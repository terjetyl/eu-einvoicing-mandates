// Sourcing pass for the remaining 19 countries, against the European Commission
// eInvoicing Country Factsheets (2026 edition).
import fs from "node:fs";

const PAGE = { AT:[467108876,"Austria"], BG:[467108878,"Bulgaria"], CY:[467108880,"Cyprus"],
  CZ:[467108881,"Czech+Republic"], EE:[467108883,"Estonia"], FI:[467108884,"Finland"],
  GR:[467108887,"Greece"], HU:[467108888,"Hungary"], IE:[467108889,"Ireland"],
  IT:[467108890,"Italy"], LV:[467108891,"Latvia"], LT:[467108892,"Lithuania"],
  LU:[467108893,"Luxembourg"], MT:[467108894,"Malta"], PT:[467108897,"Portugal"],
  RO:[467108898,"Romania"], SK:[467108899,"Slovakia"], SI:[467108900,"Slovenia"], SE:[467108902,"Sweden"] };
const EC = (code, name) => ({ title: `eInvoicing in ${name}`,
  url: `https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/${PAGE[code][0]}/eInvoicing+in+${PAGE[code][1]}`,
  publisher: "European Commission (DIGITAL / CEF eInvoicing)", official: true, retrieved: "2026-09-08" });

const p = (scope, obligation, date, applies_to, extra = {}) => ({ scope, obligation, date,
  date_precision: date ? "exact" : "unknown", applies_to, threshold: null,
  voluntary: false, needs_verification: false, ...extra });
const noB2B = (why = "No mandate; voluntary and subject to mutual agreement") =>
  p("b2b", "both", null, why, { voluntary: true });

