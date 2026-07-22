// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@umbraco-cms/backoffice/element-api", () => ({
  UmbElementMixin: <T extends CustomElementConstructor>(base: T) => class extends base {
    readonly localize = {
      number: (value: string | number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat("en-US", options).format(Number(value)),
    };
  },
}));
vi.mock("@umbraco-cms/backoffice/style", () => ({ UmbTextStyles: [] }));

import type { WebAnalyticsBreakdownDialogElement } from "./breakdown-dialog.element.js";
import type { WebAnalyticsBreakdownTableElement } from "./breakdown-table.element.js";
import { UTM_OPTIONS } from "./dashboard-cards.js";
import "./breakdown-dialog.element.js";

beforeEach(() => { HTMLDialogElement.prototype.showModal = vi.fn(); });
afterEach(() => { document.body.replaceChildren(); });

describe("breakdown dialog", () => {
  it("keeps traffic-source and UTM tabs inside the expanded table", async () => {
    const dialog = document.createElement("web-analytics-breakdown-dialog") as WebAnalyticsBreakdownDialogElement;
    dialog.headline = "UTM media";
    dialog.dimension = "UtmMedium";
    dialog.context = {
      kind: "acquisition",
      title: "Traffic sources",
      referrer: { dimension: "ReferrerHostname", headline: "Referrers", label: "Referrers" },
      utmDimension: "UtmMedium",
      utmOptions: UTM_OPTIONS,
    };
    dialog.rows = [{ value: "email", visitors: 8, pageViews: 11 }];
    const onDimensionChange = vi.fn();
    dialog.addEventListener("breakdown-dimension-change", onDimensionChange);
    document.body.append(dialog);
    await dialog.updateComplete;

    expect(dialog.shadowRoot?.querySelector("dialog")?.getAttribute("aria-label")).toBe("Traffic sources");
    expect(dialog.shadowRoot?.querySelector("uui-dialog-layout")?.getAttribute("headline")).toBe("Traffic sources");
    const table = dialog.shadowRoot?.querySelector<WebAnalyticsBreakdownTableElement>("web-analytics-breakdown-table")!;
    await table.updateComplete;
    expect([...table.shadowRoot?.querySelectorAll<HTMLButtonElement>('.report-tabs.primary [role="tab"]') ?? []]
      .map((tab) => tab.textContent?.trim())).toEqual(["Referrers", "UTM"]);
    const tabs = [...table.shadowRoot?.querySelectorAll<HTMLButtonElement>('.report-tabs.secondary [role="tab"]') ?? []];
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(["Source", "Medium", "Campaign", "Term", "Content"]);
    expect(tabs[1]?.getAttribute("aria-selected")).toBe("true");
    expect(dialog.shadowRoot?.querySelector("uui-input")?.getAttribute("label")).toBe("Search UTM media");
    expect(table.rowLabel).toBe("Medium");

    tabs[2]?.click();

    expect((onDimensionChange.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      dimension: "UtmCampaign",
      headline: "UTM campaigns",
    });
  });

  it("uses a singular column label without adding tabs to a plain breakdown", async () => {
    const dialog = document.createElement("web-analytics-breakdown-dialog") as WebAnalyticsBreakdownDialogElement;
    dialog.headline = "Countries";
    dialog.dimension = "Country";
    document.body.append(dialog);
    await dialog.updateComplete;

    expect(dialog.shadowRoot?.querySelector("uui-dialog-layout")?.getAttribute("headline")).toBe("Countries");
    const table = dialog.shadowRoot?.querySelector<WebAnalyticsBreakdownTableElement>("web-analytics-breakdown-table")!;
    await table.updateComplete;
    expect(table.rowLabel).toBe("Country");
    expect(table.shadowRoot?.querySelector(".report-tabs")).toBeNull();
  });

  it("keeps audience tabs inside the table header", async () => {
    const dialog = document.createElement("web-analytics-breakdown-dialog") as WebAnalyticsBreakdownDialogElement;
    dialog.headline = "Devices";
    dialog.dimension = "DeviceType";
    dialog.context = {
      kind: "audience",
      title: "Audience",
      options: [
        { dimension: "DeviceType", headline: "Devices", label: "Devices" },
        { dimension: "BrowserName", headline: "Browsers", label: "Browsers" },
      ],
    };
    const onDimensionChange = vi.fn();
    dialog.addEventListener("breakdown-dimension-change", onDimensionChange);
    document.body.append(dialog);
    await dialog.updateComplete;
    const table = dialog.shadowRoot?.querySelector<WebAnalyticsBreakdownTableElement>("web-analytics-breakdown-table")!;
    await table.updateComplete;

    expect(dialog.shadowRoot?.querySelector("uui-dialog-layout")?.getAttribute("headline")).toBe("Audience");
    const tabs = [...table.shadowRoot?.querySelectorAll<HTMLButtonElement>('.report-tabs.primary [role="tab"]') ?? []];
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(["Devices", "Browsers"]);
    expect(tabs[0]?.getAttribute("aria-controls")).toBe("breakdown-report-panel");
    expect(table.shadowRoot?.querySelector("table")?.getAttribute("aria-labelledby")).toBe("expanded-audience-tab-0");
    tabs[0]?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await Promise.resolve();
    expect((onDimensionChange.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      dimension: "BrowserName",
      headline: "Browsers",
    });
    expect(table.shadowRoot?.activeElement).toBe(tabs[1]);
  });
});
