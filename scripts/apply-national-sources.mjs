// National-source pass for the countries whose phases were provisional.
// Where the Commission factsheet lags national law, the national source wins
// and the discrepancy is recorded in notes.
import fs from "node:fs";

const V = "2026-09-08";
const src = (title, url, publisher) => ({ title, url, publisher, official: true, retrieved: V });
const p = (scope, obligation, date, applies_to, extra = {}) => ({
  scope, obligation, date, date_precision: date ? "exact" : "unknown",
  applies_to, threshold: null, voluntary: false, needs_verification: false, ...extra });

const path = "data/mandates.json";
const d = JSON.parse(fs.readFileSync(path, "utf8"));
const get = (code) => d.countries.find((c) => c.code === code);

// --- Spain: the implementing regulation HAS been published (RD 238/2026). The
// clock now hangs on a ministerial order instead, so still no calendar date. ---
{
  const c = get("ES");
  c.phases = [
    p("b2g", "receive", "2015-01-01", "Public entities must receive EN 16931 invoices (Law 25/2013), converted to Facturae via FACe"),
    p("b2b", "both", null, "Businesses with turnover above EUR 8 million (art. 121 Law 37/1992): 12 months after the ministerial order developing the public invoicing solution enters into force",
      { needs_verification: true, threshold: { metric: "annual_revenue", currency: "EUR", amount: 8000000, comparator: "gt" } }),
    p("b2b", "both", null, "All remaining businesses and professionals: 24 months after that same ministerial order enters into force",
      { needs_verification: true }),
  ];
  c.sources.push(
    src("Real Decreto 238/2026, de 25 de marzo (BOE-A-2026-7295)", "https://www.boe.es/buscar/act.php?id=BOE-A-2026-7295", "Boletín Oficial del Estado"));
  c.notes = "Widely misreported in both directions. The implementing regulation exists — Real Decreto 238/2026, published in the BOE on 31 March 2026 and in force since 20 April 2026 — so 'awaiting the regulation' is out of date. But it still sets no calendar date: obligations become enforceable 12 months (above EUR 8M turnover) and 24 months (everyone else) after the *ministerial order* governing the AEAT public invoicing solution enters into force, and that order is still pending. The 2025-2027 dates in circulation are wrong; commonly cited estimates now point at late 2027 and late 2028. VERIFACTU and SII are separate regimes.";
}

// --- Croatia: Fiscalization 2.0 is law and in force. Receiving and issuing
// split for non-VAT entities, plus an EU cross-border phase in 2030. ---
{
  const c = get("HR");
  c.phases = [
    p("b2g", "both", "2019-07-01", "All public-sector suppliers (Act on eInvoicing in Public Procurement, OJ 94/2018)"),
    p("b2b", "both", "2026-01-01", "Businesses in the VAT system — issuing and receiving; an eRačun is the only legally valid domestic B2B invoice"),
    p("b2b", "receive", "2026-01-01", "Entities outside the VAT system — receiving only"),
    p("b2b", "issue", "2027-01-01", "Entities outside the VAT system and the public sector — issuing"),
    p("b2b", "both", "2030-07-01", "Extension to intra-EU transactions", { needs_verification: true }),
  ];
  c.sources.push(
    src("Zakon o fiskalizaciji (Narodne novine 89/25)", "https://porezna.gov.hr/fiskalizacija/bezgotovinski-racuni", "Porezna uprava (Croatian Tax Administration)"));
  c.notes = "Zakon o fiskalizaciji was published in Narodne novine 89/25, entered into force on 1 September 2025 and applies from 1 January 2026, with system testing available from September 2025. Note the split for entities outside the VAT system: they must receive from 1 January 2026 but only issue from 1 January 2027. eRačun covers domestic B2B only — not B2C, and not invoices to foreign customers. FiskAplikacija is the free tax-administration portal.";
}

// --- Latvia: adopted 5 June 2025, B2B deferred to 2028 (still widely quoted as 2026). ---
{
  const c = get("LV");
  c.phases = [
    p("b2g", "issue", "2025-01-01", "Suppliers to budget institutions (contracts concluded before 31 December 2024 may defer to 1 January 2026)"),
    p("b2b", "both", "2028-01-01", "All businesses registered in Latvia"),
  ];
  c.sources.push(
    src("Grozījumi Grāmatvedības likumā — obligātie e-rēķini no 2028. gada", "https://www.fm.gov.lv/lv/jaunums/obligatie-e-rekini-visiem-uznemumiem-bus-jaievies-no-2028gada", "Finanšu ministrija (Ministry of Finance)"),
    src("Saeima adopts amendments to the Accounting Law (5 June 2025)", "https://www.saeima.lv/lv/aktualitates/saeimas-zinas/24961-/34793-obligatie-e-rekini-visiem-uznemumiem-bus-jaievies-no-2028-gada", "Saeima (Parliament of Latvia)"));
  c.notes = "The Saeima adopted amendments to the Accounting Law (Grāmatvedības likums) as urgent on 5 June 2025, deferring the B2B obligation from 2026 to 1 January 2028. Many sources still quote 2026. B2G has applied since 1 January 2025; structured e-invoicing is voluntary for non-budget entities in the interim. Exemptions cover businesses using electronic tax registration devices, National Health Service systems, and national security agencies.";
}

