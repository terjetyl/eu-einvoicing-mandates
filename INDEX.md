# EU E-Invoicing Readiness Index

How far each member state has actually got with e-invoicing, scored 0–100 from
[`data/mandates.json`](data/mandates.json). Generated 2026-09-08 from dataset
v1.2.0 — regenerate with `npm run build:index`.

## Method

Four components, 25 points each. Every input is a field in the dataset, so the
score is reproducible; the weighting is the only judgement involved.

| Component | What it measures |
|---|---|
| **Mandate** | 25 if a B2B obligation is in force, 15 if adopted with a date, 7 if adopted without one, 0 otherwise |
| **Coverage** | B2G 5 · B2B 15 · B2C 5, counting only obligations already in force |
| **Interop** | Whether invoices travel on EN 16931 rails: Peppol 25 · hybrid 15 · national platform 5 |
| **Certainty** | Share of the country's phases that are settled rather than provisional |

Interop is scored separately on purpose. A national clearance platform can be
domestically advanced and still be a cross-border dead end — Italy and Romania
both run mature mandates that a supplier elsewhere in the EU cannot reach over
Peppol. A single blended number hides that; two columns do not.

## Index

| # | Country | Score | Mandate | Coverage | Interop | Certainty | Network |
|--:|---|--:|--:|--:|--:|--:|---|
| 1 | Belgium | **95** | 25 | 20 | 25 | 25 | peppol |
| 2 | Germany | **90** | 25 | 15 | 25 | 25 | peppol |
| 3 | France | **85** | 25 | 20 | 15 | 25 | hybrid |
| 4 | Poland | **85** | 25 | 20 | 15 | 25 | hybrid |
| 5 | Croatia | **80** | 25 | 20 | 15 | 20 | hybrid |
| 6 | Romania | **80** | 25 | 25 | 5 | 25 | national |
| 7 | Italy | **75** | 25 | 20 | 5 | 25 | national |
| 8 | Latvia | **70** | 15 | 5 | 25 | 25 | peppol |
| 9 | Norway | **70** | 15 | 5 | 25 | 25 | peppol |
| 10 | Slovenia | **70** | 15 | 5 | 25 | 25 | peppol |
| 11 | Estonia | **68** | 8 | 10 | 25 | 25 | peppol |
| 12 | Slovakia | **62** | 15 | 5 | 25 | 17 | peppol |
| 13 | Austria | **55** | 0 | 5 | 25 | 25 | peppol |
| 14 | Bulgaria | **55** | 0 | 5 | 25 | 25 | peppol |
| 15 | Cyprus | **55** | 0 | 5 | 25 | 25 | peppol |
| 16 | Czechia | **55** | 0 | 5 | 25 | 25 | peppol |
| 17 | Finland | **55** | 0 | 5 | 25 | 25 | peppol |
| 18 | Greece | **55** | 0 | 5 | 25 | 25 | peppol |
| 19 | Hungary | **55** | 6 | 9 | 15 | 25 | hybrid |
| 20 | Ireland | **55** | 0 | 5 | 25 | 25 | peppol |
| 21 | Lithuania | **55** | 0 | 5 | 25 | 25 | peppol |
| 22 | Luxembourg | **55** | 0 | 5 | 25 | 25 | peppol |
| 23 | Malta | **55** | 0 | 5 | 25 | 25 | peppol |
| 24 | Netherlands | **55** | 0 | 5 | 25 | 25 | peppol |
| 25 | Sweden | **55** | 0 | 5 | 25 | 25 | peppol |
| 26 | Denmark | **45** | 0 | 5 | 15 | 25 | hybrid |
| 27 | Portugal | **45** | 0 | 5 | 15 | 25 | hybrid |
| 28 | Spain | **25** | 7 | 5 | 5 | 8 | national |

## Reading it

- A high **Mandate** score with low **Interop** means a country is strict but
  inward-facing — plan for a national platform integration, not just Peppol.
- A low **Certainty** score means the dates are liable to move. Spain scores
  lowest here for a reason: its obligation exists in law but has no calendar
  date at all.
- **Coverage** only counts what is in force today, so a country with an ambitious
  2028 mandate still scores 0 there. That is deliberate — this measures the
  present, not intentions.

Not legal or tax advice. Verify against the national authority before acting.
