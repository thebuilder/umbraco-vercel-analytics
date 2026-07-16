import { LitElement, css, customElement, html, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { AnalyticsBreakdownRow, AnalyticsDimension } from "../api/types.gen.js";
import { analyticsRowHref, withoutAggregatedOthers } from "./breakdown-rows.js";
import { countryDisplayName, countryFlagUrl, normalizeCountryCode } from "./country-display.js";

@customElement("vercel-analytics-breakdown-table")
export class VercelAnalyticsBreakdownTableElement extends UmbElementMixin(LitElement) {
  @property() headline = "Breakdown";
  @property() unavailable?: string;
  @property() baseUrl?: string;
  @property() dimension?: AnalyticsDimension;
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) linkValues = false;
  @property({ type: Number }) skeletonRows = 10;
  @property({ attribute: false }) rows: AnalyticsBreakdownRow[] = [];

  render() {
    if (this.loading) {
      return html`
        <span class="visually-hidden" role="status">Loading ${this.headline}</span>
        <table class="skeleton-table" aria-hidden="true">
          <caption>${this.headline}</caption>
          <thead><tr><th scope="col">Value</th><th scope="col">Visitors</th><th scope="col">Page views</th></tr></thead>
          <tbody>${Array.from({ length: this.skeletonRows }, () => html`
            <tr>
              <th scope="row"><span class="skeleton-line"></span></th>
              <td><span class="skeleton-number"></span></td>
              <td><span class="skeleton-number"></span></td>
            </tr>
          `)}</tbody>
        </table>
      `;
    }
    if (this.unavailable) return html`<p class="message">${this.unavailable}</p>`;
    const rows = withoutAggregatedOthers(this.rows);
    if (rows.length === 0) return html`<p class="message">No traffic was recorded for this breakdown.</p>`;
    const maximum = Math.max(...rows.map((row) => row.visitors), 1);

    return html`
      <table>
        <caption>${this.headline}</caption>
        <thead><tr><th scope="col">Value</th><th scope="col">Visitors</th><th scope="col">Page views</th></tr></thead>
        <tbody>${rows.map((row) => {
          const href = this.linkValues ? analyticsRowHref(this.baseUrl, row.value) : undefined;
          const countryCode = this.dimension === "Country" ? normalizeCountryCode(row.value) : undefined;
          const displayValue = countryCode ? countryDisplayName(countryCode, navigator.languages) : row.value || "Unknown";
          return html`
          <tr>
            <th scope="row">
              <span class="bar" style=${`--bar-width:${(row.visitors / maximum) * 100}%`}></span>
              <span class="row-value">
                ${countryCode ? html`<img class="country-flag" src=${countryFlagUrl(countryCode)} alt="" width="20" height="15" loading="lazy" referrerpolicy="no-referrer" @error=${(event: Event) => ((event.currentTarget as HTMLImageElement).style.visibility = "hidden")}>` : ""}
                <span class="row-label" title=${displayValue}>${href
                  ? html`<a href=${href} target="_blank" rel="noopener noreferrer">${displayValue}<span class="visually-hidden"> (opens in a new tab)</span></a>`
                  : displayValue}</span>
              </span>
            </th>
            <td>${row.visitors.toLocaleString()}</td>
            <td>${row.pageViews.toLocaleString()}</td>
          </tr>
        `;})}</tbody>
      </table>
    `;
  }

  static styles = css`
    :host { display: block; overflow-x: auto; }
    table { border-collapse: collapse; min-inline-size: 30rem; table-layout: fixed; width: 100%; }
    caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    thead th:nth-child(2), thead th:nth-child(3) { text-align: right; width: 7rem; }
    th, td { border-bottom: 1px solid var(--uui-color-border); padding: var(--uui-size-space-3); text-align: left; }
    td { text-align: right; font-variant-numeric: tabular-nums; }
    tbody th { position: relative; font-weight: 500; min-width: 10rem; }
    .row-value { align-items: center; display: flex; gap: var(--uui-size-space-3); min-inline-size: 0; position: relative; }
    .row-label { min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .country-flag { border-radius: 2px; flex: 0 0 auto; object-fit: cover; }
    a { color: var(--uui-color-interactive-emphasis); text-decoration-thickness: 1px; text-underline-offset: 0.18em; }
    a:hover { text-decoration-thickness: 2px; }
    a:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .bar {
      background: color-mix(in srgb, var(--uui-color-interactive) 10%, var(--uui-color-surface));
      border-radius: var(--uui-border-radius);
      inset: var(--uui-size-space-1) auto var(--uui-size-space-1) 0;
      position: absolute;
      width: var(--bar-width);
    }
    .skeleton-line, .skeleton-number {
      background: var(--uui-color-surface-alt);
      block-size: 1lh;
      border-radius: var(--uui-border-radius);
      display: block;
    }
    .skeleton-line { width: 72%; }
    .skeleton-number { margin-inline-start: auto; width: 3.5rem; }
    .skeleton-table tbody tr:nth-child(3n + 2) .skeleton-line { width: 56%; }
    .skeleton-table tbody tr:nth-child(3n) .skeleton-line { width: 84%; }
    .visually-hidden { clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px; }
    .message { color: var(--uui-color-text-alt); }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "vercel-analytics-breakdown-table": VercelAnalyticsBreakdownTableElement;
  }
}
