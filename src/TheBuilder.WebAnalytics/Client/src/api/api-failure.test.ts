import { describe, expect, it } from "vitest";
import { apiFailure } from "./api-failure.js";

describe("apiFailure", () => {
  it("normalizes supported problem fields", () => {
    expect(apiFailure({ code: "invalid_query", detail: "Unsupported dimension", status: "400" })).toEqual({
      code: "invalid_query",
      detail: "Unsupported dimension",
      status: 400,
    });
  });

  it("prefers the HTTP response status", () => {
    expect(apiFailure({ status: 400 }, 404).status).toBe(404);
  });

  it("ignores malformed problem fields", () => {
    expect(apiFailure({ code: 42, detail: "", status: "unknown" })).toEqual({
      code: undefined,
      detail: undefined,
      status: undefined,
    });
  });
});
