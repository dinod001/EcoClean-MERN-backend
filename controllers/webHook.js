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
    event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      if (!purchaseId) {
        console.warn("⚠️ No purchaseId in session metadata for:", paymentIntentId);
        return response.status(400).send("purchaseId metadata missing");
      }

      const purchaseData = await Purchase.findById(purchaseId);

      let orderData = await ServiceBook.findById(purchaseData.orderId);
      if (!orderData) {
        orderData = await RequestPickup.findById(purchaseData.orderId);
      }

      purchaseData.status = "Completed";
      purchaseData.paymentStage = orderData.advance !== 0 ? "AdvancePaid" : "FullyPaid";
      await purchaseData.save();

      orderData.advance = 0;
      orderData.status = purchaseData.paymentStage === "AdvancePaid" ? "In Progress" : "Completed";
      await orderData.save();

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      
      const session = sessions.data[0];
      const purchaseId = session.metadata?.purchaseId;

      const purchaseData = await Purchase.findById(purchaseId);

      purchaseData.status = "Failed";
      purchaseData.paymentStage = "Unpaid";
      await purchaseData.save();

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  return response.json({ received: true });
};
