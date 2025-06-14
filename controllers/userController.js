import Purchase from "../schema/Purchase.js";
import RequestPickup from "../schema/RequestPickup.js";
import ServiceBook from "../schema/ServiceBook.js";
import Stripe from "stripe";

export const completePayment = async (req, res) => {
  try {
    const { requestId, bookingId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;

    let purchaseData = {};
    let itemName = "";
    let amount = 0;

    if (bookingId && bookingId !== "undefined") {

      const booking = await ServiceBook.findById(bookingId);
      if (!booking)
        return res.status(404).json({ success: false, message: "Booking not found" });

      purchaseData = {
        orderId: bookingId,
        userId,
        amount: booking.advance !== 0 ? Number(booking.advance).toFixed(2) : Number(booking.balance).toFixed(2),
        paymentStage: booking.advance !== 0 ? "AdvancePaid" : "FullyPaid",
        status: "Completed"
      };
      itemName = booking.serviceName;
      amount = booking.advance !== 0 ? booking.advance : booking.balance;
    } 
    
    else if (requestId && requestId !== "undefined") {
      
      const request = await RequestPickup.findById(requestId);
      if (!request)
        return res.status(404).json({ success: false, message: "Request not found" });

      purchaseData = {
        orderId: requestId,
        userId,
        amount: request.advance !== 0 ? Number(request.advance).toFixed(2) : Number(request.balance).toFixed(2),
        paymentStage: request.advance !== 0 ? "AdvancePaid" : "FullyPaid",
        status: "Completed"
      };
      itemName = "Pickup Request"; // or request.type if applicable
      amount = request.advance !== 0 ? request.advance : request.balance;
    } else {
      return res.status(400).json({ success: false, message: "No valid ID provided" });
    }

    const newPurchase = await Purchase.create(purchaseData);

    //stripe gateway initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLocaleLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: itemName,
          },
          unit_amount: Math.floor(amount * 100),
        },
        quantity: 1,
      },
    ];
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items:line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });
  
    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
