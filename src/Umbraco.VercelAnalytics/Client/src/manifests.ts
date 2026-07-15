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
