import { describe, expect, it } from "vitest";
import { dashboardCards, requestedDimensions, selectedCardDimension } from "./dashboard-cards.js";

describe("dashboardCards", () => {
  it("models pages globally and omits them for a document", () => {
    expect(requestedDimensions(dashboardCards(false, "available"))).toContain("RequestPath");
    expect(requestedDimensions(dashboardCards(true, "available"))).not.toContain("RequestPath");
  });

  it("models audience and UTM dimensions as tabbed cards without eagerly loading hidden UTM tabs", () => {
    const cards = dashboardCards(false, "available");
    expect(cards.find((card) => card.kind === "tabbed-breakdown" && card.id === "audience")).toBeDefined();
    expect(cards.find((card) => card.kind === "tabbed-breakdown" && card.id === "utm")).toBeDefined();
    expect(requestedDimensions(cards)).toEqual(expect.arrayContaining(["DeviceType", "BrowserName"]));
    expect(requestedDimensions(cards)).not.toEqual(expect.arrayContaining([
      "UtmSource", "UtmMedium", "UtmCampaign", "UtmTerm", "UtmContent",
    ]));
    expect(requestedDimensions(cards, "UtmCampaign")).toEqual(expect.arrayContaining(["UtmCampaign"]));
    expect(requestedDimensions(cards, "UtmCampaign")).not.toEqual(expect.arrayContaining([
      "UtmSource", "UtmMedium", "UtmTerm", "UtmContent",
    ]));
  });

  it("shows the UTM card only after capability is known to be available", () => {
    for (const capability of ["unknown", "unavailable"] as const) {
      expect(dashboardCards(false, capability).some((card) => card.kind === "tabbed-breakdown" && card.id === "utm")).toBe(false);
    }
  });

  it("selects the active option from a tabbed card", () => {
    const audience = dashboardCards(false, "available").find((card) => card.kind === "tabbed-breakdown" && card.id === "audience");
    expect(audience && selectedCardDimension(audience, "BrowserName", "UtmSource").dimension).toBe("BrowserName");
  });
});
