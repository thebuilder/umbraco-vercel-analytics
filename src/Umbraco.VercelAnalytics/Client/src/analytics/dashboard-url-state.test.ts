import { describe, expect, it } from "vitest";
import { parseDashboardUrlState, writeDashboardUrlState } from "./dashboard-url-state.js";

describe("analytics dashboard URL state", () => {
  it("parses shareable report state and ignores malformed filters", () => {
    const state = parseDashboardUrlState(new URLSearchParams(
      "connection=main&range=30&from=2026-06-17&to=2026-07-16&metric=pageViews&audience=BrowserName&filter=Country%3ADK&filter=RequestPath%3A%2Fnews%3Aarchive&filter=EventName%3ASignup&filter=Nope%3Ax&filter=Country%3AUS",
    ));

    expect(state.connection).toBe("main");
    expect(state.preset).toBe(30);
    expect(state.range).toEqual({ from: "2026-06-17", to: "2026-07-16", interval: "Day" });
    expect(state.metric).toBe("pageViews");
    expect(state.audience).toBe("BrowserName");
    expect(state.filters).toEqual([
      { dimension: "Country", value: "DK" },
      { dimension: "RequestPath", value: "/news:archive" },
      { dimension: "EventName", value: "Signup" },
    ]);
  });

  it("writes analytics state while preserving unrelated Umbraco parameters", () => {
    const url = writeDashboardUrlState(new URL("https://example.com/umbraco/section/analytics?umbDebug=true&filter=Country%3AUS"), {
      connection: "main",
      preset: "custom",
      range: { from: "2026-01-01", to: "2026-01-31", interval: "Day" },
      metric: "visitors",
      audience: "DeviceType",
      filters: [{ dimension: "Country", value: "DK" }],
    });

    expect(url.searchParams.get("umbDebug")).toBe("true");
    expect(url.searchParams.get("range")).toBe("custom");
    expect(url.searchParams.getAll("filter")).toEqual(["Country:DK"]);
  });
});
