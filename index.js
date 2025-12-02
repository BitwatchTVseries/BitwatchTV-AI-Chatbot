import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_KEY = process.env.OPENAI_API_KEY;
const TELEGRAM_URL = `https://api.telegram.org/bot${TOKEN}`;

app.post("/webhook", async (req, res) => {
  const message = req.body.message;

  if (!message || !message.text) return res.sendStatus(200);

  const userMessage = message.text;
  const chatId = message.chat.id;

  // Send the message to OpenAI API
  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are BitWatchTV AI assistant." },
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await completion.json();
  const reply = data.choices?.[0]?.message?.content || "Sorry, I cannot respond now.";

  await fetch(`${TELEGRAM_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: reply,
    })
  });

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("BitWatchTV AI Bot is running!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
