export default function handler(req, res) {
  res.status(200).json({
    source: "static-test",
    avg_price: 0.25,
    peak_avg: 0.35,
    offpeak_avg: 0.15,
    date: new Date().toISOString().slice(0, 10)
  });
}
