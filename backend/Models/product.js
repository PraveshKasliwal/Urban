const mongoose = require("mongoose");

const sizeStockSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },
    
    category: {
      type: String,
      required: true,
      trim: true,
    },

    material: {
      type: String,
      trim: true,
    },

    sizes: {
      type: [sizeStockSchema],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    searchText: {
      type: String,
      trim: true,
    },

    embedding: {
      type: [Number],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index(
  { name: "text", description: "text", category: "text", material: "text" },
  { weights: { name: 10, category: 5, description: 3, material: 1 }, name: "product_text_index" }
);

module.exports = mongoose.model("Product", productSchema);