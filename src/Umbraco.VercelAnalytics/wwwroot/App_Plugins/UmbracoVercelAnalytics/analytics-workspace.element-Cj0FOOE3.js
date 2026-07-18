import { LitElement as p, html as c, state as n, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as d } from "@umbraco-cms/backoffice/element-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as _ } from "@umbraco-cms/backoffice/document";
import { UMB_APP_LANGUAGE_CONTEXT as v } from "@umbraco-cms/backoffice/language";
import { w as C } from "./analytics-dashboard.element-1BXnyzvC.js";
var f = Object.defineProperty, h = Object.getOwnPropertyDescriptor, s = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? h(t, i) : t, l = e.length - 1, o; l >= 0; l--)
    (o = e[l]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && f(t, i, r), r;
};
let u = class extends d(p) {
  constructor() {
    super(), this.consumeContext(_, (e) => {
      e && (this.observe(e.unique, (t) => this._documentId = t ?? void 0, "vercelAnalyticsDocumentUnique"), this.observe(e.splitView.firstActiveVariantInfo, (t) => this._variantCulture = t?.culture ?? void 0, "vercelAnalyticsCulture"));
    }), this.consumeContext(v, (e) => {
      e && this.observe(e.appLanguageCulture, (t) => this._appCulture = t ?? void 0, "vercelAnalyticsAppCulture");
    });
  }
  render() {
    const e = C(this._variantCulture, this._appCulture);
    return this._documentId ? c`<vercel-analytics-dashboard .documentId=${this._documentId} .culture=${e}></vercel-analytics-dashboard>` : c`<uui-loader-bar aria-label="Loading document analytics"></uui-loader-bar>`;
  }
};
s([
  n()
], u.prototype, "_documentId", 2);
s([
  n()
], u.prototype, "_variantCulture", 2);
s([
  n()
], u.prototype, "_appCulture", 2);
u = s([
  m("vercel-analytics-workspace")
], u);
const P = u;
export {
  u as VercelAnalyticsWorkspaceElement,
  P as default
};
//# sourceMappingURL=analytics-workspace.element-Cj0FOOE3.js.map
