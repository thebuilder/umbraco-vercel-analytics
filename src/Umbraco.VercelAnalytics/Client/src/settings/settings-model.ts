import type { AnalyticsSettingsResponse, UpdateAnalyticsSettingsRequest } from "../api/types.gen.js";

export function validateEditableSettings(settings: AnalyticsSettingsResponse): string | undefined {
  if (settings.enabled && settings.connections.length === 0) return "Add a connection before enabling analytics.";
  if (settings.enabled && !settings.defaultConnection) return "Choose a default connection before enabling analytics.";
  for (const connection of settings.connections) {
    if (!connection.alias.trim() || !connection.displayName.trim() || !connection.projectId.trim()) {
      return "Every connection requires an alias, display name, and Vercel project ID.";
    }
    if (connection.teamId?.trim() && connection.teamSlug?.trim()) {
      return `Connection “${connection.displayName}” cannot use both team ID and team slug.`;
    }
  }
  return undefined;
}

export function createSettingsUpdate(settings: AnalyticsSettingsResponse): UpdateAnalyticsSettingsRequest {
  return {
    enabled: settings.enabled,
    defaultConnection: settings.defaultConnection,
    defaultRangeDays: settings.defaultRangeDays,
    cacheDuration: settings.cacheDuration,
    connections: settings.connections.map((connection) => ({
      alias: connection.alias,
      displayName: connection.displayName,
      projectId: connection.projectId,
      teamId: connection.teamId,
      teamSlug: connection.teamSlug,
      hostnames: connection.hostnames,
      documentRootKeys: connection.documentRootKeys,
      enableAllDocumentTypes: connection.enableAllDocumentTypes,
      enabledDocumentTypeKeys: connection.enableAllDocumentTypes ? [] : connection.enabledDocumentTypeKeys,
    })),
  };
}
