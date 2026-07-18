import { UMB_DOCUMENT_WORKSPACE_CONTEXT as r } from "@umbraco-cms/backoffice/document";
import { UmbConditionBase as o } from "@umbraco-cms/backoffice/extension-registry";
import { U as n } from "./sdk.gen-Cl3izvwW.js";
class m extends o {
  #i = 0;
  constructor(t, e) {
    super(t, e), this.permitted = !1, this.consumeContext(r, (i) => {
      i && (this.observe(i.unique, (s) => {
        this.#t(s ?? void 0);
      }, "vercelAnalyticsConditionUnique"), this.observe(i.splitView.firstActiveVariantInfo, () => {
        this.#t(i.getUnique() ?? void 0);
      }, "vercelAnalyticsConditionCulture"));
    });
  }
  async #t(t) {
    const e = ++this.#i;
    if (!t) {
      this.permitted = !1;
      return;
    }
    const { data: i, error: s } = await n.documentRoutes({ path: { documentId: t } });
    e === this.#i && (this.permitted = !s && !!i?.length);
  }
}
export {
  m as DocumentAnalyticsCondition,
  m as api
};
//# sourceMappingURL=document-analytics.condition-Beg1wnwL.js.map
