import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "10mb" }));

app.post("/api/mood", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "No image provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-text-1",
        input: `Analyze the mood of this person from the base64 image: ${image}`
      })
    });

    const data = await response.json();

    let mood = "😐 Neutral";

    if (data.output_text) {
      const text = data.output_text.toLowerCase();
      if (text.includes("happy")) mood = "😊 Happy";
      else if (text.includes("sad")) mood = "😔 Sad";
      else if (text.includes("angry")) mood = "😡 Angry";
    }

    res.json({ mood });
  } catch (err) {
    res.status(500).json({ error: "Failed to detect mood" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
