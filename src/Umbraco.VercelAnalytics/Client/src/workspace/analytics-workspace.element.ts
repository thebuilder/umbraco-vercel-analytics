import { LitElement, customElement, html, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import "../analytics/analytics-dashboard.element.js";

@customElement("vercel-analytics-workspace")
export class VercelAnalyticsWorkspaceElement extends UmbElementMixin(LitElement) {
  @state() private _documentId?: string;
  @state() private _culture?: string;

  constructor() {
    super();
    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      this.observe(context.unique, (unique) => (this._documentId = unique ?? undefined), "vercelAnalyticsDocumentUnique");
      this.observe(context.splitView.firstActiveVariantInfo, (variant) => (this._culture = variant?.culture ?? undefined), "vercelAnalyticsCulture");
    });
  }

  render() {
    return this._documentId
      ? html`<vercel-analytics-dashboard .documentId=${this._documentId} .culture=${this._culture}></vercel-analytics-dashboard>`
      : html`<uui-loader-bar aria-label="Loading document analytics"></uui-loader-bar>`;
  }
}

export default VercelAnalyticsWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    "vercel-analytics-workspace": VercelAnalyticsWorkspaceElement;
  }
}
