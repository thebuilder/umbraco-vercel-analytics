import type { AnalyticsDimension } from "../api/types.gen.js";
import type { UtmDimension } from "./dashboard-url-state.js";

export type UtmCapability = "unknown" | "available" | "unavailable";

const UTM_DIMENSIONS: ReadonlySet<AnalyticsDimension> = new Set([
  "UtmSource",
  "UtmMedium",
  "UtmCampaign",
  "UtmTerm",
  "UtmContent",
]);

export function isUtmDimension(dimension: AnalyticsDimension): dimension is UtmDimension {
  return UTM_DIMENSIONS.has(dimension);
}

export function detectUtmCapability(
  baselineSucceeded: boolean,
  utmSucceeded: boolean,
  utmStatuses: ReadonlyArray<number>,
): UtmCapability {
  if (utmSucceeded) return "available";
  if (baselineSucceeded && utmStatuses.includes(402)) return "unavailable";
  return "unknown";
}
