import Purchase from "../schema/Purchase.js";
import RequestPickup from "../schema/RequestPickup.js";
import ServiceBook from "../schema/ServiceBook.js";
import mongoose from "mongoose";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = process.env.CURRENCY.toLowerCase();

const getPurchaseDetails = (record, userId, type) => {
  const isAdvance = record.advance !== 0;
  return {
    orderId: record._id.toString(),
    userId,
    amount: Number(isAdvance ? record.advance : record.balance).toFixed(2),
    paymentStage: isAdvance ? "AdvancePaid" : "FullyPaid",
    itemName: type === "booking" ? record.serviceName : "Pickup Request",
    rawAmount: isAdvance ? record.advance : record.balance,
  };
};

export const completePayment = async (req, res) => {
  try {
    const { requestId, bookingId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;

    let record, type;

    if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
      record = await ServiceBook.findById(bookingId);
      if (!record) return res.status(404).json({ success: false, message: "Booking not found" });
      type = "booking";

    } else if (requestId && mongoose.Types.ObjectId.isValid(requestId)) {
      record = await RequestPickup.findById(requestId);
      if (!record) return res.status(404).json({ success: false, message: "Request not found" });
      type = "request";

    } else {
      return res.status(400).json({ success: false, message: "No valid ID provided" });
    }

    const { orderId, amount, paymentStage, itemName, rawAmount } = getPurchaseDetails(record, userId, type);

    const newPurchase = await Purchase.create({
      orderId,
      userId,
      amount,
      paymentStage,
    });

    const session = await stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          purchaseId: newPurchase._id.toString(),
        },
      },
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: itemName },
            unit_amount: Math.round(rawAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment/success?orderId=${orderId}`,
      cancel_url: `${origin}/payment/cancel`,
    });

    newPurchase.stripeSessionId = session.id;
    await newPurchase.save();

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
