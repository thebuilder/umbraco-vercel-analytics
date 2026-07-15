export function reportErrorMessage(error: unknown): string {
  const status = typeof error === "object" && error !== null && "status" in error
    ? Number((error as { status?: number }).status)
    : undefined;

  switch (status) {
    case 400:
      return "This query or reporting dimension is not supported by Vercel.";
    case 401:
    case 403:
      return "Check that the Vercel access token can read Web Analytics for this project.";
    case 402:
      return "This report is outside the reporting window or is unavailable on the current Vercel plan.";
    default:
      return "Analytics could not be loaded. Try again, or check the connection configuration.";
  }
}
