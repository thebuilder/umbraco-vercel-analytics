import {
  LitElement,
  css,
  customElement,
  html,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import type { UUIInputElement, UUITextareaElement, UUIToggleElement } from "@umbraco-cms/backoffice/external/uui";
import type { AnalyticsConnectionSettingsResponse } from "../api/types.gen.js";
import "@umbraco-cms/backoffice/document";

export type EditableAnalyticsConnection = AnalyticsConnectionSettingsResponse;

@customElement("vercel-analytics-connection-editor")
export class VercelAnalyticsConnectionEditorElement extends UmbElementMixin(LitElement) {
  @property({ attribute: false }) connection!: EditableAnalyticsConnection;
  @property() testing = false;

  #update(patch: Partial<EditableAnalyticsConnection>): void {
    this.dispatchEvent(new CustomEvent<EditableAnalyticsConnection>("connection-change", {
      detail: { ...this.connection, ...patch },
      bubbles: true,
      composed: true,
    }));
  }

  #input(field: keyof EditableAnalyticsConnection, event: Event): void {
    this.#update({ [field]: String((event.target as UUIInputElement).value ?? "") });
  }

  #lines(field: "hostnames", event: Event): void {
    const value = String((event.target as UUITextareaElement).value ?? "");
    this.#update({ [field]: value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) });
  }

  #documentRoots(event: Event): void {
    const selection = (event.target as HTMLElement & { selection: string[] }).selection;
    this.#update({ documentRootKeys: selection });
  }

  #documentTypes(event: Event): void {
    const selection = (event.target as HTMLElement & { selection: string[] }).selection;
    this.#update({ enabledDocumentTypeKeys: selection });
  }

  #allDocumentTypes(event: Event): void {
    const checked = (event.target as UUIToggleElement).checked;
    this.#update({ enableAllDocumentTypes: checked });
  }

  render() {
    const connection = this.connection;
    const globalOnly = connection.hostnames.length === 0 && connection.documentRootKeys.length === 0;
    return html`
      <uui-box headline=${connection.displayName || connection.alias || "New connection"}>
        <div slot="header-actions" class="header-actions">
          <uui-tag color=${connection.hasAccessToken ? "positive" : "warning"}>
            ${connection.hasAccessToken ? "Token configured" : "Token missing"}
          </uui-tag>
          <uui-button
            look="secondary"
            label="Save settings and test connection"
            .state=${this.testing ? "waiting" : undefined}
            ?disabled=${this.testing || !connection.alias}
            @click=${() => this.dispatchEvent(new CustomEvent("test-connection", { bubbles: true, composed: true }))}>
            Save and test
          </uui-button>
          <uui-button
            look="secondary"
            color="danger"
            label="Remove connection"
            @click=${() => this.dispatchEvent(new CustomEvent("remove-connection", { bubbles: true, composed: true }))}>
            Remove
          </uui-button>
        </div>

        <fieldset>
          <legend>Connection</legend>
          <div class="fields two-columns">
            ${this.#field("Alias", "alias", connection.alias, "Used to match the server-side token. Letters, numbers, hyphens, and underscores only.")}
            ${this.#field("Display name", "displayName", connection.displayName)}
            ${this.#field("Vercel project ID", "projectId", connection.projectId)}
            ${this.#field("Team ID", "teamId", connection.teamId ?? "", "Use either team ID or team slug, not both.")}
            ${this.#field("Team slug", "teamSlug", connection.teamSlug ?? "")}
          </div>
          <p class="token-help">
            Tokens stay outside Umbraco. Configure
            <code>VercelAnalytics__Connections__${connection.alias || "alias"}__AccessToken</code>
            on the server.
          </p>
        </fieldset>

        <fieldset>
          <legend>Document mapping <span>optional</span></legend>
          <p class="description">
            A hostname or document root enables page-level analytics. Leave both empty for global reports only.
          </p>
          ${globalOnly ? html`<uui-tag color="default">Global reports only</uui-tag>` : ""}
          <div class="fields">
            <uui-form-layout-item>
              <uui-label slot="label" for=${`${connection.alias}-hostnames`}>Published hostnames</uui-label>
              <uui-textarea
                id=${`${connection.alias}-hostnames`}
                label="Published hostnames"
                .value=${connection.hostnames.join("\n")}
                @input=${(event: Event) => this.#lines("hostnames", event)}></uui-textarea>
              <span slot="description">One exact hostname per line. Do not include the scheme or path.</span>
            </uui-form-layout-item>
            <uui-form-layout-item>
              <uui-label slot="label">Document roots</uui-label>
              <umb-input-document
                .selection=${connection.documentRootKeys}
                @change=${this.#documentRoots}></umb-input-document>
              <span slot="description">The nearest selected ancestor wins over hostname mapping.</span>
            </uui-form-layout-item>
          </div>
        </fieldset>

        <fieldset>
          <legend>Document types</legend>
          <uui-toggle
            label="Enable analytics for all document types"
            ?checked=${connection.enableAllDocumentTypes}
            @change=${this.#allDocumentTypes}>
            Enable analytics for all document types
          </uui-toggle>
          ${connection.enableAllDocumentTypes ? html`
            <p class="description">New document types will automatically receive analytics when they are published beneath a mapped root or hostname.</p>
          ` : html`
            <uui-form-layout-item>
              <uui-label slot="label">Enabled document types</uui-label>
              <umb-input-document-type
                documentTypesOnly
                .selection=${connection.enabledDocumentTypeKeys}
                @change=${this.#documentTypes}></umb-input-document-type>
              <span slot="description">Choose exact document types. Pattern matching such as <code>*Page</code> is intentionally not used.</span>
            </uui-form-layout-item>
          `}
        </fieldset>
      </uui-box>
    `;
  }

  #field(
    label: string,
    field: "alias" | "displayName" | "projectId" | "teamId" | "teamSlug",
    value: string,
    description?: string,
  ) {
    const id = `${this.connection.alias || "new"}-${field}`;
    return html`
      <uui-form-layout-item>
        <uui-label slot="label" for=${id} ?required=${field === "alias" || field === "displayName" || field === "projectId"}>${label}</uui-label>
        <uui-input
          id=${id}
          name=${field}
          label=${label}
          .value=${value}
          maxlength="200"
          ?required=${field === "alias" || field === "displayName" || field === "projectId"}
          @input=${(event: Event) => this.#input(field, event)}></uui-input>
        ${description ? html`<span slot="description">${description}</span>` : ""}
      </uui-form-layout-item>
    `;
  }

  static styles = [UmbTextStyles, css`
    :host { display: block; }
    .header-actions { display: flex; align-items: center; flex-wrap: wrap; gap: var(--uui-size-space-3); }
    fieldset { border: 0; padding: 0; margin: 0 0 var(--uui-size-layout-1); }
    fieldset:last-child { margin-bottom: 0; }
    legend { font-weight: 700; font-size: var(--uui-type-h5-size); padding: 0; margin-bottom: var(--uui-size-space-4); }
    legend span, .description { color: var(--uui-color-text-alt); font-weight: 400; }
    .fields { display: grid; gap: var(--uui-size-space-5); }
    .two-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    uui-input, uui-textarea { width: 100%; }
    uui-textarea { min-height: 8rem; }
    .token-help { padding: var(--uui-size-space-4); background: var(--uui-color-surface-alt); overflow-wrap: anywhere; }
    code { font-family: var(--uui-font-monospace); }
    @media (max-width: 800px) { .two-columns { grid-template-columns: 1fr; } }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    "vercel-analytics-connection-editor": VercelAnalyticsConnectionEditorElement;
  }
}
