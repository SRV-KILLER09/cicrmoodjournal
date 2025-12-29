import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // npm install node-fetch
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "10mb" })); // to accept large image payloads

// Endpoint to receive webcam image and get mood
app.post("/api/mood", async (req, res) => {
  const { image } = req.body;

  if (!image) return res.status(400).json({ error: "No image provided" });

  try {
    // Call Gemini API (replace this with real Gemini AI request structure)
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-text-1", // or appropriate Gemini model
        input: `Analyze the mood of this person from the base64 image: ${image}`
      })
    });

    const data = await response.json();

    // Extract mood from response (depends on Gemini output)
    let mood = "Neutral";
    if (data.output_text) {
      if (data.output_text.toLowerCase().includes("happy")) mood = "😊 Happy";
      else if (data.output_text.toLowerCase().includes("sad")) mood = "😔 Sad";
      else if (data.output_text.toLowerCase().includes("angry")) mood = "😡 Angry";
    }

    res.json({ mood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to detect mood" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
