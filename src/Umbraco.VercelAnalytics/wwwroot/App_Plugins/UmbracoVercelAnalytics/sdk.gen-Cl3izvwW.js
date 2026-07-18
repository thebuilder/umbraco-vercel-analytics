import { c as t } from "./client.gen-BozzLzt5.js";
class c {
  static connections(e) {
    return (e?.client ?? t).get({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/connections",
      ...e
    });
  }
  static documentRoutes(e) {
    return (e.client ?? t).get({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/documents/{documentId}/routes",
      ...e
    });
  }
  static breakdown(e) {
    return (e.client ?? t).get({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/reports/breakdown/{dimension}",
      ...e
    });
  }
  static events(e) {
    return (e?.client ?? t).get({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/reports/events",
      ...e
    });
  }
  static flags(e) {
    return (e?.client ?? t).get({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/reports/flags",
      ...e
    });
  }
  static eventDetails(e) {
    return (e?.client ?? t).get({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/reports/events/details",
      ...e
    });
  }
  static eventPropertyValues(e) {
    return (e?.client ?? t).get({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/reports/events/property-values",
      ...e
    });
  }
  static summary(e) {
    return (e?.client ?? t).get({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/reports/summary",
      ...e
    });
  }
  static settings(e) {
    return (e?.client ?? t).get({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/settings",
      ...e
    });
  }
  static saveSettings(e) {
    return (e?.client ?? t).put({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/settings",
      ...e,
      headers: {
        "Content-Type": "application/json",
        ...e?.headers
      }
    });
  }
  static testConnection(e) {
    return (e.client ?? t).post({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/vercel-analytics/settings/connections/{key}/test",
      ...e
    });
  }
}
export {
  c as U
};
//# sourceMappingURL=sdk.gen-Cl3izvwW.js.map
