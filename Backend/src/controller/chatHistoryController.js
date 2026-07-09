const ChatHistory = require("../models/ChatHistory");

exports.list = async (req, res) => {
  try {
    const chats = await ChatHistory.find({ user: req.user.id })
      .select("title createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();
    res.json({ chats });
  } catch (err) {
    console.error("list history error:", err.message);
    res.status(500).json({ message: "Failed to load history" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({ chat });
  } catch (err) {
    console.error("get history error:", err.message);
    res.status(500).json({ message: "Failed to load chat" });
  }
};

exports.update = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const chat = await ChatHistory.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title: title.trim() },
      { new: true }
    );
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({ chat });
  } catch (err) {
    console.error("update history error:", err.message);
    res.status(500).json({ message: "Failed to update chat" });
  }
};

exports.remove = async (req, res) => {
  try {
    const chat = await ChatHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({ message: "Chat deleted" });
  } catch (err) {
    console.error("delete history error:", err.message);
    res.status(500).json({ message: "Failed to delete chat" });
  }
};
