const ragService = require("../services/ragService");
const aiProvider = require("../services/groqProvider");
const ChatHistory = require("../models/ChatHistory");

const SYSTEM_PROMPT = `You are a business advisor for Startup Genius. You help users start and run clothing businesses.

RULES:
1. NEVER invent or make up any manufacturer, company, or product. Only use what is provided in the context below.
2. If the context below lists manufacturers, use those to answer specifically.
3. If the context says no manufacturers were found, tell the user honestly but then give helpful general business advice based on their selected products and what you know about the clothing industry.
4. When users ask for advice, suggestions, or tips about starting a business, give practical, concise guidance about the clothing business.
5. Keep responses friendly, concise, and easy to understand.
6. Only answer clothing business and manufacturing questions. For unrelated topics, politely redirect.`;

async function saveMessages(userId, chatId, userMsg, botMsg, sources) {
  try {
    const userMessage = { role: "user", content: userMsg };
    const assistantMessage = { role: "assistant", content: botMsg, sources: sources || [] };

    if (chatId) {
      const updated = await ChatHistory.findOneAndUpdate(
        { _id: chatId, user: userId },
        {
          $push: { messages: { $each: [userMessage, assistantMessage] } },
          $set: {
            title: null,
          },
        },
        { new: true }
      );
      if (!updated) return null;

      if (!updated.title && updated.messages.length >= 2) {
        const firstUserMsg = updated.messages.find((m) => m.role === "user");
        if (firstUserMsg) {
          const title =
            firstUserMsg.content.length > 50
              ? firstUserMsg.content.slice(0, 50) + "..."
              : firstUserMsg.content;
          updated.title = title;
          await updated.save();
        }
      }

      return updated._id;
    }

    const title =
      userMsg.length > 50 ? userMsg.slice(0, 50) + "..." : userMsg;
    const newChat = await ChatHistory.create({
      user: userId,
      title,
      messages: [userMessage, assistantMessage],
    });
    return newChat._id;
  } catch (err) {
    console.error("saveMessages error:", err.message);
    return chatId;
  }
}

exports.sendMessage = async (req, res) => {
  try {
    const { message, history, businessSelections, chatId: reqChatId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const { context, sources, manufacturers } =
      await ragService.buildContext(message, businessSelections);

    const chatHistory = (history || []).slice(-10);

    const response = await aiProvider.sendMessage({
      systemPrompt: SYSTEM_PROMPT,
      context,
      userMessage: message,
      chatHistory,
    });

    const sourcesArr = sources.slice(0, 6);

    const chatId = await saveMessages(
      req.user.id,
      reqChatId,
      message,
      response,
      sourcesArr
    );

    res.json({
      response,
      sources: sourcesArr,
      manufacturers,
      chatId: chatId ? chatId.toString() : null,
    });
  } catch (err) {
    console.error("Chat error:", err.response?.status, err.response?.data || err.message);

    if (err.response?.status === 401) {
      return res.status(503).json({
        message: "AI service is not configured. Contact the administrator.",
      });
    }

    if (err.response?.status === 429) {
      return res.status(503).json({
        message: "AI service is busy. Please wait a moment and try again.",
      });
    }

    res.status(500).json({
      message: "Failed to get AI response. Please try again.",
    });
  }
};
