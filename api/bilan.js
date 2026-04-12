const Anthropic = require("@anthropic-ai/sdk");

module.exports = async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET = health check
  if (req.method === "GET") {
    const hasKey = !!process.env.ANTHROPIC_API_KEY;
    return res.status(200).json({
      status: "ok",
      apiKeyConfigured: hasKey,
      keyPrefix: hasKey ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + "..." : "missing"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    res.status(200).json(response);
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({
      error: "Erreur API",
      details: err.message,
      type: err.constructor.name
    });
  }
};
