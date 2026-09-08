// Schema + internal-consistency checks. Run in CI so a bad edit never ships.
import data from "../data/mandates.json" with { type: "json" };

const errors = [];
const seen = new Set();
const ISO = /^\d{4}-\d{2}-\d{2}$/;

for (const c of data.countries) {
  const at = (m) => errors.push(`${c.code}: ${m}`);
  if (!/^[A-Z]{2}$/.test(c.code)) at("code is not ISO 3166-1 alpha-2");
  if (seen.has(c.code)) at("duplicate country code");
  seen.add(c.code);
  if (!["active", "upcoming", "partial", "none"].includes(c.status)) at(`bad status "${c.status}"`);
  if (!["peppol", "national", "hybrid"].includes(c.network)) at(`bad network "${c.network}"`);
  if (!ISO.test(c.last_verified)) at("last_verified is not an ISO date");
  if (!c.phases.length) at("no phases");

  for (const p of c.phases) {
    if (p.date !== null && !ISO.test(p.date)) at(`phase date "${p.date}" is not ISO`);
    if (p.date === null && p.date_precision !== "unknown") at("null date must have date_precision unknown");
    if (!["b2g", "b2b", "b2c"].includes(p.scope)) at(`bad scope "${p.scope}"`);
    if (!["issue", "receive", "both"].includes(p.obligation)) at(`bad obligation "${p.obligation}"`);
    if (p.threshold && !["annual_revenue", "employees", "none"].includes(p.threshold.metric))
      at("bad threshold metric");
  }

  // A country marked active must actually have a non-voluntary B2B phase in force.
  const today = new Date().toISOString().slice(0, 10);
  const liveB2B = c.phases.some((p) => p.scope === "b2b" && !p.voluntary && p.date && p.date <= today);
  if (c.status === "active" && !liveB2B) at('status "active" but no B2B phase is in force');
  if (c.status === "upcoming" && liveB2B) at('status "upcoming" but a B2B phase is already in force');
  if (c.peppol_supported === false && c.network === "peppol") at("network peppol but peppol_supported false");
}

if (errors.length) {
  console.error("FAIL\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`OK — ${data.countries.length} countries, ${data.countries.reduce((n, c) => n + c.phases.length, 0)} phases`);
