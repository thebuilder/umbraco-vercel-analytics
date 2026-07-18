import { LitElement as A, html as s, css as T, property as v, state as h, customElement as S } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as D } from "@umbraco-cms/backoffice/element-api";
import { UmbTextStyles as j } from "@umbraco-cms/backoffice/style";
import { U as x } from "./sdk.gen-Cl3izvwW.js";
import "@umbraco-cms/backoffice/document";
import { a as ee } from "./analytics-availability-CxXDwRo0.js";
function te(e) {
  return e.team?.trim() || "";
}
function ie(e) {
  return { team: e.trim() || null };
}
function V(e) {
  const t = {};
  return e.mockScenario == null && !e.projectId.trim() && (t.projectId = "Enter the Vercel project ID."), t;
}
function ne(e) {
  if (e.enabled && e.connections.length === 0) return "Add a connection before enabling analytics.";
  for (const t of e.connections) {
    const i = V(t);
    if (i.projectId) return `Complete the required fields for “${t.displayName || t.projectId || "New connection"}”.`;
    if (i.team) return `Fix the team ownership for “${t.displayName || t.projectId || "New connection"}”.`;
  }
}
function ae(e) {
  return {
    enabled: e.enabled,
    defaultRangeDays: e.defaultRangeDays,
    cacheDuration: e.cacheDuration,
    connections: e.connections.map((t) => ({
      key: t.key,
      displayName: t.displayName,
      projectId: t.projectId,
      team: t.team,
      mockScenario: t.mockScenario,
      documentRootKeys: t.documentRootKeys,
      enableAllDocumentTypes: t.enableAllDocumentTypes,
      enabledDocumentTypeKeys: t.enableAllDocumentTypes ? [] : t.enabledDocumentTypeKeys
    }))
  };
}
const E = [
  { id: "Complete", name: "Demo", displayName: "Demo", description: "Traffic, audience, UTM, flags, and events." },
  { id: "Utm", name: "UTM campaigns", displayName: "Mock · UTM campaigns", description: "Populated source, medium, campaign, term, and content reports." },
  { id: "Flags", name: "Feature flags", displayName: "Mock · Feature flags", description: "Flag keys with drill-down values and traffic totals." },
  { id: "Events", name: "Custom events", displayName: "Mock · Custom events", description: "Events with searchable properties and drill-down values." }
];
function se(e) {
  return E.find((t) => t.id === e);
}
var oe = Object.defineProperty, ce = Object.getOwnPropertyDescriptor, I = (e) => {
  throw TypeError(e);
}, y = (e, t, i, a) => {
  for (var n = a > 1 ? void 0 : a ? ce(t, i) : t, d = e.length - 1, u; d >= 0; d--)
    (u = e[d]) && (n = (a ? u(t, i, n) : u(n)) || n);
  return a && n && oe(t, i, n), n;
}, re = (e, t, i) => t.has(e) || I("Cannot " + i), le = (e, t, i) => t.has(e) ? I("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), l = (e, t, i) => (re(e, t, "access private method"), i), r, b, R, K, M, N, O, k, U, P, _, q, F;
let m = class extends D(A) {
  constructor() {
    super(...arguments), le(this, r), this.errors = {}, this.mockConnectionsEnabled = !1, this.dirty = !1, this.testing = !1, this._tokenCopied = !1;
  }
  firstUpdated() {
    this.connection.projectId || this.shadowRoot?.querySelector(".connection-shell")?.setAttribute("open", "");
  }
  focusFirstInvalid() {
    const e = this.shadowRoot?.querySelector('[aria-invalid="true"]');
    return e?.focus(), !!e;
  }
  render() {
    const e = this.connection, t = e.mockScenario != null, i = se(e.mockScenario), a = this.dirty ? "Save changes before testing this connection." : t && !this.mockConnectionsEnabled ? "Mock connections are only active in Development." : "Test the saved connection.", n = t ? this.mockConnectionsEnabled ? "Development mock" : "Inactive mock" : e.hasAccessTokenOverride ? "Token override" : e.hasAccessToken ? "Shared token" : "Token missing", d = t ? this.mockConnectionsEnabled ? "positive" : "warning" : e.hasAccessToken ? "positive" : "warning", u = this.testing || this.dirty || (t ? !this.mockConnectionsEnabled : !e.projectId);
    return s`
      <uui-box class="connection-card">
        <details class="connection-shell">
          <summary class="connection-summary">
            <span class="summary-copy">
              <strong>${e.displayName || e.projectId || "New connection"}</strong>
              <span>${t ? "Mock scenario" : e.projectId || "Project ID required"} · ${l(this, r, k).call(this)}</span>
            </span>
            <span class="summary-state">
              <uui-tag color=${d}>${n}</uui-tag>
              <uui-icon name="icon-navigation-down" aria-hidden="true"></uui-icon>
            </span>
          </summary>

          <div class="connection-body">
            <section class="essentials" aria-labelledby=${`${e.key}-project-heading`}>
              <div class=${`essentials-header${this.status ? " has-status" : ""}`}>
                <div class="essentials-heading">
                  <h3 id=${`${e.key}-project-heading`}>${t ? "Mock data" : "Project"}</h3>
                </div>
                <div class="action-status" role=${this.status?.type === "error" ? "alert" : "status"} aria-live="polite">
                  ${this.status ? s`<span class=${this.status.type}><uui-icon name=${this.status.type === "success" ? "icon-check" : this.status.type === "error" ? "icon-alert" : "icon-info"}></uui-icon>${this.status.message}</span>` : ""}
                </div>
                <div class="connection-actions">
                  <uui-button
                    look="secondary"
                    label=${a}
                    title=${a}
                    .state=${this.testing ? "waiting" : void 0}
                    ?disabled=${u}
                    @click=${() => l(this, r, _).call(this, "test-connection")}>Test connection</uui-button>
                  <uui-button look="secondary" color="danger" label="Remove connection" @click=${() => l(this, r, _).call(this, "remove-connection")}>Remove</uui-button>
                </div>
              </div>
              ${t ? s`
                <p class="section-intro mock-description">${i?.description ?? "Deterministic analytics data."} This connection never contacts Vercel.</p>
              ` : s`
                <div class="fields two-columns">
                  ${l(this, r, q).call(this, "Vercel project ID", "projectId", e.projectId, void 0, this.errors.projectId)}
                  ${l(this, r, F).call(this, te(e), this.errors.team)}
                </div>
              `}
            </section>

            ${t ? "" : s`<details class="config-section token-section">
              <summary><span>Token override</span><small>${e.hasAccessTokenOverride ? "Configured on the server" : e.hasAccessToken ? "Using shared token" : "Optional"}</small></summary>
              <div class="config-content token-content">
                <p>
                  Optional. Set a connection-specific token only when this project cannot use the shared token.
                  <a href="https://vercel.com/account/settings/tokens" target="_blank" rel="noopener noreferrer" aria-label="Create a Vercel access token (opens in a new tab)">
                    Create a Vercel access token<uui-icon name="icon-out" aria-hidden="true"></uui-icon>
                  </a>
                </p>
                <div class="token-key"><code>VercelAnalytics__ConnectionAccessTokens__${e.key}</code><uui-button compact look="secondary" label="Copy access token setting name" @click=${l(this, r, P)}>${this._tokenCopied ? "Copied" : "Copy"}</uui-button></div>
              </div>
            </details>`}

            <details class="config-section">
              <summary><span>Page analytics</span><small>${l(this, r, k).call(this)}</small></summary>
              <div class="config-content mapping-content">
                <p class="section-intro">Optional. Select the Umbraco site roots that use this Vercel project. Leave empty for global analytics only.</p>
                <div class="fields">
                  <uui-form-layout-item>
                    <uui-label slot="label">Document roots</uui-label>
                    <umb-input-document .selection=${e.documentRootKeys} @change=${l(this, r, K)}></umb-input-document>
                    <span slot="description">Documents below a selected root use this connection for page analytics.</span>
                  </uui-form-layout-item>
                </div>
              </div>
            </details>

            <details class="config-section">
              <summary><span>Document workspace</span><small>${l(this, r, U).call(this)}</small></summary>
              <div class="config-content">
                <p class="section-intro">Choose which document types show an Analytics workspace tab. This does not affect the global dashboard.</p>
                <uui-toggle label="Show analytics on all document types" ?checked=${e.enableAllDocumentTypes} @change=${l(this, r, N)}>Show analytics on all document types</uui-toggle>
                ${e.enableAllDocumentTypes ? s`<p class="section-intro toggle-help">New document types are included automatically.</p>` : s`
                  <uui-form-layout-item class="document-types">
                    <uui-label slot="label">Selected document types</uui-label>
                    <umb-input-document-type documentTypesOnly .selection=${e.enabledDocumentTypeKeys} @change=${l(this, r, M)}></umb-input-document-type>
                  </uui-form-layout-item>
                `}
              </div>
            </details>
          </div>
        </details>
      </uui-box>
    `;
  }
};
r = /* @__PURE__ */ new WeakSet();
b = function(e) {
  this.dispatchEvent(new CustomEvent("connection-change", {
    detail: { ...this.connection, ...e },
    bubbles: !0,
    composed: !0
  }));
};
R = function(e, t) {
  l(this, r, b).call(this, { [e]: String(t.target.value ?? "") });
};
K = function(e) {
  l(this, r, b).call(this, { documentRootKeys: e.target.selection });
};
M = function(e) {
  l(this, r, b).call(this, { enabledDocumentTypeKeys: e.target.selection });
};
N = function(e) {
  l(this, r, b).call(this, { enableAllDocumentTypes: e.target.checked });
};
O = function(e) {
  l(this, r, b).call(this, ie(String(e.target.value ?? "")));
};
k = function() {
  const e = this.connection.documentRootKeys.length;
  return e ? `${e} document root${e === 1 ? "" : "s"}` : "Global analytics only";
};
U = function() {
  if (this.connection.enableAllDocumentTypes) return "All document types";
  const e = this.connection.enabledDocumentTypeKeys.length;
  return e ? `${e} selected document type${e === 1 ? "" : "s"}` : "No document workspace analytics";
};
P = async function() {
  await navigator.clipboard.writeText(`VercelAnalytics__ConnectionAccessTokens__${this.connection.key}`), this._tokenCopied = !0, window.setTimeout(() => {
    this._tokenCopied = !1;
  }, 2e3);
};
_ = function(e) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0 }));
};
q = function(e, t, i, a, n, d = "") {
  const u = `${this.connection.key}-${t}`, C = !0;
  return s`
      <uui-form-layout-item class=${d}>
        <uui-label slot="label" for=${u} ?required=${C}>${e}</uui-label>
        <div class="field-control">
          <uui-input id=${u} name=${t} label=${e} .value=${i} maxlength="200" ?required=${C} aria-invalid=${n ? "true" : "false"} aria-describedby=${n ? `${u}-error` : a ? `${u}-description` : ""} @input=${(Z) => l(this, r, R).call(this, t, Z)}></uui-input>
          ${n ? s`<span id=${`${u}-error`} class="field-error"><uui-icon name="icon-alert" aria-hidden="true"></uui-icon>${n}</span>` : a ? s`<span id=${`${u}-description`} class="field-description">${a}</span>` : ""}
        </div>
      </uui-form-layout-item>
    `;
};
F = function(e, t) {
  const i = `${this.connection.key}-team-reference`;
  return s`
      <uui-form-layout-item>
        <uui-label slot="label" for=${i}>Team ID or slug</uui-label>
        <div class="field-control">
          <uui-input
            id=${i}
            name="teamReference"
            label="Team ID or slug"
            .value=${e}
            maxlength="200"
            aria-invalid=${t ? "true" : "false"}
            aria-describedby=${`${i}-${t ? "error" : "description"}`}
            @input=${l(this, r, O)}></uui-input>
          <span id=${`${i}-${t ? "error" : "description"}`} class=${t ? "field-error" : "field-description"}>
            ${t ? s`<uui-icon name="icon-alert" aria-hidden="true"></uui-icon>${t}` : "Leave empty for a personal project."}
          </span>
        </div>
      </uui-form-layout-item>
    `;
};
m.styles = [j, T`
    :host { container-type: inline-size; display: block; }
    .connection-card { --uui-box-default-padding: 0; overflow: hidden; }
    details, summary { box-sizing: border-box; }
    summary { cursor: pointer; list-style: none; }
    summary::-webkit-details-marker { display: none; }
    .connection-summary { align-items: center; appearance: none; background: transparent; border: 0; color: inherit; cursor: pointer; display: flex; font: inherit; gap: var(--uui-size-space-5); inline-size: 100%; justify-content: space-between; min-block-size: 4rem; padding: var(--uui-size-space-4) var(--uui-size-space-5); text-align: start; }
    .connection-summary:hover { background: color-mix(in srgb, var(--uui-color-interactive) 3%, var(--uui-color-surface)); }
    .connection-summary:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: -2px; }
    .summary-copy { display: grid; gap: var(--uui-size-space-1); min-inline-size: 0; }
    .summary-copy strong { font-size: var(--uui-type-h5-size); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .summary-copy > span { color: var(--uui-color-text-alt); overflow-wrap: anywhere; }
    .summary-state { align-items: center; display: flex; flex: 0 0 auto; gap: var(--uui-size-space-3); }
    .connection-shell[open] .summary-state > uui-icon { transform: rotate(180deg); }
    .connection-body { border-top: 1px solid var(--uui-color-border); padding: 0 var(--uui-size-space-5) var(--uui-size-space-4); }
    .essentials { padding: var(--uui-size-space-4) 0 var(--uui-size-space-5); }
    .essentials-header { align-items: center; display: grid; gap: var(--uui-size-space-4); grid-template-areas: "heading status actions"; grid-template-columns: auto minmax(0, 1fr) auto; margin-block-end: var(--uui-size-space-4); }
    .essentials-heading { grid-area: heading; min-inline-size: 0; }
    .essentials-heading h3 { font-size: var(--uui-type-h5-size); margin: 0; }
    .connection-actions { align-items: center; display: flex; flex: 0 1 auto; flex-wrap: wrap; gap: var(--uui-size-space-3); grid-area: actions; justify-content: flex-end; }
    .action-status { grid-area: status; justify-self: end; min-inline-size: 0; }
    .action-status:empty { display: none; }
    .action-status span { align-items: center; display: flex; gap: var(--uui-size-space-2); max-inline-size: 48ch; overflow-wrap: anywhere; text-align: end; }
    .action-status .success { color: var(--uui-color-positive-standalone); }
    .action-status .error { color: var(--uui-color-danger-standalone); }
    .action-status .info { color: var(--uui-color-text-alt); }
    .section-intro { color: var(--uui-color-text-alt); margin: var(--uui-size-space-2) 0 var(--uui-size-space-4); max-inline-size: 70ch; }
    .fields { display: grid; gap: var(--uui-size-space-4); }
    .essentials .fields { column-gap: var(--uui-size-space-6); row-gap: var(--uui-size-space-4); }
    .fields > uui-form-layout-item { margin-block: 0; }
    .two-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .config-section { border-top: 1px solid var(--uui-color-border); }
    .config-section > summary { align-items: center; display: flex; gap: var(--uui-size-space-4); justify-content: space-between; padding: var(--uui-size-space-4) 0; }
    .config-section > summary::after { color: var(--uui-color-interactive); content: "+"; font-size: var(--uui-size-6); line-height: 1; margin-inline-start: var(--uui-size-space-2); }
    .config-section[open] > summary::after { content: "−"; }
    .config-section > summary:hover span { text-decoration: underline; }
    .config-section > summary:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .config-section > summary span { font-weight: 700; }
    .token-section > summary span { font-weight: 600; }
    .config-section > summary small { color: var(--uui-color-text-alt); font-size: var(--uui-type-small-size); font-weight: 400; margin-inline-start: auto; min-inline-size: 0; overflow-wrap: anywhere; text-align: end; }
    .config-content { padding: 0 0 var(--uui-size-space-5); }
    .config-content > uui-form-layout-item { margin-top: var(--uui-size-space-4); max-inline-size: 32rem; }
    .token-content p { margin-top: 0; }
    .token-content a { align-items: center; color: var(--uui-color-interactive); display: inline-flex; gap: var(--uui-size-space-1); margin-inline-start: var(--uui-size-space-1); }
    .token-content a uui-icon { font-size: 0.875em; }
    .token-key { align-items: center; background: var(--uui-color-surface-alt); display: flex; gap: var(--uui-size-space-3); justify-content: space-between; max-inline-size: 52rem; padding: var(--uui-size-space-3); }
    code { font-family: var(--uui-font-monospace); overflow-wrap: anywhere; }
    .mapping-content .fields { max-inline-size: 32rem; }
    .document-types { margin-top: var(--uui-size-space-4); }
    .toggle-help { margin-bottom: 0; }
    .field-control { display: grid; gap: var(--uui-size-space-2); }
    .field-description { color: var(--uui-color-text); font-size: var(--uui-type-small-size); }
    .field-error { align-items: center; color: var(--uui-color-danger-standalone); display: flex; gap: var(--uui-size-space-1); }
    uui-input { inline-size: 100%; }
    uui-input[aria-invalid="true"] { --uui-color-border: var(--uui-color-danger); }
    @container (max-width: 48rem) {
      .two-columns { grid-template-columns: 1fr; }
      .connection-summary { align-items: flex-start; }
      .summary-state { flex-wrap: wrap; justify-content: flex-end; }
      .essentials-header { grid-template-areas: "heading actions"; grid-template-columns: minmax(0, 1fr) auto; }
      .essentials-header.has-status { grid-template-areas: "heading actions" "status status"; }
      .action-status { justify-self: start; }
      .action-status span { text-align: start; }
    }
    @container (max-width: 34rem) {
      .connection-summary { align-items: stretch; flex-direction: column; }
      .essentials-header { align-items: stretch; grid-template-areas: "heading" "actions"; grid-template-columns: 1fr; }
      .essentials-header.has-status { grid-template-areas: "heading" "status" "actions"; }
      .summary-state { justify-content: flex-start; }
      .connection-actions { justify-content: flex-start; }
      .config-section > summary { align-items: flex-start; flex-wrap: wrap; }
      .config-section > summary small { margin-inline-start: 0; }
      .token-key { align-items: stretch; flex-direction: column; }
    }
  `];
