import { describe, expect, it } from "vitest";
import { browserIconPath } from "./browser-icon.js";

describe("browserIconPath", () => {
  it("uses local coloured marks for recognised browser values", () => {
    expect(browserIconPath("Chrome")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/chrome.svg");
    expect(browserIconPath("Microsoft Edge")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/edge.svg");
    expect(browserIconPath("Opera GX")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/opera-gx.svg");
    expect(browserIconPath("SberBrowser")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/sberbank.svg");
  });

  it("leaves unrecognised values for the generic browser fallback", () => {
    expect(browserIconPath("Mobile App")).toBeUndefined();
    expect(browserIconPath("(not set)")).toBeUndefined();
  });
});
