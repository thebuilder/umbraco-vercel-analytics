export interface SettingsLoadError {
  headline: string;
  message: string;
}

export function settingsLoadError(error: unknown, responseStatus?: number): SettingsLoadError {
  const errorStatus = typeof error === "object" && error !== null && "status" in error
    ? Number(error.status)
    : undefined;
  const status = responseStatus || errorStatus;

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
