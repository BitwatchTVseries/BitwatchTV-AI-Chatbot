import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ======== HOME ROUTE ========
app.get("/", (req, res) => {
  res.send({
    status: "BitWatchTV AI ACTIVE",
    message: "Chatbot is running successfully!",
  });
});

// ======== MAIN AI ENDPOINT ========
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are BitWatchTV AI Assistant. Expert in packages, rewards, watching-to-earn, referrals, token system, and user support.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("AI Response:", data);

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response found.",
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ======== START SERVER (Render will use this) ========
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("BitWatchTV AI running on port " + port);
});
