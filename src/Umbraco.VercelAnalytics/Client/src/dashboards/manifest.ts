export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Umbraco Vercel Analytics Dashboard",
    alias: "Umbraco.VercelAnalytics.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element.js"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content",
      },
    ],
  },
];
