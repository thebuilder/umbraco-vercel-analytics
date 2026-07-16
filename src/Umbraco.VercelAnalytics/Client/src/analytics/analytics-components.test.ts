// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sdk = vi.hoisted(() => ({
  connections: vi.fn(),
  documentRoutes: vi.fn(),
  summary: vi.fn(),
  events: vi.fn(),
  breakdown: vi.fn(),
  eventDetails: vi.fn(),
  eventPropertyValues: vi.fn(),
}));
vi.mock("../api/sdk.gen.js", () => ({ UmbracoVercelAnalyticsService: sdk }));
vi.mock("@umbraco-cms/backoffice/element-api", () => ({
  UmbElementMixin: <T extends CustomElementConstructor>(base: T) => base,
}));
vi.mock("@umbraco-cms/backoffice/style", () => ({ UmbTextStyles: [] }));

import { dateRangeForPreset } from "./date-range.js";
import { successState } from "./async-state.js";
import { dashboardCards } from "./dashboard-cards.js";
import type { VercelAnalyticsSummaryElement } from "./analytics-summary.element.js";
import type { VercelAnalyticsBreakdownGridElement } from "./analytics-breakdown-grid.element.js";
import type { VercelAnalyticsDashboardElement } from "./analytics-dashboard.element.js";
import "./analytics-summary.element.js";
import "./analytics-breakdown-grid.element.js";
import "./analytics-dashboard.element.js";

beforeEach(() => {
  sdk.connections.mockResolvedValue(apiOk({
    enabled: true,
    defaultConnection: "main",
    defaultRangeDays: 30,
    connections: [{ alias: "main", displayName: "Main", isDefault: true, isConfigured: true, baseUrl: "https://example.com", hostnames: ["example.com"], warnings: [] }],
  }));
  sdk.documentRoutes.mockResolvedValue(apiOk([]));
  sdk.summary.mockResolvedValue(apiOk({ totals: { visitors: 12, pageViews: 34 }, points: [] }));
  sdk.events.mockResolvedValue(apiOk({ rows: [] }));
  sdk.breakdown.mockResolvedValue(apiOk({ rows: [] }));
});

afterEach(() => {
  document.body.replaceChildren();
  localStorage.clear();
  window.history.replaceState({}, "", "/");
});

describe("analytics presentation components", () => {
  it("emits metric changes from the summary tabs", async () => {
    const element = document.createElement("vercel-analytics-summary") as VercelAnalyticsSummaryElement;
    element.range = dateRangeForPreset(30);
    element.metric = "visitors";
    element.report = successState({ totals: { visitors: 12, pageViews: 34 }, points: [] });
    const onChange = vi.fn();
    element.addEventListener("metric-change", onChange);
    document.body.append(element);
    await element.updateComplete;

    element.shadowRoot?.querySelector<HTMLButtonElement>("#metric-pageViews-tab")?.click();

    expect(onChange).toHaveBeenCalledOnce();
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ metric: "pageViews" });
  });

  it("emits audience changes from the breakdown tabs", async () => {
    const element = document.createElement("vercel-analytics-breakdown-grid") as VercelAnalyticsBreakdownGridElement;
    element.cards = dashboardCards(false, "unavailable").filter((card) => card.kind === "tabbed-breakdown" && card.id === "audience");
    element.audienceDimension = "DeviceType";
    element.breakdowns = {
      DeviceType: successState({ dimension: "DeviceType", rows: [] }),
      BrowserName: successState({ dimension: "BrowserName", rows: [] }),
    };
    element.events = successState({ rows: [] });
    const onChange = vi.fn();
    element.addEventListener("audience-change", onChange);
    document.body.append(element);
    await element.updateComplete;

    const browserTab = [...element.shadowRoot?.querySelectorAll<HTMLButtonElement>("[role=tab]") ?? []]
      .find((button) => button.textContent?.trim() === "Browsers");
    browserTab?.click();

    expect(onChange).toHaveBeenCalledOnce();
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ dimension: "BrowserName" });
  });

  it("wires a summary interaction through the mounted dashboard controller", async () => {
    const dashboard = document.createElement("vercel-analytics-dashboard") as VercelAnalyticsDashboardElement;
    document.body.append(dashboard);
    await vi.waitFor(() => {
      const summary = dashboard.shadowRoot?.querySelector<VercelAnalyticsSummaryElement>("vercel-analytics-summary");
      expect(summary?.report.status).toBe("success");
    });
    const summary = dashboard.shadowRoot?.querySelector<VercelAnalyticsSummaryElement>("vercel-analytics-summary");
    await summary?.updateComplete;

    summary?.shadowRoot?.querySelector<HTMLButtonElement>("#metric-pageViews-tab")?.click();
    await vi.waitFor(() => expect(new URL(window.location.href).searchParams.get("metric")).toBe("pageViews"));

    expect(summary?.metric).toBe("pageViews");
  });
});

function apiOk<T>(data: T) {
  return { data, error: undefined, request: new Request("https://example.com"), response: new Response(null, { status: 200 }) };
}
