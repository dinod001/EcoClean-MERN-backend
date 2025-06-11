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

    amount: { type: Number, required: true },
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
