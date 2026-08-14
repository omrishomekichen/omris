import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import crypto from "crypto";

const priceOptionSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      enum: ["g", "kg", "ml", "l", "piece"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const comboItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      enum: ["g", "kg", "ml", "l", "piece"],
      required: true,
    },
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    // Unique application-level ID
    menuId: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
      index: true,
    },

    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "veg",
        "nonVeg",
        "spicedPowder",
        "combo",
        "offer",
      ],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Ingredients
    ingredients: {
      type: [String],
      default: [],
    },

    // Storage & Shelf Life
    storage: {
      instructions: {
        type: String,
        trim: true,
      },

      shelfLife: {
        value: {
          type: Number,
          min: 0,
        },

        unit: {
          type: String,
          enum: ["days", "weeks", "months", "years"],
        },
      },
    },

    // Product image
    image: {
      type: String,
      default: null,
    },

    // Quantity & prices
    priceOptions: {
      type: [priceOptionSchema],
      default: [],
    },

    // Combo products
    comboItems: {
      type: [comboItemSchema],
      default: [],
    },

    // Offers
    offer: {
      enabled: {
        type: Boolean,
        default: false,
      },

      title: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      price: {
        type: Number,
        min: 0,
      },
    },

    // Status
    isAvailable: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);




export const Menu =
  mongoose.models.Menu || mongoose.model("Menu", menuSchema);

export default Menu;