// --- Norway: no longer a proposal. Passed by the Storting on 8 June 2026. ---
{
  const c = get("NO");
  c.phases = [
    p("b2g", "both", "2019-04-02", "Public-sector suppliers, for transactions above NOK 100,000 excluding VAT"),
    p("b2b", "issue", "2027-01-01", "Bookkeeping-obliged businesses must send e-invoices to one another"),
    p("b2b", "receive", "2030-01-01", "Bookkeeping-obliged businesses must keep digital accounts and receive e-invoices automatically"),
  ];
  c.sources = [
    c.sources[0],
    src("Lov 19. juni 2026 nr. 39 om endringer i bokføringsloven (pliktig digital bokføring og e-fakturering mv.)", "https://lovdata.no/dokument/LTI/lov/2026-06-19-39", "Lovdata / Stortinget"),
    src("Nye lovregler om e-fakturering i næringslivet settes i kraft", "https://www.regjeringen.no/no/aktuelt/nye-lovregler-om-e-fakturering-i-naringslivet-og-enkelte-andre-lovendringer-pa-finansmarkedsomradet-settes-i-kraft/id3166726/", "Finansdepartementet"),
  ];
  c.notes = "EEA, not EU. No longer provisional: Prop. 44 L (2025-2026) was passed by the Storting on 8 June 2026 and promulgated as Lov 2026-06-19-39, in force from 1 July 2026 except the Bookkeeping Act changes, which commence 1 January 2027 (sending) and 1 January 2030 (digital bookkeeping and automatic receipt). The obligation was pulled forward a year from 2028 by a government instruction of 16 March 2026. The Commission factsheet still records Norway as having no B2B mandate and is out of date.";
}

// --- Slovenia: ZIERDED passed 23 Oct 2025 — and the date is 2028, not 2027. ---
{
  const c = get("SI");
  c.status = "upcoming";
  c.phases = [
    p("b2g", "both", "2015-01-01", "All B2G and G2G transactions via the Public Payments Administration"),
    p("b2b", "both", "2028-01-01", "All entities in the Business Register and natural persons performing an activity"),
  ];
  c.sources.push(
    src("Zakon o izmenjavi elektronskih računov in drugih elektronskih dokumentov (ZIERDED), Uradni list RS 85/2025", "https://www.uradni-list.si/glasilo-uradni-list-rs/vsebina/2025-01-3032", "Uradni list Republike Slovenije"));
  c.notes = "ZIERDED was adopted by the Državni zbor on 23 October 2025 and published in Uradni list RS 85/2025 on 6 November 2025 — it is law, not a draft, and the date is 1 January 2028 rather than the 2027 often quoted from earlier drafts. B2C and cross-border e-invoicing remain optional. The act transposes Council Directive (EU) 2025/516 (ViDA). Accepted formats are e-SLOG 2.0 or another established structured standard.";
}

// --- Slovakia: adopted 9 Dec 2025 as part of the VAT Act amendment. ---
{
  const c = get("SK");
  c.phases = [
    p("b2g", "receive", "2019-08-01", "Central and sub-central authorities, under Act No. 2015/2019"),
    p("b2b", "both", "2027-01-01", "VAT payers established in Slovakia, for domestic supplies to businesses and legal entities (recipients include non-VAT payers); B2G is covered on the same date"),
    p("b2b", "both", "2030-07-01", "Extension to cross-border intra-EU transactions", { needs_verification: true }),
  ];
  c.sources.push(
    src("Zákon č. 385/2025 Z. z., ktorým sa mení a dopĺňa zákon č. 222/2004 Z. z. o DPH", "https://static.slov-lex.sk/static/SK/ZZ/2025/385/20270101.html", "Slov-Lex (Collection of Laws of the Slovak Republic)"));
  c.notes = "Adopted by the National Council on 9 December 2025 as Act No. 385/2025 Z. z., amending the VAT Act (222/2004). Mandatory from 1 January 2027 for domestic B2B and B2G, with a voluntary phase running since May 2026 and delivery over Peppol. B2C is out of scope. Often still listed as B2G-only.";
}

for (const c of d.countries) c.last_verified = V;
d.version = "1.1.0";
d.last_updated = V;
d.source_note = "Every country cites its European Commission eInvoicing Country Factsheet (2026 edition). Countries whose mandates were provisional additionally cite the national legal source, which takes precedence where the factsheet lags — see notes for Norway, Slovenia and Spain in particular.";
fs.writeFileSync(path, JSON.stringify(d, null, 2) + "\n");
console.log("national sources applied");
