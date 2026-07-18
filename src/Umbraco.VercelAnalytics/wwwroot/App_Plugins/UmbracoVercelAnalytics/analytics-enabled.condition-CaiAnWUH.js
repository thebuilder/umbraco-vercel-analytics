import { UmbConditionBase as o } from "@umbraco-cms/backoffice/extension-registry";
import { U as a } from "./sdk.gen-Cl3izvwW.js";
import { A as i } from "./analytics-availability-CxXDwRo0.js";
class c extends o {
  #e = 0;
  constructor(t, e) {
    super(t, e), this.permitted = !1, window.addEventListener(i, this.#t), this.#i();
  }
  #t = (t) => {
    const e = t.detail;
    typeof e?.enabled == "boolean" && (this.permitted = e.enabled);
  };
  async #i() {
    const t = ++this.#e, { data: e, error: s } = await a.connections();
    t === this.#e && (this.permitted = !s && e?.enabled === !0);
  }
  destroy() {
    this.#e++, window.removeEventListener(i, this.#t), super.destroy();
  }
}
export {
  c as AnalyticsEnabledCondition,
  c as api
};
//# sourceMappingURL=analytics-enabled.condition-CaiAnWUH.js.map
