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
  uui-dialog-layout {
    --uui-size-10: var(--uui-size-space-5);
    --uui-size-14: var(--uui-size-space-6);
  }
  @media (max-width: 600px) {
    dialog { max-height: 100dvh; max-width: 100vw; }
  }
`;
