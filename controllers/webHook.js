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

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const purchaseId = session.metadata.purchaseId;
        if (!purchaseId) {
          console.error("No purchaseId in session metadata");
          return res.status(400).send("Missing purchaseId in metadata");
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error("Purchase not found for ID:", purchaseId);
          return res.status(404).send("Purchase not found");
        }

        // Optionally, fetch the user (not mandatory here unless you want to do something with it)
        // const userData = await User.findById(purchaseData.userId);

        // Find the related order either in ServiceBook or RequestPickup
        let orderData = await ServiceBook.findById(purchaseData.orderId.toString());
        if (!orderData) {
          orderData = await RequestPickup.findById(purchaseData.orderId.toString());
        }

        if (!orderData) {
          console.error("Order data not found for orderId:", purchaseData.orderId);
          return res.status(404).send("Order data not found");
        }

        // Update purchase and order statuses accordingly
        purchaseData.status = "Completed";

        if (orderData.balance && orderData.balance !== 0) {
          purchaseData.paymentStage = "AdvancePaid";
          orderData.status = "In Progress";
        } else {
          purchaseData.paymentStage = "FullyPaid";
          orderData.status = "Completed";
        }

        orderData.balance = 0; // balance cleared after payment

        await purchaseData.save();
        await orderData.save();

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Find session by payment intent to get purchaseId
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!sessions.data.length) {
          console.error("No session found for payment intent:", paymentIntentId);
          return res.status(404).send("Session not found for payment intent");
        }

        const { purchaseId } = sessions.data[0].metadata;
        if (!purchaseId) {
          console.error("No purchaseId in session metadata for failed payment");
          return res.status(400).send("Missing purchaseId in session metadata");
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error("Purchase not found for ID:", purchaseId);
          return res.status(404).send("Purchase not found");
        }

        purchaseData.status = "Failed";
        purchaseData.paymentStage = "Unpaid";

        await purchaseData.save();

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};