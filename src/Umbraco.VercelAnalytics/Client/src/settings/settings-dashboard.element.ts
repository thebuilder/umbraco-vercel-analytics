import {
  LitElement,
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import type { UUIInputElement, UUISelectElement, UUIToggleElement } from "@umbraco-cms/backoffice/external/uui";
import { UmbracoVercelAnalyticsService } from "../api/sdk.gen.js";
import type {
  AnalyticsConnectionSettingsResponse,
  AnalyticsSettingsResponse,
  UpdateAnalyticsSettingsRequest,
} from "../api/types.gen.js";
import "./connection-editor.element.js";
import { createSettingsUpdate, validateEditableSettings } from "./settings-model.js";

@customElement("vercel-analytics-settings-dashboard")
export class VercelAnalyticsSettingsDashboardElement extends UmbElementMixin(LitElement) {
  @state() private _settings?: AnalyticsSettingsResponse;
  @state() private _loading = true;
  @state() private _saving = false;
  @state() private _testingAlias?: string;
  @state() private _status?: { type: "success" | "error"; message: string };

  connectedCallback(): void {
    super.connectedCallback();
    void this.#load();
  }

  async #load(): Promise<void> {
    this._loading = true;
    const { data, error } = await UmbracoVercelAnalyticsService.settings();
    this._loading = false;
    if (error || !data) {
      this._status = { type: "error", message: "Analytics settings could not be loaded. Administrator access is required." };
      return;
    }
    this._settings = data;
  }

  #patch(patch: Partial<AnalyticsSettingsResponse>): void {
    if (this._settings) this._settings = { ...this._settings, ...patch };
  }

  #updateConnection(index: number, connection: AnalyticsConnectionSettingsResponse): void {
    if (!this._settings) return;
    const previous = this._settings.connections[index];
    const connections = this._settings.connections.map((item, itemIndex) => itemIndex === index ? connection : item);
    const defaultConnection = this._settings.defaultConnection === previous.alias
      ? connection.alias
      : this._settings.defaultConnection;
    this.#patch({ connections, defaultConnection });
  }

  #addConnection(): void {
    if (!this._settings) return;
    let number = this._settings.connections.length + 1;
    let alias = `connection-${number}`;
    while (this._settings.connections.some((connection) => connection.alias === alias)) {
      alias = `connection-${++number}`;
    }
    const connection: AnalyticsConnectionSettingsResponse = {
      alias,
      displayName: "New connection",
      projectId: "",
      teamId: null,
      teamSlug: null,
      hostnames: [],
      documentRootKeys: [],
      enableAllDocumentTypes: false,
      enabledDocumentTypeKeys: [],
      hasAccessToken: false,
    };
    const connections = [...this._settings.connections, connection];
    this.#patch({ connections, defaultConnection: this._settings.defaultConnection ?? alias });
    this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLElement>("vercel-analytics-connection-editor:last-of-type")?.scrollIntoView({ behavior: "smooth" }));
  }

  #removeConnection(index: number): void {
    if (!this._settings) return;
    const connection = this._settings.connections[index];
    if (!window.confirm(`Remove “${connection.displayName || connection.alias}”? This takes effect when settings are saved.`)) return;
    const connections = this._settings.connections.filter((_, itemIndex) => itemIndex !== index);
    const defaultConnection = this._settings.defaultConnection === connection.alias
      ? connections[0]?.alias ?? null
      : this._settings.defaultConnection;
    this.#patch({ connections, defaultConnection });
  }

  async #testConnection(alias: string): Promise<void> {
    if (!await this.#persistSettings()) return;
    this._testingAlias = alias;
    this._status = { type: "success", message: "Settings saved. Testing the connection…" };
    const { data, error } = await UmbracoVercelAnalyticsService.testConnection({ path: { alias } });
    this._testingAlias = undefined;
    this._status = error || !data
      ? { type: "error", message: "The connection test could not be completed." }
      : { type: data.success ? "success" : "error", message: data.message };
  }

  async #save(event?: Event): Promise<void> {
    event?.preventDefault();
    await this.#persistSettings("Vercel Analytics settings saved.");
  }

  async #persistSettings(successMessage?: string): Promise<boolean> {
    if (!this._settings || this._saving) return false;
    const validationMessage = validateEditableSettings(this._settings);
    if (validationMessage) {
      this._status = { type: "error", message: validationMessage };
      return false;
    }

    this._saving = true;
    this._status = undefined;
    const body: UpdateAnalyticsSettingsRequest = createSettingsUpdate(this._settings);
    const { data, error } = await UmbracoVercelAnalyticsService.saveSettings({ body });
    this._saving = false;
    if (error || !data) {
      this._status = { type: "error", message: "Settings were not saved. Check the connection fields and mapping values." };
      return false;
    }
    this._settings = data;
    if (successMessage) this._status = { type: "success", message: successMessage };
    return true;
  }

  render() {
    if (this._loading) return html`<uui-loader-bar aria-label="Loading analytics settings"></uui-loader-bar>`;
    if (!this._settings) return html`
      <umb-empty-state headline="Settings unavailable"><p>${this._status?.message}</p><uui-button look="secondary" label="Retry loading settings" @click=${this.#load}>Retry</uui-button></umb-empty-state>
    `;

    return html`
      <form @submit=${this.#save} novalidate>
        <header>
          <div><h1>Vercel Analytics</h1><p>Configure projects and document mapping. Access tokens remain in server-side configuration.</p></div>
          <uui-button type="button" look="primary" label="Save Vercel Analytics settings" .state=${this._saving ? "waiting" : undefined} @click=${this.#save}>Save settings</uui-button>
        </header>

        <div class="status" role="status" aria-live="polite">
          ${this._status ? html`<uui-tag color=${this._status.type === "success" ? "positive" : "danger"}>${this._status.message}</uui-tag>` : ""}
        </div>

        <uui-box headline="General" class="general">
          <div class="general-grid">
            <uui-form-layout-item>
              <uui-label slot="label">Package status</uui-label>
              <uui-toggle
                label="Enable Vercel Analytics"
                ?checked=${this._settings.enabled}
                @change=${(event: Event) => this.#patch({ enabled: (event.target as UUIToggleElement).checked })}>
                Enable Vercel Analytics
              </uui-toggle>
            </uui-form-layout-item>
            <uui-form-layout-item>
              <uui-label slot="label" for="default-connection">Default connection</uui-label>
              <uui-select
                id="default-connection"
                label="Default connection"
                .options=${this._settings.connections.map((connection) => ({
                  name: connection.displayName || connection.alias,
                  value: connection.alias,
                  selected: connection.alias === this._settings?.defaultConnection,
                }))}
                @change=${(event: Event) => this.#patch({ defaultConnection: String((event.target as UUISelectElement).value) })}></uui-select>
            </uui-form-layout-item>
            <uui-form-layout-item>
              <uui-label slot="label" for="default-range">Default range in days</uui-label>
              <uui-input
                id="default-range"
                type="number"
                min="1"
                max="730"
                label="Default range in days"
                .value=${String(this._settings.defaultRangeDays)}
                @input=${(event: Event) => this.#patch({ defaultRangeDays: Number((event.target as UUIInputElement).value) })}></uui-input>
            </uui-form-layout-item>
            <uui-form-layout-item>
              <uui-label slot="label" for="cache-duration">Cache duration</uui-label>
              <uui-input
                id="cache-duration"
                label="Cache duration"
                .value=${this._settings.cacheDuration}
                @input=${(event: Event) => this.#patch({ cacheDuration: String((event.target as UUIInputElement).value) })}></uui-input>
              <span slot="description">Use <code>hh:mm:ss</code>, for example <code>00:05:00</code>.</span>
            </uui-form-layout-item>
          </div>
        </uui-box>

        <section aria-labelledby="connections-heading">
          <div class="section-heading">
            <div><h2 id="connections-heading">Connections</h2><p>Each alias can receive its token from environment variables, user-secrets, or deployment configuration.</p></div>
            <uui-button type="button" look="secondary" label="Add Vercel connection" @click=${this.#addConnection}>Add connection</uui-button>
          </div>
          <div class="connections">
            ${this._settings.connections.map((connection, index) => html`
              <vercel-analytics-connection-editor
                .connection=${connection}
                ?testing=${this._testingAlias === connection.alias}
                @connection-change=${(event: CustomEvent<AnalyticsConnectionSettingsResponse>) => this.#updateConnection(index, event.detail)}
                @remove-connection=${() => this.#removeConnection(index)}
                @test-connection=${() => this.#testConnection(connection.alias)}></vercel-analytics-connection-editor>
            `)}
            ${this._settings.connections.length === 0 ? html`
              <umb-empty-state headline="No Vercel connections"><p>Add a connection to configure global or document-level analytics.</p></umb-empty-state>
            ` : ""}
          </div>
        </section>

        <footer><uui-button type="button" look="primary" label="Save Vercel Analytics settings" .state=${this._saving ? "waiting" : undefined} @click=${this.#save}>Save settings</uui-button></footer>
      </form>
    `;
  }

  static styles = [UmbTextStyles, css`
    :host { display: block; }
    form { max-width: 90rem; margin-inline: auto; padding: var(--uui-size-layout-1); }
    header, .section-heading, footer { display: flex; align-items: center; justify-content: space-between; gap: var(--uui-size-layout-1); }
    h1, h2 { margin: 0; }
    header p, .section-heading p { color: var(--uui-color-text-alt); margin-bottom: 0; }
    .status { min-height: var(--uui-size-layout-1); margin-block: var(--uui-size-space-4); }
    .general { margin-bottom: var(--uui-size-layout-2); }
    .general-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--uui-size-space-5) var(--uui-size-layout-1); }
    .section-heading { margin-bottom: var(--uui-size-space-5); }
    .connections { display: grid; gap: var(--uui-size-layout-1); }
    footer { justify-content: flex-end; margin-top: var(--uui-size-layout-1); padding-block: var(--uui-size-layout-1); border-top: 1px solid var(--uui-color-border); }
    code { font-family: var(--uui-font-monospace); }
    @media (max-width: 800px) {
      header, .section-heading { align-items: stretch; flex-direction: column; }
      .general-grid { grid-template-columns: 1fr; }
    }
  `];
}

export default VercelAnalyticsSettingsDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "vercel-analytics-settings-dashboard": VercelAnalyticsSettingsDashboardElement;
  }
}
