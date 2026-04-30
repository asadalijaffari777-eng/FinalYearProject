const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },

  categories: [{ 
    type: String, 
    trim: true, 
    lowercase: true 
  }],

  location: { 
    type: String, 
    trim: true 
  },

  type: {
    type: String,
    enum: ["small", "medium", "large"],
    lowercase: true,
    required: true
  },

  moq: { 
    type: Number, 
    min: 0 
  },

  priceRange: {
    type: String,
    enum: ["low", "medium", "high"],
    lowercase: true
  },

  links: {
    website: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    linkedin: { type: String, trim: true }
  },

  contact: {
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true }
  }

}, { timestamps: true });

module.exports = mongoose.model("Manufacturer", manufacturerSchema);