y([
  v({ attribute: !1 })
], m.prototype, "connection", 2);
y([
  v({ attribute: !1 })
], m.prototype, "errors", 2);
y([
  v({ attribute: !1 })
], m.prototype, "status", 2);
y([
  v({ type: Boolean })
], m.prototype, "mockConnectionsEnabled", 2);
y([
  v({ type: Boolean })
], m.prototype, "dirty", 2);
y([
  v({ type: Boolean })
], m.prototype, "testing", 2);
y([
  h()
], m.prototype, "_tokenCopied", 2);
m = y([
  S("vercel-analytics-connection-editor")
], m);
var ue = Object.defineProperty, de = Object.getOwnPropertyDescriptor, B = (e) => {
  throw TypeError(e);
}, g = (e, t, i, a) => {
  for (var n = a > 1 ? void 0 : a ? de(t, i) : t, d = e.length - 1, u; d >= 0; d--)
    (u = e[d]) && (n = (a ? u(t, i, n) : u(n)) || n);
  return a && n && ue(t, i, n), n;
}, pe = (e, t, i) => t.has(e) || B("Cannot " + i), me = (e, t, i) => t.has(e) ? B("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), c = (e, t, i) => (pe(e, t, "access private method"), i), o, w, f, L, $, W, z, H, G, J, Q, X, Y;
let p = class extends D(A) {
  constructor() {
    super(...arguments), me(this, o), this._loading = !0, this._saving = !1, this._dirty = !1, this._showValidation = !1, this._connectionStatuses = {}, this._tokenKeyCopied = !1;
  }
  connectedCallback() {
    super.connectedCallback(), c(this, o, w).call(this);
  }
  render() {
    if (this._loading) return s`<uui-loader-bar aria-label="Loading analytics settings"></uui-loader-bar>`;
    if (!this._settings) return s`
      <umb-empty-state headline="Settings unavailable"><p>${this._status?.message}</p><uui-button look="secondary" label="Retry loading settings" @click=${c(this, o, w)}>Retry</uui-button></umb-empty-state>
    `;
    const e = this._settings.connections.length > 0, t = this._settings.canCreateMockConnections;
    return s`
      <form @submit=${c(this, o, Q)} novalidate>
        <header>
          <div class="page-heading"><h1>Vercel Analytics</h1><p>Connect Vercel projects and choose where page analytics appears.</p></div>
        </header>

        ${this._dirty ? s`
          <div class="save-bar" aria-label="Unsaved Vercel Analytics settings">
            <span class="unsaved-indicator" role="status" aria-live="polite">Unsaved changes</span>
            <uui-button type="submit" look="primary" label="Save Vercel Analytics settings" .state=${this._saving ? "waiting" : void 0} ?disabled=${this._saving}>Save settings</uui-button>
          </div>
        ` : ""}

        ${this._status ? s`<div class=${`status ${this._status.type}`} role=${this._status.type === "error" ? "alert" : "status"} aria-live="polite"><uui-icon name=${this._status.type === "success" ? "icon-check" : "icon-alert"}></uui-icon><span>${this._status.message}</span></div>` : ""}

        <uui-box headline="Defaults" class="general">
          <div class="general-grid">
            <uui-form-layout-item class="package-status">
              <uui-label slot="label">Package status</uui-label>
              <uui-toggle
                label="Enable Vercel Analytics"
                ?checked=${this._settings.enabled}
                @change=${(i) => c(this, o, f).call(this, { enabled: i.target.checked })}>
                Enable Vercel Analytics
              </uui-toggle>
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
                @input=${(i) => c(this, o, f).call(this, { defaultRangeDays: Number(i.target.value) })}></uui-input>
            </uui-form-layout-item>
            <uui-form-layout-item>
              <uui-label slot="label" for="cache-duration">Cache duration</uui-label>
              <div class="field-with-help">
                <uui-input
                  id="cache-duration"
                  label="Cache duration"
                  aria-describedby="cache-duration-help"
                  .value=${this._settings.cacheDuration}
                  @input=${(i) => c(this, o, f).call(this, { cacheDuration: String(i.target.value) })}></uui-input>
                <span id="cache-duration-help" class="field-help">Use <code>hh:mm:ss</code>, for example <code>00:05:00</code>.</span>
              </div>
            </uui-form-layout-item>
            <section class="shared-token" aria-labelledby="shared-token-heading">
              <div class="shared-token-copy">
                <div class="shared-token-summary">
                  <strong id="shared-token-heading">Access token</strong>
                  ${this._settings.hasAccessToken ? s`<span class="shared-token-status configured" title="Access token configured"><uui-icon name="icon-check" aria-hidden="true"></uui-icon><span class="visually-hidden">Configured</span></span>` : s`<uui-tag class="shared-token-status" color="warning">Not configured</uui-tag>`}
                </div>
                <p class="shared-token-help">Set this server environment variable to a Vercel access token.</p>
              </div>
              <div class="shared-token-actions">
                <a href="https://vercel.com/account/settings/tokens" target="_blank" rel="noopener noreferrer" aria-label="Create a Vercel access token (opens in a new tab)">Create token<uui-icon name="icon-out" aria-hidden="true"></uui-icon></a>
                <div class="shared-token-key">
                  <code>VercelAnalytics__AccessToken</code>
                  <uui-button compact look="secondary" label="Copy shared access token setting name" @click=${c(this, o, H)}>${this._tokenKeyCopied ? "Copied" : "Copy"}</uui-button>
                </div>
              </div>
            </section>
          </div>
        </uui-box>

        ${this._settings.canCreateMockConnections ? s`
          <uui-box headline="Development data" class="mock-settings">
            <p class="mock-intro">Create deterministic local connections to verify dashboard states without calling Vercel. Mock connections are only active while the server runs in Development.</p>
            <div class="mock-scenarios">
              ${E.map((i) => {
      const a = this._settings?.connections.some((n) => n.mockScenario === i.id) ?? !1;
      return s`
                  <div class="mock-scenario">
                    <span><strong>${i.name}</strong><small>${i.description}</small></span>
                    <uui-button
                      type="button"
                      look="secondary"
                      label=${a ? `${i.name} mock connection added` : `Add ${i.name} mock connection`}
                      ?disabled=${a}
                      @click=${() => c(this, o, W).call(this, i)}>${a ? "Added" : "Add mock"}</uui-button>
                  </div>
                `;
    })}
            </div>
          </uui-box>
        ` : ""}

        <section aria-labelledby="connections-heading">
          <div class="section-heading">
            <div><h2 id="connections-heading">Connections</h2><p>Add each Vercel project that editors should be able to view.</p></div>
            ${e ? s`
              <uui-button type="button" look="secondary" label="Add Vercel connection" @click=${c(this, o, $)}>Add connection</uui-button>
            ` : ""}
          </div>
          <div class="connections">
            ${this._settings.connections.map((i, a) => s`
              <vercel-analytics-connection-editor
                .connection=${i}
                .errors=${this._showValidation ? V(i) : {}}
                .status=${this._connectionStatuses[i.key]}
                ?mockConnectionsEnabled=${t}
                ?dirty=${this._dirty}
                ?testing=${this._testingKey === i.key}
                @connection-change=${(n) => c(this, o, L).call(this, a, n.detail)}
                @remove-connection=${() => c(this, o, G).call(this, a)}
                @test-connection=${() => c(this, o, J).call(this, i.key)}></vercel-analytics-connection-editor>
            `)}
            ${e ? "" : s`
              <div class="connection-empty-state">
                <uui-icon name="icon-globe" aria-hidden="true"></uui-icon>
                <div>
                  <h3>Connect your first Vercel project</h3>
                  <p>Add a Vercel project ID. The shared server-side access token above will be used automatically.</p>
                </div>
                <uui-button type="button" look="primary" label="Add your first Vercel connection" @click=${c(this, o, $)}>Add connection</uui-button>
              </div>
            `}
          </div>
        </section>

      </form>
    `;
  }
};
o = /* @__PURE__ */ new WeakSet();
w = async function() {
  this._loading = !0;
  const { data: e, error: t } = await x.settings();
  if (this._loading = !1, t || !e) {
    this._status = { type: "error", message: "Analytics settings could not be loaded. Administrator access is required." };
    return;
  }
  this._settings = e, this._dirty = !1, this._showValidation = !1, this._status = void 0;
};
f = function(e, t = !0) {
  this._settings && (this._settings = { ...this._settings, ...e }, t && (this._dirty = !0, this._status?.type === "success" && (this._status = void 0)));
};
L = function(e, t) {
  if (!this._settings) return;
  const i = this._settings.connections.map((a, n) => n === e ? t : a);
  c(this, o, f).call(this, { connections: i });
};
$ = function() {
  c(this, o, z).call(this, { kind: "vercel", hasAccessToken: this._settings?.hasAccessToken ?? !1 });
};
W = function(e) {
  c(this, o, z).call(this, { kind: "mock", scenario: e });
};
z = function(e) {
  if (!this._settings) return;
  const t = e.kind === "mock", a = {
    key: crypto.randomUUID(),
    displayName: t ? e.scenario.displayName : "",
    projectId: "",
    team: null,
    documentRootKeys: [],
    enableAllDocumentTypes: !1,
    enabledDocumentTypeKeys: [],
    hasAccessToken: t ? !1 : e.hasAccessToken,
    hasAccessTokenOverride: !1,
    mockScenario: t ? e.scenario.id : null
  }, n = [...this._settings.connections, a];
  c(this, o, f).call(this, { connections: n }), this.updateComplete.then(() => {
    const d = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
    this.shadowRoot?.querySelector("vercel-analytics-connection-editor:last-of-type")?.scrollIntoView({
      behavior: d ? "auto" : "smooth",
      block: "start"
    });
  });
};
H = async function() {
  await navigator.clipboard.writeText("VercelAnalytics__AccessToken"), this._tokenKeyCopied = !0, window.setTimeout(() => {
    this._tokenKeyCopied = !1;
  }, 2e3);
};
G = function(e) {
  if (!this._settings) return;
  const t = this._settings.connections[e];
  if (!window.confirm(`Remove “${t.displayName || t.projectId || "this connection"}”? This takes effect when settings are saved.`)) return;
  const i = this._settings.connections.filter((a, n) => n !== e);
  c(this, o, f).call(this, { connections: i });
};
J = async function(e) {
  if (this._dirty) {
    this._connectionStatuses = { ...this._connectionStatuses, [e]: { type: "error", message: "Save changes before testing this connection." } };
    return;
  }
  this._testingKey = e, this._connectionStatuses = { ...this._connectionStatuses, [e]: { type: "info", message: "Testing the saved connection…" } };
  const { data: t, error: i } = await x.testConnection({ path: { key: e } });
  this._testingKey = void 0, this._connectionStatuses = {
    ...this._connectionStatuses,
    [e]: i || !t ? { type: "error", message: "The connection test could not be completed." } : { type: t.success ? "success" : "error", message: t.message }
  };
};
Q = async function(e) {
  e?.preventDefault(), await c(this, o, X).call(this, "Vercel Analytics settings saved.");
};
X = async function(e) {
  if (!this._settings || this._saving) return !1;
  this._showValidation = !0;
  const t = ne(this._settings);
  if (t)
    return this._status = { type: "error", message: t }, await this.updateComplete, c(this, o, Y).call(this), !1;
  this._saving = !0, this._status = void 0;
  const i = ae(this._settings), { data: a, error: n } = await x.saveSettings({ body: i });
  return this._saving = !1, n || !a ? (this._status = { type: "error", message: "Settings were not saved. Check the connection fields and mapping values." }, !1) : (this._settings = a, this._dirty = !1, this._showValidation = !1, ee(a.enabled), e && (this._status = { type: "success", message: e }), !0);
};
Y = function() {
  const e = this.shadowRoot?.querySelectorAll("vercel-analytics-connection-editor") ?? [];
  for (const t of e)
    if (t.focusFirstInvalid()) return;
};
p.styles = [j, T`
    :host { --analytics-z-sticky-action: 10; display: block; }
    form { max-width: 76rem; margin-inline: auto; padding: var(--uui-size-layout-1); }
    header, .section-heading { display: flex; align-items: center; justify-content: space-between; gap: var(--uui-size-layout-1); }
    .page-heading, .section-heading > div { min-inline-size: 0; }
    .save-bar {
      align-items: center;
      background: var(--uui-color-surface);
      border: 1px solid var(--uui-color-border);
      display: flex;
      flex-wrap: wrap;
      gap: var(--uui-size-space-4);
      justify-content: flex-end;
      margin-block-start: var(--uui-size-space-5);
      padding: var(--uui-size-space-3) var(--uui-size-space-4);
      position: sticky;
      top: var(--uui-size-space-4);
      z-index: var(--analytics-z-sticky-action);
    }
    .unsaved-indicator { align-items: center; color: var(--uui-color-text-alt); display: inline-flex; font-size: var(--uui-type-small-size); gap: var(--uui-size-space-2); white-space: nowrap; }
    .unsaved-indicator::before { background: var(--uui-color-warning-standalone); border-radius: 50%; block-size: var(--uui-size-space-3); content: ""; flex: 0 0 auto; inline-size: var(--uui-size-space-3); }
    h1, h2 { margin: 0; }
    header p, .section-heading p { color: var(--uui-color-text-alt); margin-block: var(--uui-size-space-2) 0; text-wrap: pretty; }
    .status { align-items: flex-start; border: 1px solid var(--uui-color-border); display: flex; gap: var(--uui-size-space-2); margin-block: var(--uui-size-space-5); overflow-wrap: anywhere; padding: var(--uui-size-space-3) var(--uui-size-space-4); }
    .status.success { background: color-mix(in srgb, var(--uui-color-positive) 8%, var(--uui-color-surface)); border-color: color-mix(in srgb, var(--uui-color-positive) 35%, var(--uui-color-border)); }
    .status.error { background: color-mix(in srgb, var(--uui-color-danger) 7%, var(--uui-color-surface)); border-color: color-mix(in srgb, var(--uui-color-danger) 35%, var(--uui-color-border)); }
    .general { container-type: inline-size; margin-block: var(--uui-size-space-6) var(--uui-size-layout-2); }
    .mock-settings { margin-block-end: var(--uui-size-layout-2); }
    .mock-intro { color: var(--uui-color-text-alt); margin: 0 0 var(--uui-size-space-5); max-inline-size: 72ch; text-wrap: pretty; }
    .mock-scenarios { display: grid; gap: var(--uui-size-space-3); grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .mock-scenario { align-items: center; border: 1px solid var(--uui-color-border); display: grid; gap: var(--uui-size-space-4); grid-template-columns: minmax(0, 1fr) max-content; min-inline-size: 0; padding: var(--uui-size-space-4); }
    .mock-scenario > span { display: grid; gap: var(--uui-size-space-1); min-inline-size: 0; }
    .mock-scenario small { color: var(--uui-color-text-alt); text-wrap: pretty; }
    .mock-scenario uui-button { white-space: nowrap; }
    .general-grid { align-items: start; display: grid; gap: var(--uui-size-space-5) var(--uui-size-space-6); grid-template-columns: minmax(14rem, 1.35fr) minmax(10rem, 0.7fr) minmax(14rem, 1fr); }
    .general-grid > uui-form-layout-item { margin-block: 0; }
    .field-with-help { display: grid; gap: var(--uui-size-space-1); }
    .field-help { color: var(--uui-color-text-alt); font-size: var(--uui-type-small-size); }
    .package-status { min-inline-size: 0; }
    .shared-token { align-items: center; border-top: 1px solid var(--uui-color-border); display: flex; gap: var(--uui-size-space-5); grid-column: 1 / -1; justify-content: space-between; min-inline-size: 0; padding-block-start: var(--uui-size-space-4); }
    .shared-token-copy { display: grid; gap: var(--uui-size-space-1); min-inline-size: 0; }
    .shared-token-summary, .shared-token-actions { align-items: center; display: flex; flex-wrap: wrap; }
    .shared-token-summary { gap: var(--uui-size-space-2); }
    .shared-token-help { color: var(--uui-color-text-alt); margin: 0; max-inline-size: 48ch; text-wrap: pretty; }
    .shared-token-status.configured { align-items: center; color: var(--uui-color-positive); display: inline-flex; font-size: 1.125rem; }
    .shared-token-actions { gap: var(--uui-size-space-3); justify-content: flex-end; min-inline-size: 0; }
    .shared-token-key { align-items: center; background: var(--uui-color-surface-alt); display: flex; gap: var(--uui-size-space-2); max-inline-size: 100%; padding: var(--uui-size-space-2) var(--uui-size-space-3); }
    .shared-token-key code { min-inline-size: 0; overflow-wrap: anywhere; }
    .shared-token-actions > a { align-items: center; color: var(--uui-color-interactive); display: inline-flex; gap: var(--uui-size-space-1); white-space: nowrap; }
    .shared-token-actions > a uui-icon { font-size: 0.875em; }
    .visually-hidden { block-size: 1px; clip: rect(0 0 0 0); clip-path: inset(50%); inline-size: 1px; overflow: hidden; position: absolute; white-space: nowrap; }
    .section-heading { margin-bottom: var(--uui-size-space-4); }
    .connections { display: grid; gap: var(--uui-size-layout-1); }
    .connection-empty-state {
      align-items: center;
      background: color-mix(in srgb, var(--uui-color-interactive) 5%, var(--uui-color-surface));
      border: 1px solid color-mix(in srgb, var(--uui-color-interactive) 22%, var(--uui-color-border));
      display: grid;
      gap: var(--uui-size-space-4);
      grid-template-columns: auto minmax(0, 1fr) auto;
      padding: var(--uui-size-layout-1);
    }
    .connection-empty-state > uui-icon { color: var(--uui-color-interactive); font-size: var(--uui-size-8); }
    .connection-empty-state h3 { font-size: var(--uui-type-h5-size); margin: 0; text-wrap: balance; }
    .connection-empty-state p { color: var(--uui-color-text-alt); margin: var(--uui-size-space-1) 0 0; max-width: 65ch; text-wrap: pretty; }
    code { font-family: var(--uui-font-monospace); }
    @container (max-width: 52rem) {
      .general-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .package-status { grid-column: 1 / -1; }
    }
    @container (max-width: 34rem) {
      .general-grid { grid-template-columns: 1fr; }
      .package-status { grid-column: auto; }
      .shared-token { align-items: flex-start; flex-direction: column; grid-column: auto; gap: var(--uui-size-space-3); }
      .shared-token-actions { align-items: flex-start; flex-direction: column; inline-size: 100%; }
      .shared-token-key { justify-content: space-between; }
    }
    @media (max-width: 800px) {
      header, .section-heading { align-items: stretch; flex-direction: column; }
      .mock-scenarios { grid-template-columns: 1fr; }
      .save-bar { top: var(--uui-size-space-2); }
      .connection-empty-state { align-items: start; grid-template-columns: auto minmax(0, 1fr); }
      .connection-empty-state uui-button { grid-column: 1 / -1; justify-self: start; }
    }
    @media (forced-colors: active) {
      .unsaved-indicator::before { background: Highlight; }
    }
  `];
g([
  h()
], p.prototype, "_settings", 2);
g([
  h()
], p.prototype, "_loading", 2);
g([
  h()
], p.prototype, "_saving", 2);
g([
  h()
], p.prototype, "_dirty", 2);
g([
  h()
], p.prototype, "_showValidation", 2);
g([
  h()
], p.prototype, "_testingKey", 2);
g([
  h()
], p.prototype, "_status", 2);
g([
  h()
], p.prototype, "_connectionStatuses", 2);
g([
  h()
], p.prototype, "_tokenKeyCopied", 2);
p = g([
  S("vercel-analytics-settings-dashboard")
], p);
const ke = p;
export {
  p as VercelAnalyticsSettingsDashboardElement,
  ke as default
};
//# sourceMappingURL=settings-dashboard.element-B7yu7vO2.js.map
