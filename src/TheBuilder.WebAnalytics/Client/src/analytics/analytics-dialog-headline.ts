import { html, nothing } from "@umbraco-cms/backoffice/external/lit";

export function renderAnalyticsDialogHeadline(
  headline: string,
  closeLabel: string,
  onClose: () => void,
  controls?: unknown,
) {
  return html`
    <header class=${`analytics-dialog-headline${controls ? " has-controls" : ""}`}>
      <h2>${headline}</h2>
      ${controls ? html`<div class="analytics-dialog-headline-controls">${controls}</div>` : nothing}
      <button type="button" class="analytics-dialog-close" aria-label=${closeLabel} title="Close" @click=${onClose}>
        <span aria-hidden="true">&times;</span>
      </button>
    </header>
  `;
}
