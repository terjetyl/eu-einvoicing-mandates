import data from "./data/mandates.json" with { type: "json" };

/**
 * EU E-Invoicing Readiness Index.
 *
 * Four components, each 0-25, summing to 0-100. Every input is a field in
 * data/mandates.json, so the score is reproducible from the dataset alone and
 * no judgement is smuggled in — the weighting below is the only opinion.
 *
 *  mandate    Is there a B2B obligation, and is it in force?
 *  coverage   How much of the transaction space it reaches (B2G/B2B/B2C).
 *  interop    Whether invoices leave the country on EN 16931 rails. A national
 *             clearance platform can be advanced domestically and still be a
 *             cross-border dead end, which is the distinction most single-score
 *             rankings lose.
 *  certainty  Share of phases that are settled rather than provisional.
 */
const TODAY = () => new Date().toISOString().slice(0, 10);

// How much a phase counts toward "there is a mandate here". A sectoral
// obligation is not a national mandate, and an on-request duty is not one
// either -- scoring them as such is exactly the error that puts Hungary next
// to Belgium in most published comparisons.
const BREADTH_WEIGHT = { universal: 1, threshold: 0.7, sector: 0.25, on_request: 0.3 };

function scoreMandate(c, on) {
  const b2b = c.phases.filter((p) => p.scope === "b2b" && !p.voluntary);
  const best = (pred) =>
    Math.max(0, ...b2b.filter(pred).map((p) => BREADTH_WEIGHT[p.breadth] ?? 1));

  const inForce = best((p) => p.date && p.date <= on);
  if (inForce) return Math.round(25 * inForce);
  const dated = best((p) => p.date && p.date > on);
  if (dated) return Math.round(15 * dated);
  const undated = best((p) => p.date === null);
  if (undated) return Math.round(7 * undated);
  return 0;
}

function scoreCoverage(c, on) {
  const live = (scope) =>
    Math.max(0, ...c.phases
      .filter((p) => p.scope === scope && !p.voluntary && p.date && p.date <= on)
      .map((p) => BREADTH_WEIGHT[p.breadth] ?? 1));
  // B2B is the hard part and carries most of the weight; B2G is near-universal
  // across the EU thanks to Directive 2014/55/EU, so it discriminates little.
  return Math.round(5 * live("b2g") + 15 * live("b2b") + 5 * live("b2c"));
}

function scoreInterop(c) {
  const base = { peppol: 25, hybrid: 15, national: 5 }[c.network] ?? 0;
  return c.peppol_supported ? base : Math.min(base, 10);
}

function scoreCertainty(c) {
  const total = c.phases.length;
  if (!total) return 0;
  const settled = c.phases.filter((p) => !p.needs_verification).length;
  return Math.round((settled / total) * 25);
}

export function readinessIndex({ date = TODAY() } = {}) {
  const on = date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10);
  return data.countries
    .map((c) => {
      const parts = {
        mandate: scoreMandate(c, on),
        coverage: scoreCoverage(c, on),
        interop: scoreInterop(c),
        certainty: scoreCertainty(c),
      };
      const score = parts.mandate + parts.coverage + parts.interop + parts.certainty;
      return { code: c.code, name: c.name, status: c.status, network: c.network, score, parts };
    })
    .sort((a, b) => b.score - a.score || a.code.localeCompare(b.code));
}

export function readinessTable(opts) {
  const rows = readinessIndex(opts);
  const head =
    "| # | Country | Score | Mandate | Coverage | Interop | Certainty | Network |\n" +
    "|--:|---|--:|--:|--:|--:|--:|---|";
  const body = rows.map((r, i) =>
    `| ${i + 1} | ${r.name} | **${r.score}** | ${r.parts.mandate} | ${r.parts.coverage} | ${r.parts.interop} | ${r.parts.certainty} | ${r.network} |`
  );
  return [head, ...body].join("\n");
}
