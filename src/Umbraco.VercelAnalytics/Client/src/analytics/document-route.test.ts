import { describe, expect, it } from "vitest";
import type { AnalyticsDocumentRoute } from "../api/types.gen.js";
import { activeDocumentRoute } from "./document-route.js";

const route = (culture: string, isCurrent = false): AnalyticsDocumentRoute => ({
  connection: "main",
  culture,
  hostname: "www.example.com",
  path: `/${culture}`,
  url: `https://www.example.com/${culture}`,
  isCurrent,
  warnings: [],
});

describe("active document route", () => {
  it("uses the active workspace culture", () => {
    const routes = [route("en-US", true), route("da-DK")];

    expect(activeDocumentRoute(routes, "DA-dk")?.culture).toBe("da-DK");
    expect(activeDocumentRoute(routes, "de-DE")).toBeUndefined();
  });

  it("falls back to the API current route and then the first published route", () => {
    const routes = [route("en-US"), route("da-DK", true)];

    expect(activeDocumentRoute(routes)?.culture).toBe("da-DK");
    expect(activeDocumentRoute([route("en-US")])?.culture).toBe("en-US");
    expect(activeDocumentRoute([])).toBeUndefined();
  });
});
