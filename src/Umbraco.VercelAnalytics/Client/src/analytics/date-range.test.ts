import { describe, expect, it } from "vitest";
import { dateRangeForPreset, intervalForRange, normalizeCustomRange } from "./date-range.js";

describe("analytics date ranges", () => {
  it("creates an inclusive 30 day range", () => {
    expect(dateRangeForPreset(30, new Date("2026-07-15T12:00:00Z"))).toEqual({
      from: "2026-06-16",
      to: "2026-07-15",
      interval: "Day",
    });
  });

  it("selects granularity from the reporting window", () => {
    expect(intervalForRange(90)).toBe("Day");
    expect(intervalForRange(91)).toBe("Week");
    expect(intervalForRange(367)).toBe("Month");
  });

  it("rejects inverted custom ranges", () => {
    expect(normalizeCustomRange("2026-07-15", "2026-07-14")).toBeUndefined();
  });
});
