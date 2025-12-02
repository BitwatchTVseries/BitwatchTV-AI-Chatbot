import express from "express";
import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// === TELEGRAM BOT ===
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

// Telegram listener
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    const reply = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are BitWatchTV AI Assistant. Promote BitWatchTV features, earnings, token, and benefits. Answer in Taglish."
        },
        { role: "user", content: text }
      ]
    });

    bot.sendMessage(chatId, reply.choices[0].message.content);
  } catch (err) {
    bot.sendMessage(chatId, "Error sa AI. Try again po.");
  }
});

// === EXPRESS SERVER FOR RENDER ===
app.get("/", (req, res) => {
  res.send("BitWatchTV AI Chatbot is running.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
