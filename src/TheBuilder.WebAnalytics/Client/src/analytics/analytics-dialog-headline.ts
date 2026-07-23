import { html, nothing } from "@umbraco-cms/backoffice/external/lit";

export function renderAnalyticsDialogHeadline(
  headline: string,
  closeLabel: string,
  onClose: () => void,
  controls?: unknown,
  showHeadline = true,
  leadingAction?: unknown,
) {
  return html`
    <header class=${`analytics-dialog-headline${controls ? " has-controls" : ""}${showHeadline ? "" : " no-headline"}${leadingAction ? " has-leading-action" : ""}`}>
      ${leadingAction ? html`<div class="analytics-dialog-headline-leading-action">${leadingAction}</div>` : nothing}
      ${showHeadline ? html`<h2>${headline}</h2>` : nothing}
      ${controls ? html`<div class="analytics-dialog-headline-controls">${controls}</div>` : nothing}
      <button type="button" class="analytics-dialog-close" aria-label=${closeLabel} title="Close" @click=${onClose}>
        <span aria-hidden="true">&times;</span>
      </button>
    </header>
  `;
}
