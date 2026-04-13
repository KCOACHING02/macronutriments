// Endpoint pour capturer les leads (email + archetype + bilan)
// Pour l'instant, on log dans Vercel (visible dans Logs).
// Plus tard tu pourras brancher Mailchimp / Brevo / ConvertKit ici.

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, prenom, archetype, temperature, blocage_dominant } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Email invalide" });
    }

    // Log structuré dans Vercel (visible dans le dashboard → Logs)
    console.log("NEW_LEAD", JSON.stringify({
      timestamp: new Date().toISOString(),
      email,
      prenom: prenom || null,
      archetype: archetype || null,
      temperature: temperature || null,
      blocage_dominant: blocage_dominant || null,
    }));

    // TODO: Brancher ton service email ici
    // Exemple Brevo :
    // await fetch("https://api.brevo.com/v3/contacts", {
    //   method: "POST",
    //   headers: {
    //     "api-key": process.env.BREVO_API_KEY,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email,
    //     attributes: { PRENOM: prenom, ARCHETYPE: archetype },
    //     listIds: [1],
    //   }),
    // });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Lead capture error:", err.message);
    return res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
};
