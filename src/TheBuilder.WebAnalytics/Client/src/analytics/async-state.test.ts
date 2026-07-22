import { describe, expect, it } from "vitest";
import { isInitialLoading, loadingState, successState } from "./async-state.js";

describe("async state", () => {
  it("distinguishes the initial load from a refresh with previous data", () => {
    expect(isInitialLoading(undefined)).toBe(true);
    expect(isInitialLoading(loadingState())).toBe(true);
    expect(isInitialLoading(loadingState(successState({ rows: ["previous"] })))).toBe(false);
  });
});
