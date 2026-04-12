const Anthropic = require("@anthropic-ai/sdk");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
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

    res.status(200).json(response);
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "Erreur lors de l'appel a l'IA", details: err.message });
  }
};
