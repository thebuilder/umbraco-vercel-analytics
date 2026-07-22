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
import "./breakdown-dialog.element.js";

beforeEach(() => { HTMLDialogElement.prototype.showModal = vi.fn(); });
afterEach(() => { document.body.replaceChildren(); });

describe("breakdown dialog", () => {
  it("keeps every UTM parameter available while showing the selected report", async () => {
    const dialog = document.createElement("web-analytics-breakdown-dialog") as WebAnalyticsBreakdownDialogElement;
    dialog.headline = "UTM media";
    dialog.dimension = "UtmMedium";
    dialog.rows = [{ value: "email", visitors: 8, pageViews: 11 }];
    const onDimensionChange = vi.fn();
    dialog.addEventListener("breakdown-dimension-change", onDimensionChange);
    document.body.append(dialog);
    await dialog.updateComplete;

    expect(dialog.shadowRoot?.querySelector("dialog")?.getAttribute("aria-label")).toBe("UTM");
    expect(dialog.shadowRoot?.querySelector("uui-dialog-layout")?.getAttribute("headline")).toBe("UTM");
    const tabs = [...dialog.shadowRoot?.querySelectorAll<HTMLButtonElement>('.utm-tabs [role="tab"]') ?? []];
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(["Source", "Medium", "Campaign", "Term", "Content"]);
    expect(tabs[1]?.getAttribute("aria-selected")).toBe("true");
    expect(dialog.shadowRoot?.querySelector("uui-input")?.getAttribute("label")).toBe("Search UTM media");
    expect(dialog.shadowRoot?.querySelector<WebAnalyticsBreakdownTableElement>("web-analytics-breakdown-table")?.headline).toBe("UTM media");

    tabs[2]?.click();

    expect((onDimensionChange.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      dimension: "UtmCampaign",
      headline: "UTM campaigns",
    });
  });

  it("does not add UTM navigation to other breakdowns", async () => {
    const dialog = document.createElement("web-analytics-breakdown-dialog") as WebAnalyticsBreakdownDialogElement;
    dialog.headline = "Countries";
    dialog.dimension = "Country";
    document.body.append(dialog);
    await dialog.updateComplete;

    expect(dialog.shadowRoot?.querySelector("uui-dialog-layout")?.getAttribute("headline")).toBe("Countries");
    expect(dialog.shadowRoot?.querySelector(".utm-tabs")).toBeNull();
  });
});
