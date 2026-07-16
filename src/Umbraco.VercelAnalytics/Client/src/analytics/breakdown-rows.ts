import type { AnalyticsBreakdownRow } from "../api/types.gen.js";

const OTHERS_LABEL = "others";

export function withoutAggregatedOthers(rows: AnalyticsBreakdownRow[]): AnalyticsBreakdownRow[] {
  return rows.filter((row) => row.value.trim().toLocaleLowerCase() !== OTHERS_LABEL);
}

export function topBreakdownRows(rows: AnalyticsBreakdownRow[], limit = 10): AnalyticsBreakdownRow[] {
  return withoutAggregatedOthers(rows).slice(0, limit);
}

export function analyticsRowHref(baseUrl: string | undefined, value: string): string | undefined {
  if (!baseUrl || !value.startsWith("/")) return undefined;

  try {
    const base = new URL(baseUrl);
    if (base.protocol !== "https:" && base.protocol !== "http:") return undefined;
    return new URL(value, base.origin).href;
  } catch {
    return undefined;
  }
}
