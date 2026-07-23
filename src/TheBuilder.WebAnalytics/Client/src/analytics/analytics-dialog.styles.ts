import { css } from "@umbraco-cms/backoffice/external/lit";

export const analyticsDialogStyles = css`
  dialog {
    border: 0;
    border-radius: var(--uui-border-radius);
    box-shadow: var(--uui-shadow-depth-5);
    box-sizing: border-box;
    margin: auto;
    max-height: min(52rem, calc(100dvh - 2 * var(--uui-size-layout-1)));
    max-width: min(var(--analytics-dialog-max-width, 50rem), calc(100vw - 2 * var(--uui-size-layout-1)));
    padding: 0;
    width: 100%;
  }
  dialog::backdrop { background: color-mix(in srgb, var(--uui-color-text) 45%, transparent); }
  .analytics-dialog-layout {
    --analytics-dialog-inline-padding: var(--uui-size-space-5);
    color: var(--uui-color-text);
  }
  .analytics-dialog-headline {
    align-items: center;
    border-bottom: 1px solid var(--uui-color-border);
    box-sizing: border-box;
    display: grid;
    gap: var(--uui-size-space-5);
    grid-template-columns: minmax(0, 1fr) 2.75rem;
    min-block-size: 3.5rem;
    padding-block: var(--uui-size-space-3);
    padding-inline: var(--analytics-dialog-inline-padding);
  }
  .analytics-dialog-headline.has-controls { grid-template-columns: max-content minmax(11rem, 16rem) minmax(0, 1fr) 2.75rem; }
  .analytics-dialog-headline.has-controls .analytics-dialog-close { grid-column: 4; }
  .analytics-dialog-headline.has-controls.no-headline { grid-template-columns: minmax(11rem, 16rem) minmax(0, 1fr) 2.75rem; }
  .analytics-dialog-headline.has-controls.no-headline .analytics-dialog-close { grid-column: 3; }
  .analytics-dialog-headline.has-leading-action { gap: var(--uui-size-space-3); grid-template-columns: max-content minmax(0, 1fr) 2.75rem; }
  .analytics-dialog-headline h2 {
    font-size: var(--uui-type-default-size);
    font-weight: 700;
    line-height: var(--uui-type-default-line-height);
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .analytics-dialog-headline-controls { min-width: 0; }
  .analytics-dialog-close {
    align-items: center;
    appearance: none;
    background: transparent;
    block-size: 2.75rem;
    border: 0;
    border-radius: var(--uui-border-radius);
    color: var(--uui-color-text-alt);
    cursor: pointer;
    display: inline-flex;
    flex: 0 0 auto;
    font: inherit;
    inline-size: 2.75rem;
    justify-content: center;
    line-height: 1;
    padding: 0;
  }
  .analytics-dialog-close span {
    font-size: var(--uui-type-h3-size);
    line-height: 1;
    transform: translateY(-0.03em);
  }
  .analytics-dialog-close:hover {
    background: var(--uui-color-surface-alt);
    color: var(--uui-color-text);
  }
  .analytics-dialog-close:focus-visible {
    outline: 2px solid var(--uui-color-selected);
    outline-offset: 2px;
  }
  .analytics-dialog-back {
    align-items: center;
    appearance: none;
    background: transparent;
    block-size: 2.75rem;
    border: 0;
    border-radius: var(--uui-border-radius);
    color: var(--uui-color-interactive);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: var(--uui-size-space-1);
    padding: 0 var(--uui-size-space-2);
  }
  .analytics-dialog-back:hover { background: var(--uui-color-surface-alt); color: var(--uui-color-text); }
  .analytics-dialog-back:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
  .analytics-dialog-back span { white-space: nowrap; }
  .analytics-dialog-body {
    block-size: var(--analytics-dialog-body-height, min(30rem, 52dvh));
    min-block-size: 0;
  }
  @media (max-width: 600px) {
    dialog { max-height: 100dvh; max-width: 100vw; }
    .analytics-dialog-headline.has-controls { grid-template-columns: minmax(0, 1fr) 2.75rem; }
    .analytics-dialog-headline-controls { grid-column: 1 / -1; grid-row: 2; }
    .analytics-dialog-headline.has-controls .analytics-dialog-close { grid-column: 2; grid-row: 1; }
    .analytics-dialog-body { block-size: 48dvh; }
  }
`;
