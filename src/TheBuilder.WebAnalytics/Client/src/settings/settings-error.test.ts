import { describe, expect, it } from "vitest";
import { settingsActionError, settingsLoadError } from "./settings-error.js";

describe("settingsLoadError", () => {
  it.each([
    [401, "Sign in again", "session has expired"],
    [403, "Administrator access required", "Only administrators"],
    [404, "Package files are out of sync", "server and package files use the same version"],
    [429, "Too many requests", "Wait a moment"],
    [503, "Settings service unavailable", "Umbraco logs"],
  ])("describes HTTP %s with a useful recovery", (status, headline, message) => {
    expect(settingsLoadError({}, status)).toEqual(expect.objectContaining({ headline }));
    expect(settingsLoadError({}, status).message).toContain(message);
  });

  it("uses a network recovery message when no response exists", () => {
    expect(settingsLoadError(new TypeError("Failed to fetch"))).toEqual({
      headline: "Could not reach the settings service",
      message: "Check your connection and that Umbraco is running, then retry loading Web Analytics settings.",
    });
  });

  it("uses a status carried by an SDK error when no response is available", () => {
    expect(settingsLoadError({ status: 403 }).headline).toBe("Administrator access required");
  });
});

describe("settingsActionError", () => {
  it.each([
    ["save", 401, "session has expired"],
    ["save", 404, "server and package files use the same version"],
    ["save", 503, "Umbraco logs"],
    ["test", 401, "retry the connection test"],
    ["test", 404, "connection test API was not found"],
    ["test", 503, "Umbraco logs"],
  ] as const)("describes %s HTTP %s failures", (action, status, message) => {
    expect(settingsActionError(action, {}, status)).toContain(message);
  });

  it("preserves a server validation detail when saving", () => {
    expect(settingsActionError("save", { detail: "Cache duration must use hh:mm:ss." }, 400))
      .toBe("Cache duration must use hh:mm:ss.");
  });

  it("describes rejected requests as connection failures", () => {
    expect(settingsActionError("save", new TypeError("Failed to fetch"))).toContain("could not reach Umbraco");
    expect(settingsActionError("test", new TypeError("Failed to fetch"))).toContain("could not reach Umbraco");
  });
});
