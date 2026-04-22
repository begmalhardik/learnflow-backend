import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

// GENERIC LLM ENDPOINT
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data.choices[0].message.content;

    res.json({
      prompt: prompt,
      response: result
    });

  } catch (error) {
    // console.log(error.response?.data || error.message);
    // res.status(500).json({ error: "LLM failed" });
    console.log("FULL ERROR:");
    console.log(error.response?.data || error);
    console.log(error.message);

    res.status(500).json({
        error: "LLM failed",
        details: error.response?.data || error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

