import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    orderId: {
      type:String,
      required: true,
    },

    userId: {
      type: String,
      ref: "User",
      requied: true,
    },
    
    stripeSessionId: {
      type: String,
    }, 

    amount: { type: Number, required: true },

    paymentStage: {
      type: String,
      enum: ['Unpaid', 'AdvancePaid', 'FullyPaid'],
      default: 'Unpaid'
    },
    
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
