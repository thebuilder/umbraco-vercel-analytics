const a = [
  {
    name: "Umbraco Vercel Analytics Entrypoint",
    alias: "Umbraco.VercelAnalytics.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-CL49-Ze_.js")
  }
], i = [
  {
    type: "condition",
    alias: "Umbraco.VercelAnalytics.Condition.AnalyticsEnabled",
    name: "Vercel Analytics Enabled Condition",
    api: () => import("./analytics-enabled.condition-CaiAnWUH.js")
  },
  {
    type: "section",
    alias: "Umbraco.VercelAnalytics.Section",
    name: "Vercel Analytics Section",
    meta: { label: "Analytics", pathname: "analytics" },
    conditions: [{ alias: "Umbraco.VercelAnalytics.Condition.AnalyticsEnabled" }]
  },
  {
    type: "sectionView",
    alias: "Umbraco.VercelAnalytics.SectionView",
    name: "Vercel Analytics Section View",
    js: () => import("./analytics-section.element-KRK7Uz2g.js"),
    meta: { label: "Analytics", pathname: "overview", icon: "icon-chart-curve" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "Umbraco.VercelAnalytics.Section" }]
  },
  {
    type: "dashboard",
    alias: "Umbraco.VercelAnalytics.SettingsDashboard",
    name: "Vercel Analytics Settings Dashboard",
    js: () => import("./settings-dashboard.element-B7yu7vO2.js"),
    weight: 25,
    meta: { label: "Vercel Analytics", pathname: "vercel-analytics" },
    conditions: [
      { alias: "Umb.Condition.SectionAlias", match: "Umb.Section.Settings" },
      { alias: "Umb.Condition.CurrentUser.IsAdmin" }
    ]
  },
  {
    type: "condition",
    alias: "Umbraco.VercelAnalytics.Condition.DocumentAnalytics",
    name: "Document Analytics Availability Condition",
    api: () => import("./document-analytics.condition-Beg1wnwL.js")
  },
  {
    type: "workspaceView",
    alias: "Umbraco.VercelAnalytics.DocumentWorkspaceView",
    name: "Vercel Analytics Document Workspace View",
    js: () => import("./analytics-workspace.element-Cj0FOOE3.js"),
    meta: { label: "Analytics", pathname: "analytics", icon: "icon-chart-curve" },
    conditions: [
      { alias: "Umb.Condition.WorkspaceAlias", match: "Umb.Workspace.Document" },
      { alias: "Umbraco.VercelAnalytics.Condition.DocumentAnalytics" }
    ]
  }
], n = [
  ...a,
  ...i
];
export {
  n as manifests
};
//# sourceMappingURL=umbraco-vercel-analytics.js.map
