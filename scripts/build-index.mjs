// Regenerates INDEX.md from the dataset. Run after any data change.
import fs from "node:fs";
import { readinessIndex, readinessTable } from "../readiness.mjs";
import data from "../data/mandates.json" with { type: "json" };

// Scored and dated as of the dataset's last_updated, not the build day, so the
// same data always gives the same INDEX.md and the CI freshness check does not
// fail on later days or when a mandate date passes.
const today = data.last_updated;
const rows = readinessIndex({ date: today });
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

${readinessTable({ date: today })}

## Reading it

- A high **Mandate** score with low **Interop** means a country is strict but
  inward-facing — plan for a national platform integration, not just Peppol.
- A low **Certainty** score means the dates are liable to move. The
  Netherlands scores lowest here: its 2030 B2B date is a cabinet decision, not
  yet law.
- **Coverage** only counts what is in force today, so a country with an ambitious
  2028 mandate still scores 0 there. That is deliberate — this measures the
  present, not intentions.

Not legal or tax advice. Verify against the national authority before acting.
`;
fs.writeFileSync("INDEX.md", md);
console.log(`INDEX.md written — ${rows.length} countries, top: ${rows.slice(0,3).map(r=>r.code+" "+r.score).join(", ")}`);
