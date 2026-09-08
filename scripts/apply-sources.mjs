// Sourcing pass for the 9 full-tier countries. Every phase below is backed by
// the European Commission eInvoicing Country Factsheet (2026 edition) unless a
// national source is cited alongside it.
import fs from "node:fs";

const EC = (id, slug, name) => ({
  title: `eInvoicing in ${name}`,
  url: `https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/${id}/eInvoicing+in+${slug}`,
  publisher: "European Commission (DIGITAL / CEF eInvoicing)",
  official: true, retrieved: "2026-09-08",
});
const V = "2026-09-08";
const p = (scope, obligation, date, applies_to, extra = {}) => ({
  scope, obligation, date, date_precision: date ? "exact" : "unknown",
  applies_to, threshold: null, voluntary: false, needs_verification: false, ...extra,
});

const FIXES = {
  BE: {
    status: "active", network: "peppol", peppol_supported: true,
    formats: ["PEPPOL BIS Billing 3.0"],
    phases: [
      p("b2g", "both", "2022-11-01", "Public contracts of EUR 215,000 or more"),
      p("b2g", "both", "2023-05-01", "Public contracts of EUR 30,000 or more"),
      p("b2g", "both", "2023-11-01", "Public contracts below EUR 30,000 (contracts under EUR 3,000 exempt)"),
      p("b2b", "both", "2026-01-01", "All VAT-liable Belgian entities, for domestic transactions"),
    ],
    sources: [EC("467108877", "Belgium", "Belgium")],
    notes: "Peppol is the exclusive route; an emailed PDF no longer satisfies the B2B obligation. Exemptions: entities registered for Belgian VAT only, certain VAT-exempt entities, bankrupt entities, and flat-rate scheme taxpayers. B2C is out of scope.",
  },
  DK: {
    status: "partial", network: "hybrid", peppol_supported: true,
    formats: ["OIOUBL 3.0", "PEPPOL BIS Billing 3.0"],
    phases: [
      p("b2g", "both", "2019-04-18", "All public contracting authorities (Bekendtgørelse nr. 346 af 15/03/2019)"),
      p("b2b", "both", null, "No B2B e-invoicing mandate. The Bookkeeping Act requires the *capability* to send and receive structured invoices, not their use.", { voluntary: true }),
    ],
    sources: [EC("467108882", "Denmark", "Denmark")],
    notes: "Frequently misreported as a B2B mandate. The 2022 Bookkeeping Act (bogføringsloven) mandates certified digital bookkeeping systems — from January 2026 for businesses above DKK 300,000 turnover, July 2026 for in-house systems — but does not require invoices to be exchanged electronically. OIOUBL 3.0 became mandatory 15 November 2025, with OIOUBL 2.1 phased out by 15 May 2026.",
  },
  PL: {
    status: "active", network: "hybrid", peppol_supported: true,
    formats: ["FA(2) XML via KSeF", "PEPPOL BIS Billing 3.0 (B2G)"],
    phases: [
      p("b2g", "both", "2019-04-18", "Contracting authorities, contracts of EUR 30,000 or more (PEF platform, Peppol)"),
      p("b2g", "both", "2019-08-01", "All contracting authorities"),
      p("b2b", "both", "2026-02-01", "Businesses with annual revenue above PLN 200 million",
        { threshold: { metric: "annual_revenue", currency: "PLN", amount: 200000000, comparator: "gt" } }),
      p("b2b", "both", "2026-04-01", "All remaining B2B transactions"),
    ],
    sources: [EC("467108896", "Poland", "Poland")],
    notes: "Two distinct regimes: B2G runs on Peppol via the PEF platform, while B2B uses the national KSeF clearance platform. The KSeF rollout was postponed from July 2024. Note the phase split — the widely-quoted 1 February 2026 date applies only to businesses above PLN 200 million revenue; everyone else follows on 1 April 2026.",
  },
  HR: {
    status: "active", network: "hybrid", peppol_supported: true,
    formats: ["UBL 2.1", "UN/CEFACT CII"],
    phases: [
      p("b2g", "both", "2019-07-01", "All public-sector suppliers (Act on eInvoicing in Public Procurement, OJ 94/2018)"),
      p("b2b", "both", "2026-01-01", "VAT-registered businesses (Fiscalization 2.0)", { needs_verification: true }),
      p("b2b", "both", "2027-01-01", "Sole traders, liberal professions and non-VAT-registered public bodies", { needs_verification: true }),
    ],
    sources: [EC("467108879", "Croatia", "Croatia")],
    notes: "B2G scope goes below EU thresholds (EUR 26,540 goods/services, EUR 66,360 works) via FINA's Servis eRačun za državu. The B2B mandate follows a public consultation opened 27 February 2025, with testing from 1 September 2025; treatment of non-residents with a VAT fixed establishment is still unsettled.",
  },
  FR: {
    status: "active", network: "hybrid", peppol_supported: true,
    formats: ["Factur-X", "UBL 2.1", "UN/CEFACT CII"],
    phases: [
      p("b2g", "receive", "2019-11-01", "Public authorities must receive and process EN 16931 invoices (Chorus Pro)"),
      p("b2b", "receive", "2026-09-01", "All businesses must be able to receive e-invoices"),
      p("b2b", "issue", "2026-09-01", "Large enterprises and mid-caps"),
      p("b2b", "issue", "2027-09-01", "SMEs and micro-enterprises"),
    ],
    sources: [EC("467108885", "France", "France")],
    notes: "Legal basis is Article 26 of the 2022 amending finance law. Since October 2024 the state portal (PPF) no longer handles B2B invoice exchange — invoices route through accredited private platforms (PDP), with Chorus Pro acting as directory and data concentrator. DGFiP became the Peppol authority for France in July 2025.",
  },
  DE: {
    status: "active", network: "peppol", peppol_supported: true,
    formats: ["XRechnung", "ZUGFeRD 2.0+", "PEPPOL BIS Billing 3.0"],
    phases: [
      p("b2b", "receive", "2025-01-01", "All German VAT-registered businesses"),
      p("b2b", "issue", "2027-01-01", "Businesses with annual turnover above EUR 800,000",
        { threshold: { metric: "annual_revenue", currency: "EUR", amount: 800000, comparator: "gt" } }),
      p("b2b", "issue", "2028-01-01", "All remaining businesses"),
    ],
    sources: [EC("467108886", "Germany", "Germany")],
    notes: "Legal basis is the Wachstumschancengesetz amending §14 UStG, with detail in the BMF circular of 15 October 2025. The receive obligation has been universal since 2025 while issuance phases to 2028 — conflating the two is the most common error about the German mandate. Exemptions include businesses under EUR 22,000 turnover and invoices below EUR 250.",
  },
  ES: {
    status: "partial", network: "national", peppol_supported: false,
    formats: ["Facturae", "EN 16931"],
    phases: [
      p("b2g", "receive", "2015-01-01", "Public entities must receive EN 16931 invoices (Law 25/2013), converted to Facturae via FACe"),
      p("b2b", "both", null, "Adopted under Law 18/2022 (Crea y Crece) but not commenced — the clock runs from publication of the implementing regulation: 1 year for businesses above EUR 8 million turnover, 2 years for the rest.",
        { needs_verification: true, threshold: { metric: "annual_revenue", currency: "EUR", amount: 8000000, comparator: "gt" } }),
    ],
    sources: [EC("467108901", "Spain", "Spain")],
    notes: "The commonly-quoted 2025/2026 Spanish dates are unreliable: the B2B obligation is keyed to publication of the implementing regulation, which has not occurred, so no firm date exists. Separately, VERIFACTU (invoicing-software certification and QR codes) and SII real-time reporting above EUR 6 million turnover are distinct regimes and are often conflated with the e-invoicing mandate.",
  },
  NL: {
    status: "partial", network: "peppol", peppol_supported: true,
    formats: ["PEPPOL BIS Billing 3.0", "SI-UBL 2.0 (NLCIUS)", "UBL-OHNL"],
    phases: [
      p("b2g", "receive", "2019-11-01", "Central government entities must receive and process EN 16931 invoices"),
      p("b2b", "both", null, "No mandate; voluntary and requires buyer consent", { voluntary: true }),
    ],
    sources: [EC("467108895", "The+Netherlands", "The Netherlands")],
    notes: "No B2B or B2C mandate is planned nationally; any future obligation is expected to arrive through ViDA rather than domestic law.",
  },
  NO: {
    status: "partial", network: "peppol", peppol_supported: true,
    formats: ["EHF", "PEPPOL BIS Billing 3.0"],
    phases: [
      p("b2g", "both", "2019-04-02", "Public-sector suppliers, for transactions above NOK 100,000 excluding VAT"),
      p("b2b", "issue", "2027-01-01", "Bookkeeping-obliged businesses, when invoicing businesses registered in ELMA", { needs_verification: true }),
      p("b2b", "receive", "2030-01-01", "Bookkeeping-obliged businesses, alongside mandatory digital bookkeeping", { needs_verification: true }),
    ],
    sources: [
      EC("467108905", "Norway", "Norway"),
      { title: "Oppdragsbrev til Skattedirektoratet — obligatorisk e-faktura og digital bokføring (16 March 2026)",
        url: "https://www.regjeringen.no/no/dep/fin/id216/", publisher: "Finansdepartementet", official: true, retrieved: "2026-09-08" },
    ],
    notes: "EEA, not EU. The Commission factsheet is out of date here: on 16 March 2026 the Ministry of Finance instructed the Directorate of Taxes to bring the issuance obligation forward by a year, from 1 January 2028 to 1 January 2027, following Skattedirektoratet's consultation paper of 20 June 2025. Legislation amending the Bookkeeping Act is still before the Storting, so both dates remain provisional. The definition of 'electronic invoice' is to follow ViDA.",
  },
};

const path = "data/mandates.json";
const d = JSON.parse(fs.readFileSync(path, "utf8"));
let n = 0;
for (const c of d.countries) {
  const f = FIXES[c.code];
  if (!f) continue;
  Object.assign(c, f, { last_verified: V, detail_tier: "full" });
  n++;
}
d.version = "0.3.0";
d.last_updated = V;
d.source_note = "Phases are sourced to the European Commission eInvoicing Country Factsheets (2026 edition) and, where the factsheet lags national law, to the national authority. Phases still flagged needs_verification are pending legislation or depend on an unpublished implementing regulation.";
fs.writeFileSync(path, JSON.stringify(d, null, 2) + "\n");
console.log(`updated ${n} countries`);
