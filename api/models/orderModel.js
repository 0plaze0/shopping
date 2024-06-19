import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Not process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.default("Order", orderSchema);
