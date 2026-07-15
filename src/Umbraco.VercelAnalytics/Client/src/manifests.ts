export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "section",
    alias: "Umbraco.VercelAnalytics.Section",
    name: "Vercel Analytics Section",
    meta: { label: "Analytics", pathname: "analytics" },
  },
  {
    type: "sectionView",
    alias: "Umbraco.VercelAnalytics.SectionView",
    name: "Vercel Analytics Section View",
    js: () => import("./section/analytics-section.element.js"),
    meta: { label: "Analytics", pathname: "overview", icon: "icon-chart-curve" },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "Umbraco.VercelAnalytics.Section" }],
  },
  {
    type: "dashboard",
    alias: "Umbraco.VercelAnalytics.SettingsDashboard",
    name: "Vercel Analytics Settings Dashboard",
    js: () => import("./settings/settings-dashboard.element.js"),
    weight: 25,
    meta: { label: "Vercel Analytics", pathname: "vercel-analytics" },
    conditions: [
      { alias: "Umb.Condition.SectionAlias", match: "Umb.Section.Settings" },
      { alias: "Umb.Condition.CurrentUser.IsAdmin" },
    ],
  },
  {
    type: "condition",
    alias: "Umbraco.VercelAnalytics.Condition.DocumentAnalytics",
    name: "Document Analytics Availability Condition",
    api: () => import("./workspace/document-analytics.condition.js"),
  },
  {
    type: "workspaceView",
    alias: "Umbraco.VercelAnalytics.DocumentWorkspaceView",
    name: "Vercel Analytics Document Workspace View",
    js: () => import("./workspace/analytics-workspace.element.js"),
    meta: { label: "Analytics", pathname: "analytics", icon: "icon-chart-curve" },
    conditions: [
      { alias: "Umb.Condition.WorkspaceAlias", match: "Umb.Workspace.Document" },
      { alias: "Umbraco.VercelAnalytics.Condition.DocumentAnalytics" },
    ],
  },
];
