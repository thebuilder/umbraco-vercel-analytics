import { describe, expect, it } from "vitest";
import { analyticsRowHref, referrerFaviconUrl, topBreakdownRows, visibleBreakdownRows, withoutAggregatedOthers } from "./breakdown-rows.js";

const rows = [
  { value: "/news", visitors: 12, pageViews: 18 },
  { value: "Others", visitors: 9, pageViews: 11 },
  { value: "/about", visitors: 4, pageViews: 6 },
];

describe("analytics breakdown rows", () => {
  it("removes Vercel's aggregate row everywhere", () => {
    expect(withoutAggregatedOthers(rows).map((row) => row.value)).toEqual(["/news", "/about"]);
  });

  it("limits panels after removing the aggregate row", () => {
    expect(topBreakdownRows(rows, 1).map((row) => row.value)).toEqual(["/news"]);
  });

  it("removes unknown values only from referrer breakdowns", () => {
    const referrers = [
      { value: "", visitors: 12, pageViews: 18 },
      { value: "Unknown", visitors: 9, pageViews: 11 },
      { value: "google.com", visitors: 4, pageViews: 6 },
    ];

    expect(visibleBreakdownRows(referrers, "ReferrerHostname").map((row) => row.value)).toEqual(["google.com"]);
    expect(visibleBreakdownRows(referrers, "BrowserName")).toHaveLength(3);
  });

  it("builds an encoded Google favicon URL for a referrer hostname", () => {
    expect(referrerFaviconUrl("www.example.com")).toBe("https://www.google.com/s2/favicons?domain=www.example.com&sz=32");
    expect(referrerFaviconUrl("sub domain.example")).toContain("domain=sub%20domain.example");
    expect(referrerFaviconUrl("Unknown")).toBeUndefined();
  });

  it("only creates links for rooted paths on an HTTP origin", () => {
    expect(analyticsRowHref("https://example.com/start", "/news")).toBe("https://example.com/news");
    expect(analyticsRowHref("javascript:alert(1)", "/news")).toBeUndefined();
    expect(analyticsRowHref("https://example.com", "https://attacker.test")).toBeUndefined();
  });
});
