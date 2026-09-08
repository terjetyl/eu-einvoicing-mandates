import data from "./data/mandates.json" with { type: "json" };

export const countries = data.countries;
export const meta = { version: data.version, license: data.license, last_updated: data.last_updated };

const byCode = new Map(data.countries.map((c) => [c.code, c]));
const bySlug = new Map(data.countries.map((c) => [c.slug, c]));

/** Look up a country by ISO 3166-1 alpha-2 code or slug. */
export function getCountry(idOrCode) {
  const k = String(idOrCode).trim();
  return byCode.get(k.toUpperCase()) ?? bySlug.get(k.toLowerCase()) ?? null;
}

/**
 * Is structured e-invoicing mandatory for a given country on a given date?
 *
 * This is the question the free-text deadline on a marketing page cannot answer,
 * because obligations split by scope (b2g/b2b), direction (issue/receive) and
 * company size — Germany, for example, has required *receipt* since 2025 while
 * *issuance* phases in to 2028.
 */
export function isMandatory({ country, date = new Date(), scope = "b2b", obligation = "issue" }) {
  const c = getCountry(country);
  if (!c) throw new Error(`Unknown country: ${country}`);
  const on = date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10);

  const matched = c.phases.filter(
    (p) =>
      p.scope === scope &&
      !p.voluntary &&
      p.date !== null &&
      p.date <= on &&
      (p.obligation === "both" || p.obligation === obligation),
  );

  return {
    country: c.code,
    mandatory: matched.length > 0,
    on,
    // The earliest matching phase is the one that created the obligation.
    since: matched.length ? matched.map((p) => p.date).sort()[0] : null,
    provisional: matched.some((p) => p.needs_verification),
    formats: c.formats,
    network: c.network,
    phases: matched,
  };
}

/** Every obligation landing after `from`, soonest first — the deadline calendar. */
export function upcomingDeadlines(from = new Date()) {
  const on = from instanceof Date ? from.toISOString().slice(0, 10) : String(from).slice(0, 10);
  return data.countries
    .flatMap((c) => c.phases.map((p) => ({ ...p, country: c.code, name: c.name })))
    .filter((p) => p.date && p.date > on && !p.voluntary)
    .sort((a, b) => a.date.localeCompare(b.date));
}
