const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    sources: [String],
  },
  { _id: false }
);

const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New Chat" },
    messages: [messageSchema],
  },
  { timestamps: true }
);

chatHistorySchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
