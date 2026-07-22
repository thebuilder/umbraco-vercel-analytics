import {
  LitElement,
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import type { UUIInputElement } from "@umbraco-cms/backoffice/external/uui";
import type { AnalyticsBreakdownRow, AnalyticsDimension } from "../api/types.gen.js";
import { analyticsDialogStyles } from "./analytics-dialog.styles.js";
import { breakdownDimensionLabel, breakdownMetricTotal, type TrafficMetric } from "./breakdown-rows.js";
import type { BreakdownDialogContext, DimensionOption } from "./dashboard-cards.js";
import type { AnalyticsFilter } from "./dashboard-url-state.js";
import { isUtmDimension } from "./utm-capability.js";
import type { ReportTabGroup } from "./report-tabs.js";
import "./breakdown-table.element.js";

@customElement("web-analytics-breakdown-dialog")
export class WebAnalyticsBreakdownDialogElement extends UmbElementMixin(LitElement) {
  @property() headline = "Breakdown";
  @property() loading = false;
  @property() unavailable?: string;
  @property() baseUrl?: string;
  @property() dimension?: AnalyticsDimension;
  @property() metric: TrafficMetric = "visitors";
  @property({ type: Boolean }) linkValues = false;
  @property({ attribute: false }) rows: AnalyticsBreakdownRow[] = [];
  @property({ attribute: false }) filters: AnalyticsFilter[] = [];
  @property({ attribute: false }) context?: BreakdownDialogContext;
  @state() private _search = "";

  protected firstUpdated(): void {
    this.shadowRoot?.querySelector("dialog")?.showModal();
  }

  #close(): void {
    this.shadowRoot?.querySelector("dialog")?.close();
  }

  #notifyClosed(): void {
    this.dispatchEvent(new CustomEvent("close-breakdown", { bubbles: true, composed: true }));
  }

  #onCancel(event: Event): void {
    event.preventDefault();
    this.#close();
  }

  #onSearch(event: Event): void {
    this._search = String((event.target as UUIInputElement).value ?? "");
    this.dispatchEvent(new CustomEvent("search-breakdown", {
      bubbles: true,
      composed: true,
      detail: { search: this._search.trim() },
    }));
  }

  #selectDimension(option?: DimensionOption): void {
    if (!option || option.dimension === this.dimension) return;
    this._search = "";
    this.dispatchEvent(new CustomEvent("breakdown-dimension-change", {
      bubbles: true,
      composed: true,
      detail: { dimension: option.dimension, headline: option.headline },
    }));
  }

  #headingTabs(): ReportTabGroup | undefined {
    if (this.context?.kind === "audience") {
      return {
        ariaLabel: "Audience technology",
        idPrefix: "expanded-audience-tab",
        options: this.context.options.map(({ dimension, label }) => ({ value: dimension, label })),
        selected: this.dimension ?? this.context.options[0]?.dimension ?? "DeviceType",
      };
    }
    if (this.context?.kind === "acquisition") {
      return {
        ariaLabel: "Traffic source",
        idPrefix: "expanded-acquisition-tab",
        options: [
          { value: "referrers", label: "Referrers" },
          { value: "utm", label: "UTM" },
        ],
        selected: this.dimension && isUtmDimension(this.dimension) ? "utm" : "referrers",
      };
    }
    return undefined;
  }

  #subheadingTabs(): ReportTabGroup | undefined {
    if (this.context?.kind !== "acquisition" || !this.dimension || !isUtmDimension(this.dimension)) return undefined;
    return {
      appearance: "secondary",
      ariaLabel: "UTM parameter",
      idPrefix: "expanded-utm-tab",
      options: this.context.utmOptions.map(({ dimension, label }) => ({ value: dimension, label })),
      selected: this.dimension,
    };
  }

  #selectHeading(value: string): void {
    if (this.context?.kind === "audience") {
      this.#selectDimension(this.context.options.find(({ dimension }) => dimension === value));
      return;
    }
    if (this.context?.kind === "acquisition") {
      const context = this.context;
      this.#selectDimension(value === "referrers"
        ? context.referrer
        : context.utmOptions.find(({ dimension }) => dimension === context.utmDimension));
    }
  }

  #selectSubheading(value: string): void {
    if (this.context?.kind === "acquisition") {
      this.#selectDimension(this.context.utmOptions.find(({ dimension }) => dimension === value));
    }
  }

  render() {
    const dialogHeadline = this.context?.title ?? this.headline;
    const headingTabs = this.#headingTabs();
    const subheadingTabs = this.#subheadingTabs();
    return html`
      <dialog aria-label=${dialogHeadline} @cancel=${this.#onCancel} @close=${this.#notifyClosed}>
        <uui-dialog-layout headline=${dialogHeadline}>
          <uui-input
            type="search"
            label=${`Search ${this.headline}`}
            maxlength="200"
            placeholder="Search"
            .value=${this._search}
            @input=${this.#onSearch}>
            <uui-icon name="icon-search" slot="prepend"></uui-icon>
          </uui-input>
          <div class="results" aria-busy=${this.loading} aria-live="polite">
            <web-analytics-breakdown-table
              .headline=${this.headline}
              .rowLabel=${breakdownDimensionLabel(this.dimension)}
              .dimension=${this.dimension}
              .metric=${this.metric}
              .total=${breakdownMetricTotal(this.rows, this.metric)}
              .rows=${this.rows}
              .loading=${this.loading}
              .unavailable=${this.unavailable}
              .emptyMessage=${this._search ? "No matching results. Try a different search." : "No traffic was recorded for this breakdown."}
              .baseUrl=${this.baseUrl}
              .filters=${this.filters}
              .linkValues=${this.linkValues}
              .headingTabs=${headingTabs}
              .subheadingTabs=${subheadingTabs}
              .hasSubheading=${Boolean(subheadingTabs)}
              @heading-tab-change=${(event: CustomEvent<{ value: string }>) => this.#selectHeading(event.detail.value)}
              @subheading-tab-change=${(event: CustomEvent<{ value: string }>) => this.#selectSubheading(event.detail.value)}></web-analytics-breakdown-table>
          </div>
          <uui-button slot="actions" look="secondary" label="Close breakdown" @click=${this.#close}>Close</uui-button>
        </uui-dialog-layout>
      </dialog>
    `;
  }

  static styles = [UmbTextStyles, analyticsDialogStyles, css`
    uui-input { box-sizing: border-box; width: 100%; }
    uui-input [slot="prepend"] { align-items: center; display: flex; margin-inline: var(--uui-size-space-3) var(--uui-size-space-2); }
    .results { max-block-size: min(30rem, 52dvh); margin-top: var(--uui-size-space-4); overflow: auto; scrollbar-gutter: stable; }
    @media (max-width: 600px) {
      .results { max-block-size: 48dvh; }
    }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    "web-analytics-breakdown-dialog": WebAnalyticsBreakdownDialogElement;
  }
}