const F = {
  AT: { status:"partial", network:"peppol", peppol_supported:true, formats:["ebInterface 4.3/5/6","UBL 2.1","UN/CEFACT CII","PEPPOL BIS Billing 3.0"],
    phases:[p("b2g","issue","2020-04-18","All suppliers, including foreign ones, invoicing central government"), noB2B()],
    notes:"Central government requires supplier issuance via e-Rechnung.gv.at / USP; sub-central adoption is voluntary. Two national CIUS apply." },
  BG: { status:"partial", network:"peppol", peppol_supported:true, formats:["UBL 2.1","UN/CEFACT CII"],
    phases:[p("b2g","receive","2019-11-01","Public sector entities, under Article 115a of the Public Procurement Act"), noB2B()],
    notes:"A public consultation has been opened on adopting a mandatory clearance model along Italian/French lines; nothing adopted." },
  CY: { status:"partial", network:"peppol", peppol_supported:true, formats:["PEPPOL BIS Billing 3.0"],
    phases:[p("b2g","receive","2019-04-18","Central public sector bodies"), p("b2g","receive","2020-04-18","Sub-central entities"), noB2B()],
    notes:"Supplier issuance is voluntary. Mandatory B2B/B2C is a stated long-term objective with no timeline." },
  CZ: { status:"partial", network:"peppol", peppol_supported:true, formats:["UBL 2.1","ISDOC","EDIFACT"],
    phases:[p("b2g","receive","2016-10-01","Public contracting authorities, under Act No. 134/2016 on Public Procurement"), noB2B()],
    notes:"B2G runs through the NEN platform. ISDOC is the national format alongside EN 16931." },
  EE: { status:"partial", network:"peppol", peppol_supported:true, formats:["EN 16931","national XML"],
    phases:[p("b2g","receive","2019-04-18","Public sector, for procurement above EU thresholds"),
      p("b2b","issue","2025-07-01","Suppliers, on request, where the buyer is registered as an e-invoice recipient in the commercial register")],
    notes:"Not a blanket mandate. The Accounting Act amendment works on a buyer's-choice principle: registered recipients are entitled to an EN 16931 invoice by default, and parties may still agree another format. Frequently misreported as a universal B2B mandate." },
  FI: { status:"partial", network:"peppol", peppol_supported:true, formats:["Finvoice 3.0","TEAPPSXML 3.0","UBL 2.1","UN/CEFACT CII","PEPPOL BIS Billing 3.0"],
    phases:[p("b2g","receive","2019-04-01","Central government bodies, under the eInvoicing Act 241/2019"),
      noB2B("No mandate. Under Act 241/2019 businesses above EUR 10,000 turnover hold a right to request an EN 16931 invoice — an entitlement, not an obligation to use e-invoicing.")],
    notes:"Finland's B2G scope goes beyond the Directive minimum to national thresholds." },
  GR: { status:"partial", network:"peppol", peppol_supported:true, formats:["PEPPOL BIS Billing CIUS 3.0"],
    phases:[p("b2g","issue","2024-09-13","Gradual rollout across general government"),
      p("b2g","issue","2025-09-01","General government expenditure above EUR 2,500"), noB2B("No B2B mandate; legislative amendments would be required and no date is set.")],
    notes:"myDATA real-time VAT reporting is a separate regime and is not an e-invoicing mandate. KE.D is the central receiving point over Peppol." },
  HU: { status:"partial", network:"hybrid", peppol_supported:true, formats:["EN 16931 (B2G)"],
    phases:[p("b2g","receive","2019-11-01","Public sector entities, for procurement above EU thresholds"),
      p("b2b","issue","2025-07-01","Electricity and natural gas suppliers only"),
      noB2B("No general B2B e-invoicing mandate.")],
    notes:"Hungary is routinely miscategorised. RTIR/NAV real-time invoice reporting (universal since 4 January 2021) is a VAT reporting obligation, not an e-invoicing mandate — any format the tax authority accepts may be used. The only sectoral e-invoicing obligation covers energy suppliers." },
  IE: { status:"partial", network:"peppol", peppol_supported:true, formats:["PEPPOL BIS Billing 3.0"],
    phases:[p("b2g","receive","2019-06-12","Public sector entities, under Statutory Instrument 258/2019"), noB2B()],
    notes:"Any future obligation is expected via ViDA rather than domestic law." },
  IT: { status:"active", network:"national", peppol_supported:false, formats:["FatturaPA"],
    phases:[p("b2g","issue","2015-03-31","All suppliers to public administrations, via SdI"),
      p("b2b","both","2019-01-01","All VAT-registered Italian businesses, for domestic transactions")],
    notes:"The EU's first universal B2B clearance mandate. The turnover-based exclusion for small businesses was removed in January 2024. Exchange is exclusively via the Sistema di Interscambio, not Peppol; Italy's derogation to keep SdI runs to 31 December 2027 under EU Decision 2024/3150." },
  LV: { status:"upcoming", network:"peppol", peppol_supported:true, formats:["EN 16931"],
    phases:[p("b2g","issue","2025-01-01","Suppliers to budget institutions (contracts concluded before 31 December 2024 may defer to 1 January 2026)"),
      p("b2b","both","2028-01-01","All Latvian-registered businesses", { needs_verification: true })],
    notes:"The B2B mandate was postponed from 2026 to 2028, approved 5 June 2025 — widely still reported as 2026. Exemptions cover businesses using electronic tax registration devices, National Health Service systems, and national security agencies. Decentralised delivery via eAddress or Peppol providers." },
  LT: { status:"partial", network:"peppol", peppol_supported:true, formats:["EN 16931"],
    phases:[p("b2g","issue","2017-07-01","All suppliers in public procurement"), noB2B()],
    notes:"SABIS replaced eSąskaita in September 2024 and is now the only accepted route, connected to Peppol." },
  LU: { status:"partial", network:"peppol", peppol_supported:true, formats:["UBL 2.1","UN/CEFACT CII"],
    phases:[p("b2g","issue","2022-05-18","Large companies"), p("b2g","issue","2022-10-18","Medium-sized companies"),
      p("b2g","issue","2023-03-18","Small and newly established businesses"), noB2B()],
    notes:"Phased B2G rollout by company size, complete since March 2023. Peppol is the backbone." },
  MT: { status:"partial", network:"peppol", peppol_supported:true, formats:["PEPPOL BIS Billing 3.0"],
    phases:[p("b2g","receive","2019-04-18","Central contracting authorities and local councils, under Legal Notices 403/404 of 2018"), noB2B()],
    notes:"No dedicated national e-invoicing platform. B2B/B2G expansion is under study in line with ViDA." },
  PT: { status:"partial", network:"hybrid", peppol_supported:true, formats:["CIUS-PT","UBL 2.1","XML-GS1"],
    phases:[p("b2g","issue","2021-01-01","Large companies (250+ employees, EUR 50M+ revenue or EUR 43M+ assets)"),
      p("b2g","issue","2025-01-01","Small and medium-sized enterprises"), noB2B()],
    notes:"Legal basis Lei n.º 111-B/2017 as amended. No B2B mandate: PDF invoices remain valid but from January 2026 require a Qualified Electronic Signature. SAF-T(PT) monthly reporting is a separate, long-standing regime." },
  RO: { status:"active", network:"national", peppol_supported:false, formats:["RO_CIUS (UBL 2.1)","UN/CEFACT CII"],
    phases:[p("b2g","receive","2020-09-08","Public sector entities, under Law 199/2020"),
      p("b2b","both","2024-01-01","Taxable persons established in Romania and non-established entities registered for Romanian VAT"),
      p("b2c","issue","2025-01-01","All domestic B2C transactions taxable in Romania")],
    notes:"One of the few member states with a B2C mandate as well as B2B. Invoices must reach RO e-Factura within five calendar days of issuance. National specification RO_CIUS under Order 1366/2021." },
  SK: { status:"upcoming", network:"peppol", peppol_supported:true, formats:["UBL 2.1","UN/CEFACT CII"],
    phases:[p("b2g","receive","2019-08-01","Central and sub-central authorities, under Act No. 2015/2019"),
      p("b2b","both","2027-01-01","VAT taxpayers, domestic transactions, with simultaneous real-time reporting", { needs_verification: true }),
      p("b2b","both","2030-07-01","Cross-border intra-EU transactions", { needs_verification: true })],
    notes:"IS EFA migrates to Peppol-based infrastructure by 2027 to align with ViDA. Commonly listed as B2G-only, which is now out of date." },
  SI: { status:"upcoming", network:"peppol", peppol_supported:true, formats:["e-SLOG 2.0","EN 16931"],
    phases:[p("b2g","both","2015-01-01","All B2G and G2G transactions via the Public Payments Administration"),
      p("b2b","both","2027-01-01","Businesses, pending adoption of the draft ZIERDED act", { needs_verification: true })],
    notes:"The B2B date depends on ZIERDED passing and has slipped before — treat as provisional. Peppol compatible since 2018." },
  SE: { status:"partial", network:"peppol", peppol_supported:true, formats:["PEPPOL BIS Billing 3.0"],
    phases:[p("b2g","receive","2019-11-01","Public sector entities, under Act 2018:1277"), noB2B()],
    notes:"No B2B mandate and no VAT real-time reporting. Peppol BIS Billing 3.0 is used as the national CIUS without modification; voluntary adoption is high." },
};

const path = "data/mandates.json";
const d = JSON.parse(fs.readFileSync(path, "utf8"));
let n = 0;
for (const c of d.countries) {
  const f = F[c.code];
  if (!f) continue;
  Object.assign(c, f, { last_verified: "2026-09-08", detail_tier: "full",
    sources: [EC(c.code, c.name)], standard: "EN 16931" });
  n++;
}
d.version = "1.0.0";
fs.writeFileSync(path, JSON.stringify(d, null, 2) + "\n");
console.log(`updated ${n} countries`);
