import { LitElement, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import "../analytics/analytics-dashboard.element.js";

@customElement("web-analytics-section")
export class WebAnalyticsSectionElement extends UmbElementMixin(LitElement) {
  render() {
    return html`<web-analytics-dashboard></web-analytics-dashboard>`;
  }
}

export default WebAnalyticsSectionElement;

declare global {
  interface HTMLElementTagNameMap {
    "web-analytics-section": WebAnalyticsSectionElement;
  }
}
