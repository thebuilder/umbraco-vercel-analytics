import { describe, expect, it } from "vitest";
import { breakdownValueIconPath } from "./breakdown-value-icon.js";

describe("breakdownValueIconPath", () => {
  it("uses local coloured marks for recognised browser values", () => {
    expect(breakdownValueIconPath("BrowserName", "Chrome")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/chrome.svg");
    expect(breakdownValueIconPath("BrowserName", "Microsoft Edge")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/edge.svg");
    expect(breakdownValueIconPath("BrowserName", "Opera GX")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/opera-gx.svg");
    expect(breakdownValueIconPath("BrowserName", "SberBrowser")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/sberbank.svg");
  });

  it("uses local platform marks for recognised operating systems", () => {
    expect(breakdownValueIconPath("OsName", "Mac OS X")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/operating-systems/apple.svg");
    expect(breakdownValueIconPath("OsName", "Windows")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/operating-systems/windows.svg");
    expect(breakdownValueIconPath("OsName", "GNU/Linux")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/operating-systems/linux.svg");
    expect(breakdownValueIconPath("OsName", "Chrome OS")).toBe("/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/chrome.svg");
  });

  it("leaves unrecognised values for the generic fallback", () => {
    expect(breakdownValueIconPath("BrowserName", "Mobile App")).toBeUndefined();
    expect(breakdownValueIconPath("OsName", "(not set)")).toBeUndefined();
  });
});
