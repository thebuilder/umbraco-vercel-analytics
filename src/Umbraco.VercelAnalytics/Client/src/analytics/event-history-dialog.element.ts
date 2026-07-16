import { LitElement, css, customElement, html, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import type { AnalyticsEventHistory, AnalyticsInterval } from "../api/types.gen.js";
import "./history-chart.element.js";

@customElement("vercel-analytics-event-history-dialog")
export class VercelAnalyticsEventHistoryDialogElement extends UmbElementMixin(LitElement) {
  @property() eventName = "Event";
  @property({ type: Boolean }) loading = false;
  @property() unavailable?: string;
  @property() interval: AnalyticsInterval = "Day";
  @property({ attribute: false }) history?: AnalyticsEventHistory;
  @state() private _metric: "visitors" | "count" = "count";

  protected firstUpdated(): void { this.shadowRoot?.querySelector("dialog")?.showModal(); }
  #close(): void { this.shadowRoot?.querySelector("dialog")?.close(); }
  #notifyClosed(): void { this.dispatchEvent(new CustomEvent("close-event-history", { bubbles: true, composed: true })); }
  #onCancel(event: Event): void { event.preventDefault(); this.#close(); }
  #onTabKeydown(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextMetric = event.key === 'ArrowLeft' || event.key === 'Home' ? 'count' : 'visitors';
    this._metric = nextMetric;
    this.shadowRoot?.querySelector<HTMLButtonElement>(`#event-${nextMetric}-tab`)?.focus();
  }

  render() {
    return html`
      <dialog aria-label=${`${this.eventName} history`} @cancel=${this.#onCancel} @close=${this.#notifyClosed}>
        <uui-dialog-layout headline=${this.eventName}>
          ${this.loading ? html`<div class="loading" role="status">Loading event history…</div>` : this.unavailable ? html`<umb-empty-state headline="Event history unavailable"><p>${this.unavailable}</p></umb-empty-state>` : this.history ? html`
            <div class="metric-tabs" role="tablist" aria-label="Event metric">
              ${(["count", "visitors"] as const).map((metric) => html`
                <button
                  id=${`event-${metric}-tab`}
                  type="button"
                  role="tab"
                  aria-controls="event-history-panel"
                  aria-selected=${this._metric === metric}
                  tabindex=${this._metric === metric ? 0 : -1}
                  @click=${() => (this._metric = metric)}
                  @keydown=${this.#onTabKeydown}>
                  <span>${metric === "count" ? "Total events" : "Visitors"}</span>
                  <strong>${this.history?.totals[metric].toLocaleString()}</strong>
                </button>
              `)}
            </div>
            <div id="event-history-panel" role="tabpanel" aria-labelledby=${`event-${this._metric}-tab`}>
              ${this.history.points.length ? html`<vercel-analytics-history-chart .points=${this.history.points} .metric=${this._metric} .interval=${this.interval}></vercel-analytics-history-chart>` : html`<umb-empty-state headline="No event history"><p>No occurrences were recorded in this period.</p></umb-empty-state>`}
            </div>
          ` : ""}
          <uui-button slot="actions" look="secondary" label="Close event history" @click=${this.#close}>Close</uui-button>
        </uui-dialog-layout>
      </dialog>
    `;
  }

  static styles = [UmbTextStyles, css`
    dialog { border: 0; border-radius: var(--uui-border-radius); box-shadow: var(--uui-shadow-depth-5); box-sizing: border-box; margin: auto; max-height: min(52rem, calc(100dvh - 2 * var(--uui-size-layout-1))); max-width: min(68rem, calc(100vw - 2 * var(--uui-size-layout-1))); padding: 0; width: 100%; }
    dialog::backdrop { background: rgb(0 0 0 / 45%); }
    uui-dialog-layout { --uui-size-10: var(--uui-size-space-5); --uui-size-14: var(--uui-size-space-6); }
    .metric-tabs { border: 1px solid var(--uui-color-border); border-radius: var(--uui-border-radius); display: flex; margin-bottom: var(--uui-size-space-5); overflow: hidden; }
    .metric-tabs button { appearance: none; background: transparent; border: 0; border-bottom: 3px solid transparent; cursor: pointer; display: grid; flex: 1 1 50%; font: inherit; gap: var(--uui-size-space-2); padding: var(--uui-size-space-4); text-align: left; }
    .metric-tabs button + button { border-inline-start: 1px solid var(--uui-color-border); }
    .metric-tabs button[aria-selected="true"] { border-bottom-color: var(--uui-color-selected); }
    .metric-tabs strong { font-size: 1.75rem; font-variant-numeric: tabular-nums; }
    .loading { min-block-size: 22rem; padding: var(--uui-size-space-5); }
  `];
}

declare global { interface HTMLElementTagNameMap { "vercel-analytics-event-history-dialog": VercelAnalyticsEventHistoryDialogElement; } }
