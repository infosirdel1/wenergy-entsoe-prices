<h2>Test ENTSO-E – Prix dynamiques Belgique</h2>
<pre id="out">Chargement…</pre>

<script>
const url = "https://wenergy-entsoe-prices.vercel.app/api/entsoe-latest";

fetch(url)
  .then(r => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  })
  .then(data => {
    document.getElementById("out").textContent =
`Source        : ${data.source}
Zone          : ${data.zone}
Points        : ${data.points}
Min €/MWh     : ${data.min.toFixed(2)}
Max €/MWh     : ${data.max.toFixed(2)}
Moy €/MWh     : ${data.avgMWh.toFixed(2)}
Moy €/kWh     : ${data.avgKWh.toFixed(4)}
`;
  })
  .catch(err => {
    document.getElementById("out").textContent =
      "Erreur : " + err.message;
  });
</script>
