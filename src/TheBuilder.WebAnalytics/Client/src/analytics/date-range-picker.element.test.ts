// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@umbraco-cms/backoffice/element-api", () => ({
  UmbElementMixin: <T extends CustomElementConstructor>(base: T) => base,
}));
vi.mock("@umbraco-cms/backoffice/style", () => ({ UmbTextStyles: [] }));

import { dateRangeForPreset, normalizeCustomRange } from "./date-range.js";
import type { WebAnalyticsDateRangePickerElement } from "./date-range-picker.element.js";
import "./date-range-picker.element.js";

afterEach(() => {
  document.body.replaceChildren();
});

describe("analytics date range picker", () => {
  it("hydrates a preset end as today and a custom end as its selected inclusive date", async () => {
    const preset = document.createElement("web-analytics-date-range-picker") as WebAnalyticsDateRangePickerElement;
    preset.range = dateRangeForPreset(30, new Date("2026-07-16T12:00:00Z"), "UTC");
    preset.preset = 30;
    document.body.append(preset);
    await openPicker(preset);

    expect(dateInputValues(preset)).toEqual(["2026-06-16", "2026-07-16"]);

    const custom = document.createElement("web-analytics-date-range-picker") as WebAnalyticsDateRangePickerElement;
    custom.range = normalizeCustomRange("2026-07-09", "2026-07-16", "UTC")!;
    custom.preset = "custom";
    document.body.append(custom);
    await openPicker(custom);

    expect(dateInputValues(custom)).toEqual(["2026-07-09", "2026-07-16"]);
  });
});

async function openPicker(element: WebAnalyticsDateRangePickerElement): Promise<void> {
  await element.updateComplete;
  const details = element.shadowRoot?.querySelector("details");
  details!.open = true;
  details!.dispatchEvent(new Event("toggle"));
  await element.updateComplete;
}

function dateInputValues(element: WebAnalyticsDateRangePickerElement): string[] {
  return [...element.shadowRoot?.querySelectorAll<HTMLElement>(".date-inputs uui-input") ?? []]
    .map((input) => (input as HTMLElement & { value: string }).value);
}
