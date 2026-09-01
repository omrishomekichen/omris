import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      default: "N/A",
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    shippingAddress: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },


    paymentScreenshot: {
      data: {
        type: Buffer,
        default: () => Buffer.from(""),
      },
      contentType: {
        type: String,
        default: "image/none",
      },
    },

    utrNumber: {
      type: String,
      default: "N/A",
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    assignTo: {
      type: String,
      default: "owner",
    },

    branch: {
      type: String,
      default: "Unassigned",
    },

    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "payment_verification",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "rejected",
      ],
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
