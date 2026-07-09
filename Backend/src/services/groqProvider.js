const axios = require("axios");

const API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const BASE_URL = "https://api.groq.com/openai/v1";

async function sendMessage({ systemPrompt, context, userMessage, chatHistory }) {
  let systemContent = systemPrompt;
  if (context) {
    systemContent += "\n\nHere is the data from our database that you should use to answer:\n" + context;
  }

  const messages = [{ role: "system", content: systemContent }];

  if (chatHistory && chatHistory.length > 0) {
    const recent = chatHistory.slice(-6);
    recent.forEach((msg) => {
      if (msg.content) {
        messages.push({ role: msg.role, content: msg.content });
      }
    });
  }

  messages.push({ role: "user", content: userMessage });

  const body = {
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 800,
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      body,
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Groq API error:", err.response?.status, err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendMessage };
