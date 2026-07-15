import { describe, expect, it } from "vitest";
import { reportErrorMessage } from "./report-error.js";

describe("report error guidance", () => {
  it("explains authentication failures without exposing server details", () => {
    expect(reportErrorMessage({ status: 403 })).toContain("access token");
  });

  it("explains plan and reporting-window failures", () => {
    expect(reportErrorMessage({ status: 402 })).toContain("reporting window");
  });

  it("uses safe generic guidance for unknown errors", () => {
    expect(reportErrorMessage(new Error("secret upstream message"))).not.toContain("secret");
  });
});
