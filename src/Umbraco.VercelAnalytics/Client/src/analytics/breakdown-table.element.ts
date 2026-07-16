import { LitElement, css, customElement, html, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { AnalyticsBreakdownRow, AnalyticsDimension } from "../api/types.gen.js";
import {
  analyticsRowHref,
  breakdownBarRatio,
  breakdownDisplayValue,
  breakdownMetricValue,
  breakdownPercentage,
  isPercentageDimension,
  referrerFaviconUrl,
  visibleBreakdownRows,
  type TrafficMetric,
} from "./breakdown-rows.js";
import { countryDisplayName, countryFlagUrl, normalizeCountryCode } from "./country-display.js";

@customElement("vercel-analytics-breakdown-table")
export class VercelAnalyticsBreakdownTableElement extends UmbElementMixin(LitElement) {
  @property() headline = "Breakdown";
  @property() unavailable?: string;
  @property() baseUrl?: string;
  @property() dimension?: AnalyticsDimension;
  @property() metric: TrafficMetric = "visitors";
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) linkValues = false;
  @property({ type: Number }) skeletonRows = 10;
  @property({ type: Number }) total = 0;
  @property({ attribute: false }) rows: AnalyticsBreakdownRow[] = [];

  render() {
    if (this.loading) {
      return html`
        <span class="visually-hidden" role="status">Loading ${this.headline}</span>
        <table class="skeleton-table" aria-hidden="true">
          <caption>${this.headline}</caption>
          <thead><tr><th scope="col"><slot name="heading">${this.headline}</slot></th><th scope="col">${this.#metricLabel()}</th></tr></thead>
          <tbody>${Array.from({ length: this.skeletonRows }, () => html`
            <tr>
              <th scope="row"><span class="skeleton-line"></span></th>
              <td><span class="skeleton-number"></span></td>
            </tr>
          `)}</tbody>
        </table>
      `;
    }
    if (this.unavailable) return html`<p class="message">${this.unavailable}</p>`;
    const rows = visibleBreakdownRows(this.rows);
    if (rows.length === 0) return html`<p class="message">No traffic was recorded for this breakdown.</p>`;
    const maximum = Math.max(...rows.map((row) => breakdownMetricValue(row, this.metric)), 1);
    const percentageDimension = isPercentageDimension(this.dimension);

    return html`
      <table>
        <caption>${this.headline}</caption>
        <thead><tr><th scope="col"><slot name="heading">${this.headline}</slot></th><th scope="col">${this.#metricLabel()}</th></tr></thead>
        <tbody>${rows.map((row, index) => {
          const href = this.linkValues ? analyticsRowHref(this.baseUrl, row.value) : undefined;
          const countryCode = this.dimension === "Country" ? normalizeCountryCode(row.value) : undefined;
          const faviconUrl = this.dimension === "ReferrerHostname" ? referrerFaviconUrl(row.value) : undefined;
          const displayValue = countryCode
            ? countryDisplayName(countryCode, navigator.languages)
            : breakdownDisplayValue(row.value, this.dimension);
          const metricValue = breakdownMetricValue(row, this.metric);
          const percentage = breakdownPercentage(metricValue, this.total);
          const barRatio = breakdownBarRatio(metricValue, maximum);
          const tooltipId = `breakdown-value-${index}`;
          return html`
          <tr>
            <th scope="row">
              <span class="bar" style=${`--bar-width:${barRatio * 100}%;--bar-minimum:${metricValue > 0 ? "4px" : "0px"}`}></span>
              <span class="row-value">
                ${countryCode ? html`<img class="country-flag" src=${countryFlagUrl(countryCode)} alt="" width="20" height="15" loading="lazy" referrerpolicy="no-referrer" @error=${(event: Event) => ((event.currentTarget as HTMLImageElement).style.visibility = "hidden")}>` : ""}
                ${faviconUrl ? html`<img class="referrer-favicon" src=${faviconUrl} alt="" width="20" height="20" loading="lazy" referrerpolicy="no-referrer" @error=${(event: Event) => ((event.currentTarget as HTMLImageElement).style.visibility = "hidden")}>` : ""}
                <span class="row-label" title=${displayValue}>${href
                  ? html`<a href=${href} target="_blank" rel="noopener noreferrer">${displayValue}<span class="visually-hidden"> (opens in a new tab)</span></a>`
                  : displayValue}</span>
              </span>
            </th>
            <td>${percentageDimension ? html`
              <span class="percentage-value" tabindex="0" aria-describedby=${tooltipId}>
                <span aria-hidden="true">${percentage.display}</span>
                <span class="visually-hidden">${metricValue.toLocaleString()} ${this.#metricLabel().toLocaleLowerCase()}, ${percentage.precise} of the total</span>
                <span id=${tooltipId} class="percentage-tooltip" role="tooltip">
                  <strong>${metricValue.toLocaleString()}</strong>
                  <span>${percentage.precise}</span>
                </span>
              </span>
            ` : metricValue.toLocaleString()}</td>
          </tr>
        `;})}</tbody>
      </table>
    `;
  }

  #metricLabel(): string {
    return this.metric === "visitors" ? "Visitors" : "Page views";
  }

  static styles = css`
    :host { display: block; overflow-x: auto; }
    table {
      --bar-inset: var(--uui-size-space-3);
      --metric-column-width: 7rem;
      border-collapse: collapse;
      min-inline-size: 20rem;
      table-layout: fixed;
      width: 100%;
    }
    caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    thead th { border-bottom: 1px solid var(--uui-color-border); font-weight: 700; }
    thead th:nth-child(2) { color: var(--uui-color-text-alt); text-align: right; width: var(--metric-column-width); }
    th, td { box-sizing: border-box; padding: var(--uui-size-space-3) var(--uui-size-space-5); text-align: left; }
    td { font-variant-numeric: tabular-nums; position: relative; text-align: right; z-index: 1; }
    tbody th { position: relative; font-weight: 500; min-width: 10rem; }
    .row-value { align-items: center; display: flex; gap: var(--uui-size-space-3); min-inline-size: 0; position: relative; z-index: 1; }
    .row-label { min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .country-flag { border-radius: 2px; flex: 0 0 auto; object-fit: cover; }
    .referrer-favicon { border-radius: var(--uui-border-radius); flex: 0 0 auto; object-fit: contain; }
    .percentage-value { display: inline-block; font-weight: 700; outline: none; position: relative; }
    .percentage-value:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .percentage-tooltip {
      align-items: end;
      background: var(--uui-color-text);
      border-radius: var(--uui-border-radius);
      bottom: calc(100% + var(--uui-size-space-3));
      box-shadow: var(--uui-shadow-depth-2);
      color: var(--uui-color-surface);
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
      gap: var(--uui-size-space-1);
      opacity: 0;
      padding: var(--uui-size-space-3) var(--uui-size-space-4);
      pointer-events: none;
      position: absolute;
      right: calc(-1 * var(--uui-size-space-3));
      transform: translateY(var(--uui-size-space-2));
      transition: opacity 120ms ease-out, transform 120ms ease-out;
      visibility: hidden;
      white-space: nowrap;
      z-index: 1;
    }
    .percentage-tooltip::after {
      border: var(--uui-size-space-2) solid transparent;
      border-top-color: var(--uui-color-text);
      content: "";
      position: absolute;
      right: var(--uui-size-space-4);
      top: 100%;
    }
    .percentage-tooltip strong { font-size: 1rem; }
    .percentage-tooltip span { color: color-mix(in srgb, var(--uui-color-surface) 70%, transparent); }
    .percentage-value:hover .percentage-tooltip,
    .percentage-value:focus .percentage-tooltip { opacity: 1; transform: translateY(0); visibility: visible; }
    a { color: var(--uui-color-interactive-emphasis); text-decoration-thickness: 1px; text-underline-offset: 0.18em; }
    a:hover { text-decoration-thickness: 2px; }
    a:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .bar {
      inset-block: var(--uui-size-space-1);
      inset-inline-start: var(--bar-inset);
      inline-size: calc(100% + var(--metric-column-width) - var(--bar-inset) - var(--bar-inset));
      position: absolute;
    }
    .bar::before {
      background: color-mix(in srgb, var(--uui-color-interactive) 4%, var(--uui-color-surface));
      border-radius: var(--uui-border-radius);
      block-size: 100%;
      content: "";
      display: block;
      inline-size: max(var(--bar-minimum), var(--bar-width));
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
    .message { color: var(--uui-color-text-alt); padding: var(--uui-size-space-5); }
    @media (prefers-reduced-motion: reduce) { .percentage-tooltip { transition: none; } }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "vercel-analytics-breakdown-table": VercelAnalyticsBreakdownTableElement;
  }
}
