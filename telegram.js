import express from "express";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  try {
    const response = await axios.post(process.env.AI_URL + "/chat", {
      message: userMessage
    });

    bot.sendMessage(chatId, response.data.reply);
  } catch (err) {
    bot.sendMessage(chatId, "⚠️ Error sa AI server.");
  }
});

app.listen(PORT, () => {
  console.log("Telegram bot running on port", PORT);
});
