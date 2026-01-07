export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://wenergy1.odoo.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    source: "static-test",
    avg_price: 0.25,
    peak_avg: 0.35,
    offpeak_avg: 0.15,
    date: new Date().toISOString().slice(0, 10)
  });
}
