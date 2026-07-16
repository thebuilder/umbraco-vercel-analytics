import type { AnalyticsDocumentRoute } from "../api/types.gen.js";

export function activeDocumentRoute(
  routes: AnalyticsDocumentRoute[],
  culture?: string,
): AnalyticsDocumentRoute | undefined {
  if (culture) {
    return routes.find((route) => route.culture.toLocaleLowerCase() === culture.toLocaleLowerCase());
  }

  return routes.find((route) => route.isCurrent) ?? routes[0];
}
