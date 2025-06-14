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


//payment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { purchaseId } = session.metadata;
        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) return res.status(404).send("Purchase not found");
        
        console.log("Purchase here "+purchase);
        res.status(500).send("Purchase here "+purchase);
        

        let record =
          (await ServiceBook.findById(purchase.orderId)) ||
          (await RequestPickup.findById(purchase.orderId));

        if (!record) return res.status(404).send("Related order not found");

        purchase.status = "Completed";
        purchase.paymentStage = record.balance !== 0 ? "AdvancePaid" : "FullyPaid";
        await purchase.save();

        record.balance = 0;
        record.status = purchase.paymentStage === "AdvancePaid" ? "In Progress" : "Completed";
        await record.save();

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { purchaseId } = session.metadata;
        const purchase = await Purchase.findById(purchaseId);
        if (purchase) {
          purchase.status = "Failed";
          purchase.paymentStage = "Unpaid";
          await purchase.save();
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).send("Internal Server Error");
  }
};
