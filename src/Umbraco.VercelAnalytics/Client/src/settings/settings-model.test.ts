import { describe, expect, it } from "vitest";
import type { AnalyticsSettingsResponse } from "../api/types.gen.js";
import { createSettingsUpdate, validateEditableSettings } from "./settings-model.js";

const settings = (): AnalyticsSettingsResponse => ({
  enabled: true,
  defaultConnection: "main",
  defaultRangeDays: 30,
  cacheDuration: "00:05:00",
  connections: [{
    alias: "main",
    displayName: "Main",
    projectId: "project",
    teamId: null,
    teamSlug: null,
    hostnames: [],
    documentRootKeys: [],
    enableAllDocumentTypes: false,
    enabledDocumentTypeKeys: [],
    hasAccessToken: false,
  }],
});

describe("analytics settings model", () => {
  it("allows global-only connections without mappings", () => {
    expect(validateEditableSettings(settings())).toBeUndefined();
  });

  it("rejects simultaneous team id and slug", () => {
    const model = settings();
    model.connections[0].teamId = "team-id";
    model.connections[0].teamSlug = "team-slug";
    expect(validateEditableSettings(model)).toContain("both team ID and team slug");
  });

  it("clears explicit selections when all document types is enabled", () => {
    const model = settings();
    model.connections[0].enableAllDocumentTypes = true;
    model.connections[0].enabledDocumentTypeKeys = ["11111111-1111-1111-1111-111111111111"];
    expect(createSettingsUpdate(model).connections[0].enabledDocumentTypeKeys).toEqual([]);
  });
});
