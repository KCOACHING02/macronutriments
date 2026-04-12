require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50kb" }));

// Serve static files (index.html, bilan.html, images, etc.)
app.use(express.static(__dirname));

// Anthropic API proxy endpoint
app.post("/api/bilan", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured on server" });
  }

  try {
    const client = new Anthropic({ apiKey });
    const { system, messages } = req.body;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system: system || "",
      messages: messages || [],
    });

    res.json(response);
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "Erreur lors de l'appel a l'IA", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Bilan de vie: http://localhost:${PORT}/bilan.html`);
  console.log(`Calculateur macros: http://localhost:${PORT}/index.html`);
});
