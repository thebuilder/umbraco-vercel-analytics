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
          <legend>Page analytics <span>optional</span></legend>
          <p class="description mapping-description">
            Select document roots to enable page analytics for Umbraco content. Use published hostnames instead, or as a fallback. If both match, the document root wins. Leave both empty for global analytics only.
          </p>
          <div class="fields mapping-fields">
            <uui-form-layout-item>
              <uui-label slot="label">Document roots</uui-label>
              <umb-input-document
                .selection=${connection.documentRootKeys}
                @change=${this.#documentRoots}></umb-input-document>
              <span slot="description">Recommended. Select each Umbraco site's root.</span>
            </uui-form-layout-item>
            <uui-form-layout-item class="hostname-field">
              <uui-label slot="label" for=${`${connection.alias}-hostnames`}>Hostname fallback</uui-label>
              <uui-textarea
                id=${`${connection.alias}-hostnames`}
                label="Published hostnames"
                .value=${connection.hostnames.join("\n")}
                @input=${(event: Event) => this.#lines("hostnames", event)}></uui-textarea>
              <span slot="description">Enter one exact published hostname per line, without scheme or path.</span>
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
            <p class="description document-types-help">New document types will automatically receive analytics when they are published beneath a mapped root or hostname.</p>
          ` : html`
            <uui-form-layout-item>
              <uui-label slot="label">Enabled document types</uui-label>
              <umb-input-document-type
                documentTypesOnly
                .selection=${connection.enabledDocumentTypeKeys}
                @change=${this.#documentTypes}></umb-input-document-type>
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
    :host { container-type: inline-size; display: block; }
    .header-actions { display: flex; align-items: center; flex-wrap: wrap; gap: var(--uui-size-space-3); }
    fieldset { border: 0; padding: 0; margin: 0 0 var(--uui-size-space-6); }
    fieldset:last-child { margin-bottom: 0; }
    legend { font-weight: 700; font-size: var(--uui-type-h5-size); padding: 0; margin-bottom: var(--uui-size-space-3); }
    legend span, .description { color: var(--uui-color-text-alt); font-weight: 400; }
    .description { margin: 0; }
    .fields { display: grid; gap: var(--uui-size-space-4); }
    .two-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .two-columns > uui-form-layout-item:nth-child(3) { grid-column: 1 / -1; }
    .mapping-description { margin-bottom: var(--uui-size-space-4); max-width: 65ch; }
    .mapping-fields { align-items: start; }
    .hostname-field { max-width: 40rem; }
    .document-types-help { margin-top: var(--uui-size-space-2); }
    uui-input, uui-textarea { width: 100%; }
    uui-textarea { min-height: 5rem; }
    .token-help { padding: var(--uui-size-space-3); background: var(--uui-color-surface-alt); margin: var(--uui-size-space-4) 0 0; overflow-wrap: anywhere; }
    code { font-family: var(--uui-font-monospace); }
    @container (max-width: 48rem) { .two-columns { grid-template-columns: 1fr; } .two-columns > uui-form-layout-item:nth-child(3) { grid-column: auto; } }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    "vercel-analytics-connection-editor": VercelAnalyticsConnectionEditorElement;
  }
}
