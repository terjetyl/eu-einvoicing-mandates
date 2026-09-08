# EU E-Invoicing Mandates — open dataset

Machine-readable e-invoicing mandate data for all 27 EU member states plus Norway:
who must issue or receive structured invoices, from when, in which format, over
which network.

**v1.2.0** — every country is sourced to its European Commission eInvoicing Country Factsheet (2026 edition); countries whose mandates were provisional also cite the national legal instrument. 4 of 76 phases remain provisional; see [Verification](#verification).

```bash
npm install eu-einvoicing-mandates
```

```js
import { isMandatory, upcomingDeadlines, getCountry } from "eu-einvoicing-mandates";

// Germany has required *receipt* since 2025, but *issuance* phases in to 2028.
isMandatory({ country: "DE", obligation: "receive" }); // → mandatory: true,  since: "2025-01-01"
isMandatory({ country: "DE", obligation: "issue"   }); // → mandatory: false

upcomingDeadlines();  // every future obligation, soonest first
```

## Why this exists

Mandate information is published as prose, and prose can't be computed against.
"Mandatory from 1 September 2026" hides the three things an integrator actually
needs to know: *for whom*, *to issue or to receive*, and *under which threshold*.

So each obligation is modelled as a discrete phase:

```json
{
  "scope": "b2b",
  "obligation": "receive",
  "date": "2025-01-01",
  "applies_to": "All German VAT-registered businesses",
  "threshold": null,
  "needs_verification": false
}
```

That structure is the whole point. Conflating issuance with receipt is the most
common error in this space, and a single free-text `deadline` field guarantees it.

## Fields

| Field | Meaning |
| --- | --- |
| `status` | `active` (B2B mandate in force) · `upcoming` (adopted, future date) · `partial` (B2G only, or phased/voluntary B2B) · `none` |
| `network` | `peppol` · `national` (a state clearance platform such as KSeF or SdI) · `hybrid` |
| `phases[]` | Dated obligations, split by scope and direction |
| `breadth` | `universal` · `threshold` · `sector` · `on_request` — who the obligation actually reaches |
| `detail_tier` | `full` (researched country guide) · `minimal` (verified baseline only) |
| `needs_verification` | The date is provisional — see below |
| `sources[]` | Citations, official sources marked `official: true` |

## Readiness Index

[**INDEX.md**](INDEX.md) scores every country 0–100 on how far it has actually
got — mandate, coverage, cross-border interoperability and certainty — computed
entirely from this dataset (`npm run build:index`).

`breadth` is what makes it honest. Hungary has a B2B e-invoicing obligation, but
it covers energy suppliers only; Estonia's applies only when the buyer asks.
Score those as national mandates and both land beside Belgium, which is how most
published comparisons get it wrong. Weighted by breadth, Hungary sits below
Italy, where it belongs.

Interop is a separate column on purpose: Italy and Romania run mature mandates
that a supplier elsewhere in the EU cannot reach over Peppol at all.

## Verification

Mandate dates slip, and secondary sources lag. Every country cites its European
Commission factsheet. Where the factsheet is behind national law, the national
instrument is cited alongside it and the discrepancy is recorded in `notes`.

Three cases where following only the widely-repeated figure would mislead you:

- **Norway** — the Commission factsheet still records no B2B mandate. There is
  one: Lov 2026-06-19-39, passed by the Storting on 8 June 2026, commencing
  1 January 2027.
- **Slovenia** — often listed as 2027, from earlier drafts. ZIERDED was adopted
  on 23 October 2025 (Uradni list RS 85/2025) with a date of **1 January 2028**.
- **Spain** — quoted as 2025–2027 almost everywhere. Real Decreto 238/2026 is
  in force, but sets no calendar date at all: the 12- and 24-month phases run
  from a ministerial order that has not yet been made.

The 4 phases still flagged `needs_verification: true` are Spain's two undated
phases and the 2030 intra-EU extensions for Croatia and Slovakia, which follow
the ViDA timetable rather than settled national law.

`scripts/validate.mjs` enforces the schema and catches internal contradictions —
for example a country marked `upcoming` whose phase date has already passed. It
runs in CI, which is how staleness gets caught rather than noticed.

**This is not legal or tax advice.** Verify against the relevant national
authority before acting.

## Contributing

Corrections are the most valuable contribution, particularly ones that attach an
official source to a phase flagged `needs_verification`. Open a PR against
`data/mandates.json`; `npm run validate` must pass.

## Licence

[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). Free to use in
commercial products; attribution required.

Maintained by [Invoicia](https://invoicia.eu), an EU-hosted invoicing tool.
