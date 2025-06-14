import { Webhook } from "svix";
import User from "../schema/Users.js";
import Stripe from "stripe";
import Purchase from "../schema/Purchase.js";
import ServiceBook from "../schema/ServiceBook.js";
import RequestPickup from "../schema/RequestPickup.js";

//API controller Function to Manage Clerk user with database

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.create(userData);

        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed.", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Get checkout sessions related to this payment intent
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        if (!sessions.data.length) {
          console.error("No checkout session found for payment_intent:", paymentIntentId);
          return response.status(404).send("Session not found");
        }

        const session = sessions.data[0];
        const purchaseId = session.metadata?.purchaseId;

        if (!purchaseId) {
          console.error("purchaseId missing in session metadata for payment_intent:", paymentIntentId);
          return response.status(400).send("purchaseId metadata missing");
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error("Purchase not found in DB for ID:", purchaseId);
          return response.status(404).send("Purchase not found");
        }

        // Load related user and service/request data
        const userData = await User.findById(purchaseData.userId);

        let data = await ServiceBook.findById(purchaseData.orderId.toString());
        if (!data) {
          data = await RequestPickup.findById(purchaseData.orderId.toString());
        }

        purchaseData.status = "completed";
        purchaseData.paymentStage = data.balance !== 0 ? "AdvancePaid" : "FullyPaid";
        await purchaseData.save();

        data.balance = 0;
        data.status = purchaseData.paymentStage === "AdvancePaid" ? "In Progress" : "Completed";
        await data.save();

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        if (!sessions.data.length) {
          console.error("No checkout session found for payment_intent:", paymentIntentId);
          return response.status(404).send("Session not found");
        }

        const session = sessions.data[0];
        const purchaseId = session.metadata?.purchaseId;

        if (!purchaseId) {
          console.error("purchaseId missing in session metadata for payment_intent:", paymentIntentId);
          return response.status(400).send("purchaseId metadata missing");
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error("Purchase not found in DB for ID:", purchaseId);
          return response.status(404).send("Purchase not found");
        }

        purchaseData.status = "Failed";
        purchaseData.paymentStage = "Unpaid";
        await purchaseData.save();

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook event:", err);
    response.status(500).send("Internal Server Error");
  }
};
