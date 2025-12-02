import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Welcome endpoint
app.get("/", (req, res) => {
  res.send("🤖 BitWatchTV AI Chatbot is running!");
});

// Chatbot API endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    res.json({
      reply: reply.output[0].content[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Chatbot error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
