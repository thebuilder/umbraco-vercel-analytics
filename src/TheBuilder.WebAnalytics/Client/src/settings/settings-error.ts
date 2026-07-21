import { apiFailure } from "../api/api-failure.js";

export interface SettingsError {
  headline: string;
  message: string;
}

export type SettingsOperation = "load" | "save" | "test";

export function settingsError(operation: SettingsOperation, error: unknown, responseStatus?: number): SettingsError {
  const failure = apiFailure(error, responseStatus);
  const retryAction = operation === "load" ? "retry loading Web Analytics settings" : operation === "save" ? "save your preserved changes" : "retry the connection test";
  const subject = operation === "test" ? "The connection test" : "Web Analytics settings";

  switch (failure.status) {
    case 400:
      return operation === "save"
        ? { headline: "Review the settings", message: failure.detail ?? "Settings were not saved. Review the connection fields and mapping values." }
        : operation === "test"
          ? { headline: "Invalid connection test", message: "The connection test request was invalid. Check the saved connection configuration." }
          : unavailable("Settings request rejected", "Umbraco rejected the settings request. Refresh the backoffice, then retry.");
    case 401:
      return unavailable("Sign in again", `Your backoffice session has expired. Sign in again, then ${retryAction}.`);
    case 403:
      return unavailable("Administrator access required", operation === "load"
        ? "Only administrators can manage Web Analytics settings. Ask an administrator to open this page."
        : `Administrator access is required to ${operation === "save" ? "save Web Analytics settings" : "test analytics connections"}.`);
    case 404:
      return unavailable("Package files are out of sync", `${operation === "load" ? "The settings" : subject} API was not found. Restart Umbraco after updating Web Analytics, then refresh the backoffice so the server and package files use the same version.`);
    case 429:
      return unavailable("Too many requests", `${subject} ${operation === "load" ? "cannot be loaded" : "could not be completed"} right now. Wait a moment, then retry.`);
    default:
      if (failure.status !== undefined && failure.status >= 500) {
        return unavailable("Settings service unavailable", `${subject} could not be ${operation === "load" ? "loaded" : "completed"}. Retry, and check the Umbraco logs if the problem continues.`);
      }
      return operation === "load"
        ? unavailable("Could not reach the settings service", "Check your connection and that Umbraco is running, then retry loading Web Analytics settings.")
        : unavailable("Could not reach the settings service", `${subject} could not reach Umbraco. Check your connection and that Umbraco is running, then retry.`);
  }
}

function unavailable(headline: string, message: string): SettingsError {
  return { headline, message };
}
