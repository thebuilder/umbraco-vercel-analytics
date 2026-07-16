import type { AnalyticsBreakdownRow, AnalyticsDimension } from "../api/types.gen.js";

const OTHERS_LABEL = "others";
const UNKNOWN_LABEL = "unknown";

export function withoutAggregatedOthers(rows: AnalyticsBreakdownRow[]): AnalyticsBreakdownRow[] {
  return rows.filter((row) => row.value.trim().toLocaleLowerCase() !== OTHERS_LABEL);
}

export function visibleBreakdownRows(
  rows: AnalyticsBreakdownRow[],
  dimension?: AnalyticsDimension,
): AnalyticsBreakdownRow[] {
  return withoutAggregatedOthers(rows).filter((row) => {
    if (dimension !== "ReferrerHostname") return true;
    const value = row.value.trim().toLocaleLowerCase();
    return value.length > 0 && value !== UNKNOWN_LABEL;
  });
}

export function topBreakdownRows(
  rows: AnalyticsBreakdownRow[],
  limit = 10,
  dimension?: AnalyticsDimension,
): AnalyticsBreakdownRow[] {
  return visibleBreakdownRows(rows, dimension).slice(0, limit);
}

export function referrerFaviconUrl(domain: string): string | undefined {
  const value = domain.trim();
  if (!value || value.toLocaleLowerCase() === UNKNOWN_LABEL) return undefined;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(value)}&sz=32`;
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
