import { describe, expect, it } from "vitest";
import { manifests } from "./manifests.js";

describe("Vercel Analytics manifests", () => {
  it("only exposes the Analytics section when the package is enabled", () => {
    const section = manifests.find((manifest) => manifest.alias === "Umbraco.VercelAnalytics.Section") as
      | { conditions?: Array<{ alias: string }> }
      | undefined;
    const condition = manifests.find((manifest) => manifest.alias === "Umbraco.VercelAnalytics.Condition.AnalyticsEnabled");

    expect(condition?.type).toBe("condition");
    expect(section?.conditions).toContainEqual({ alias: "Umbraco.VercelAnalytics.Condition.AnalyticsEnabled" });
  });
});
