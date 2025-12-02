import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

// Load variables
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

bot.on("message", async(msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text || "";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userMessage }]
    });

    const reply = completion.choices[0].message.content;
    bot.sendMessage(chatId, reply);

  } catch (error) {
    console.error("AI ERROR:", error);
    bot.sendMessage(chatId, "⚠️ Error, try again later.");
  }
});

console.log("🤖 Telegram AI Bot is running...");
