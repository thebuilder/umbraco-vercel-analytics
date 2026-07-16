import { describe, expect, it } from "vitest";
import { countryDisplayName, countryFlagUrl, normalizeCountryCode } from "./country-display.js";

describe("country display", () => {
  it("normalizes ISO country codes", () => {
    expect(normalizeCountryCode("dk")).toBe("DK");
    expect(normalizeCountryCode("Unknown")).toBeUndefined();
  });

  it("uses localized region names with a code fallback", () => {
    expect(countryDisplayName("DK", "en")).toBe("Denmark");
    expect(countryDisplayName("Unknown", "en")).toBe("Unknown");
  });

  it("builds flag URLs only for valid country codes", () => {
    expect(countryFlagUrl("dk")).toBe("https://flag.vercel.app/s/DK.svg");
    expect(countryFlagUrl("Unknown")).toBeUndefined();
  });
});
