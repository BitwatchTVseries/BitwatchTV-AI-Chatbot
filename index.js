import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    bot.sendMessage(chatId, reply);

  } catch (error) {
    console.error("Error:", error.response?.data || error);
    bot.sendMessage(chatId, "⚠️ Error: Please try again.");
  }
});
