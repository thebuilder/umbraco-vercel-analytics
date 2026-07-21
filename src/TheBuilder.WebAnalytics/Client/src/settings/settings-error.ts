export interface SettingsLoadError {
  headline: string;
  message: string;
}

export type SettingsAction = "save" | "test";

export function settingsLoadError(error: unknown, responseStatus?: number): SettingsLoadError {
  const status = requestStatus(error, responseStatus);

  switch (status) {
    case 401:
      return {
        headline: "Sign in again",
        message: "Your backoffice session has expired. Sign in again, then retry loading Web Analytics settings.",
      };
    case 403:
      return {
        headline: "Administrator access required",
        message: "Only administrators can manage Web Analytics settings. Ask an administrator to open this page.",
      };
    case 404:
      return {
        headline: "Package files are out of sync",
        message: "The settings API was not found. Restart Umbraco after updating Web Analytics, then refresh the backoffice so the server and package files use the same version.",
      };
    case 429:
      return {
        headline: "Too many requests",
        message: "Web Analytics settings cannot be loaded right now. Wait a moment, then retry.",
      };
    default:
      if (status !== undefined && status >= 500) {
        return {
          headline: "Settings service unavailable",
          message: "Umbraco could not load Web Analytics settings. Retry, and check the Umbraco logs if the problem continues.",
        };
      }
      return {
        headline: "Could not reach the settings service",
        message: "Check your connection and that Umbraco is running, then retry loading Web Analytics settings.",
      };
  }
}

export function settingsActionError(action: SettingsAction, error: unknown, responseStatus?: number): string {
  const status = requestStatus(error, responseStatus);
  const subject = action === "save" ? "Web Analytics settings" : "The connection test";

  switch (status) {
    case 400:
      return action === "save"
        ? problemDetail(error) ?? "Settings were not saved. Review the connection fields and mapping values."
        : "The connection test request was invalid. Check the saved connection configuration.";
    case 401:
      return `Your backoffice session has expired. Sign in again, then ${action === "save" ? "save your preserved changes" : "retry the connection test"}.`;
    case 403:
      return `Administrator access is required to ${action === "save" ? "save Web Analytics settings" : "test analytics connections"}.`;
    case 404:
      return `${subject} API was not found. Restart Umbraco after updating Web Analytics, then refresh the backoffice so the server and package files use the same version.`;
    case 429:
      return `${subject} could not be completed because there were too many requests. Wait a moment, then retry.`;
    default:
      if (status !== undefined && status >= 500) {
        return `${subject} could not be completed. Retry, and check the Umbraco logs if the problem continues.`;
      }
      return `${subject} could not reach Umbraco. Check your connection and that Umbraco is running, then retry.`;
  }
}

function requestStatus(error: unknown, responseStatus?: number): number | undefined {
  const errorStatus = typeof error === "object" && error !== null && "status" in error
    ? Number(error.status)
    : undefined;
  return responseStatus || errorStatus;
}

function problemDetail(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("detail" in error)) return undefined;
  return typeof error.detail === "string" && error.detail.trim() ? error.detail : undefined;
}
