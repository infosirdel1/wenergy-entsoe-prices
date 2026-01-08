export const runtime = "nodejs";

export default async function handler(req, res) {

  // ===============================
  // CORS — OBLIGATOIRE POUR ODOO
  // ===============================
  res.setHeader("Access-Control-Allow-Origin", "https://wenergy1.odoo.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    // 🔐 Token stocké dans Vercel (Environment Variable)
    const TOKEN = process.env.ENTSOE_TOKEN;

    if (!TOKEN) {
      return res.status(500).json({
        error: "ENTSOE_TOKEN manquant (variable d’environnement)"
      });
    }

    const url =
      "https://web-api.tp.entsoe.eu/api" +
      "?securityToken=" + TOKEN +
      "&documentType=A44" +
      "&in_Domain=10YBE----------2" +
      "&out_Domain=10YBE----------2" +
      "&periodStart=202601060000" +
      "&periodEnd=202601070000";

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erreur ENTSO-E",
        status: response.status
      });
    }

    const xmlText = await response.text();

    // 🔎 Extraction des prix horaires
    const prices = [...xmlText.matchAll(/<price.amount>([^<]+)<\/price.amount>/g)]
      .map(m => parseFloat(m[1]))
      .filter(v => Number.isFinite(v));

    if (!prices.length) {
      return res.status(500).json({
        error: "Aucun prix extrait depuis ENTSO-E"
      });
    }

    const points = prices.length;
    const avgMWh = prices.reduce((a, b) => a + b, 0) / points;

    // 📦 Réponse JSON exploitable par le simulateur
    return res.status(200).json({
      source: "ENTSO-E",
      zone: "BE",
      unit: "EUR/MWh",
      points,
      avgMWh,
      avgKWh: avgMWh / 1000
    });

  } catch (err) {
    return res.status(500).json({
      error: "Crash serveur",
      message: err.message
    });
  }
}
