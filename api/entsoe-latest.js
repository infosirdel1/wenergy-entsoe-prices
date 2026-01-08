<h2>Test ENTSO-E – Prix dynamiques Belgique</h2>
<pre id="out">Chargement…</pre>

<script>
const TOKEN = "TON_TOKEN";

const url =
  "https://web-api.tp.entsoe.eu/api" +
  "?securityToken=" + 5dd26e03-9676-433c-8b84-938b9f84885f +
  "&documentType=A44" +
  "&in_Domain=10YBE----------2" +
  "&out_Domain=10YBE----------2" +
  "&periodStart=202601060000" +
  "&periodEnd=202601070000";

fetch(url)
  .then(r => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.text();
  })
  .then(xmlText => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const prices = [...xml.querySelectorAll("price\\.amount")]
      .map(n => parseFloat(n.textContent))
      .filter(v => !isNaN(v));

    const count = prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avgMWh = prices.reduce((a, b) => a + b, 0) / count;
    const avgKWh = avgMWh / 1000;

    document.getElementById("out").textContent =
`Points        : ${count}
Min €/MWh     : ${min.toFixed(2)}
Max €/MWh     : ${max.toFixed(2)}
Moy €/MWh     : ${avgMWh.toFixed(2)}
Moy €/kWh     : ${avgKWh.toFixed(4)}
`;
  })
  .catch(err => {
    document.getElementById("out").textContent =
      "Erreur : " + err.message;
  });
</script>
