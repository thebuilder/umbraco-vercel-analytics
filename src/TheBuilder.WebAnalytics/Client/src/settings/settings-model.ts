import type {
  AnalyticsConnectionSettingsResponse,
  AnalyticsProviderDescriptor,
  AnalyticsSettingsResponse,
  UpdateAnalyticsSettingsRequest,
} from "../api/types.gen.js";
import { identifierField, identifierValue, providerDescriptor } from "./provider-identity.js";

export type ConnectionValidationErrors = Partial<Record<"provider" | "projectId" | "siteId" | "team" | "eventPropertyNames", string>>;

export function teamReference(connection: AnalyticsConnectionSettingsResponse): string {
  return connection.team?.trim() || "";
}

export function parseTeamReference(value: string): Pick<AnalyticsConnectionSettingsResponse, "team"> {
  return { team: value.trim() || null };
}

export function validateConnection(
  connection: AnalyticsConnectionSettingsResponse,
  descriptor: AnalyticsProviderDescriptor | undefined,
): ConnectionValidationErrors {
  const errors: ConnectionValidationErrors = {};
  if (!descriptor) return { provider: `Unsupported analytics provider: ${connection.provider}.` };
  const field = identifierField(descriptor);
  const identifier = identifierValue(connection, descriptor);
  if (!field || identifier === undefined) return { provider: `Unsupported identifier field for ${connection.provider}.` };
  if (connection.mockScenario == null && !identifier.trim()) errors[field] = `Enter ${descriptor.identifier.requiredMessage}.`;
  const eventProperties = descriptor.eventProperties;
  if (eventProperties && connection.eventPropertyNames.length > eventProperties.maximumNames)
    errors.eventPropertyNames = `Add no more than ${eventProperties.maximumNames} event properties.`;
  else if (eventProperties && connection.eventPropertyNames.some((name) => name.length > eventProperties.maximumNameLength))
    errors.eventPropertyNames = `Event property names must be ${eventProperties.maximumNameLength} characters or fewer.`;
  return errors;
}

export function validateEditableSettings(settings: AnalyticsSettingsResponse): string | undefined {
  for (const connection of settings.connections) {
    const errors = validateConnection(connection, providerDescriptor(settings, connection.provider));
    if (errors.provider) return errors.provider;
    if (errors.projectId) return `Complete the required fields for “${connection.displayName || connection.projectId || "New connection"}”.`;
    if (errors.siteId) return `Complete the required fields for “${connection.displayName || connection.siteId || "New connection"}”.`;
    if (errors.team) return `Fix the team ownership for “${connection.displayName || connection.projectId || "New connection"}”.`;
    if (errors.eventPropertyNames) return `Fix the event properties for “${connection.displayName || connection.siteId || "New connection"}”.`;
  }
  return undefined;
}

export function createSettingsUpdate(settings: AnalyticsSettingsResponse): UpdateAnalyticsSettingsRequest {
  return {
    enabled: settings.enabled,
    defaultRangeDays: settings.defaultRangeDays,
    cacheDuration: settings.cacheDuration,
    connections: settings.connections.map((connection) => ({
      key: connection.key,
      displayName: connection.displayName,
      provider: connection.provider,
      projectId: connection.projectId,
      team: connection.team,
      siteId: connection.siteId,
      eventPropertyNames: connection.eventPropertyNames,
      enableEvents: connection.enableEvents,
      enableFlags: connection.enableFlags,
      mockScenario: connection.mockScenario,
      documentRootKeys: connection.documentRootKeys,
      enableAllDocumentTypes: connection.enableAllDocumentTypes,
      enabledDocumentTypeKeys: connection.enableAllDocumentTypes ? [] : connection.enabledDocumentTypeKeys,
    })),
  };
}
