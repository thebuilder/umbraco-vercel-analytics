import type { AnalyticsBreakdownRow, AnalyticsDimension } from "../api/types.gen.js";

const OTHERS_LABEL = "others";
const UNKNOWN_LABEL = "unknown";

export type TrafficMetric = "visitors" | "pageViews";

const PERCENTAGE_DIMENSIONS = new Set<AnalyticsDimension>([
  "Country",
  "DeviceType",
  "BrowserName",
  "OsName",
]);

export function withoutAggregatedOthers(rows: AnalyticsBreakdownRow[]): AnalyticsBreakdownRow[] {
  return rows.filter((row) => row.value.trim().toLocaleLowerCase() !== OTHERS_LABEL);
}

export function visibleBreakdownRows(
  rows: AnalyticsBreakdownRow[],
): AnalyticsBreakdownRow[] {
  return withoutAggregatedOthers(rows).filter((row) => {
    const value = row.value.trim().toLocaleLowerCase();
    return value.length > 0 && value !== UNKNOWN_LABEL;
  });
}

export function isPercentageDimension(dimension?: AnalyticsDimension): boolean {
  return dimension ? PERCENTAGE_DIMENSIONS.has(dimension) : false;
}

export function breakdownMetricValue(row: AnalyticsBreakdownRow, metric: TrafficMetric): number {
  return row[metric];
}

export function breakdownPercentage(value: number, total: number): { display: string; precise: string } {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return {
    display: percentage > 0 && percentage < 0.5 ? "<1%" : `${Math.round(percentage)}%`,
    precise: `${percentage.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`,
  };
}

export function breakdownDisplayValue(value: string, dimension?: AnalyticsDimension): string {
  const trimmed = value.trim();
  return dimension === "DeviceType" && trimmed
    ? `${trimmed.charAt(0).toLocaleUpperCase()}${trimmed.slice(1)}`
    : trimmed;
}

export function topBreakdownRows(
  rows: AnalyticsBreakdownRow[],
  limit = 10,
): AnalyticsBreakdownRow[] {
  return visibleBreakdownRows(rows).slice(0, limit);
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
