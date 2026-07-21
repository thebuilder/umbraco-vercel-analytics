import { html } from "@umbraco-cms/backoffice/external/lit";
import type {
  AnalyticsConnectionSettingsResponse,
  AnalyticsProvider,
  AnalyticsProviderDescriptor,
  AnalyticsSettingsResponse,
} from "../api/types.gen.js";

export type ConnectionIdentifierField = "projectId" | "siteId";

export function providerDescriptor(
  settings: Pick<AnalyticsSettingsResponse, "providers">,
  provider: AnalyticsProvider,
): AnalyticsProviderDescriptor | undefined {
  const descriptor = settings.providers.find((item) => item.provider === provider);
  return descriptor && isSupportedProviderDescriptor(descriptor) ? descriptor : undefined;
}

export function identifierValue(
  connection: AnalyticsConnectionSettingsResponse,
  descriptor: AnalyticsProviderDescriptor,
): string | undefined {
  return descriptor.identifier.key === "projectId"
    ? connection.projectId
    : descriptor.identifier.key === "siteId"
      ? connection.siteId
      : undefined;
}

export function identifierField(descriptor: AnalyticsProviderDescriptor): ConnectionIdentifierField | undefined {
  return descriptor.identifier.key === "projectId" || descriptor.identifier.key === "siteId"
    ? descriptor.identifier.key
    : undefined;
}

export function providerLogo(descriptor: Pick<AnalyticsProviderDescriptor, "logoSlug">) {
  return html`<img
    class=${`provider-logo ${descriptor.logoSlug}`}
    src=${`/App_Plugins/TheBuilder.WebAnalytics/icons/providers/${descriptor.logoSlug}.svg`}
    alt=""
    width="24"
    height="24"
    aria-hidden="true"
    decoding="async"
  />`;
}

function isSupportedProviderDescriptor(descriptor: AnalyticsProviderDescriptor): boolean {
  return /^[a-z0-9-]+$/.test(descriptor.logoSlug)
    && (descriptor.identifier.key === "projectId" || descriptor.identifier.key === "siteId");
}
