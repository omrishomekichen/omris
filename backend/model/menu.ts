import mongoose from "mongoose";

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
  { _id: false },
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
  { _id: false },
);

const menuSchema = new mongoose.Schema(
  {
    menuId: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["veg", "nonVeg", "spicedPowder", "combo", "offer"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
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
    image: {
      type: String,
      default: null,
    },
    priceOptions: {
      type: [priceOptionSchema],
      default: [],
    },
    comboItems: {
      type: [comboItemSchema],
      default: [],
    },
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
  },
);

export const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);

export default Menu;
