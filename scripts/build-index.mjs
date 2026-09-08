// Regenerates INDEX.md from the dataset. Run after any data change.
import fs from "node:fs";
import { readinessIndex, readinessTable } from "../readiness.mjs";
import data from "../data/mandates.json" with { type: "json" };

const rows = readinessIndex();
const today = new Date().toISOString().slice(0, 10);
const md = `# EU E-Invoicing Readiness Index

How far each member state has actually got with e-invoicing, scored 0–100 from
[\`data/mandates.json\`](data/mandates.json). Generated ${today} from dataset
v${data.version} — regenerate with \`npm run build:index\`.

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

${readinessTable()}

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
`;
fs.writeFileSync("INDEX.md", md);
console.log(`INDEX.md written — ${rows.length} countries, top: ${rows.slice(0,3).map(r=>r.code+" "+r.score).join(", ")}`);
