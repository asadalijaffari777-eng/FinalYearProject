const axios = require("axios");

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "mistral";

async function sendMessage({ systemPrompt, context, userMessage, chatHistory }) {
  let prompt = systemPrompt + "\n\n";

  if (context) {
    prompt += "Here is the data from our database that you should use to answer:\n";
    prompt += context + "\n\n";
  }

  if (chatHistory && chatHistory.length > 0) {
    prompt += "Previous conversation:\n";
    chatHistory.forEach((msg) => {
      prompt += `${msg.role}: ${msg.content}\n`;
    });
    prompt += "\n";
  }

  prompt += `User: ${userMessage}\nAssistant:`;
  console.log(prompt);

  const response = await axios.post(
    `${OLLAMA_URL}/api/generate`,
    {
      model: MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        max_tokens: 800,
      },
    },
    {
      timeout: 120000,
    }
  );

  return response.data.response;
}

module.exports = { sendMessage };
