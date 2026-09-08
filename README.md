# EU E-Invoicing Mandates — open dataset

Machine-readable e-invoicing mandate data for all 27 EU member states plus Norway:
who must issue or receive structured invoices, from when, in which format, over
which network.

**Status: pre-release (v0.2.0). Not yet suitable for production — see [Verification](#verification).**

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
| `detail_tier` | `full` (researched country guide) · `minimal` (verified baseline only) |
| `needs_verification` | The date is provisional — see below |
| `sources[]` | Citations, official sources marked `official: true` |

## Verification

Mandate dates slip. Poland's KSeF was postponed more than once, Spain's
commencement depends on implementing regulation, and France's timetable has been
revised. Any phase carrying `needs_verification: true` is provisional and should
not be relied on for compliance decisions without checking the primary source.

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
