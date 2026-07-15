import { LitElement, css, customElement, html, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { AnalyticsBreakdownRow } from "../api/types.gen.js";

@customElement("vercel-analytics-breakdown-table")
export class VercelAnalyticsBreakdownTableElement extends UmbElementMixin(LitElement) {
  @property() headline = "Breakdown";
  @property() unavailable?: string;
  @property({ attribute: false }) rows: AnalyticsBreakdownRow[] = [];

  render() {
    if (this.unavailable) return html`<p class="message">${this.unavailable}</p>`;
    if (this.rows.length === 0) return html`<p class="message">No traffic was recorded for this breakdown.</p>`;
    const maximum = Math.max(...this.rows.map((row) => row.visitors), 1);

    return html`
      <table>
        <caption>${this.headline}</caption>
        <thead><tr><th scope="col">Value</th><th scope="col">Visitors</th><th scope="col">Page views</th></tr></thead>
        <tbody>${this.rows.map((row) => html`
          <tr>
            <th scope="row">
              <span class="bar" style=${`--bar-width:${(row.visitors / maximum) * 100}%`}></span>
              <span>${row.value || "Unknown"}</span>
            </th>
            <td>${row.visitors.toLocaleString()}</td>
            <td>${row.pageViews.toLocaleString()}</td>
          </tr>
        `)}</tbody>
      </table>
    `;
  }

  static styles = css`
    :host { display: block; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; }
    caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    th, td { border-bottom: 1px solid var(--uui-color-border); padding: var(--uui-size-space-3); text-align: left; }
    td { text-align: right; font-variant-numeric: tabular-nums; }
    tbody th { position: relative; font-weight: 500; min-width: 10rem; }
    tbody th span:last-child { position: relative; }
    .bar { position: absolute; inset: var(--uui-size-space-1) auto var(--uui-size-space-1) 0; width: var(--bar-width); background: var(--uui-color-surface-alt); border-radius: var(--uui-border-radius); }
    .message { color: var(--uui-color-text-alt); }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "vercel-analytics-breakdown-table": VercelAnalyticsBreakdownTableElement;
  }
}
