import { UMB_AUTH_CONTEXT as s } from "@umbraco-cms/backoffice/auth";
import { c as t } from "./client.gen-BozzLzt5.js";
const c = (o, e) => {
  o.consumeContext(s, async (i) => {
    const n = i?.getOpenApiConfiguration();
    t.setConfig({
      auth: n?.token ?? void 0,
      baseUrl: n?.base ?? "",
      credentials: n?.credentials ?? "same-origin"
    });
  });
}, g = (o, e) => {
  t.setConfig({ auth: void 0 });
};
export {
  c as onInit,
  g as onUnload
};
//# sourceMappingURL=entrypoint-CL49-Ze_.js.map
