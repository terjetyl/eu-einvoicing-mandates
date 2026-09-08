// Adds minimal-tier records for the EU member states not yet covered in depth.
//
// Every phase added here is flagged needs_verification. The one fact carried
// with real confidence is the B2G baseline: Directive 2014/55/EU obliged all
// member states to receive structured e-invoices in public procurement
// (central authorities 18 Apr 2019, sub-central 18 Apr 2020). National B2B
// positions below are scaffolding for a sourcing pass, NOT publishable facts.
import fs from "node:fs";

const DIRECTIVE_B2G = {
  scope: "b2g", obligation: "receive", date: "2020-04-18", date_precision: "approximate",
  applies_to: "Contracting authorities, under Directive 2014/55/EU",
  threshold: null, voluntary: false, needs_verification: true,
};

const b2b = (date, applies_to, extra = {}) => ({
  scope: "b2b", obligation: "both", date, date_precision: date ? "approximate" : "unknown",
  applies_to, threshold: null, voluntary: false, needs_verification: true, ...extra,
});
const voluntaryB2B = () => b2b(null, "No adopted national B2B mandate", { voluntary: true });

const MINIMAL = [
  ["AT", "Austria", "partial", "peppol", true, ["ebInterface", "PEPPOL BIS Billing 3.0"], [voluntaryB2B()], "Long-standing B2G mandate via e-Rechnung.gv.at. No national B2B mandate adopted."],
  ["BG", "Bulgaria", "partial", "peppol", true, ["EN 16931"], [voluntaryB2B()], "B2G only. B2B expected to follow ViDA rather than domestic law."],
  ["CY", "Cyprus", "partial", "peppol", true, ["EN 16931"], [voluntaryB2B()], "B2G only."],
  ["CZ", "Czechia", "partial", "peppol", true, ["ISDOC", "EN 16931"], [voluntaryB2B()], "B2G only; ISDOC is the domestic format alongside EN 16931."],
  ["EE", "Estonia", "partial", "peppol", true, ["EN 16931"], [b2b("2025-07-01", "Sellers must issue an e-invoice on request from a registered buyer")], "Not a blanket mandate: it establishes a buyer's right to demand an e-invoice."],
  ["FI", "Finland", "partial", "peppol", true, ["Finvoice", "PEPPOL BIS Billing 3.0"], [b2b("2020-04-01", "Buyers may require e-invoices from suppliers")], "Act on Electronic Invoicing gives businesses a right to request an EN 16931 invoice."],
  ["GR", "Greece", "partial", "hybrid", true, ["myDATA", "EN 16931"], [b2b(null, "B2B mandate legislated but commencement dependent on derogation")], "myDATA reporting is separate from, and already broader than, the e-invoicing mandate."],
  ["HU", "Hungary", "partial", "national", false, ["RTIR XML"], [b2b("2021-01-04", "Real-time invoice reporting for all domestic transactions")], "RTIR is real-time REPORTING, not structured e-invoicing. Do not conflate the two."],
  ["IE", "Ireland", "partial", "peppol", true, ["EN 16931"], [voluntaryB2B()], "B2G only."],
  ["IT", "Italy", "active", "national", false, ["FatturaPA"], [b2b("2019-01-01", "All VAT-registered businesses via the SdI clearance platform")], "The EU's first universal B2B clearance mandate. FatturaPA via SdI, not PEPPOL."],
  ["LV", "Latvia", "upcoming", "peppol", true, ["EN 16931"], [b2b("2026-01-01", "All businesses, following a B2G phase")], "Adopted B2B mandate; verify commencement."],
  ["LT", "Lithuania", "partial", "peppol", true, ["EN 16931"], [voluntaryB2B()], "B2G via E-saskaita."],
  ["LU", "Luxembourg", "partial", "peppol", true, ["PEPPOL BIS Billing 3.0"], [voluntaryB2B()], "B2G phased by company size 2021-2023. No B2B mandate."],
  ["MT", "Malta", "partial", "peppol", true, ["EN 16931"], [voluntaryB2B()], "B2G only."],
  ["PT", "Portugal", "partial", "hybrid", true, ["CIUS-PT", "UBL 2.1"], [voluntaryB2B()], "B2G mandatory; B2B governed by ATCUD/QR and SAF-T reporting rather than an e-invoicing mandate."],
  ["RO", "Romania", "active", "national", false, ["RO_CIUS (UBL)"], [b2b("2024-07-01", "All VAT-registered businesses via RO e-Factura")], "RO e-Factura is a national clearance platform. Phased through 2024."],
  ["SK", "Slovakia", "partial", "peppol", true, ["EN 16931"], [voluntaryB2B()], "B2G only; B2B mandate under preparation."],
  ["SI", "Slovenia", "partial", "peppol", true, ["e-SLOG", "EN 16931"], [voluntaryB2B()], "B2G mandatory via UJP. B2B proposals have been repeatedly deferred."],
  ["SE", "Sweden", "partial", "peppol", true, ["PEPPOL BIS Billing 3.0"], [voluntaryB2B()], "B2G mandatory since 2019. No B2B mandate; PEPPOL adoption is high voluntarily."],
];

const p = "data/mandates.json";
const d = JSON.parse(fs.readFileSync(p, "utf8"));
const have = new Set(d.countries.map((c) => c.code));

for (const [code, name, status, network, peppol, formats, phases, notes] of MINIMAL) {
  if (have.has(code)) continue;
  d.countries.push({
    code, name, slug: name.toLowerCase(), status, network,
    peppol_supported: peppol, standard: "EN 16931", formats,
    detail_tier: "minimal",
    phases: [DIRECTIVE_B2G, ...phases],
    sources: [], last_verified: "2026-09-08", notes,
  });
}
for (const c of d.countries) c.detail_tier ??= "full";
d.countries.sort((a, b) => a.code.localeCompare(b.code));
d.version = "0.2.0";
fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
console.log(`countries: ${d.countries.length}`);
