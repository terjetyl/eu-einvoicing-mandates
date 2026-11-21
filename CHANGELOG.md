# Changelog

## 1.3.0 — 2026-11-18

Fact-check of nine countries against primary official sources. All nine now
have `last_verified: 2026-11-18`.

- **Spain** — dated: B2B 6 Oct 2027 (turnover above EUR 8M) and 6 Oct 2028 (all
  others), from Orden HAC/1028/2026 (BOE-A-2026-20587, in force 6 Oct 2026).
  Both phases no longer `needs_verification`; status `partial` → `upcoming`.
  Formats now EN 16931 in UBL, CII, EDIFACT or Facturae. Sources: BOE order, AEAT notice.
- **Netherlands** — B2B e-invoicing planned from 1 Jul 2030 (cabinet decision
  11 Sep 2026, KOR exempt, reporting from 1 Jul 2031). Replaces the "no mandate"
  phase; flagged `needs_verification` until the bill passes. Source: rijksoverheid.nl.
- **Poland** — B2B split into receive (all taxpayers, 1 Feb 2026) and issue
  (above PLN 200M 2024 sales incl. VAT 1 Feb 2026; others 1 Apr 2026; invoiced
  sales up to PLN 10,000 gross a month 1 Jan 2027). FA(2) → FA(3) / KSeF 2.0.
  Penalties from 2027. Source: ksef.podatki.gov.pl.
- **France** — B2G phase is Chorus Pro from 1 Jan 2017 (phased to 2020), not
  2019. Scope "established in France"; "plateformes agréées" replaces PDP;
  fines added. Source: economie.gouv.fr.
- **Germany** — scope is businesses *established* in Germany; EUR 800,000 is
  prior-year total turnover; Kleinunternehmer, invoices up to EUR 250 and tickets
  exempt; ZUGFeRD from 2.0.1. Source: § 27 UStG.
- **Croatia** — scope "established in Croatia"; HR CIUS extensions and KPD codes
  required (plain Peppol BIS not valid); the 2030 phase is labelled as EU ViDA.
  Source: Porezna uprava FAQ (30.1.2026).
- **Norway** — 2027 sending duty applies to buyers registered in ELMA; scope is
  bokføringspliktige; NOK 50,000 rule. Source: Skatteetaten.
- **Denmark** — Bookkeeping Act dates corrected (annual-report companies 2024/2025;
  others above DKK 300,000 from 2026). Source: Erhvervsstyrelsen.
- **Belgium** — scope "established in Belgium" (non-established holders of a
  Belgian VAT number are out of scope); small-business exemption scheme in scope;
  fines and 2028 e-reporting added. Source: einvoice.belgium.be.

## 1.2.0 — 2026-09-08

`breadth` field and the Readiness Index; national legal sources cited.
