const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    enum: ["caps", "upper-summer", "upper-winter", "lower"],
    lowercase: true
  },

  image: {
    type: String,
    trim: true,
    default: ""
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  }
}, { timestamps: true });

itemSchema.pre("save", function () {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
});

module.exports = mongoose.model("Item", itemSchema);
