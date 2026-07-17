export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Umbraco Vercel Analytics Entrypoint",
    alias: "Umbraco.VercelAnalytics.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
