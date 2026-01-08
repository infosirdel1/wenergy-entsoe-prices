export const runtime = "nodejs";

export default async function handler(req, res) {
  try {
    const TOKEN = process.env.ENTSOE_TOKEN;

    if (!TOKEN) {
      return res.status(500).json({ error: "ENTSOE_TOKEN manquant" });
    }

    const url =
      "https://web-api.tp.entsoe.eu/api" +
      "?securityToken=" + 5dd26e03-9676-433c-8b84-938b9f84885f +
      "&documentType=A44" +
      "&in_Domain=10YBE----------2" +
      "&out_Domain=10YBE----------2" +
      "&periodStart=202601060000" +
      "&periodEnd=202601070000";

    const response = await fetch(url); // Node 18 OK

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erreur ENTSO-E",
        status: response.status
      });
    }

    const xmlText = await response.text();

    // Extraction simple et robuste
    const prices = [...xmlText.matchAll(/<price.amount>([^<]+)<\/price.amount>/g)]
      .map(m => parseFloat(m[1]))
      .filter(v => !isNaN(v));

    if (!prices.length) {
      return res.status(500).json({ error: "Aucun prix extrait" });
    }

    const count = prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avgMWh = prices.reduce((a, b) => a + b, 0) / count;
    const avgKWh = avgMWh / 1000;

    return res.status(200).json({
      source: "ENTSO-E",
      zone: "BE",
      unit: "EUR/MWh",
      points: count,
      min,
      max,
      avgMWh,
      avgKWh,
      raw: prices
    });

  } catch (err) {
    return res.status(500).json({
      error: "Crash serveur",
      message: err.message
    });
  }
}
