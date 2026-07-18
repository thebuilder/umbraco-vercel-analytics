import { css as ut, LitElement as ht, html as v, property as _, state as Dt, customElement as dt } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as ft } from "@umbraco-cms/backoffice/element-api";
import { U as Ft } from "./sdk.gen-Cl3izvwW.js";
import { UmbTextStyles as Lt } from "@umbraco-cms/backoffice/style";
const Ca = /^[A-Z]{2}$/;
function ii(e) {
  const t = e.trim().toUpperCase();
  return Ca.test(t) ? t : void 0;
}
function Po(e, t = "en") {
  const i = ii(e);
  if (!i) return e || "Unknown";
  if (typeof Intl.DisplayNames != "function") return i;
  try {
    return new Intl.DisplayNames(t, { type: "region" }).of(i) ?? i;
  } catch {
    return i;
  }
}
function Ma(e) {
  const t = ii(e);
  return t ? `https://flag.vercel.app/s/${t}.svg` : void 0;
}
function za(e, t = "en") {
  const i = e.trim(), s = ii(i);
  if (s || !i || typeof Intl.DisplayNames != "function") return s ?? i;
  const n = new Intl.DisplayNames(t, { type: "region" }), o = i.toLocaleLowerCase();
  for (let r = 65; r <= 90; r++)
    for (let a = 65; a <= 90; a++) {
      const l = String.fromCharCode(r, a), c = n.of(l);
      if (c !== l && c?.toLocaleLowerCase() === o) return l;
    }
  return i;
}
const Eo = {
  connections: (e) => Ft.connections(e),
  documentRoutes: (e) => Ft.documentRoutes(e),
  summary: (e) => Ft.summary(e),
  events: (e) => Ft.events(e),
  flags: (e) => Ft.flags(e),
  breakdown: (e) => Ft.breakdown(e),
  eventDetails: (e) => Ft.eventDetails(e),
  eventPropertyValues: (e) => Ft.eventPropertyValues(e)
};
function Ta(e, t) {
  return t ? e.find((i) => i.culture.toLocaleLowerCase() === t.toLocaleLowerCase()) : e.find((i) => i.isCurrent) ?? e[0];
}
function Df(e, t) {
  const i = e?.trim();
  return i && i.toLocaleLowerCase() !== "invariant" ? i : t?.trim() || void 0;
}
const Pa = [
  { dimension: "DeviceType", headline: "Devices", label: "Devices" },
  { dimension: "BrowserName", headline: "Browsers", label: "Browsers" }
], Oo = [
  { dimension: "UtmSource", headline: "UTM sources", label: "Source" },
  { dimension: "UtmMedium", headline: "UTM media", label: "Medium" },
  { dimension: "UtmCampaign", headline: "UTM campaigns", label: "Campaign" },
  { dimension: "UtmTerm", headline: "UTM terms", label: "Term" },
  { dimension: "UtmContent", headline: "UTM content", label: "Content" }
], Ea = [
  { kind: "breakdown", dimension: "ReferrerHostname", headline: "Referrers", span: "wide" },
  { kind: "breakdown", dimension: "Country", headline: "Countries", span: "normal" },
  { kind: "tabbed-breakdown", id: "audience", options: Pa, span: "normal", planLimited: !1 },
  { kind: "breakdown", dimension: "OsName", headline: "Operating systems", span: "normal" }
], Oa = {
  kind: "tabbed-breakdown",
  id: "utm",
  options: Oo,
  span: "wide",
  planLimited: !0
};
function on(e, t) {
  const i = [
    ...e ? [] : [{ kind: "breakdown", dimension: "RequestPath", headline: "Pages", span: "wide" }],
    ...Ea
  ];
  return t !== "unavailable" && i.push(Oa), i;
}
function Aa(e) {
  return e.flatMap((t) => t.kind === "breakdown" ? [t.dimension] : t.options.map(({ dimension: i }) => i));
}
function hs(e, t, i) {
  if (e.kind === "breakdown")
    return { dimension: e.dimension, headline: e.headline, label: e.headline };
  const s = e.id === "audience" ? t : i;
  return e.options.find(({ dimension: n }) => n === s) ?? e.options[0];
}
const zs = 864e5, rn = /^\d{4}-\d{2}-\d{2}$/, Bi = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", ds = (e) => e.toISOString().slice(0, 10);
function Ve(e, t = /* @__PURE__ */ new Date(), i = Bi()) {
  const s = new Date(t);
  return {
    from: new Date(s.valueOf() - e * zs).toISOString(),
    to: s.toISOString(),
    interval: Ao(e),
    timeZone: i
  };
}
function Ao(e) {
  return e <= 7 ? "Hour" : e <= 90 ? "Day" : e <= 365 ? "Week" : "Month";
}
function La(e) {
  const t = Date.parse(e.from), i = Date.parse(e.to);
  return Math.max(1, Math.ceil((i - t) / zs));
}
function Ts(e, t, i = Bi()) {
  const s = rn.test(e) ? cn(e, i) : ln(e), n = rn.test(t) ? cn(t, i) : ln(t);
  if (!s || !n || Date.parse(s) >= Date.parse(n)) return;
  const o = Math.max(1, Math.ceil((Date.parse(n) - Date.parse(s)) / zs));
  return { from: s, to: n, interval: Ao(o), timeZone: i };
}
function re(e, t) {
  const i = new Date(e);
  if (Number.isNaN(i.valueOf())) return "";
  const s = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: t
  }).formatToParts(i), n = (o) => s.find((r) => r.type === o)?.value ?? "";
  return `${n("year")}-${n("month")}-${n("day")}`;
}
function Ra(e, t = /* @__PURE__ */ new Date()) {
  const i = /* @__PURE__ */ new Date(`${e}T00:00:00Z`);
  if (Number.isNaN(i.valueOf())) return [];
  const s = new Date(Date.UTC(i.getUTCFullYear(), i.getUTCMonth(), 1)), n = (s.getUTCDay() + 6) % 7, o = new Date(s);
  o.setUTCDate(o.getUTCDate() - n);
  const r = ds(new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())));
  return Array.from({ length: 42 }, (a, l) => {
    const c = new Date(o);
    c.setUTCDate(o.getUTCDate() + l);
    const u = ds(c);
    return {
      date: u,
      day: c.getUTCDate(),
      outsideMonth: c.getUTCMonth() !== s.getUTCMonth(),
      today: u === r
    };
  });
}
function an(e, t) {
  const i = /* @__PURE__ */ new Date(`${e}T00:00:00Z`);
  return Number.isNaN(i.valueOf()) ? e : (i.setUTCDate(1), i.setUTCMonth(i.getUTCMonth() + t), ds(i));
}
function Fa(e, t, i) {
  if (t === 1) return "Last 24 hours";
  if (t !== "custom") return `Last ${t === 365 ? "12 months" : `${t} days`}`;
  const s = new Date(e.from), n = new Date(e.to);
  if (Number.isNaN(s.valueOf()) || Number.isNaN(n.valueOf())) return "Custom range";
  const o = re(e.from, e.timeZone), r = re(e.to, e.timeZone), a = o.slice(0, 4) === r.slice(0, 4), l = a && o.slice(0, 7) === r.slice(0, 7), c = new Intl.DateTimeFormat(i, { month: "short", day: "numeric", timeZone: e.timeZone }), u = new Intl.DateTimeFormat(i, { month: "short", day: "numeric", year: "numeric", timeZone: e.timeZone });
  return l ? `${new Intl.DateTimeFormat(i, { month: "short", timeZone: e.timeZone }).format(s)} ${Number(o.slice(8))} – ${Number(r.slice(8))}` : a ? `${c.format(s)} – ${c.format(n)}` : `${u.format(s)} – ${u.format(n)}`;
}
function Lo(e, t, i, s = Bi()) {
  const n = new Date(e);
  if (t === "Month") {
    const o = new Intl.DateTimeFormat(i, { month: "short", timeZone: s }).format(n), r = new Intl.DateTimeFormat("en", { year: "2-digit", timeZone: s }).format(n);
    return `${o} ’${r}`;
  }
  return t === "Hour" ? new Intl.DateTimeFormat(i, { hour: "numeric", minute: "2-digit", timeZone: s }).format(n) : new Intl.DateTimeFormat(i, { month: "short", day: "numeric", timeZone: s }).format(n);
}
function Ia(e, t, i, s = Bi()) {
  const n = new Date(e);
  if (t === "Hour")
    return new Intl.DateTimeFormat(i, {
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone: s
    }).format(n);
  const o = Lo(e, t, i, s);
  if (t !== "Day") return o;
  const r = new Intl.DateTimeFormat(i, { weekday: "short", timeZone: s }).format(n);
  return `${o} · ${r}`;
}
function Ro(e, t, i = /* @__PURE__ */ new Date()) {
  const s = new Date(e);
  if (Number.isNaN(s.valueOf())) return !1;
  const n = new Date(s);
  return t === "Month" ? n.setUTCMonth(n.getUTCMonth() + 1) : t === "Week" ? n.setUTCDate(n.getUTCDate() + 7) : t === "Day" ? n.setUTCDate(n.getUTCDate() + 1) : n.setUTCHours(n.getUTCHours() + 1), s <= i && i < n;
}
function ln(e) {
  const t = new Date(e);
  return e && !Number.isNaN(t.valueOf()) ? t.toISOString() : void 0;
}
function cn(e, t) {
  const i = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!i) return;
  const s = Date.UTC(Number(i[1]), Number(i[2]) - 1, Number(i[3]));
  let n = s;
  for (let r = 0; r < 3; r++) {
    const a = Na(new Date(n), t), l = s - a;
    if (l === n) break;
    n = l;
  }
  const o = new Date(n);
  return re(o.toISOString(), t) === e ? o.toISOString() : void 0;
}
function Na(e, t) {
  const i = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone: t
  }).formatToParts(e), s = (o) => Number(i.find((r) => r.type === o)?.value ?? 0);
  return Date.UTC(s("year"), s("month") - 1, s("day"), s("hour"), s("minute"), s("second")) - Math.floor(e.valueOf() / 1e3) * 1e3;
}
const Ba = /* @__PURE__ */ new Set([
  "RequestPath",
  "Route",
  "ReferrerHostname",
  "Country",
  "DeviceType",
  "BrowserName",
  "OsName",
  "UtmSource",
  "UtmMedium",
  "UtmCampaign",
  "UtmTerm",
  "UtmContent",
  "EventName"
]), Va = /* @__PURE__ */ new Set([1, 7, 30, 90, 365]);
function Fo(e) {
  return `${e.dimension}:${e.value}`;
}
function Ua(e) {
  const t = e.get("range"), i = Number(t), s = t === "custom" ? "custom" : Va.has(i) ? i : void 0, n = Ts(
    e.get("from") ?? "",
    e.get("to") ?? "",
    e.get("tz") || void 0
  ), o = [], r = /* @__PURE__ */ new Set();
  for (const a of e.getAll("filter").slice(0, 10)) {
    const l = a.indexOf(":"), c = a.slice(0, l), u = a.slice(l + 1).trim();
    l <= 0 || !Ba.has(c) || !u || u.length > 500 || /[\u0000-\u001f\u007f]/.test(u) || r.has(c) || (r.add(c), o.push({ dimension: c, value: u }));
  }
  return {
    connection: e.get("connection") || void 0,
    preset: s,
    range: n,
    metric: e.get("metric") === "pageViews" ? "pageViews" : "visitors",
    audience: e.get("audience") === "BrowserName" ? "BrowserName" : "DeviceType",
    utm: Wa(e.get("utm")),
    filters: o
  };
}
function Wa(e) {
  return e === "UtmMedium" || e === "UtmCampaign" || e === "UtmTerm" || e === "UtmContent" ? e : "UtmSource";
}
function Ha(e, t) {
  const i = e.searchParams;
  for (const s of ["connection", "range", "from", "to", "tz", "metric", "audience", "utm", "filter"]) i.delete(s);
  return t.connection && i.set("connection", t.connection), i.set("range", String(t.preset)), i.set("from", t.range.from), i.set("to", t.range.to), i.set("tz", t.range.timeZone), i.set("metric", t.metric), i.set("audience", t.audience), i.set("utm", t.utm), t.filters.forEach((s) => i.append("filter", Fo(s))), e;
}
function gt(e) {
  const t = typeof e == "object" && e !== null ? e : void 0, i = typeof t?.code == "string" ? t.code : void 0, s = t?.status === void 0 ? void 0 : Number(t.status);
  switch (i) {
    case "invalid_credentials":
      return "Check that the Vercel access token can read Web Analytics for this project.";
    case "plan_limit":
      return "This report is outside the reporting window or is unavailable on the current Vercel plan.";
    case "invalid_query":
      return "This query or reporting dimension is not supported by Vercel.";
    case "upstream_timeout":
      return "Vercel Analytics did not respond in time. Try again.";
    case "upstream_transport":
    case "invalid_upstream_payload":
    case "upstream_unavailable":
      return "Vercel Analytics is temporarily unavailable. Try again.";
  }
  switch (s) {
    case 400:
      return "This query or reporting dimension is not supported by Vercel.";
    case 401:
    case 403:
      return "Check that the Vercel access token can read Web Analytics for this project.";
    case 402:
      return "This report is outside the reporting window or is unavailable on the current Vercel plan.";
    default:
      return "Analytics could not be loaded. Try again, or check the connection configuration.";
  }
}
class Oe {
  #s = 0;
  #e;
  get signal() {
    return this.#e?.signal;
  }
  async run(t) {
    this.#e?.abort();
    const i = ++this.#s, s = new AbortController();
    this.#e = s;
    try {
      const n = await t(s.signal);
      return i !== this.#s ? { status: "stale" } : s.signal.aborted ? { status: "cancelled" } : { status: "success", value: n };
    } catch (n) {
      return i !== this.#s ? { status: "stale" } : s.signal.aborted ? { status: "cancelled" } : { status: "error", error: n };
    }
  }
  cancel() {
    this.#e?.abort(), this.#e = void 0;
  }
}
class Gi {
  #s = new Oe();
  #e;
  #i;
  #n;
  constructor(t = 300) {
    this.#e = t;
  }
  run(t) {
    return this.cancelScheduled(), this.#s.run(t);
  }
  schedule(t) {
    return this.cancel(), new Promise((i) => {
      this.#n = () => i({ status: "cancelled" }), this.#i = globalThis.setTimeout(() => {
        this.#i = void 0, this.#n = void 0, this.#s.run(t).then(i);
      }, this.#e);
    });
  }
  cancel() {
    this.cancelScheduled(), this.#s.cancel();
  }
  cancelScheduled() {
    this.#i !== void 0 && globalThis.clearTimeout(this.#i), this.#i = void 0, this.#n?.(), this.#n = void 0;
  }
}
async function ui(e) {
  try {
    return { status: "success", value: await e };
  } catch (t) {
    return { status: "error", error: t };
  }
}
const ja = /* @__PURE__ */ new Set([
  "UtmSource",
  "UtmMedium",
  "UtmCampaign",
  "UtmTerm",
  "UtmContent"
]);
function qa(e) {
  return ja.has(e);
}
function Ya(e, t, i) {
  return t ? "available" : e && i.includes(402) ? "unavailable" : "unknown";
}
async function Ka(e, t, i, s, n, o = Eo) {
  let r = !1, a = !1;
  const l = [], c = (g) => {
    s.aborted || n(g);
  }, u = ui(o.summary({ query: e, signal: s })).then((g) => {
    const p = hi(g);
    p.status === "success" && (r = !0), c({ panel: "summary", ...p });
  }), h = ui(o.events({ query: { ...t, limit: 20 }, signal: s })).then((g) => {
    c({ panel: "events", ...hi(g) });
  }), d = ui(o.flags({ query: { ...e, limit: 10 }, signal: s })).then((g) => {
    c({ panel: "flags", ...hi(g) });
  }), f = i.map((g) => ui(o.breakdown({
    path: { dimension: g },
    query: { ...e, limit: 11 },
    signal: s
  })).then((p) => {
    const m = hi(p);
    qa(g) ? m.status === "success" ? a = !0 : p.status === "success" && p.value.error && l.push(p.value.response.status) : m.status === "success" && (r = !0), c({ panel: "breakdown", dimension: g, ...m });
  }));
  return await Promise.all([u, h, d, ...f]), { baselineSucceeded: r, utmSucceeded: a, utmStatuses: l };
}
function hi(e) {
  if (e.status === "error") return { status: "error", error: gt(e.error) };
  const { data: t, error: i, response: s } = e.value;
  return i ? { status: "error", error: gt(Xa(i, s.status)) } : t == null ? { status: "error", error: "Analytics returned an empty response." } : { status: "success", data: t };
}
function Xa(e, t) {
  return typeof e == "object" && e !== null ? { ...e, status: t } : { status: t };
}
function Ps(e) {
  return e.filter(({ eventName: t }) => {
    const i = t.trim().toLocaleLowerCase();
    return i.length > 0 && i !== "others";
  });
}
function Za(e, t = 10) {
  return Ps(e).slice(0, t);
}
const De = () => ({ status: "idle" });
function Z(e) {
  const t = e && "data" in e ? e.data : e && "previous" in e ? e.previous : void 0;
  return t === void 0 ? { status: "loading" } : { status: "loading", previous: t };
}
const Ct = (e) => ({ status: "success", data: e });
function H(e, t) {
  const i = t && "data" in t ? t.data : t && "previous" in t ? t.previous : void 0;
  return i === void 0 ? { status: "error", message: e } : { status: "error", message: e, previous: i };
}
function it(e) {
  return "data" in e ? e.data : "previous" in e ? e.previous : void 0;
}
const Ga = () => ({
  currentUrl: () => new URL(window.location.href),
  replaceUrl: (e) => window.history.replaceState(window.history.state, "", e),
  getStoredConnection: () => localStorage.getItem("umbraco-vercel-analytics:connection"),
  setStoredConnection: (e) => localStorage.setItem("umbraco-vercel-analytics:connection", e),
  languages: navigator.languages
});
class Qa {
  constructor(t, i = Eo, s = Ga()) {
    this.state = {
      connections: [],
      range: Ve(30),
      preset: 30,
      summary: Z(),
      breakdowns: {},
      events: Z(),
      flags: Z(),
      metric: "visitors",
      audienceDimension: "DeviceType",
      utmDimension: "UtmSource",
      filters: [],
      utmCapability: "unknown"
    }, this.#n = new Oe(), this.#p = new Oe(), this.#a = new Gi(), this.#l = new Gi(), this.#h = new Oe(), this.#d = new Oe(), this.#r = new Gi(), this.#m = /* @__PURE__ */ new Map(), this.#v = !1, this.#g = !1, this.#s = t, this.#e = i, this.#i = s;
  }
  #s;
  #e;
  #i;
  #n;
  #p;
  #a;
  #l;
  #h;
  #d;
  #r;
  #m;
  #c;
  #b;
  #y;
  #v;
  #g;
  connect(t, i) {
    this.#v || (this.#M(), this.#v = !0), this.setScope(t, i);
  }
  setScope(t, i) {
    const s = t ? `${t}:${i ?? ""}` : "global";
    s !== this.#y && (this.#y = s, this.#c = t, this.#b = i, this.#n.cancel(), this.#p.cancel(), this.#a.cancel(), this.#l.cancel(), this.#h.cancel(), this.#d.cancel(), this.#r.cancel(), this.#t({
      route: void 0,
      configurationError: void 0,
      summary: Z(),
      breakdowns: {},
      events: Z(),
      flags: Z(),
      selectedFlag: void 0,
      utmCapability: "unknown",
      expandedBreakdown: void 0,
      expandedEvents: void 0,
      selectedEvent: void 0
    }), this.#S());
  }
  disconnect() {
    this.#n.cancel(), this.#p.cancel(), this.#a.cancel(), this.#l.cancel(), this.#h.cancel(), this.#d.cancel(), this.#r.cancel();
  }
  cards() {
    return on(!!this.#c, this.state.utmCapability);
  }
  linkBaseUrl() {
    if (this.state.route?.url)
      try {
        return new URL(this.state.route.url).origin;
      } catch {
        return `https://${this.state.route.hostname}`;
      }
    return this.state.connections.find(({ key: i }) => i === this.state.connection)?.baseUrl ?? void 0;
  }
  async loadReports() {
    const t = this.state.connection;
    if (!t) return;
    this.#z();
    const i = this.#m.get(t) ?? "unknown", s = Aa(on(!!this.#c, i));
    this.#t({
      utmCapability: i,
      summary: Z(this.state.summary),
      events: Z(this.state.events),
      flags: Z(this.state.flags),
      breakdowns: Object.fromEntries(s.map((l) => [l, Z(this.state.breakdowns[l])]))
    });
    const n = this.#u(t, this.#f()), o = this.#u(t, this.#k()), r = await this.#p.run((l) => Ka(
      n,
      o,
      s,
      l,
      (c) => this.#$(c),
      this.#e
    ));
    if (r.status !== "success") {
      r.status === "error" && this.#D(gt(r.error), s);
      return;
    }
    const a = Ya(
      r.value.baselineSucceeded,
      r.value.utmSucceeded,
      r.value.utmStatuses
    );
    a !== "unknown" && (this.#m.set(t, a), this.#t({ utmCapability: a }));
  }
  setConnection(t) {
    this.#i.setStoredConnection(t), this.#t({ connection: t }), this.#o(), this.loadReports();
  }
  setDateRange(t, i) {
    this.#t({ preset: t, range: i }), this.#o(), this.loadReports();
  }
  setMetric(t) {
    this.#t({ metric: t }), this.#o();
  }
  setAudienceDimension(t) {
    this.#t({ audienceDimension: t }), this.#o();
  }
  setUtmDimension(t) {
    this.#t({ utmDimension: t }), this.#o();
  }
  toggleFilter(t, i) {
    if (!t || !i) return;
    const n = this.state.filters.some((o) => o.dimension === t && o.value === i) ? this.state.filters.filter((o) => o.dimension !== t) : [...this.state.filters.filter((o) => o.dimension !== t), { dimension: t, value: i }];
    this.#t({ filters: n }), this.#o(), this.loadReports();
  }
  removeFilter(t) {
    this.#t({ filters: this.state.filters.filter((i) => i.dimension !== t) }), this.#o(), this.loadReports();
  }
  clearFilters() {
    this.#t({ filters: [] }), this.#o(), this.loadReports();
  }
  async openBreakdown(t, i, s = "", n = !1) {
    const o = this.state.connection;
    if (!o) return;
    const r = this.state.expandedBreakdown?.dimension === t ? this.state.expandedBreakdown.report : void 0;
    this.#t({ expandedBreakdown: { dimension: t, headline: i, report: Z(r) } });
    const a = (d) => this.#e.breakdown({
      path: { dimension: t },
      query: { ...this.#u(o, this.#f()), limit: 100, search: s || void 0 },
      signal: d
    }), l = await (n ? this.#a.schedule(a) : this.#a.run(a));
    if (l.status === "cancelled" || l.status === "stale" || this.state.expandedBreakdown?.dimension !== t) return;
    if (l.status === "error") {
      this.#t({ expandedBreakdown: { dimension: t, headline: i, report: H(gt(l.error), r) } });
      return;
    }
    const { data: c, error: u, response: h } = l.value;
    this.#t({ expandedBreakdown: { dimension: t, headline: i, report: u ? H(Ce(u, h.status), r) : Ct(c?.rows ?? []) } });
  }
  searchBreakdown(t) {
    const i = this.state.expandedBreakdown;
    if (!i) return;
    const s = i.dimension === "Country" ? za(t, this.#i.languages) : t;
    this.openBreakdown(i.dimension, i.headline, s, !0);
  }
  closeBreakdown() {
    this.#a.cancel(), this.#t({ expandedBreakdown: void 0 });
  }
  async openEvents(t = "", i = !1) {
    const s = this.state.connection;
    if (!s) return;
    const n = this.state.expandedEvents;
    this.#t({ expandedEvents: Z(n) });
    const o = (u) => this.#e.events({
      query: { ...this.#u(s, this.#k()), limit: 100, search: t || void 0 },
      signal: u
    }), r = await (i ? this.#l.schedule(o) : this.#l.run(o));
    if (r.status === "cancelled" || r.status === "stale" || !this.state.expandedEvents) return;
    if (r.status === "error") {
      this.#t({ expandedEvents: H(gt(r.error), n) });
      return;
    }
    const { data: a, error: l, response: c } = r.value;
    this.#t({ expandedEvents: l ? H(Ce(l, c.status), n) : Ct(Ps(a?.rows ?? [])) });
  }
  closeEvents() {
    this.#l.cancel(), this.#t({ expandedEvents: void 0 });
  }
  async selectFlag(t) {
    const i = this.state.connection;
    if (!i) return;
    const s = this.state.selectedFlag;
    this.#t({ selectedFlag: Z(s) });
    const n = await this.#d.run((l) => this.#e.flags({
      query: { ...this.#u(i, this.#f()), flagKey: t, limit: 100 },
      signal: l
    }));
    if (n.status === "cancelled" || n.status === "stale") return;
    if (n.status === "error") {
      this.#t({ selectedFlag: H(gt(n.error), s) });
      return;
    }
    const { data: o, error: r, response: a } = n.value;
    this.#t({ selectedFlag: r || !o ? H(Ce(r, a.status), s) : Ct(o) });
  }
  clearSelectedFlag() {
    this.#d.cancel(), this.#t({ selectedFlag: void 0 });
  }
  async selectEvent(t) {
    this.closeEvents(), await this.#_(t);
  }
  toggleEventPropertyFilter(t, i) {
    const s = this.state.selectedEvent;
    if (!s) return;
    const n = s.eventProperty === t && s.eventValue === i;
    this.#_(s.eventName, n ? void 0 : t, n ? void 0 : i);
  }
  searchEventProperty(t, i) {
    this.state.selectedEvent && this.#x(t, i.trim(), !0);
  }
  closeEventDetails() {
    this.#r.cancel(), this.#h.cancel(), this.#t({ selectedEvent: void 0 });
  }
  #t(t) {
    this.state = { ...this.state, ...t }, this.#s();
  }
  async #S() {
    if (this.#t({ configurationError: void 0 }), this.#c) {
      const t = this.#c, i = await this.#n.run((r) => this.#e.documentRoutes({
        path: { documentId: t },
        query: { culture: this.#b },
        signal: r
      }));
      if (i.status === "cancelled" || i.status === "stale") return;
      if (i.status === "error") {
        this.#t({ configurationError: gt(i.error), summary: De() });
        return;
      }
      const { data: s, error: n } = i.value, o = !n && s?.length ? Ta(s, this.#b) : void 0;
      if (!o) {
        this.#t({ configurationError: "This document is unpublished, unmapped, or its active culture is not configured for analytics.", summary: De() });
        return;
      }
      this.#t({ route: o, connection: o.connection });
    } else {
      const t = await this.#n.run((c) => this.#e.connections({ signal: c }));
      if (t.status === "cancelled" || t.status === "stale") return;
      if (t.status === "error") {
        this.#t({ configurationError: gt(t.error), summary: De() });
        return;
      }
      const { data: i, error: s } = t.value;
      if (s || !i?.enabled) {
        this.#t({ configurationError: "Vercel Analytics is disabled or unavailable. Ask an administrator to configure a connection.", summary: De() });
        return;
      }
      let { preset: n, range: o } = this.state;
      this.#g || (n = [1, 7, 30, 90, 365].includes(i.defaultRangeDays) ? i.defaultRangeDays : "custom", o = Ve(i.defaultRangeDays));
      const r = this.#i.getStoredConnection(), a = i.connections.some(({ key: c }) => c === this.state.connection) ? this.state.connection : void 0, l = i.connections.some(({ key: c }) => c === r) ? r ?? void 0 : void 0;
      this.#t({
        connections: i.connections,
        connection: a ?? l ?? i.connections[0]?.key,
        preset: n,
        range: o
      });
    }
    this.#o(), await this.loadReports();
  }
  #$(t) {
    if (t.panel === "summary")
      this.#t({ summary: t.status === "error" ? H(t.error, this.state.summary) : Ct(t.data) });
    else if (t.panel === "events")
      this.#t({ events: t.status === "error" ? H(t.error, this.state.events) : Ct(t.data) });
    else if (t.panel === "flags")
      this.#t({ flags: t.status === "error" ? H(t.error, this.state.flags) : Ct(t.data) });
    else {
      const i = this.state.breakdowns[t.dimension];
      this.#t({ breakdowns: { ...this.state.breakdowns, [t.dimension]: t.status === "error" ? H(t.error, i) : Ct(t.data) } });
    }
  }
  #D(t, i) {
    this.#t({
      summary: H(t, this.state.summary),
      events: H(t, this.state.events),
      flags: H(t, this.state.flags),
      breakdowns: Object.fromEntries(i.map((s) => [s, H(t, this.state.breakdowns[s])]))
    });
  }
  async #_(t, i, s) {
    const n = this.state.connection;
    if (!n) return;
    this.#r.cancel();
    const o = this.state.selectedEvent?.eventName === t ? this.state.selectedEvent.details : void 0;
    this.#t({ selectedEvent: { eventName: t, eventProperty: i, eventValue: s, details: Z(o), property: De() } });
    const r = await this.#h.run((h) => this.#e.eventDetails({
      query: { ...this.#u(n, this.#f()), eventName: t, eventProperty: i, eventValue: s },
      signal: h
    }));
    if (r.status === "cancelled" || r.status === "stale" || this.state.selectedEvent?.eventName !== t) return;
    if (r.status === "error") {
      this.#t({ selectedEvent: { ...this.state.selectedEvent, details: H(gt(r.error), o) } });
      return;
    }
    const { data: a, error: l, response: c } = r.value;
    if (l || !a) {
      this.#t({ selectedEvent: { ...this.state.selectedEvent, details: H(Ce(l, c.status), o) } });
      return;
    }
    this.#t({ selectedEvent: { ...this.state.selectedEvent, details: Ct(a) } });
    const u = a.properties[0]?.name;
    u && this.#x(u, "");
  }
  async #x(t, i, s = !1) {
    const n = this.state.connection, o = this.state.selectedEvent;
    if (!n || !o) return;
    const r = o.property;
    this.#t({ selectedEvent: { ...o, propertyName: t, propertySearch: i, property: Z(r) } });
    const a = (f) => this.#e.eventPropertyValues({
      query: {
        ...this.#u(n, this.#f()),
        eventName: o.eventName,
        propertyName: t,
        limit: 100,
        search: i,
        eventProperty: o.eventProperty,
        eventValue: o.eventValue
      },
      signal: f
    }), l = await (s ? this.#r.schedule(a) : this.#r.run(a)), c = this.state.selectedEvent;
    if (l.status === "cancelled" || l.status === "stale" || c?.eventName !== o.eventName || c.propertyName !== t) return;
    if (l.status === "error") {
      this.#t({ selectedEvent: { ...c, property: H(gt(l.error), r) } });
      return;
    }
    const { data: u, error: h, response: d } = l.value;
    this.#t({ selectedEvent: { ...c, property: h || !u ? H(Ce(h, d.status), r) : Ct(u) } });
  }
  #u(t, i) {
    const { from: s, to: n, interval: o } = this.state.range;
    return { connection: t, from: s, to: n, interval: o, ...this.#C(), ...i };
  }
  #C() {
    return this.#c && this.state.route ? { documentId: this.#c, culture: this.state.route.culture, path: this.state.route.path } : {};
  }
  #w(t) {
    return t.length ? { filter: t.map(Fo) } : {};
  }
  #f() {
    return this.#w(this.state.filters.filter(({ dimension: t }) => t !== "EventName"));
  }
  #k() {
    return this.#w(this.state.filters);
  }
  #M() {
    const t = Ua(this.#i.currentUrl().searchParams), i = {
      connection: t.connection,
      metric: t.metric,
      audienceDimension: t.audience,
      utmDimension: t.utm,
      filters: t.filters
    };
    t.range ? (i.range = t.range, i.preset = t.preset ?? "custom", this.#g = !0) : t.preset && t.preset !== "custom" && (i.preset = t.preset, i.range = Ve(t.preset), this.#g = !0), this.#t(i);
  }
  #o() {
    this.#i.replaceUrl(Ha(this.#i.currentUrl(), {
      connection: this.state.connection,
      preset: this.state.preset,
      range: this.state.range,
      metric: this.state.metric,
      audience: this.state.audienceDimension,
      utm: this.state.utmDimension,
      filters: this.state.filters
    }));
  }
  #z() {
    this.#a.cancel(), this.#l.cancel(), this.#h.cancel(), this.#d.cancel(), this.#r.cancel(), this.#t({ expandedBreakdown: void 0, expandedEvents: void 0, selectedEvent: void 0, selectedFlag: void 0 });
  }
}
function Ce(e, t) {
  return gt(typeof e == "object" && e !== null ? { ...e, status: t } : { status: t });
}
const Ja = [Lt, ut`
  :host { display: block; }
  main { container-type: inline-size; margin-inline: auto; max-width: 110rem; padding: var(--uui-size-layout-1); }
  .active-filters { align-items: center; background: color-mix(in srgb, var(--uui-color-interactive) 3%, var(--uui-color-surface)); border: 1px solid var(--uui-color-border); border-radius: var(--uui-border-radius); display: flex; gap: var(--uui-size-space-3); margin-bottom: var(--uui-size-space-5); min-inline-size: 0; padding: var(--uui-size-space-2); }
  .filter-heading { align-items: center; color: var(--uui-color-text-alt); display: flex; flex: 0 0 auto; gap: var(--uui-size-space-2); padding-inline: var(--uui-size-space-2); }
  .filter-heading uui-icon { color: var(--uui-color-interactive); }
  .filter-list { align-items: center; display: flex; flex: 1 1 auto; flex-wrap: wrap; gap: var(--uui-size-space-2); min-inline-size: 0; }
  .filter-badge { align-items: center; appearance: none; background: var(--uui-color-surface); border: 1px solid var(--uui-color-border); border-radius: var(--uui-border-radius); color: var(--uui-color-text); cursor: pointer; display: inline-flex; font: inherit; gap: var(--uui-size-space-2); max-inline-size: min(32rem, 100%); min-block-size: 2rem; min-inline-size: 0; padding: var(--uui-size-space-1) var(--uui-size-space-2); }
  .filter-badge:hover { background: color-mix(in srgb, var(--uui-color-interactive) 6%, var(--uui-color-surface)); border-color: var(--uui-color-interactive); }
  .filter-badge:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
  .filter-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .filter-remove { color: var(--uui-color-text-alt); flex: 0 0 auto; font-size: 1.1em; line-height: 1; }
  .clear-filters { flex: 0 0 auto; }
  @container (max-width: 32rem) {
    .active-filters { align-items: stretch; flex-wrap: wrap; }
    .filter-heading { flex: 1 1 auto; }
    .filter-list { flex-basis: 100%; order: 3; }
  }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; } }
`];
var tl = Object.defineProperty, el = Object.getOwnPropertyDescriptor, Io = (e) => {
  throw TypeError(e);
}, ue = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? el(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && tl(t, i, n), n;
}, No = (e, t, i) => t.has(e) || Io("Cannot " + i), Ue = (e, t, i) => (No(e, t, "read from private field"), i ? i.call(e) : t.get(e)), un = (e, t, i) => t.has(e) ? Io("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), tt = (e, t, i) => (No(e, t, "access private method"), i), V, Ei, Ci, Bo, Vo, Vi, Uo, Es, Wo, Ho, fs, jo, qo;
const il = [
  { value: 1, label: "Last 24 hours" },
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
  { value: 365, label: "Last 12 months" }
], sl = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let At = class extends ft(ht) {
  constructor() {
    super(...arguments), un(this, V), this.range = Ve(30), this.preset = 30, this._draftFrom = re(this.range.from, this.range.timeZone), this._draftTo = re(this.range.to, this.range.timeZone), this._viewMonth = this._draftTo, this._selectingEnd = !1, un(this, Ci, (e) => {
      Ue(this, V, Ei)?.open && !e.composedPath().includes(this) && tt(this, V, Vi).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("click", Ue(this, Ci));
  }
  disconnectedCallback() {
    document.removeEventListener("click", Ue(this, Ci)), super.disconnectedCallback();
  }
  render() {
    const e = Fa(this.range, this.preset), t = /* @__PURE__ */ new Date(`${this._viewMonth}T00:00:00Z`), i = new Intl.DateTimeFormat(void 0, {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(t), s = Ts(this._draftFrom, this._draftTo, this.range.timeZone);
    return v`
      <details @toggle=${(n) => tt(this, V, Vo).call(this, n)}>
        <summary class="trigger" aria-label=${`Date range: ${e}`} aria-haspopup="dialog">
          <span class="trigger-content">
            <uui-icon name="icon-calendar" aria-hidden="true"></uui-icon>
            <span>${e}</span>
            <uui-icon name="icon-navigation-down" aria-hidden="true"></uui-icon>
          </span>
        </summary>

        <div
          class="popover-panel"
          id="analytics-date-popover"
          role="dialog"
          aria-label="Choose analytics date range"
          @keydown=${(n) => tt(this, V, Uo).call(this, n)}>
          <umb-popover-layout>
          <div class="picker">
            <nav class="presets" aria-label="Date range presets">
              ${il.map((n) => v`
                <button
                  type="button"
                  aria-current=${this.preset === n.value ? "true" : "false"}
                  @click=${() => tt(this, V, Wo).call(this, n.value)}>${n.label}</button>
              `)}
              <span class="custom-label" aria-current=${this.preset === "custom" ? "true" : "false"}>Custom range</span>
            </nav>

            <section class="calendar" aria-label="Custom date range">
              <div class="calendar-header">
                <strong>${i}</strong>
                <div class="month-actions">
                  <uui-button
                    compact
                    look="secondary"
                    label="Previous month"
                    @click=${() => {
      this._viewMonth = an(this._viewMonth, -1);
    }}>
                    <uui-icon name="icon-navigation-left" aria-hidden="true"></uui-icon>
                  </uui-button>
                  <uui-button
                    compact
                    look="secondary"
                    label="Next month"
                    @click=${() => {
      this._viewMonth = an(this._viewMonth, 1);
    }}>
                    <uui-icon name="icon-navigation-right" aria-hidden="true"></uui-icon>
                  </uui-button>
                </div>
              </div>

              <div class="weekdays" aria-hidden="true">
                ${sl.map((n) => v`<abbr title=${n}>${n.slice(0, 1)}</abbr>`)}
              </div>
              <div class="calendar-grid">
                ${Ra(this._viewMonth).map((n) => tt(this, V, qo).call(this, n))}
              </div>

              <div class="date-inputs">
                <label>
                  <span>From</span>
                  <uui-input label="From date" type="date" .value=${this._draftFrom} @change=${(n) => tt(this, V, fs).call(this, "from", n)}></uui-input>
                </label>
                <label>
                  <span>To</span>
                  <uui-input label="To date" type="date" .value=${this._draftTo} @change=${(n) => tt(this, V, fs).call(this, "to", n)}></uui-input>
                </label>
              </div>

              <div class="picker-footer">
                <span class="selection-hint" aria-live="polite">
                  ${this._selectingEnd ? "Choose an end date" : ""}
                </span>
                <uui-button
                  look="primary"
                  label="Apply custom date range"
                  ?disabled=${!s}
                  @click=${tt(this, V, jo)}>Apply</uui-button>
              </div>
            </section>
          </div>
          </umb-popover-layout>
        </div>
      </details>
    `;
  }
};
V = /* @__PURE__ */ new WeakSet();
Ei = function() {
  return this.shadowRoot?.querySelector("details") ?? null;
};
Ci = /* @__PURE__ */ new WeakMap();
Bo = function() {
  this._draftFrom = re(this.range.from, this.range.timeZone), this._draftTo = re(this.range.to, this.range.timeZone), this._viewMonth = this._draftTo, this._selectingEnd = !1;
};
Vo = function(e) {
  e.currentTarget.open && tt(this, V, Bo).call(this);
};
Vi = function() {
  Ue(this, V, Ei) && (Ue(this, V, Ei).open = !1);
};
Uo = function(e) {
  e.key === "Escape" && (tt(this, V, Vi).call(this), this.shadowRoot?.querySelector(".trigger")?.focus());
};
Es = function(e, t) {
  this.dispatchEvent(new CustomEvent("analytics-date-range-change", {
    bubbles: !0,
    composed: !0,
    detail: { preset: e, range: t }
  })), tt(this, V, Vi).call(this);
};
Wo = function(e) {
  tt(this, V, Es).call(this, e, Ve(e));
};
Ho = function(e) {
  if (!this._selectingEnd) {
    this._draftFrom = e, this._draftTo = e, this._selectingEnd = !0;
    return;
  }
  e < this._draftFrom ? (this._draftTo = this._draftFrom, this._draftFrom = e) : this._draftTo = e, this._selectingEnd = !1;
};
fs = function(e, t) {
  const i = t.target.value;
  e === "from" ? this._draftFrom = i : this._draftTo = i, i && (this._viewMonth = i), this._selectingEnd = !1;
};
jo = function() {
  const e = Ts(this._draftFrom, this._draftTo, this.range.timeZone);
  e && tt(this, V, Es).call(this, "custom", e);
};
qo = function(e) {
  const t = e.date === this._draftFrom, i = e.date === this._draftTo, s = e.date >= this._draftFrom && e.date <= this._draftTo, n = [
    "calendar-day",
    e.outsideMonth ? "outside-month" : "",
    s ? "in-range" : "",
    t ? "selected-start" : "",
    i ? "selected-end" : ""
  ].filter(Boolean).join(" "), o = new Intl.DateTimeFormat(void 0, {
    dateStyle: "long",
    timeZone: "UTC"
  }).format(/* @__PURE__ */ new Date(`${e.date}T00:00:00Z`));
  return v`
      <button
        class=${n}
        type="button"
        aria-label=${o}
        aria-pressed=${t || i ? "true" : "false"}
        aria-current=${e.today ? "date" : "false"}
        @click=${() => tt(this, V, Ho).call(this, e.date)}>${e.day}</button>
    `;
};
At.styles = [Lt, ut`
    :host { display: block; min-inline-size: 0; }
    details { position: relative; }
    .trigger { align-items: center; appearance: none; background: var(--uui-color-surface); block-size: 2.25rem; border: 1px solid color-mix(in srgb, var(--uui-color-border) 55%, var(--uui-color-text-alt)); border-radius: var(--uui-border-radius); box-sizing: border-box; color: var(--uui-color-text); cursor: pointer; display: flex; font: inherit; font-weight: 600; max-inline-size: 100%; min-inline-size: 11rem; padding: 0 var(--uui-size-space-3); }
    .trigger::-webkit-details-marker { display: none; }
    .trigger:hover { background: var(--uui-color-surface-alt); border-color: var(--uui-color-interactive); }
    .trigger:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .trigger-content { align-items: center; display: grid; gap: var(--uui-size-space-3); grid-template-columns: auto minmax(0, 1fr) auto; inline-size: 100%; text-align: left; }
    .trigger-content > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .trigger-content uui-icon { color: var(--uui-color-text-alt); }
    .popover-panel { background: var(--uui-color-surface); border: 1px solid var(--uui-color-border); border-radius: var(--uui-border-radius); box-shadow: var(--uui-shadow-depth-3); inset-block-start: calc(100% + var(--uui-size-space-2)); inset-inline-end: 0; overflow: hidden; position: absolute; z-index: var(--uui-popover-z-index, 1); }
    .picker { display: grid; grid-template-columns: 10rem minmax(19rem, 1fr); inline-size: min(40rem, calc(100vw - (2 * var(--uui-size-space-5)))); max-block-size: min(42rem, calc(100dvh - 6rem)); overflow: auto; }
    .presets { border-inline-end: 1px solid var(--uui-color-border); display: flex; flex-direction: column; padding: var(--uui-size-space-3); }
    .presets button, .custom-label { border-radius: var(--uui-border-radius); box-sizing: border-box; color: var(--uui-color-text); display: block; font: inherit; inline-size: 100%; padding: var(--uui-size-space-3); text-align: left; }
    .presets button { appearance: none; background: transparent; border: 0; cursor: pointer; }
    .presets button:hover { background: var(--uui-color-surface-alt); }
    .presets button:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: -2px; }
    .presets button[aria-current="true"], .custom-label[aria-current="true"] { background: var(--uui-color-surface-alt); font-weight: 700; }
    .custom-label { color: var(--uui-color-text-alt); margin-top: var(--uui-size-space-1); }
    .calendar { padding: var(--uui-size-space-5); }
    .calendar-header { align-items: center; display: flex; justify-content: space-between; margin-bottom: var(--uui-size-space-4); }
    .month-actions { display: flex; gap: var(--uui-size-space-1); }
    .weekdays, .calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
    .weekdays abbr { color: var(--uui-color-text-alt); font-size: 0.875rem; padding-block: var(--uui-size-space-2); text-align: center; text-decoration: none; }
    .calendar-day { appearance: none; background: transparent; border: 0; color: var(--uui-color-text); cursor: pointer; font: inherit; min-block-size: 2.35rem; padding: 0; position: relative; }
    .calendar-day:hover { background: var(--uui-color-surface-alt); }
    .calendar-day:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: -2px; z-index: 1; }
    .calendar-day.outside-month { color: var(--uui-color-text-alt); }
    .calendar-day.in-range { background: color-mix(in srgb, var(--uui-color-selected) 12%, var(--uui-color-surface)); }
    .calendar-day.selected-start, .calendar-day.selected-end { background: var(--uui-color-selected); color: var(--uui-color-selected-contrast); font-weight: 700; }
    .calendar-day.selected-start { border-radius: var(--uui-border-radius) 0 0 var(--uui-border-radius); }
    .calendar-day.selected-end { border-radius: 0 var(--uui-border-radius) var(--uui-border-radius) 0; }
    .calendar-day.selected-start.selected-end { border-radius: var(--uui-border-radius); }
    .date-inputs { border-top: 1px solid var(--uui-color-border); display: grid; gap: var(--uui-size-space-3); grid-template-columns: 1fr 1fr; margin-top: var(--uui-size-space-4); padding-top: var(--uui-size-space-4); }
    .date-inputs label { display: grid; gap: var(--uui-size-space-2); }
    .date-inputs label > span { color: var(--uui-color-text-alt); font-size: 0.875rem; }
    .date-inputs uui-input { inline-size: 100%; }
    .picker-footer { align-items: center; display: flex; gap: var(--uui-size-space-3); justify-content: space-between; margin-top: var(--uui-size-space-4); }
    .selection-hint { color: var(--uui-color-text-alt); font-size: 0.875rem; }
    @media (max-width: 40rem) {
      .picker { grid-template-columns: 1fr; inline-size: calc(100vw - (2 * var(--uui-size-space-3))); }
      .presets { border-bottom: 1px solid var(--uui-color-border); border-inline-end: 0; flex-direction: row; flex-wrap: wrap; gap: var(--uui-size-space-1); }
      .presets button, .custom-label { inline-size: auto; padding: var(--uui-size-space-2) var(--uui-size-space-3); }
      .custom-label { margin-top: 0; }
      .calendar { padding: var(--uui-size-space-4); }
    }
  `];
ue([
  _({ attribute: !1 })
], At.prototype, "range", 2);
ue([
  _({ attribute: !1 })
], At.prototype, "preset", 2);
ue([
  Dt()
], At.prototype, "_draftFrom", 2);
ue([
  Dt()
], At.prototype, "_draftTo", 2);
ue([
  Dt()
], At.prototype, "_viewMonth", 2);
ue([
  Dt()
], At.prototype, "_selectingEnd", 2);
At = ue([
  dt("vercel-analytics-date-range-picker")
], At);
var nl = Object.defineProperty, ol = Object.getOwnPropertyDescriptor, Yo = (e) => {
  throw TypeError(e);
}, jt = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? ol(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && nl(t, i, n), n;
}, rl = (e, t, i) => t.has(e) || Yo("Cannot " + i), al = (e, t, i) => t.has(e) ? Yo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), di = (e, t, i) => (rl(e, t, "access private method"), i), ge, Ko, Xo, Zo, Go;
let $t = class extends ft(ht) {
  constructor() {
    super(...arguments), al(this, ge), this.connections = [], this.preset = 30, this.documentScoped = !1;
  }
  render() {
    const e = di(this, ge, Ko).call(this), t = di(this, ge, Xo).call(this), i = t ?? e?.displayName;
    return v`
      <header>
        <div class="site-context">
          ${t && this.siteUrl ? v`
            <a class="site-link" href=${this.siteUrl} target="_blank" rel="noopener noreferrer">
              <uui-icon name="icon-globe" aria-hidden="true"></uui-icon>
              <span class="site-link-label">${t}</span>
              <uui-icon class="external-indicator" name="icon-out" aria-hidden="true"></uui-icon>
              <span class="visually-hidden">Open site in a new tab</span>
            </a>
          ` : i ? v`
            <span class="site-name"><uui-icon name="icon-globe" aria-hidden="true"></uui-icon><span>${i}</span></span>
          ` : ""}
        </div>
        <div class="controls">
          ${!this.documentScoped && this.connections.length > 1 ? v`
            <uui-select class="project-select" label="Vercel project" .options=${di(this, ge, Zo).call(this)} @change=${di(this, ge, Go)}></uui-select>
          ` : ""}
          <vercel-analytics-date-range-picker .preset=${this.preset} .range=${this.range}></vercel-analytics-date-range-picker>
        </div>
      </header>
      <div class="warnings">
        ${e?.warnings.map((s) => v`<uui-tag color="warning">${s}</uui-tag>`)}
        ${this.route?.warnings.map((s) => v`<uui-tag color="warning">${s}</uui-tag>`)}
      </div>
    `;
  }
};
ge = /* @__PURE__ */ new WeakSet();
Ko = function() {
  return this.connections.find(({ key: e }) => e === this.connection);
};
Xo = function() {
  if (this.route?.hostname) return this.route.hostname;
  if (this.siteUrl)
    try {
      return new URL(this.siteUrl).hostname;
    } catch {
      return;
    }
};
Zo = function() {
  return this.connections.map(({ key: e, displayName: t }) => ({
    value: e,
    name: t,
    selected: e === this.connection
  }));
};
Go = function(e) {
  this.dispatchEvent(new CustomEvent("connection-change", {
    bubbles: !0,
    composed: !0,
    detail: { connection: e.target.value }
  }));
};
$t.styles = [Lt, ut`
    header { align-items: center; display: flex; flex-wrap: wrap; gap: var(--uui-size-space-4); justify-content: space-between; margin-bottom: var(--uui-size-space-2); min-block-size: 2.5rem; }
    .site-context { align-items: center; display: flex; gap: var(--uui-size-space-3); min-block-size: 2.5rem; min-inline-size: 0; }
    .site-link, .site-name { align-items: center; color: var(--uui-color-text); display: inline-flex; font-weight: 700; gap: var(--uui-size-space-2); min-inline-size: 0; text-decoration: none; }
    .site-link:hover .site-link-label { text-decoration: underline; text-underline-offset: 0.18em; }
    .site-link:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 3px; }
    .site-context uui-icon, .external-indicator { color: var(--uui-color-text-alt); flex: 0 0 auto; }
    .external-indicator { font-size: 0.875em; }
    .controls { align-items: center; display: flex; flex-wrap: wrap; gap: var(--uui-size-space-3); justify-content: flex-end; margin-inline-start: auto; min-inline-size: 0; }
    .project-select {
      --uui-select-background-color: var(--uui-color-surface);
      --uui-select-border-color: color-mix(in srgb, var(--uui-color-border) 55%, var(--uui-color-text-alt));
      --uui-select-border-color-hover: var(--uui-color-interactive);
      --uui-select-font-size: inherit;
      --uui-select-height: 2.25rem;
      --uui-select-outline-color: var(--uui-color-selected);
      --uui-select-padding-x: var(--uui-size-space-3);
      --uui-select-padding-y: 0;
      font-weight: 600;
      min-inline-size: 11rem;
    }
    .project-select:hover { --uui-select-background-color: var(--uui-color-surface-alt); }
    .warnings { display: flex; flex-wrap: wrap; gap: var(--uui-size-space-3); margin-bottom: var(--uui-size-space-5); }
    .warnings:empty { display: none; }
    .visually-hidden { clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px; }
    @container (max-width: 62rem) { .project-select { inline-size: min(100%, 28rem); max-inline-size: 100%; } }
    @container (max-width: 32rem) {
      header { align-items: stretch; }
      .site-context { flex: 1 1 100%; }
      .controls { align-items: stretch; inline-size: 100%; margin-inline-start: 0; }
      .project-select, vercel-analytics-date-range-picker { box-sizing: border-box; flex: 1 1 100%; inline-size: 100%; max-inline-size: none; }
    }
  `];
jt([
  _({ attribute: !1 })
], $t.prototype, "connections", 2);
jt([
  _()
], $t.prototype, "connection", 2);
jt([
  _({ attribute: !1 })
], $t.prototype, "route", 2);
jt([
  _({ attribute: !1 })
], $t.prototype, "range", 2);
jt([
  _()
], $t.prototype, "preset", 2);
jt([
  _()
], $t.prototype, "siteUrl", 2);
jt([
  _({ type: Boolean })
], $t.prototype, "documentScoped", 2);
$t = jt([
  dt("vercel-analytics-dashboard-header")
], $t);
function ll(e, t, i, s) {
  if (t == null || t <= 0) return;
  const n = Math.round((e - t) / t * 100), o = n > 0 ? "increase" : n < 0 ? "decrease" : "unchanged", r = n > 0 ? `+${n}%` : `${n}%`, a = s === 1 ? "24 hours" : `${s} days`, l = o === "unchanged" ? `No change in ${i} compared with the previous ${a}` : `${Math.abs(n)}% ${o === "increase" ? "more" : "fewer"} ${i} than the previous ${a}`;
  return { display: r, description: l, direction: o };
}
function si(e) {
  return e + 0.5 | 0;
}
const It = (e, t, i) => Math.max(Math.min(e, i), t);
function Ae(e) {
  return It(si(e * 2.55), 0, 255);
}
function Bt(e) {
  return It(si(e * 255), 0, 255);
}
function Pt(e) {
  return It(si(e / 2.55) / 100, 0, 1);
}
function hn(e) {
  return It(si(e * 100), 0, 100);
}
const lt = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 }, ps = [..."0123456789ABCDEF"], cl = (e) => ps[e & 15], ul = (e) => ps[(e & 240) >> 4] + ps[e & 15], fi = (e) => (e & 240) >> 4 === (e & 15), hl = (e) => fi(e.r) && fi(e.g) && fi(e.b) && fi(e.a);
function dl(e) {
  var t = e.length, i;
  return e[0] === "#" && (t === 4 || t === 5 ? i = {
    r: 255 & lt[e[1]] * 17,
    g: 255 & lt[e[2]] * 17,
    b: 255 & lt[e[3]] * 17,
    a: t === 5 ? lt[e[4]] * 17 : 255
  } : (t === 7 || t === 9) && (i = {
    r: lt[e[1]] << 4 | lt[e[2]],
    g: lt[e[3]] << 4 | lt[e[4]],
    b: lt[e[5]] << 4 | lt[e[6]],
    a: t === 9 ? lt[e[7]] << 4 | lt[e[8]] : 255
  })), i;
}
const fl = (e, t) => e < 255 ? t(e) : "";
function pl(e) {
  var t = hl(e) ? cl : ul;
  return e ? "#" + t(e.r) + t(e.g) + t(e.b) + fl(e.a, t) : void 0;
}
const gl = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function Qo(e, t, i) {
  const s = t * Math.min(i, 1 - i), n = (o, r = (o + e / 30) % 12) => i - s * Math.max(Math.min(r - 3, 9 - r, 1), -1);
  return [n(0), n(8), n(4)];
}
function ml(e, t, i) {
  const s = (n, o = (n + e / 60) % 6) => i - i * t * Math.max(Math.min(o, 4 - o, 1), 0);
  return [s(5), s(3), s(1)];
}
function bl(e, t, i) {
  const s = Qo(e, 1, 0.5);
  let n;
  for (t + i > 1 && (n = 1 / (t + i), t *= n, i *= n), n = 0; n < 3; n++)
    s[n] *= 1 - t - i, s[n] += t;
  return s;
}
function vl(e, t, i, s, n) {
  return e === n ? (t - i) / s + (t < i ? 6 : 0) : t === n ? (i - e) / s + 2 : (e - t) / s + 4;
}
function Os(e) {
  const i = e.r / 255, s = e.g / 255, n = e.b / 255, o = Math.max(i, s, n), r = Math.min(i, s, n), a = (o + r) / 2;
  let l, c, u;
  return o !== r && (u = o - r, c = a > 0.5 ? u / (2 - o - r) : u / (o + r), l = vl(i, s, n, u, o), l = l * 60 + 0.5), [l | 0, c || 0, a];
}
function As(e, t, i, s) {
  return (Array.isArray(t) ? e(t[0], t[1], t[2]) : e(t, i, s)).map(Bt);
}
function Ls(e, t, i) {
  return As(Qo, e, t, i);
}
function yl(e, t, i) {
  return As(bl, e, t, i);
}
function _l(e, t, i) {
  return As(ml, e, t, i);
}
function Jo(e) {
  return (e % 360 + 360) % 360;
}
function xl(e) {
  const t = gl.exec(e);
  let i = 255, s;
  if (!t)
    return;
  t[5] !== s && (i = t[6] ? Ae(+t[5]) : Bt(+t[5]));
  const n = Jo(+t[2]), o = +t[3] / 100, r = +t[4] / 100;
  return t[1] === "hwb" ? s = yl(n, o, r) : t[1] === "hsv" ? s = _l(n, o, r) : s = Ls(n, o, r), {
    r: s[0],
    g: s[1],
    b: s[2],
    a: i
  };
}
function wl(e, t) {
  var i = Os(e);
  i[0] = Jo(i[0] + t), i = Ls(i), e.r = i[0], e.g = i[1], e.b = i[2];
}
function kl(e) {
  if (!e)
    return;
  const t = Os(e), i = t[0], s = hn(t[1]), n = hn(t[2]);
  return e.a < 255 ? `hsla(${i}, ${s}%, ${n}%, ${Pt(e.a)})` : `hsl(${i}, ${s}%, ${n}%)`;
}
const dn = {
  x: "dark",
  Z: "light",
  Y: "re",
  X: "blu",
  W: "gr",
  V: "medium",
  U: "slate",
  A: "ee",
  T: "ol",
  S: "or",
  B: "ra",
  C: "lateg",
  D: "ights",
  R: "in",
  Q: "turquois",
  E: "hi",
  P: "ro",
  O: "al",
  N: "le",
  M: "de",
  L: "yello",
  F: "en",
  K: "ch",
  G: "arks",
  H: "ea",
  I: "ightg",
  J: "wh"
}, fn = {
  OiceXe: "f0f8ff",
  antiquewEte: "faebd7",
  aqua: "ffff",
  aquamarRe: "7fffd4",
  azuY: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "0",
  blanKedOmond: "ffebcd",
  Xe: "ff",
  XeviTet: "8a2be2",
  bPwn: "a52a2a",
  burlywood: "deb887",
  caMtXe: "5f9ea0",
  KartYuse: "7fff00",
  KocTate: "d2691e",
  cSO: "ff7f50",
  cSnflowerXe: "6495ed",
  cSnsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "ffff",
  xXe: "8b",
  xcyan: "8b8b",
  xgTMnPd: "b8860b",
  xWay: "a9a9a9",
  xgYF: "6400",
  xgYy: "a9a9a9",
  xkhaki: "bdb76b",
  xmagFta: "8b008b",
  xTivegYF: "556b2f",
  xSange: "ff8c00",
  xScEd: "9932cc",
  xYd: "8b0000",
  xsOmon: "e9967a",
  xsHgYF: "8fbc8f",
  xUXe: "483d8b",
  xUWay: "2f4f4f",
  xUgYy: "2f4f4f",
  xQe: "ced1",
  xviTet: "9400d3",
  dAppRk: "ff1493",
  dApskyXe: "bfff",
  dimWay: "696969",
  dimgYy: "696969",
  dodgerXe: "1e90ff",
  fiYbrick: "b22222",
  flSOwEte: "fffaf0",
  foYstWAn: "228b22",
  fuKsia: "ff00ff",
  gaRsbSo: "dcdcdc",
  ghostwEte: "f8f8ff",
  gTd: "ffd700",
  gTMnPd: "daa520",
  Way: "808080",
  gYF: "8000",
  gYFLw: "adff2f",
  gYy: "808080",
  honeyMw: "f0fff0",
  hotpRk: "ff69b4",
  RdianYd: "cd5c5c",
  Rdigo: "4b0082",
  ivSy: "fffff0",
  khaki: "f0e68c",
  lavFMr: "e6e6fa",
  lavFMrXsh: "fff0f5",
  lawngYF: "7cfc00",
  NmoncEffon: "fffacd",
  ZXe: "add8e6",
  ZcSO: "f08080",
  Zcyan: "e0ffff",
  ZgTMnPdLw: "fafad2",
  ZWay: "d3d3d3",
  ZgYF: "90ee90",
  ZgYy: "d3d3d3",
  ZpRk: "ffb6c1",
  ZsOmon: "ffa07a",
  ZsHgYF: "20b2aa",
  ZskyXe: "87cefa",
  ZUWay: "778899",
  ZUgYy: "778899",
  ZstAlXe: "b0c4de",
  ZLw: "ffffe0",
  lime: "ff00",
  limegYF: "32cd32",
  lRF: "faf0e6",
  magFta: "ff00ff",
  maPon: "800000",
  VaquamarRe: "66cdaa",
  VXe: "cd",
  VScEd: "ba55d3",
  VpurpN: "9370db",
  VsHgYF: "3cb371",
  VUXe: "7b68ee",
  VsprRggYF: "fa9a",
  VQe: "48d1cc",
  VviTetYd: "c71585",
  midnightXe: "191970",
  mRtcYam: "f5fffa",
  mistyPse: "ffe4e1",
  moccasR: "ffe4b5",
  navajowEte: "ffdead",
  navy: "80",
  Tdlace: "fdf5e6",
  Tive: "808000",
  TivedBb: "6b8e23",
  Sange: "ffa500",
  SangeYd: "ff4500",
  ScEd: "da70d6",
  pOegTMnPd: "eee8aa",
  pOegYF: "98fb98",
  pOeQe: "afeeee",
  pOeviTetYd: "db7093",
  papayawEp: "ffefd5",
  pHKpuff: "ffdab9",
  peru: "cd853f",
  pRk: "ffc0cb",
  plum: "dda0dd",
  powMrXe: "b0e0e6",
  purpN: "800080",
  YbeccapurpN: "663399",
  Yd: "ff0000",
  Psybrown: "bc8f8f",
  PyOXe: "4169e1",
  saddNbPwn: "8b4513",
  sOmon: "fa8072",
  sandybPwn: "f4a460",
  sHgYF: "2e8b57",
  sHshell: "fff5ee",
  siFna: "a0522d",
  silver: "c0c0c0",
  skyXe: "87ceeb",
  UXe: "6a5acd",
  UWay: "708090",
  UgYy: "708090",
  snow: "fffafa",
  sprRggYF: "ff7f",
  stAlXe: "4682b4",
  tan: "d2b48c",
  teO: "8080",
  tEstN: "d8bfd8",
  tomato: "ff6347",
  Qe: "40e0d0",
  viTet: "ee82ee",
  JHt: "f5deb3",
  wEte: "ffffff",
  wEtesmoke: "f5f5f5",
  Lw: "ffff00",
  LwgYF: "9acd32"
};
function Sl() {
  const e = {}, t = Object.keys(fn), i = Object.keys(dn);
  let s, n, o, r, a;
  for (s = 0; s < t.length; s++) {
    for (r = a = t[s], n = 0; n < i.length; n++)
      o = i[n], a = a.replace(o, dn[o]);
    o = parseInt(fn[r], 16), e[a] = [o >> 16 & 255, o >> 8 & 255, o & 255];
  }
  return e;
}
let pi;
function $l(e) {
  pi || (pi = Sl(), pi.transparent = [0, 0, 0, 0]);
  const t = pi[e.toLowerCase()];
  return t && {
    r: t[0],
    g: t[1],
    b: t[2],
    a: t.length === 4 ? t[3] : 255
  };
}
const Dl = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function Cl(e) {
  const t = Dl.exec(e);
  let i = 255, s, n, o;
  if (t) {
    if (t[7] !== s) {
      const r = +t[7];
      i = t[8] ? Ae(r) : It(r * 255, 0, 255);
    }
    return s = +t[1], n = +t[3], o = +t[5], s = 255 & (t[2] ? Ae(s) : It(s, 0, 255)), n = 255 & (t[4] ? Ae(n) : It(n, 0, 255)), o = 255 & (t[6] ? Ae(o) : It(o, 0, 255)), {
      r: s,
      g: n,
      b: o,
      a: i
    };
  }
}
function Ml(e) {
  return e && (e.a < 255 ? `rgba(${e.r}, ${e.g}, ${e.b}, ${Pt(e.a)})` : `rgb(${e.r}, ${e.g}, ${e.b})`);
}
const Qi = (e) => e <= 31308e-7 ? e * 12.92 : Math.pow(e, 1 / 2.4) * 1.055 - 0.055, pe = (e) => e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
function zl(e, t, i) {
  const s = pe(Pt(e.r)), n = pe(Pt(e.g)), o = pe(Pt(e.b));
  return {
    r: Bt(Qi(s + i * (pe(Pt(t.r)) - s))),
    g: Bt(Qi(n + i * (pe(Pt(t.g)) - n))),
    b: Bt(Qi(o + i * (pe(Pt(t.b)) - o))),
    a: e.a + i * (t.a - e.a)
  };
}
function gi(e, t, i) {
  if (e) {
    let s = Os(e);
    s[t] = Math.max(0, Math.min(s[t] + s[t] * i, t === 0 ? 360 : 1)), s = Ls(s), e.r = s[0], e.g = s[1], e.b = s[2];
  }
}
function tr(e, t) {
  return e && Object.assign(t || {}, e);
}
function pn(e) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return Array.isArray(e) ? e.length >= 3 && (t = { r: e[0], g: e[1], b: e[2], a: 255 }, e.length > 3 && (t.a = Bt(e[3]))) : (t = tr(e, { r: 0, g: 0, b: 0, a: 1 }), t.a = Bt(t.a)), t;
}
function Tl(e) {
  return e.charAt(0) === "r" ? Cl(e) : xl(e);
}
class Ke {
  constructor(t) {
    if (t instanceof Ke)
      return t;
    const i = typeof t;
    let s;
    i === "object" ? s = pn(t) : i === "string" && (s = dl(t) || $l(t) || Tl(t)), this._rgb = s, this._valid = !!s;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var t = tr(this._rgb);
    return t && (t.a = Pt(t.a)), t;
  }
  set rgb(t) {
    this._rgb = pn(t);
  }
  rgbString() {
    return this._valid ? Ml(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? pl(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? kl(this._rgb) : void 0;
  }
  mix(t, i) {
    if (t) {
      const s = this.rgb, n = t.rgb;
      let o;
      const r = i === o ? 0.5 : i, a = 2 * r - 1, l = s.a - n.a, c = ((a * l === -1 ? a : (a + l) / (1 + a * l)) + 1) / 2;
      o = 1 - c, s.r = 255 & c * s.r + o * n.r + 0.5, s.g = 255 & c * s.g + o * n.g + 0.5, s.b = 255 & c * s.b + o * n.b + 0.5, s.a = r * s.a + (1 - r) * n.a, this.rgb = s;
    }
    return this;
  }
  interpolate(t, i) {
    return t && (this._rgb = zl(this._rgb, t._rgb, i)), this;
  }
  clone() {
    return new Ke(this.rgb);
  }
  alpha(t) {
    return this._rgb.a = Bt(t), this;
  }
  clearer(t) {
    const i = this._rgb;
    return i.a *= 1 - t, this;
  }
  greyscale() {
    const t = this._rgb, i = si(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
    return t.r = t.g = t.b = i, this;
  }
  opaquer(t) {
    const i = this._rgb;
    return i.a *= 1 + t, this;
  }
  negate() {
    const t = this._rgb;
    return t.r = 255 - t.r, t.g = 255 - t.g, t.b = 255 - t.b, this;
  }
  lighten(t) {
    return gi(this._rgb, 2, t), this;
  }
  darken(t) {
    return gi(this._rgb, 2, -t), this;
  }
  saturate(t) {
    return gi(this._rgb, 1, t), this;
  }
  desaturate(t) {
    return gi(this._rgb, 1, -t), this;
  }
  rotate(t) {
    return wl(this._rgb, t), this;
  }
}
function Mt() {
}
const Pl = /* @__PURE__ */ (() => {
  let e = 0;
  return () => e++;
})();
function O(e) {
  return e == null;
}
function j(e) {
  if (Array.isArray && Array.isArray(e))
    return !0;
  const t = Object.prototype.toString.call(e);
  return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function M(e) {
  return e !== null && Object.prototype.toString.call(e) === "[object Object]";
}
function X(e) {
  return (typeof e == "number" || e instanceof Number) && isFinite(+e);
}
function yt(e, t) {
  return X(e) ? e : t;
}
function E(e, t) {
  return typeof e > "u" ? t : e;
}
const El = (e, t) => typeof e == "string" && e.endsWith("%") ? parseFloat(e) / 100 * t : +e;
function F(e, t, i) {
  if (e && typeof e.call == "function")
    return e.apply(i, t);
}
function P(e, t, i, s) {
  let n, o, r;
  if (j(e))
    for (o = e.length, n = 0; n < o; n++)
      t.call(i, e[n], n);
  else if (M(e))
    for (r = Object.keys(e), o = r.length, n = 0; n < o; n++)
      t.call(i, e[r[n]], r[n]);
}
function Oi(e, t) {
  let i, s, n, o;
  if (!e || !t || e.length !== t.length)
    return !1;
  for (i = 0, s = e.length; i < s; ++i)
    if (n = e[i], o = t[i], n.datasetIndex !== o.datasetIndex || n.index !== o.index)
      return !1;
  return !0;
}
function Ai(e) {
  if (j(e))
    return e.map(Ai);
  if (M(e)) {
    const t = /* @__PURE__ */ Object.create(null), i = Object.keys(e), s = i.length;
    let n = 0;
    for (; n < s; ++n)
      t[i[n]] = Ai(e[i[n]]);
    return t;
  }
  return e;
}
function er(e) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(e) === -1;
}
function Ol(e, t, i, s) {
  if (!er(e))
    return;
  const n = t[e], o = i[e];
  M(n) && M(o) ? Xe(n, o, s) : t[e] = Ai(o);
}
function Xe(e, t, i) {
  const s = j(t) ? t : [
    t
  ], n = s.length;
  if (!M(e))
    return e;
  i = i || {};
  const o = i.merger || Ol;
  let r;
  for (let a = 0; a < n; ++a) {
    if (r = s[a], !M(r))
      continue;
    const l = Object.keys(r);
    for (let c = 0, u = l.length; c < u; ++c)
      o(l[c], e, r, i);
  }
  return e;
}
function We(e, t) {
  return Xe(e, t, {
    merger: Al
  });
}
function Al(e, t, i) {
  if (!er(e))
    return;
  const s = t[e], n = i[e];
  M(s) && M(n) ? We(s, n) : Object.prototype.hasOwnProperty.call(t, e) || (t[e] = Ai(n));
}
const gn = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (e) => e,
  // default resolvers
  x: (e) => e.x,
  y: (e) => e.y
};
function Ll(e) {
  const t = e.split("."), i = [];
  let s = "";
  for (const n of t)
    s += n, s.endsWith("\\") ? s = s.slice(0, -1) + "." : (i.push(s), s = "");
  return i;
}
function Rl(e) {
  const t = Ll(e);
  return (i) => {
    for (const s of t) {
      if (s === "")
        break;
      i = i && i[s];
    }
    return i;
  };
}
function Li(e, t) {
  return (gn[t] || (gn[t] = Rl(t)))(e);
}
function Rs(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const Ri = (e) => typeof e < "u", Vt = (e) => typeof e == "function", mn = (e, t) => {
  if (e.size !== t.size)
    return !1;
  for (const i of e)
    if (!t.has(i))
      return !1;
  return !0;
};
function Fl(e) {
  return e.type === "mouseup" || e.type === "click" || e.type === "contextmenu";
}
const K = Math.PI, St = 2 * K, Il = St + K, Fi = Number.POSITIVE_INFINITY, Nl = K / 180, mt = K / 2, Kt = K / 4, bn = K * 2 / 3, ir = Math.log10, be = Math.sign;
function He(e, t, i) {
  return Math.abs(e - t) < i;
}
function vn(e) {
  const t = Math.round(e);
  e = He(e, t, e / 1e3) ? t : e;
  const i = Math.pow(10, Math.floor(ir(e))), s = e / i;
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * i;
}
function Bl(e) {
  const t = [], i = Math.sqrt(e);
  let s;
  for (s = 1; s < i; s++)
    e % s === 0 && (t.push(s), t.push(e / s));
  return i === (i | 0) && t.push(i), t.sort((n, o) => n - o).pop(), t;
}
function Vl(e) {
  return typeof e == "symbol" || typeof e == "object" && e !== null && !(Symbol.toPrimitive in e || "toString" in e || "valueOf" in e);
}
function Ze(e) {
  return !Vl(e) && !isNaN(parseFloat(e)) && isFinite(e);
}
function Ul(e, t) {
  const i = Math.round(e);
  return i - t <= e && i + t >= e;
}
function Wl(e, t, i) {
  let s, n, o;
  for (s = 0, n = e.length; s < n; s++)
    o = e[s][i], isNaN(o) || (t.min = Math.min(t.min, o), t.max = Math.max(t.max, o));
}
function ie(e) {
  return e * (K / 180);
}
function Hl(e) {
  return e * (180 / K);
}
function yn(e) {
  if (!X(e))
    return;
  let t = 1, i = 0;
  for (; Math.round(e * t) / t !== e; )
    t *= 10, i++;
  return i;
}
function jl(e, t) {
  const i = t.x - e.x, s = t.y - e.y, n = Math.sqrt(i * i + s * s);
  let o = Math.atan2(s, i);
  return o < -0.5 * K && (o += St), {
    angle: o,
    distance: n
  };
}
function gs(e, t) {
  return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
}
function ql(e, t) {
  return (e - t + Il) % St - K;
}
function wt(e) {
  return (e % St + St) % St;
}
function sr(e, t, i, s) {
  const n = wt(e), o = wt(t), r = wt(i), a = wt(o - n), l = wt(r - n), c = wt(n - o), u = wt(n - r);
  return n === o || n === r || s && o === r || a > l && c < u;
}
function ct(e, t, i) {
  return Math.max(t, Math.min(i, e));
}
function Yl(e) {
  return ct(e, -32768, 32767);
}
function nr(e, t, i, s = 1e-6) {
  return e >= Math.min(t, i) - s && e <= Math.max(t, i) + s;
}
function Fs(e, t, i) {
  i = i || ((r) => e[r] < t);
  let s = e.length - 1, n = 0, o;
  for (; s - n > 1; )
    o = n + s >> 1, i(o) ? n = o : s = o;
  return {
    lo: n,
    hi: s
  };
}
const se = (e, t, i, s) => Fs(e, i, s ? (n) => {
  const o = e[n][t];
  return o < i || o === i && e[n + 1][t] === i;
} : (n) => e[n][t] < i), Kl = (e, t, i) => Fs(e, i, (s) => e[s][t] >= i);
function Xl(e, t, i) {
  let s = 0, n = e.length;
  for (; s < n && e[s] < t; )
    s++;
  for (; n > s && e[n - 1] > i; )
    n--;
  return s > 0 || n < e.length ? e.slice(s, n) : e;
}
const or = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function Zl(e, t) {
  if (e._chartjs) {
    e._chartjs.listeners.push(t);
    return;
  }
  Object.defineProperty(e, "_chartjs", {
    configurable: !0,
    enumerable: !1,
    value: {
      listeners: [
        t
      ]
    }
  }), or.forEach((i) => {
    const s = "_onData" + Rs(i), n = e[i];
    Object.defineProperty(e, i, {
      configurable: !0,
      enumerable: !1,
      value(...o) {
        const r = n.apply(this, o);
        return e._chartjs.listeners.forEach((a) => {
          typeof a[s] == "function" && a[s](...o);
        }), r;
      }
    });
  });
}
function _n(e, t) {
  const i = e._chartjs;
  if (!i)
    return;
  const s = i.listeners, n = s.indexOf(t);
  n !== -1 && s.splice(n, 1), !(s.length > 0) && (or.forEach((o) => {
    delete e[o];
  }), delete e._chartjs);
}
function Gl(e) {
  const t = new Set(e);
  return t.size === e.length ? e : Array.from(t);
}
const rr = (function() {
  return typeof window > "u" ? function(e) {
    return e();
  } : window.requestAnimationFrame;
})();
function ar(e, t) {
  let i = [], s = !1;
  return function(...n) {
    i = n, s || (s = !0, rr.call(window, () => {
      s = !1, e.apply(t, i);
    }));
  };
}
function Ql(e, t) {
  let i;
  return function(...s) {
    return t ? (clearTimeout(i), i = setTimeout(e, t, s)) : e.apply(this, s), t;
  };
}
const Jl = (e) => e === "start" ? "left" : e === "end" ? "right" : "center", xn = (e, t, i) => e === "start" ? t : e === "end" ? i : (t + i) / 2;
function tc(e, t, i) {
  const s = t.length;
  let n = 0, o = s;
  if (e._sorted) {
    const { iScale: r, vScale: a, _parsed: l } = e, c = e.dataset && e.dataset.options ? e.dataset.options.spanGaps : null, u = r.axis, { min: h, max: d, minDefined: f, maxDefined: g } = r.getUserBounds();
    if (f) {
      if (n = Math.min(
        // @ts-expect-error Need to type _parsed
        se(l, u, h).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        i ? s : se(t, u, r.getPixelForValue(h)).lo
      ), c) {
        const p = l.slice(0, n + 1).reverse().findIndex((m) => !O(m[a.axis]));
        n -= Math.max(0, p);
      }
      n = ct(n, 0, s - 1);
    }
    if (g) {
      let p = Math.max(
        // @ts-expect-error Need to type _parsed
        se(l, r.axis, d, !0).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        i ? 0 : se(t, u, r.getPixelForValue(d), !0).hi + 1
      );
      if (c) {
        const m = l.slice(p - 1).findIndex((b) => !O(b[a.axis]));
        p += Math.max(0, m);
      }
      o = ct(p, n, s) - n;
    } else
      o = s - n;
  }
  return {
    start: n,
    count: o
  };
}
function ec(e) {
  const { xScale: t, yScale: i, _scaleRanges: s } = e, n = {
    xmin: t.min,
    xmax: t.max,
    ymin: i.min,
    ymax: i.max
  };
  if (!s)
    return e._scaleRanges = n, !0;
  const o = s.xmin !== t.min || s.xmax !== t.max || s.ymin !== i.min || s.ymax !== i.max;
  return Object.assign(s, n), o;
}
const mi = (e) => e === 0 || e === 1, wn = (e, t, i) => -(Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * St / i)), kn = (e, t, i) => Math.pow(2, -10 * e) * Math.sin((e - t) * St / i) + 1, je = {
  linear: (e) => e,
  easeInQuad: (e) => e * e,
  easeOutQuad: (e) => -e * (e - 2),
  easeInOutQuad: (e) => (e /= 0.5) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1),
  easeInCubic: (e) => e * e * e,
  easeOutCubic: (e) => (e -= 1) * e * e + 1,
  easeInOutCubic: (e) => (e /= 0.5) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2),
  easeInQuart: (e) => e * e * e * e,
  easeOutQuart: (e) => -((e -= 1) * e * e * e - 1),
  easeInOutQuart: (e) => (e /= 0.5) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2),
  easeInQuint: (e) => e * e * e * e * e,
  easeOutQuint: (e) => (e -= 1) * e * e * e * e + 1,
  easeInOutQuint: (e) => (e /= 0.5) < 1 ? 0.5 * e * e * e * e * e : 0.5 * ((e -= 2) * e * e * e * e + 2),
  easeInSine: (e) => -Math.cos(e * mt) + 1,
  easeOutSine: (e) => Math.sin(e * mt),
  easeInOutSine: (e) => -0.5 * (Math.cos(K * e) - 1),
  easeInExpo: (e) => e === 0 ? 0 : Math.pow(2, 10 * (e - 1)),
  easeOutExpo: (e) => e === 1 ? 1 : -Math.pow(2, -10 * e) + 1,
  easeInOutExpo: (e) => mi(e) ? e : e < 0.5 ? 0.5 * Math.pow(2, 10 * (e * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (e * 2 - 1)) + 2),
  easeInCirc: (e) => e >= 1 ? e : -(Math.sqrt(1 - e * e) - 1),
  easeOutCirc: (e) => Math.sqrt(1 - (e -= 1) * e),
  easeInOutCirc: (e) => (e /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1),
  easeInElastic: (e) => mi(e) ? e : wn(e, 0.075, 0.3),
  easeOutElastic: (e) => mi(e) ? e : kn(e, 0.075, 0.3),
  easeInOutElastic(e) {
    return mi(e) ? e : e < 0.5 ? 0.5 * wn(e * 2, 0.1125, 0.45) : 0.5 + 0.5 * kn(e * 2 - 1, 0.1125, 0.45);
  },
  easeInBack(e) {
    return e * e * ((1.70158 + 1) * e - 1.70158);
  },
  easeOutBack(e) {
    return (e -= 1) * e * ((1.70158 + 1) * e + 1.70158) + 1;
  },
  easeInOutBack(e) {
    let t = 1.70158;
    return (e /= 0.5) < 1 ? 0.5 * (e * e * (((t *= 1.525) + 1) * e - t)) : 0.5 * ((e -= 2) * e * (((t *= 1.525) + 1) * e + t) + 2);
  },
  easeInBounce: (e) => 1 - je.easeOutBounce(1 - e),
  easeOutBounce(e) {
    return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375 : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
  },
  easeInOutBounce: (e) => e < 0.5 ? je.easeInBounce(e * 2) * 0.5 : je.easeOutBounce(e * 2 - 1) * 0.5 + 0.5
};
function Is(e) {
  if (e && typeof e == "object") {
    const t = e.toString();
    return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
  }
  return !1;
}
function Sn(e) {
  return Is(e) ? e : new Ke(e);
}
function Ji(e) {
  return Is(e) ? e : new Ke(e).saturate(0.5).darken(0.1).hexString();
}
const ic = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
], sc = [
  "color",
  "borderColor",
  "backgroundColor"
];
function nc(e) {
  e.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0
  }), e.describe("animation", {
    _fallback: !1,
    _indexable: !1,
    _scriptable: (t) => t !== "onProgress" && t !== "onComplete" && t !== "fn"
  }), e.set("animations", {
    colors: {
      type: "color",
      properties: sc
    },
    numbers: {
      type: "number",
      properties: ic
    }
  }), e.describe("animations", {
    _fallback: "animation"
  }), e.set("transitions", {
    active: {
      animation: {
        duration: 400
      }
    },
    resize: {
      animation: {
        duration: 0
      }
    },
    show: {
      animations: {
        colors: {
          from: "transparent"
        },
        visible: {
          type: "boolean",
          duration: 0
        }
      }
    },
    hide: {
      animations: {
        colors: {
          to: "transparent"
        },
        visible: {
          type: "boolean",
          easing: "linear",
          fn: (t) => t | 0
        }
      }
    }
  });
}
function oc(e) {
  e.set("layout", {
    autoPadding: !0,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
}
const $n = /* @__PURE__ */ new Map();
function rc(e, t) {
  t = t || {};
  const i = e + JSON.stringify(t);
  let s = $n.get(i);
  return s || (s = new Intl.NumberFormat(e, t), $n.set(i, s)), s;
}
function lr(e, t, i) {
  return rc(t, i).format(e);
}
const ac = {
  values(e) {
    return j(e) ? e : "" + e;
  },
  numeric(e, t, i) {
    if (e === 0)
      return "0";
    const s = this.chart.options.locale;
    let n, o = e;
    if (i.length > 1) {
      const c = Math.max(Math.abs(i[0].value), Math.abs(i[i.length - 1].value));
      (c < 1e-4 || c > 1e15) && (n = "scientific"), o = lc(e, i);
    }
    const r = ir(Math.abs(o)), a = isNaN(r) ? 1 : Math.max(Math.min(-1 * Math.floor(r), 20), 0), l = {
      notation: n,
      minimumFractionDigits: a,
      maximumFractionDigits: a
    };
    return Object.assign(l, this.options.ticks.format), lr(e, s, l);
  }
};
function lc(e, t) {
  let i = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return Math.abs(i) >= 1 && e !== Math.floor(e) && (i = e - Math.floor(e)), i;
}
var cr = {
  formatters: ac
};
function cc(e) {
  e.set("scale", {
    display: !0,
    offset: !1,
    reverse: !1,
    beginAtZero: !1,
    bounds: "ticks",
    clip: !0,
    grace: 0,
    grid: {
      display: !0,
      lineWidth: 1,
      drawOnChartArea: !0,
      drawTicks: !0,
      tickLength: 8,
      tickWidth: (t, i) => i.lineWidth,
      tickColor: (t, i) => i.color,
      offset: !1
    },
    border: {
      display: !0,
      dash: [],
      dashOffset: 0,
      width: 1
    },
    title: {
      display: !1,
      text: "",
      padding: {
        top: 4,
        bottom: 4
      }
    },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: !1,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: !0,
      autoSkip: !0,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: cr.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: !1,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2
    }
  }), e.route("scale.ticks", "color", "", "color"), e.route("scale.grid", "color", "", "borderColor"), e.route("scale.border", "color", "", "borderColor"), e.route("scale.title", "color", "", "color"), e.describe("scale", {
    _fallback: !1,
    _scriptable: (t) => !t.startsWith("before") && !t.startsWith("after") && t !== "callback" && t !== "parser",
    _indexable: (t) => t !== "borderDash" && t !== "tickBorderDash" && t !== "dash"
  }), e.describe("scales", {
    _fallback: "scale"
  }), e.describe("scale.ticks", {
    _scriptable: (t) => t !== "backdropPadding" && t !== "callback",
    _indexable: (t) => t !== "backdropPadding"
  });
}
const ae = /* @__PURE__ */ Object.create(null), ms = /* @__PURE__ */ Object.create(null);
function qe(e, t) {
  if (!t)
    return e;
  const i = t.split(".");
  for (let s = 0, n = i.length; s < n; ++s) {
    const o = i[s];
    e = e[o] || (e[o] = /* @__PURE__ */ Object.create(null));
  }
  return e;
}
function ts(e, t, i) {
  return typeof t == "string" ? Xe(qe(e, t), i) : Xe(qe(e, ""), t);
}
class uc {
  constructor(t, i) {
    this.animation = void 0, this.backgroundColor = "rgba(0,0,0,0.1)", this.borderColor = "rgba(0,0,0,0.1)", this.color = "#666", this.datasets = {}, this.devicePixelRatio = (s) => s.chart.platform.getDevicePixelRatio(), this.elements = {}, this.events = [
      "mousemove",
      "mouseout",
      "click",
      "touchstart",
      "touchmove"
    ], this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: "normal",
      lineHeight: 1.2,
      weight: null
    }, this.hover = {}, this.hoverBackgroundColor = (s, n) => Ji(n.backgroundColor), this.hoverBorderColor = (s, n) => Ji(n.borderColor), this.hoverColor = (s, n) => Ji(n.color), this.indexAxis = "x", this.interaction = {
      mode: "nearest",
      intersect: !0,
      includeInvisible: !1
    }, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(t), this.apply(i);
  }
  set(t, i) {
    return ts(this, t, i);
  }
  get(t) {
    return qe(this, t);
  }
  describe(t, i) {
    return ts(ms, t, i);
  }
  override(t, i) {
    return ts(ae, t, i);
  }
  route(t, i, s, n) {
    const o = qe(this, t), r = qe(this, s), a = "_" + i;
    Object.defineProperties(o, {
      [a]: {
        value: o[i],
        writable: !0
      },
      [i]: {
        enumerable: !0,
        get() {
          const l = this[a], c = r[n];
          return M(l) ? Object.assign({}, c, l) : E(l, c);
        },
        set(l) {
          this[a] = l;
        }
      }
    });
  }
  apply(t) {
    t.forEach((i) => i(this));
  }
}
var N = /* @__PURE__ */ new uc({
  _scriptable: (e) => !e.startsWith("on"),
  _indexable: (e) => e !== "events",
  hover: {
    _fallback: "interaction"
  },
  interaction: {
    _scriptable: !1,
    _indexable: !1
  }
}, [
  nc,
  oc,
  cc
]);
function hc(e) {
  return !e || O(e.size) || O(e.family) ? null : (e.style ? e.style + " " : "") + (e.weight ? e.weight + " " : "") + e.size + "px " + e.family;
}
function Dn(e, t, i, s, n) {
  let o = t[n];
  return o || (o = t[n] = e.measureText(n).width, i.push(n)), o > s && (s = o), s;
}
function Xt(e, t, i) {
  const s = e.currentDevicePixelRatio, n = i !== 0 ? Math.max(i / 2, 0.5) : 0;
  return Math.round((t - n) * s) / s + n;
}
function Cn(e, t) {
  !t && !e || (t = t || e.getContext("2d"), t.save(), t.resetTransform(), t.clearRect(0, 0, e.width, e.height), t.restore());
}
function bs(e, t, i, s) {
  dc(e, t, i, s);
}
function dc(e, t, i, s, n) {
  let o, r, a, l, c, u, h, d;
  const f = t.pointStyle, g = t.rotation, p = t.radius;
  let m = (g || 0) * Nl;
  if (f && typeof f == "object" && (o = f.toString(), o === "[object HTMLImageElement]" || o === "[object HTMLCanvasElement]")) {
    e.save(), e.translate(i, s), e.rotate(m), e.drawImage(f, -f.width / 2, -f.height / 2, f.width, f.height), e.restore();
    return;
  }
  if (!(isNaN(p) || p <= 0)) {
    switch (e.beginPath(), f) {
      // Default includes circle
      default:
        e.arc(i, s, p, 0, St), e.closePath();
        break;
      case "triangle":
        u = p, e.moveTo(i + Math.sin(m) * u, s - Math.cos(m) * p), m += bn, e.lineTo(i + Math.sin(m) * u, s - Math.cos(m) * p), m += bn, e.lineTo(i + Math.sin(m) * u, s - Math.cos(m) * p), e.closePath();
        break;
      case "rectRounded":
        c = p * 0.516, l = p - c, r = Math.cos(m + Kt) * l, h = Math.cos(m + Kt) * l, a = Math.sin(m + Kt) * l, d = Math.sin(m + Kt) * l, e.arc(i - h, s - a, c, m - K, m - mt), e.arc(i + d, s - r, c, m - mt, m), e.arc(i + h, s + a, c, m, m + mt), e.arc(i - d, s + r, c, m + mt, m + K), e.closePath();
        break;
      case "rect":
        if (!g) {
          l = Math.SQRT1_2 * p, u = l, e.rect(i - u, s - l, 2 * u, 2 * l);
          break;
        }
        m += Kt;
      /* falls through */
      case "rectRot":
        h = Math.cos(m) * p, r = Math.cos(m) * p, a = Math.sin(m) * p, d = Math.sin(m) * p, e.moveTo(i - h, s - a), e.lineTo(i + d, s - r), e.lineTo(i + h, s + a), e.lineTo(i - d, s + r), e.closePath();
        break;
      case "crossRot":
        m += Kt;
      /* falls through */
      case "cross":
        h = Math.cos(m) * p, r = Math.cos(m) * p, a = Math.sin(m) * p, d = Math.sin(m) * p, e.moveTo(i - h, s - a), e.lineTo(i + h, s + a), e.moveTo(i + d, s - r), e.lineTo(i - d, s + r);
        break;
      case "star":
        h = Math.cos(m) * p, r = Math.cos(m) * p, a = Math.sin(m) * p, d = Math.sin(m) * p, e.moveTo(i - h, s - a), e.lineTo(i + h, s + a), e.moveTo(i + d, s - r), e.lineTo(i - d, s + r), m += Kt, h = Math.cos(m) * p, r = Math.cos(m) * p, a = Math.sin(m) * p, d = Math.sin(m) * p, e.moveTo(i - h, s - a), e.lineTo(i + h, s + a), e.moveTo(i + d, s - r), e.lineTo(i - d, s + r);
        break;
      case "line":
        r = Math.cos(m) * p, a = Math.sin(m) * p, e.moveTo(i - r, s - a), e.lineTo(i + r, s + a);
        break;
      case "dash":
        e.moveTo(i, s), e.lineTo(i + Math.cos(m) * p, s + Math.sin(m) * p);
        break;
      case !1:
        e.closePath();
        break;
    }
    e.fill(), t.borderWidth > 0 && e.stroke();
  }
}
function Ge(e, t, i) {
  return i = i || 0.5, !t || e && e.x > t.left - i && e.x < t.right + i && e.y > t.top - i && e.y < t.bottom + i;
}
function Ns(e, t) {
  e.save(), e.beginPath(), e.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), e.clip();
}
function Bs(e) {
  e.restore();
}
function fc(e, t, i, s, n) {
  if (!t)
    return e.lineTo(i.x, i.y);
  if (n === "middle") {
    const o = (t.x + i.x) / 2;
    e.lineTo(o, t.y), e.lineTo(o, i.y);
  } else n === "after" != !!s ? e.lineTo(t.x, i.y) : e.lineTo(i.x, t.y);
  e.lineTo(i.x, i.y);
}
function pc(e, t, i, s) {
  if (!t)
    return e.lineTo(i.x, i.y);
  e.bezierCurveTo(s ? t.cp1x : t.cp2x, s ? t.cp1y : t.cp2y, s ? i.cp2x : i.cp1x, s ? i.cp2y : i.cp1y, i.x, i.y);
}
function gc(e, t) {
  t.translation && e.translate(t.translation[0], t.translation[1]), O(t.rotation) || e.rotate(t.rotation), t.color && (e.fillStyle = t.color), t.textAlign && (e.textAlign = t.textAlign), t.textBaseline && (e.textBaseline = t.textBaseline);
}
function mc(e, t, i, s, n) {
  if (n.strikethrough || n.underline) {
    const o = e.measureText(s), r = t - o.actualBoundingBoxLeft, a = t + o.actualBoundingBoxRight, l = i - o.actualBoundingBoxAscent, c = i + o.actualBoundingBoxDescent, u = n.strikethrough ? (l + c) / 2 : c;
    e.strokeStyle = e.fillStyle, e.beginPath(), e.lineWidth = n.decorationWidth || 2, e.moveTo(r, u), e.lineTo(a, u), e.stroke();
  }
}
function bc(e, t) {
  const i = e.fillStyle;
  e.fillStyle = t.color, e.fillRect(t.left, t.top, t.width, t.height), e.fillStyle = i;
}
function Mn(e, t, i, s, n, o = {}) {
  const r = j(t) ? t : [
    t
  ], a = o.strokeWidth > 0 && o.strokeColor !== "";
  let l, c;
  for (e.save(), e.font = n.string, gc(e, o), l = 0; l < r.length; ++l)
    c = r[l], o.backdrop && bc(e, o.backdrop), a && (o.strokeColor && (e.strokeStyle = o.strokeColor), O(o.strokeWidth) || (e.lineWidth = o.strokeWidth), e.strokeText(c, i, s, o.maxWidth)), e.fillText(c, i, s, o.maxWidth), mc(e, i, s, c, o), s += Number(n.lineHeight);
  e.restore();
}
function zn(e, t) {
  const { x: i, y: s, w: n, h: o, radius: r } = t;
  e.arc(i + r.topLeft, s + r.topLeft, r.topLeft, 1.5 * K, K, !0), e.lineTo(i, s + o - r.bottomLeft), e.arc(i + r.bottomLeft, s + o - r.bottomLeft, r.bottomLeft, K, mt, !0), e.lineTo(i + n - r.bottomRight, s + o), e.arc(i + n - r.bottomRight, s + o - r.bottomRight, r.bottomRight, mt, 0, !0), e.lineTo(i + n, s + r.topRight), e.arc(i + n - r.topRight, s + r.topRight, r.topRight, 0, -mt, !0), e.lineTo(i + r.topLeft, s);
}
const vc = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, yc = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function _c(e, t) {
  const i = ("" + e).match(vc);
  if (!i || i[1] === "normal")
    return t * 1.2;
  switch (e = +i[2], i[3]) {
    case "px":
      return e;
    case "%":
      e /= 100;
      break;
  }
  return t * e;
}
const xc = (e) => +e || 0;
function ur(e, t) {
  const i = {}, s = M(t), n = s ? Object.keys(t) : t, o = M(e) ? s ? (r) => E(e[r], e[t[r]]) : (r) => e[r] : () => e;
  for (const r of n)
    i[r] = xc(o(r));
  return i;
}
function wc(e) {
  return ur(e, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function Mi(e) {
  return ur(e, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function Ut(e) {
  const t = wc(e);
  return t.width = t.left + t.right, t.height = t.top + t.bottom, t;
}
function kt(e, t) {
  e = e || {}, t = t || N.font;
  let i = E(e.size, t.size);
  typeof i == "string" && (i = parseInt(i, 10));
  let s = E(e.style, t.style);
  s && !("" + s).match(yc) && (console.warn('Invalid font style specified: "' + s + '"'), s = void 0);
  const n = {
    family: E(e.family, t.family),
    lineHeight: _c(E(e.lineHeight, t.lineHeight), i),
    size: i,
    style: s,
    weight: E(e.weight, t.weight),
    string: ""
  };
  return n.string = hc(n), n;
}
function bi(e, t, i, s) {
  let n, o, r;
  for (n = 0, o = e.length; n < o; ++n)
    if (r = e[n], r !== void 0 && r !== void 0)
      return r;
}
function kc(e, t, i) {
  const { min: s, max: n } = e, o = El(t, (n - s) / 2), r = (a, l) => i && a === 0 ? 0 : a + l;
  return {
    min: r(s, -Math.abs(o)),
    max: r(n, o)
  };
}
function he(e, t) {
  return Object.assign(Object.create(e), t);
}
function Vs(e, t = [
  ""
], i, s, n = () => e[0]) {
  const o = i || e;
  typeof s > "u" && (s = pr("_fallback", e));
  const r = {
    [Symbol.toStringTag]: "Object",
    _cacheable: !0,
    _scopes: e,
    _rootScopes: o,
    _fallback: s,
    _getTarget: n,
    override: (a) => Vs([
      a,
      ...e
    ], t, o, s)
  };
  return new Proxy(r, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(a, l) {
      return delete a[l], delete a._keys, delete e[0][l], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(a, l) {
      return dr(a, l, () => Pc(l, t, e, a));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(a, l) {
      return Reflect.getOwnPropertyDescriptor(a._scopes[0], l);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(e[0]);
    },
    /**
    * A trap for the in operator.
    */
    has(a, l) {
      return Pn(a).includes(l);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(a) {
      return Pn(a);
    },
    /**
    * A trap for setting property values.
    */
    set(a, l, c) {
      const u = a._storage || (a._storage = n());
      return a[l] = u[l] = c, delete a._keys, !0;
    }
  });
}
function ve(e, t, i, s) {
  const n = {
    _cacheable: !1,
    _proxy: e,
    _context: t,
    _subProxy: i,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: hr(e, s),
    setContext: (o) => ve(e, o, i, s),
    override: (o) => ve(e.override(o), t, i, s)
  };
  return new Proxy(n, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(o, r) {
      return delete o[r], delete e[r], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(o, r, a) {
      return dr(o, r, () => $c(o, r, a));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(o, r) {
      return o._descriptors.allKeys ? Reflect.has(e, r) ? {
        enumerable: !0,
        configurable: !0
      } : void 0 : Reflect.getOwnPropertyDescriptor(e, r);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(e);
    },
    /**
    * A trap for the in operator.
    */
    has(o, r) {
      return Reflect.has(e, r);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys() {
      return Reflect.ownKeys(e);
    },
    /**
    * A trap for setting property values.
    */
    set(o, r, a) {
      return e[r] = a, delete o[r], !0;
    }
  });
}
function hr(e, t = {
  scriptable: !0,
  indexable: !0
}) {
  const { _scriptable: i = t.scriptable, _indexable: s = t.indexable, _allKeys: n = t.allKeys } = e;
  return {
    allKeys: n,
    scriptable: i,
    indexable: s,
    isScriptable: Vt(i) ? i : () => i,
    isIndexable: Vt(s) ? s : () => s
  };
}
const Sc = (e, t) => e ? e + Rs(t) : t, Us = (e, t) => M(t) && e !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function dr(e, t, i) {
  if (Object.prototype.hasOwnProperty.call(e, t) || t === "constructor")
    return e[t];
  const s = i();
  return e[t] = s, s;
}
function $c(e, t, i) {
  const { _proxy: s, _context: n, _subProxy: o, _descriptors: r } = e;
  let a = s[t];
  return Vt(a) && r.isScriptable(t) && (a = Dc(t, a, e, i)), j(a) && a.length && (a = Cc(t, a, e, r.isIndexable)), Us(t, a) && (a = ve(a, n, o && o[t], r)), a;
}
function Dc(e, t, i, s) {
  const { _proxy: n, _context: o, _subProxy: r, _stack: a } = i;
  if (a.has(e))
    throw new Error("Recursion detected: " + Array.from(a).join("->") + "->" + e);
  a.add(e);
  let l = t(o, r || s);
  return a.delete(e), Us(e, l) && (l = Ws(n._scopes, n, e, l)), l;
}
function Cc(e, t, i, s) {
  const { _proxy: n, _context: o, _subProxy: r, _descriptors: a } = i;
  if (typeof o.index < "u" && s(e))
    return t[o.index % t.length];
  if (M(t[0])) {
    const l = t, c = n._scopes.filter((u) => u !== l);
    t = [];
    for (const u of l) {
      const h = Ws(c, n, e, u);
      t.push(ve(h, o, r && r[e], a));
    }
  }
  return t;
}
function fr(e, t, i) {
  return Vt(e) ? e(t, i) : e;
}
const Mc = (e, t) => e === !0 ? t : typeof e == "string" ? Li(t, e) : void 0;
function zc(e, t, i, s, n) {
  for (const o of t) {
    const r = Mc(i, o);
    if (r) {
      e.add(r);
      const a = fr(r._fallback, i, n);
      if (typeof a < "u" && a !== i && a !== s)
        return a;
    } else if (r === !1 && typeof s < "u" && i !== s)
      return null;
  }
  return !1;
}
function Ws(e, t, i, s) {
  const n = t._rootScopes, o = fr(t._fallback, i, s), r = [
    ...e,
    ...n
  ], a = /* @__PURE__ */ new Set();
  a.add(s);
  let l = Tn(a, r, i, o || i, s);
  return l === null || typeof o < "u" && o !== i && (l = Tn(a, r, o, l, s), l === null) ? !1 : Vs(Array.from(a), [
    ""
  ], n, o, () => Tc(t, i, s));
}
function Tn(e, t, i, s, n) {
  for (; i; )
    i = zc(e, t, i, s, n);
  return i;
}
function Tc(e, t, i) {
  const s = e._getTarget();
  t in s || (s[t] = {});
  const n = s[t];
  return j(n) && M(i) ? i : n || {};
}
function Pc(e, t, i, s) {
  let n;
  for (const o of t)
    if (n = pr(Sc(o, e), i), typeof n < "u")
      return Us(e, n) ? Ws(i, s, e, n) : n;
}
function pr(e, t) {
  for (const i of t) {
    if (!i)
      continue;
    const s = i[e];
    if (typeof s < "u")
      return s;
  }
}
function Pn(e) {
  let t = e._keys;
  return t || (t = e._keys = Ec(e._scopes)), t;
}
function Ec(e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of Object.keys(i).filter((n) => !n.startsWith("_")))
      t.add(s);
  return Array.from(t);
}
const Oc = Number.EPSILON || 1e-14, ye = (e, t) => t < e.length && !e[t].skip && e[t], gr = (e) => e === "x" ? "y" : "x";
function Ac(e, t, i, s) {
  const n = e.skip ? t : e, o = t, r = i.skip ? t : i, a = gs(o, n), l = gs(r, o);
  let c = a / (a + l), u = l / (a + l);
  c = isNaN(c) ? 0 : c, u = isNaN(u) ? 0 : u;
  const h = s * c, d = s * u;
  return {
    previous: {
      x: o.x - h * (r.x - n.x),
      y: o.y - h * (r.y - n.y)
    },
    next: {
      x: o.x + d * (r.x - n.x),
      y: o.y + d * (r.y - n.y)
    }
  };
}
function Lc(e, t, i) {
  const s = e.length;
  let n, o, r, a, l, c = ye(e, 0);
  for (let u = 0; u < s - 1; ++u)
    if (l = c, c = ye(e, u + 1), !(!l || !c)) {
      if (He(t[u], 0, Oc)) {
        i[u] = i[u + 1] = 0;
        continue;
      }
      n = i[u] / t[u], o = i[u + 1] / t[u], a = Math.pow(n, 2) + Math.pow(o, 2), !(a <= 9) && (r = 3 / Math.sqrt(a), i[u] = n * r * t[u], i[u + 1] = o * r * t[u]);
    }
}
function Rc(e, t, i = "x") {
  const s = gr(i), n = e.length;
  let o, r, a, l = ye(e, 0);
  for (let c = 0; c < n; ++c) {
    if (r = a, a = l, l = ye(e, c + 1), !a)
      continue;
    const u = a[i], h = a[s];
    r && (o = (u - r[i]) / 3, a[`cp1${i}`] = u - o, a[`cp1${s}`] = h - o * t[c]), l && (o = (l[i] - u) / 3, a[`cp2${i}`] = u + o, a[`cp2${s}`] = h + o * t[c]);
  }
}
function Fc(e, t = "x") {
  const i = gr(t), s = e.length, n = Array(s).fill(0), o = Array(s);
  let r, a, l, c = ye(e, 0);
  for (r = 0; r < s; ++r)
    if (a = l, l = c, c = ye(e, r + 1), !!l) {
      if (c) {
        const u = c[t] - l[t];
        n[r] = u !== 0 ? (c[i] - l[i]) / u : 0;
      }
      o[r] = a ? c ? be(n[r - 1]) !== be(n[r]) ? 0 : (n[r - 1] + n[r]) / 2 : n[r - 1] : n[r];
    }
  Lc(e, n, o), Rc(e, o, t);
}
function vi(e, t, i) {
  return Math.max(Math.min(e, i), t);
}
function Ic(e, t) {
  let i, s, n, o, r, a = Ge(e[0], t);
  for (i = 0, s = e.length; i < s; ++i)
    r = o, o = a, a = i < s - 1 && Ge(e[i + 1], t), o && (n = e[i], r && (n.cp1x = vi(n.cp1x, t.left, t.right), n.cp1y = vi(n.cp1y, t.top, t.bottom)), a && (n.cp2x = vi(n.cp2x, t.left, t.right), n.cp2y = vi(n.cp2y, t.top, t.bottom)));
}
function Nc(e, t, i, s, n) {
  let o, r, a, l;
  if (t.spanGaps && (e = e.filter((c) => !c.skip)), t.cubicInterpolationMode === "monotone")
    Fc(e, n);
  else {
    let c = s ? e[e.length - 1] : e[0];
    for (o = 0, r = e.length; o < r; ++o)
      a = e[o], l = Ac(c, a, e[Math.min(o + 1, r - (s ? 0 : 1)) % r], t.tension), a.cp1x = l.previous.x, a.cp1y = l.previous.y, a.cp2x = l.next.x, a.cp2y = l.next.y, c = a;
  }
  t.capBezierPoints && Ic(e, i);
}
function Hs() {
  return typeof window < "u" && typeof document < "u";
}
function js(e) {
  let t = e.parentNode;
  return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function Ii(e, t, i) {
  let s;
  return typeof e == "string" ? (s = parseInt(e, 10), e.indexOf("%") !== -1 && (s = s / 100 * t.parentNode[i])) : s = e, s;
}
const Ui = (e) => e.ownerDocument.defaultView.getComputedStyle(e, null);
function Bc(e, t) {
  return Ui(e).getPropertyValue(t);
}
const Vc = [
  "top",
  "right",
  "bottom",
  "left"
];
function ne(e, t, i) {
  const s = {};
  i = i ? "-" + i : "";
  for (let n = 0; n < 4; n++) {
    const o = Vc[n];
    s[o] = parseFloat(e[t + "-" + o + i]) || 0;
  }
  return s.width = s.left + s.right, s.height = s.top + s.bottom, s;
}
const Uc = (e, t, i) => (e > 0 || t > 0) && (!i || !i.shadowRoot);
function Wc(e, t) {
  const i = e.touches, s = i && i.length ? i[0] : e, { offsetX: n, offsetY: o } = s;
  let r = !1, a, l;
  if (Uc(n, o, e.target))
    a = n, l = o;
  else {
    const c = t.getBoundingClientRect();
    a = s.clientX - c.left, l = s.clientY - c.top, r = !0;
  }
  return {
    x: a,
    y: l,
    box: r
  };
}
function Gt(e, t) {
  if ("native" in e)
    return e;
  const { canvas: i, currentDevicePixelRatio: s } = t, n = Ui(i), o = n.boxSizing === "border-box", r = ne(n, "padding"), a = ne(n, "border", "width"), { x: l, y: c, box: u } = Wc(e, i), h = r.left + (u && a.left), d = r.top + (u && a.top);
  let { width: f, height: g } = t;
  return o && (f -= r.width + a.width, g -= r.height + a.height), {
    x: Math.round((l - h) / f * i.width / s),
    y: Math.round((c - d) / g * i.height / s)
  };
}
function Hc(e, t, i) {
  let s, n;
  if (t === void 0 || i === void 0) {
    const o = e && js(e);
    if (!o)
      t = e.clientWidth, i = e.clientHeight;
    else {
      const r = o.getBoundingClientRect(), a = Ui(o), l = ne(a, "border", "width"), c = ne(a, "padding");
      t = r.width - c.width - l.width, i = r.height - c.height - l.height, s = Ii(a.maxWidth, o, "clientWidth"), n = Ii(a.maxHeight, o, "clientHeight");
    }
  }
  return {
    width: t,
    height: i,
    maxWidth: s || Fi,
    maxHeight: n || Fi
  };
}
const Nt = (e) => Math.round(e * 10) / 10;
function jc(e, t, i, s) {
  const n = Ui(e), o = ne(n, "margin"), r = Ii(n.maxWidth, e, "clientWidth") || Fi, a = Ii(n.maxHeight, e, "clientHeight") || Fi, l = Hc(e, t, i);
  let { width: c, height: u } = l;
  if (n.boxSizing === "content-box") {
    const d = ne(n, "border", "width"), f = ne(n, "padding");
    c -= f.width + d.width, u -= f.height + d.height;
  }
  return c = Math.max(0, c - o.width), u = Math.max(0, s ? c / s : u - o.height), c = Nt(Math.min(c, r, l.maxWidth)), u = Nt(Math.min(u, a, l.maxHeight)), c && !u && (u = Nt(c / 2)), (t !== void 0 || i !== void 0) && s && l.height && u > l.height && (u = l.height, c = Nt(Math.floor(u * s))), {
    width: c,
    height: u
  };
}
function En(e, t, i) {
  const s = t || 1, n = Nt(e.height * s), o = Nt(e.width * s);
  e.height = Nt(e.height), e.width = Nt(e.width);
  const r = e.canvas;
  return r.style && (i || !r.style.height && !r.style.width) && (r.style.height = `${e.height}px`, r.style.width = `${e.width}px`), e.currentDevicePixelRatio !== s || r.height !== n || r.width !== o ? (e.currentDevicePixelRatio = s, r.height = n, r.width = o, e.ctx.setTransform(s, 0, 0, s, 0, 0), !0) : !1;
}
const qc = (function() {
  let e = !1;
  try {
    const t = {
      get passive() {
        return e = !0, !1;
      }
    };
    Hs() && (window.addEventListener("test", null, t), window.removeEventListener("test", null, t));
  } catch {
  }
  return e;
})();
function On(e, t) {
  const i = Bc(e, t), s = i && i.match(/^(\d+)(\.\d+)?px$/);
  return s ? +s[1] : void 0;
}
function Qt(e, t, i, s) {
  return {
    x: e.x + i * (t.x - e.x),
    y: e.y + i * (t.y - e.y)
  };
}
function Yc(e, t, i, s) {
  return {
    x: e.x + i * (t.x - e.x),
    y: s === "middle" ? i < 0.5 ? e.y : t.y : s === "after" ? i < 1 ? e.y : t.y : i > 0 ? t.y : e.y
  };
}
function Kc(e, t, i, s) {
  const n = {
    x: e.cp2x,
    y: e.cp2y
  }, o = {
    x: t.cp1x,
    y: t.cp1y
  }, r = Qt(e, n, i), a = Qt(n, o, i), l = Qt(o, t, i), c = Qt(r, a, i), u = Qt(a, l, i);
  return Qt(c, u, i);
}
const Xc = function(e, t) {
  return {
    x(i) {
      return e + e + t - i;
    },
    setWidth(i) {
      t = i;
    },
    textAlign(i) {
      return i === "center" ? i : i === "right" ? "left" : "right";
    },
    xPlus(i, s) {
      return i - s;
    },
    leftForLtr(i, s) {
      return i - s;
    }
  };
}, Zc = function() {
  return {
    x(e) {
      return e;
    },
    setWidth(e) {
    },
    textAlign(e) {
      return e;
    },
    xPlus(e, t) {
      return e + t;
    },
    leftForLtr(e, t) {
      return e;
    }
  };
};
function es(e, t, i) {
  return e ? Xc(t, i) : Zc();
}
function Gc(e, t) {
  let i, s;
  (t === "ltr" || t === "rtl") && (i = e.canvas.style, s = [
    i.getPropertyValue("direction"),
    i.getPropertyPriority("direction")
  ], i.setProperty("direction", t, "important"), e.prevTextDirection = s);
}
function Qc(e, t) {
  t !== void 0 && (delete e.prevTextDirection, e.canvas.style.setProperty("direction", t[0], t[1]));
}
function mr(e) {
  return e === "angle" ? {
    between: sr,
    compare: ql,
    normalize: wt
  } : {
    between: nr,
    compare: (t, i) => t - i,
    normalize: (t) => t
  };
}
function An({ start: e, end: t, count: i, loop: s, style: n }) {
  return {
    start: e % i,
    end: t % i,
    loop: s && (t - e + 1) % i === 0,
    style: n
  };
}
function Jc(e, t, i) {
  const { property: s, start: n, end: o } = i, { between: r, normalize: a } = mr(s), l = t.length;
  let { start: c, end: u, loop: h } = e, d, f;
  if (h) {
    for (c += l, u += l, d = 0, f = l; d < f && r(a(t[c % l][s]), n, o); ++d)
      c--, u--;
    c %= l, u %= l;
  }
  return u < c && (u += l), {
    start: c,
    end: u,
    loop: h,
    style: e.style
  };
}
function br(e, t, i) {
  if (!i)
    return [
      e
    ];
  const { property: s, start: n, end: o } = i, r = t.length, { compare: a, between: l, normalize: c } = mr(s), { start: u, end: h, loop: d, style: f } = Jc(e, t, i), g = [];
  let p = !1, m = null, b, x, k;
  const w = () => l(n, k, b) && a(n, k) !== 0, y = () => a(o, b) === 0 || l(o, k, b), D = () => p || w(), S = () => !p || y();
  for (let $ = u, C = u; $ <= h; ++$)
    x = t[$ % r], !x.skip && (b = c(x[s]), b !== k && (p = l(b, n, o), m === null && D() && (m = a(b, n) === 0 ? $ : C), m !== null && S() && (g.push(An({
      start: m,
      end: $,
      loop: d,
      count: r,
      style: f
    })), m = null), C = $, k = b));
  return m !== null && g.push(An({
    start: m,
    end: h,
    loop: d,
    count: r,
    style: f
  })), g;
}
function vr(e, t) {
  const i = [], s = e.segments;
  for (let n = 0; n < s.length; n++) {
    const o = br(s[n], e.points, t);
    o.length && i.push(...o);
  }
  return i;
}
function tu(e, t, i, s) {
  let n = 0, o = t - 1;
  if (i && !s)
    for (; n < t && !e[n].skip; )
      n++;
  for (; n < t && e[n].skip; )
    n++;
  for (n %= t, i && (o += n); o > n && e[o % t].skip; )
    o--;
  return o %= t, {
    start: n,
    end: o
  };
}
function eu(e, t, i, s) {
  const n = e.length, o = [];
  let r = t, a = e[t], l;
  for (l = t + 1; l <= i; ++l) {
    const c = e[l % n];
    c.skip || c.stop ? a.skip || (s = !1, o.push({
      start: t % n,
      end: (l - 1) % n,
      loop: s
    }), t = r = c.stop ? l : null) : (r = l, a.skip && (t = l)), a = c;
  }
  return r !== null && o.push({
    start: t % n,
    end: r % n,
    loop: s
  }), o;
}
function iu(e, t) {
  const i = e.points, s = e.options.spanGaps, n = i.length;
  if (!n)
    return [];
  const o = !!e._loop, { start: r, end: a } = tu(i, n, o, s);
  if (s === !0)
    return Ln(e, [
      {
        start: r,
        end: a,
        loop: o
      }
    ], i, t);
  const l = a < r ? a + n : a, c = !!e._fullLoop && r === 0 && a === n - 1;
  return Ln(e, eu(i, r, l, c), i, t);
}
function Ln(e, t, i, s) {
  return !s || !s.setContext || !i ? t : su(e, t, i, s);
}
function su(e, t, i, s) {
  const n = e._chart.getContext(), o = Rn(e.options), { _datasetIndex: r, options: { spanGaps: a } } = e, l = i.length, c = [];
  let u = o, h = t[0].start, d = h;
  function f(g, p, m, b) {
    const x = a ? -1 : 1;
    if (g !== p) {
      for (g += l; i[g % l].skip; )
        g -= x;
      for (; i[p % l].skip; )
        p += x;
      g % l !== p % l && (c.push({
        start: g % l,
        end: p % l,
        loop: m,
        style: b
      }), u = b, h = p % l);
    }
  }
  for (const g of t) {
    h = a ? h : g.start;
    let p = i[h % l], m;
    for (d = h + 1; d <= g.end; d++) {
      const b = i[d % l];
      m = Rn(s.setContext(he(n, {
        type: "segment",
        p0: p,
        p1: b,
        p0DataIndex: (d - 1) % l,
        p1DataIndex: d % l,
        datasetIndex: r
      }))), nu(m, u) && f(h, d - 1, g.loop, u), p = b, u = m;
    }
    h < d - 1 && f(h, d - 1, g.loop, u);
  }
  return c;
}
function Rn(e) {
  return {
    backgroundColor: e.backgroundColor,
    borderCapStyle: e.borderCapStyle,
    borderDash: e.borderDash,
    borderDashOffset: e.borderDashOffset,
    borderJoinStyle: e.borderJoinStyle,
    borderWidth: e.borderWidth,
    borderColor: e.borderColor
  };
}
function nu(e, t) {
  if (!t)
    return !1;
  const i = [], s = function(n, o) {
    return Is(o) ? (i.includes(o) || i.push(o), i.indexOf(o)) : o;
  };
  return JSON.stringify(e, s) !== JSON.stringify(t, s);
}
function yi(e, t, i) {
  return e.options.clip ? e[i] : t[i];
}
function ou(e, t) {
  const { xScale: i, yScale: s } = e;
  return i && s ? {
    left: yi(i, t, "left"),
    right: yi(i, t, "right"),
    top: yi(s, t, "top"),
    bottom: yi(s, t, "bottom")
  } : t;
}
function yr(e, t) {
  const i = t._clip;
  if (i.disabled)
    return !1;
  const s = ou(t, e.chartArea);
  return {
    left: i.left === !1 ? 0 : s.left - (i.left === !0 ? 0 : i.left),
    right: i.right === !1 ? e.width : s.right + (i.right === !0 ? 0 : i.right),
    top: i.top === !1 ? 0 : s.top - (i.top === !0 ? 0 : i.top),
    bottom: i.bottom === !1 ? e.height : s.bottom + (i.bottom === !0 ? 0 : i.bottom)
  };
}
class ru {
  constructor() {
    this._request = null, this._charts = /* @__PURE__ */ new Map(), this._running = !1, this._lastDate = void 0;
  }
  _notify(t, i, s, n) {
    const o = i.listeners[n], r = i.duration;
    o.forEach((a) => a({
      chart: t,
      initial: i.initial,
      numSteps: r,
      currentStep: Math.min(s - i.start, r)
    }));
  }
  _refresh() {
    this._request || (this._running = !0, this._request = rr.call(window, () => {
      this._update(), this._request = null, this._running && this._refresh();
    }));
  }
  _update(t = Date.now()) {
    let i = 0;
    this._charts.forEach((s, n) => {
      if (!s.running || !s.items.length)
        return;
      const o = s.items;
      let r = o.length - 1, a = !1, l;
      for (; r >= 0; --r)
        l = o[r], l._active ? (l._total > s.duration && (s.duration = l._total), l.tick(t), a = !0) : (o[r] = o[o.length - 1], o.pop());
      a && (n.draw(), this._notify(n, s, t, "progress")), o.length || (s.running = !1, this._notify(n, s, t, "complete"), s.initial = !1), i += o.length;
    }), this._lastDate = t, i === 0 && (this._running = !1);
  }
  _getAnims(t) {
    const i = this._charts;
    let s = i.get(t);
    return s || (s = {
      running: !1,
      initial: !0,
      items: [],
      listeners: {
        complete: [],
        progress: []
      }
    }, i.set(t, s)), s;
  }
  listen(t, i, s) {
    this._getAnims(t).listeners[i].push(s);
  }
  add(t, i) {
    !i || !i.length || this._getAnims(t).items.push(...i);
  }
  has(t) {
    return this._getAnims(t).items.length > 0;
  }
  start(t) {
    const i = this._charts.get(t);
    i && (i.running = !0, i.start = Date.now(), i.duration = i.items.reduce((s, n) => Math.max(s, n._duration), 0), this._refresh());
  }
  running(t) {
    if (!this._running)
      return !1;
    const i = this._charts.get(t);
    return !(!i || !i.running || !i.items.length);
  }
  stop(t) {
    const i = this._charts.get(t);
    if (!i || !i.items.length)
      return;
    const s = i.items;
    let n = s.length - 1;
    for (; n >= 0; --n)
      s[n].cancel();
    i.items = [], this._notify(t, i, Date.now(), "complete");
  }
  remove(t) {
    return this._charts.delete(t);
  }
}
var zt = /* @__PURE__ */ new ru();
const Fn = "transparent", au = {
  boolean(e, t, i) {
    return i > 0.5 ? t : e;
  },
  color(e, t, i) {
    const s = Sn(e || Fn), n = s.valid && Sn(t || Fn);
    return n && n.valid ? n.mix(s, i).hexString() : t;
  },
  number(e, t, i) {
    return e + (t - e) * i;
  }
};
class lu {
  constructor(t, i, s, n) {
    const o = i[s];
    n = bi([
      t.to,
      n,
      o,
      t.from
    ]);
    const r = bi([
      t.from,
      o,
      n
    ]);
    this._active = !0, this._fn = t.fn || au[t.type || typeof r], this._easing = je[t.easing] || je.linear, this._start = Math.floor(Date.now() + (t.delay || 0)), this._duration = this._total = Math.floor(t.duration), this._loop = !!t.loop, this._target = i, this._prop = s, this._from = r, this._to = n, this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(t, i, s) {
    if (this._active) {
      this._notify(!1);
      const n = this._target[this._prop], o = s - this._start, r = this._duration - o;
      this._start = s, this._duration = Math.floor(Math.max(r, t.duration)), this._total += o, this._loop = !!t.loop, this._to = bi([
        t.to,
        i,
        n,
        t.from
      ]), this._from = bi([
        t.from,
        n,
        i
      ]);
    }
  }
  cancel() {
    this._active && (this.tick(Date.now()), this._active = !1, this._notify(!1));
  }
  tick(t) {
    const i = t - this._start, s = this._duration, n = this._prop, o = this._from, r = this._loop, a = this._to;
    let l;
    if (this._active = o !== a && (r || i < s), !this._active) {
      this._target[n] = a, this._notify(!0);
      return;
    }
    if (i < 0) {
      this._target[n] = o;
      return;
    }
    l = i / s % 2, l = r && l > 1 ? 2 - l : l, l = this._easing(Math.min(1, Math.max(0, l))), this._target[n] = this._fn(o, a, l);
  }
  wait() {
    const t = this._promises || (this._promises = []);
    return new Promise((i, s) => {
      t.push({
        res: i,
        rej: s
      });
    });
  }
  _notify(t) {
    const i = t ? "res" : "rej", s = this._promises || [];
    for (let n = 0; n < s.length; n++)
      s[n][i]();
  }
}
class _r {
  constructor(t, i) {
    this._chart = t, this._properties = /* @__PURE__ */ new Map(), this.configure(i);
  }
  configure(t) {
    if (!M(t))
      return;
    const i = Object.keys(N.animation), s = this._properties;
    Object.getOwnPropertyNames(t).forEach((n) => {
      const o = t[n];
      if (!M(o))
        return;
      const r = {};
      for (const a of i)
        r[a] = o[a];
      (j(o.properties) && o.properties || [
        n
      ]).forEach((a) => {
        (a === n || !s.has(a)) && s.set(a, r);
      });
    });
  }
  _animateOptions(t, i) {
    const s = i.options, n = uu(t, s);
    if (!n)
      return [];
    const o = this._createAnimations(n, s);
    return s.$shared && cu(t.options.$animations, s).then(() => {
      t.options = s;
    }, () => {
    }), o;
  }
  _createAnimations(t, i) {
    const s = this._properties, n = [], o = t.$animations || (t.$animations = {}), r = Object.keys(i), a = Date.now();
    let l;
    for (l = r.length - 1; l >= 0; --l) {
      const c = r[l];
      if (c.charAt(0) === "$")
        continue;
      if (c === "options") {
        n.push(...this._animateOptions(t, i));
        continue;
      }
      const u = i[c];
      let h = o[c];
      const d = s.get(c);
      if (h)
        if (d && h.active()) {
          h.update(d, u, a);
          continue;
        } else
          h.cancel();
      if (!d || !d.duration) {
        t[c] = u;
        continue;
      }
      o[c] = h = new lu(d, t, c, u), n.push(h);
    }
    return n;
  }
  update(t, i) {
    if (this._properties.size === 0) {
      Object.assign(t, i);
      return;
    }
    const s = this._createAnimations(t, i);
    if (s.length)
      return zt.add(this._chart, s), !0;
  }
}
function cu(e, t) {
  const i = [], s = Object.keys(t);
  for (let n = 0; n < s.length; n++) {
    const o = e[s[n]];
    o && o.active() && i.push(o.wait());
  }
  return Promise.all(i);
}
function uu(e, t) {
  if (!t)
    return;
  let i = e.options;
  if (!i) {
    e.options = t;
    return;
  }
  return i.$shared && (e.options = i = Object.assign({}, i, {
    $shared: !1,
    $animations: {}
  })), i;
}
function In(e, t) {
  const i = e && e.options || {}, s = i.reverse, n = i.min === void 0 ? t : 0, o = i.max === void 0 ? t : 0;
  return {
    start: s ? o : n,
    end: s ? n : o
  };
}
function hu(e, t, i) {
  if (i === !1)
    return !1;
  const s = In(e, i), n = In(t, i);
  return {
    top: n.end,
    right: s.end,
    bottom: n.start,
    left: s.start
  };
}
function du(e) {
  let t, i, s, n;
  return M(e) ? (t = e.top, i = e.right, s = e.bottom, n = e.left) : t = i = s = n = e, {
    top: t,
    right: i,
    bottom: s,
    left: n,
    disabled: e === !1
  };
}
function xr(e, t) {
  const i = [], s = e._getSortedDatasetMetas(t);
  let n, o;
  for (n = 0, o = s.length; n < o; ++n)
    i.push(s[n].index);
  return i;
}
function Nn(e, t, i, s = {}) {
  const n = e.keys, o = s.mode === "single";
  let r, a, l, c;
  if (t === null)
    return;
  let u = !1;
  for (r = 0, a = n.length; r < a; ++r) {
    if (l = +n[r], l === i) {
      if (u = !0, s.all)
        continue;
      break;
    }
    c = e.values[l], X(c) && (o || t === 0 || be(t) === be(c)) && (t += c);
  }
  return !u && !s.all ? 0 : t;
}
function fu(e, t) {
  const { iScale: i, vScale: s } = t, n = i.axis === "x" ? "x" : "y", o = s.axis === "x" ? "x" : "y", r = Object.keys(e), a = new Array(r.length);
  let l, c, u;
  for (l = 0, c = r.length; l < c; ++l)
    u = r[l], a[l] = {
      [n]: u,
      [o]: e[u]
    };
  return a;
}
function is(e, t) {
  const i = e && e.options.stacked;
  return i || i === void 0 && t.stack !== void 0;
}
function pu(e, t, i) {
  return `${e.id}.${t.id}.${i.stack || i.type}`;
}
function gu(e) {
  const { min: t, max: i, minDefined: s, maxDefined: n } = e.getUserBounds();
  return {
    min: s ? t : Number.NEGATIVE_INFINITY,
    max: n ? i : Number.POSITIVE_INFINITY
  };
}
function mu(e, t, i) {
  const s = e[t] || (e[t] = {});
  return s[i] || (s[i] = {});
}
function Bn(e, t, i, s) {
  for (const n of t.getMatchingVisibleMetas(s).reverse()) {
    const o = e[n.index];
    if (i && o > 0 || !i && o < 0)
      return n.index;
  }
  return null;
}
function Vn(e, t) {
  const { chart: i, _cachedMeta: s } = e, n = i._stacks || (i._stacks = {}), { iScale: o, vScale: r, index: a } = s, l = o.axis, c = r.axis, u = pu(o, r, s), h = t.length;
  let d;
  for (let f = 0; f < h; ++f) {
    const g = t[f], { [l]: p, [c]: m } = g, b = g._stacks || (g._stacks = {});
    d = b[c] = mu(n, u, p), d[a] = m, d._top = Bn(d, r, !0, s.type), d._bottom = Bn(d, r, !1, s.type);
    const x = d._visualValues || (d._visualValues = {});
    x[a] = m;
  }
}
function ss(e, t) {
  const i = e.scales;
  return Object.keys(i).filter((s) => i[s].axis === t).shift();
}
function bu(e, t) {
  return he(e, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: "default",
    type: "dataset"
  });
}
function vu(e, t, i) {
  return he(e, {
    active: !1,
    dataIndex: t,
    parsed: void 0,
    raw: void 0,
    element: i,
    index: t,
    mode: "default",
    type: "data"
  });
}
function Me(e, t) {
  const i = e.controller.index, s = e.vScale && e.vScale.axis;
  if (s) {
    t = t || e._parsed;
    for (const n of t) {
      const o = n._stacks;
      if (!o || o[s] === void 0 || o[s][i] === void 0)
        return;
      delete o[s][i], o[s]._visualValues !== void 0 && o[s]._visualValues[i] !== void 0 && delete o[s]._visualValues[i];
    }
  }
}
const ns = (e) => e === "reset" || e === "none", Un = (e, t) => t ? e : Object.assign({}, e), yu = (e, t, i) => e && !t.hidden && t._stacked && {
  keys: xr(i, !0),
  values: null
};
class wr {
  static defaults = {};
  static datasetElementType = null;
  static dataElementType = null;
  constructor(t, i) {
    this.chart = t, this._ctx = t.ctx, this.index = i, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.datasetElementType = new.target.datasetElementType, this.dataElementType = new.target.dataElementType, this.initialize();
  }
  initialize() {
    const t = this._cachedMeta;
    this.configure(), this.linkScales(), t._stacked = is(t.vScale, t), this.addElements(), this.options.fill && !this.chart.isPluginEnabled("filler") && console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
  }
  updateIndex(t) {
    this.index !== t && Me(this._cachedMeta), this.index = t;
  }
  linkScales() {
    const t = this.chart, i = this._cachedMeta, s = this.getDataset(), n = (h, d, f, g) => h === "x" ? d : h === "r" ? g : f, o = i.xAxisID = E(s.xAxisID, ss(t, "x")), r = i.yAxisID = E(s.yAxisID, ss(t, "y")), a = i.rAxisID = E(s.rAxisID, ss(t, "r")), l = i.indexAxis, c = i.iAxisID = n(l, o, r, a), u = i.vAxisID = n(l, r, o, a);
    i.xScale = this.getScaleForId(o), i.yScale = this.getScaleForId(r), i.rScale = this.getScaleForId(a), i.iScale = this.getScaleForId(c), i.vScale = this.getScaleForId(u);
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(t) {
    return this.chart.scales[t];
  }
  _getOtherScale(t) {
    const i = this._cachedMeta;
    return t === i.iScale ? i.vScale : i.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const t = this._cachedMeta;
    this._data && _n(this._data, this), t._stacked && Me(t);
  }
  _dataCheck() {
    const t = this.getDataset(), i = t.data || (t.data = []), s = this._data;
    if (M(i)) {
      const n = this._cachedMeta;
      this._data = fu(i, n);
    } else if (s !== i) {
      if (s) {
        _n(s, this);
        const n = this._cachedMeta;
        Me(n), n._parsed = [];
      }
      i && Object.isExtensible(i) && Zl(i, this), this._syncList = [], this._data = i;
    }
  }
  addElements() {
    const t = this._cachedMeta;
    this._dataCheck(), this.datasetElementType && (t.dataset = new this.datasetElementType());
  }
  buildOrUpdateElements(t) {
    const i = this._cachedMeta, s = this.getDataset();
    let n = !1;
    this._dataCheck();
    const o = i._stacked;
    i._stacked = is(i.vScale, i), i.stack !== s.stack && (n = !0, Me(i), i.stack = s.stack), this._resyncElements(t), (n || o !== i._stacked) && (Vn(this, i._parsed), i._stacked = is(i.vScale, i));
  }
  configure() {
    const t = this.chart.config, i = t.datasetScopeKeys(this._type), s = t.getOptionScopes(this.getDataset(), i, !0);
    this.options = t.createResolver(s, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {};
  }
  parse(t, i) {
    const { _cachedMeta: s, _data: n } = this, { iScale: o, _stacked: r } = s, a = o.axis;
    let l = t === 0 && i === n.length ? !0 : s._sorted, c = t > 0 && s._parsed[t - 1], u, h, d;
    if (this._parsing === !1)
      s._parsed = n, s._sorted = !0, d = n;
    else {
      j(n[t]) ? d = this.parseArrayData(s, n, t, i) : M(n[t]) ? d = this.parseObjectData(s, n, t, i) : d = this.parsePrimitiveData(s, n, t, i);
      const f = () => h[a] === null || c && h[a] < c[a];
      for (u = 0; u < i; ++u)
        s._parsed[u + t] = h = d[u], l && (f() && (l = !1), c = h);
      s._sorted = l;
    }
    r && Vn(this, d);
  }
  parsePrimitiveData(t, i, s, n) {
    const { iScale: o, vScale: r } = t, a = o.axis, l = r.axis, c = o.getLabels(), u = o === r, h = new Array(n);
    let d, f, g;
    for (d = 0, f = n; d < f; ++d)
      g = d + s, h[d] = {
        [a]: u || o.parse(c[g], g),
        [l]: r.parse(i[g], g)
      };
    return h;
  }
  parseArrayData(t, i, s, n) {
    const { xScale: o, yScale: r } = t, a = new Array(n);
    let l, c, u, h;
    for (l = 0, c = n; l < c; ++l)
      u = l + s, h = i[u], a[l] = {
        x: o.parse(h[0], u),
        y: r.parse(h[1], u)
      };
    return a;
  }
  parseObjectData(t, i, s, n) {
    const { xScale: o, yScale: r } = t, { xAxisKey: a = "x", yAxisKey: l = "y" } = this._parsing, c = new Array(n);
    let u, h, d, f;
    for (u = 0, h = n; u < h; ++u)
      d = u + s, f = i[d], c[u] = {
        x: o.parse(Li(f, a), d),
        y: r.parse(Li(f, l), d)
      };
    return c;
  }
  getParsed(t) {
    return this._cachedMeta._parsed[t];
  }
  getDataElement(t) {
    return this._cachedMeta.data[t];
  }
  applyStack(t, i, s) {
    const n = this.chart, o = this._cachedMeta, r = i[t.axis], a = {
      keys: xr(n, !0),
      values: i._stacks[t.axis]._visualValues
    };
    return Nn(a, r, o.index, {
      mode: s
    });
  }
  updateRangeFromParsed(t, i, s, n) {
    const o = s[i.axis];
    let r = o === null ? NaN : o;
    const a = n && s._stacks[i.axis];
    n && a && (n.values = a, r = Nn(n, o, this._cachedMeta.index)), t.min = Math.min(t.min, r), t.max = Math.max(t.max, r);
  }
  getMinMax(t, i) {
    const s = this._cachedMeta, n = s._parsed, o = s._sorted && t === s.iScale, r = n.length, a = this._getOtherScale(t), l = yu(i, s, this.chart), c = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    }, { min: u, max: h } = gu(a);
    let d, f;
    function g() {
      f = n[d];
      const p = f[a.axis];
      return !X(f[t.axis]) || u > p || h < p;
    }
    for (d = 0; d < r && !(!g() && (this.updateRangeFromParsed(c, t, f, l), o)); ++d)
      ;
    if (o) {
      for (d = r - 1; d >= 0; --d)
        if (!g()) {
          this.updateRangeFromParsed(c, t, f, l);
          break;
        }
    }
    return c;
  }
  getAllParsedValues(t) {
    const i = this._cachedMeta._parsed, s = [];
    let n, o, r;
    for (n = 0, o = i.length; n < o; ++n)
      r = i[n][t.axis], X(r) && s.push(r);
    return s;
  }
  getMaxOverflow() {
    return !1;
  }
  getLabelAndValue(t) {
    const i = this._cachedMeta, s = i.iScale, n = i.vScale, o = this.getParsed(t);
    return {
      label: s ? "" + s.getLabelForValue(o[s.axis]) : "",
      value: n ? "" + n.getLabelForValue(o[n.axis]) : ""
    };
  }
  _update(t) {
    const i = this._cachedMeta;
    this.update(t || "default"), i._clip = du(E(this.options.clip, hu(i.xScale, i.yScale, this.getMaxOverflow())));
  }
  update(t) {
  }
  draw() {
    const t = this._ctx, i = this.chart, s = this._cachedMeta, n = s.data || [], o = i.chartArea, r = [], a = this._drawStart || 0, l = this._drawCount || n.length - a, c = this.options.drawActiveElementsOnTop;
    let u;
    for (s.dataset && s.dataset.draw(t, o, a, l), u = a; u < a + l; ++u) {
      const h = n[u];
      h.hidden || (h.active && c ? r.push(h) : h.draw(t, o));
    }
    for (u = 0; u < r.length; ++u)
      r[u].draw(t, o);
  }
  getStyle(t, i) {
    const s = i ? "active" : "default";
    return t === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(s) : this.resolveDataElementOptions(t || 0, s);
  }
  getContext(t, i, s) {
    const n = this.getDataset();
    let o;
    if (t >= 0 && t < this._cachedMeta.data.length) {
      const r = this._cachedMeta.data[t];
      o = r.$context || (r.$context = vu(this.getContext(), t, r)), o.parsed = this.getParsed(t), o.raw = n.data[t], o.index = o.dataIndex = t;
    } else
      o = this.$context || (this.$context = bu(this.chart.getContext(), this.index)), o.dataset = n, o.index = o.datasetIndex = this.index;
    return o.active = !!i, o.mode = s, o;
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t);
  }
  resolveDataElementOptions(t, i) {
    return this._resolveElementOptions(this.dataElementType.id, i, t);
  }
  _resolveElementOptions(t, i = "default", s) {
    const n = i === "active", o = this._cachedDataOpts, r = t + "-" + i, a = o[r], l = this.enableOptionSharing && Ri(s);
    if (a)
      return Un(a, l);
    const c = this.chart.config, u = c.datasetElementScopeKeys(this._type, t), h = n ? [
      `${t}Hover`,
      "hover",
      t,
      ""
    ] : [
      t,
      ""
    ], d = c.getOptionScopes(this.getDataset(), u), f = Object.keys(N.elements[t]), g = () => this.getContext(s, n, i), p = c.resolveNamedOptions(d, f, g, h);
    return p.$shared && (p.$shared = l, o[r] = Object.freeze(Un(p, l))), p;
  }
  _resolveAnimations(t, i, s) {
    const n = this.chart, o = this._cachedDataOpts, r = `animation-${i}`, a = o[r];
    if (a)
      return a;
    let l;
    if (n.options.animation !== !1) {
      const u = this.chart.config, h = u.datasetAnimationScopeKeys(this._type, i), d = u.getOptionScopes(this.getDataset(), h);
      l = u.createResolver(d, this.getContext(t, s, i));
    }
    const c = new _r(n, l && l.animations);
    return l && l._cacheable && (o[r] = Object.freeze(c)), c;
  }
  getSharedOptions(t) {
    if (t.$shared)
      return this._sharedOptions || (this._sharedOptions = Object.assign({}, t));
  }
  includeOptions(t, i) {
    return !i || ns(t) || this.chart._animationsDisabled;
  }
  _getSharedOptions(t, i) {
    const s = this.resolveDataElementOptions(t, i), n = this._sharedOptions, o = this.getSharedOptions(s), r = this.includeOptions(i, o) || o !== n;
    return this.updateSharedOptions(o, i, s), {
      sharedOptions: o,
      includeOptions: r
    };
  }
  updateElement(t, i, s, n) {
    ns(n) ? Object.assign(t, s) : this._resolveAnimations(i, n).update(t, s);
  }
  updateSharedOptions(t, i, s) {
    t && !ns(i) && this._resolveAnimations(void 0, i).update(t, s);
  }
  _setStyle(t, i, s, n) {
    t.active = n;
    const o = this.getStyle(i, n);
    this._resolveAnimations(i, s, n).update(t, {
      options: !n && this.getSharedOptions(o) || o
    });
  }
  removeHoverStyle(t, i, s) {
    this._setStyle(t, s, "active", !1);
  }
  setHoverStyle(t, i, s) {
    this._setStyle(t, s, "active", !0);
  }
  _removeDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !1);
  }
  _setDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !0);
  }
  _resyncElements(t) {
    const i = this._data, s = this._cachedMeta.data;
    for (const [a, l, c] of this._syncList)
      this[a](l, c);
    this._syncList = [];
    const n = s.length, o = i.length, r = Math.min(o, n);
    r && this.parse(0, r), o > n ? this._insertElements(n, o - n, t) : o < n && this._removeElements(o, n - o);
  }
  _insertElements(t, i, s = !0) {
    const n = this._cachedMeta, o = n.data, r = t + i;
    let a;
    const l = (c) => {
      for (c.length += i, a = c.length - 1; a >= r; a--)
        c[a] = c[a - i];
    };
    for (l(o), a = t; a < r; ++a)
      o[a] = new this.dataElementType();
    this._parsing && l(n._parsed), this.parse(t, i), s && this.updateElements(o, t, i, "reset");
  }
  updateElements(t, i, s, n) {
  }
  _removeElements(t, i) {
    const s = this._cachedMeta;
    if (this._parsing) {
      const n = s._parsed.splice(t, i);
      s._stacked && Me(s, n);
    }
    s.data.splice(t, i);
  }
  _sync(t) {
    if (this._parsing)
      this._syncList.push(t);
    else {
      const [i, s, n] = t;
      this[i](s, n);
    }
    this.chart._dataChanges.push([
      this.index,
      ...t
    ]);
  }
  _onDataPush() {
    const t = arguments.length;
    this._sync([
      "_insertElements",
      this.getDataset().data.length - t,
      t
    ]);
  }
  _onDataPop() {
    this._sync([
      "_removeElements",
      this._cachedMeta.data.length - 1,
      1
    ]);
  }
  _onDataShift() {
    this._sync([
      "_removeElements",
      0,
      1
    ]);
  }
  _onDataSplice(t, i) {
    i && this._sync([
      "_removeElements",
      t,
      i
    ]);
    const s = arguments.length - 2;
    s && this._sync([
      "_insertElements",
      t,
      s
    ]);
  }
  _onDataUnshift() {
    this._sync([
      "_insertElements",
      0,
      arguments.length
    ]);
  }
}
class _u extends wr {
  static id = "line";
  static defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    showLine: !0,
    spanGaps: !1
  };
  static overrides = {
    scales: {
      _index_: {
        type: "category"
      },
      _value_: {
        type: "linear"
      }
    }
  };
  initialize() {
    this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
  }
  update(t) {
    const i = this._cachedMeta, { dataset: s, data: n = [], _dataset: o } = i, r = this.chart._animationsDisabled;
    let { start: a, count: l } = tc(i, n, r);
    this._drawStart = a, this._drawCount = l, ec(i) && (a = 0, l = n.length), s._chart = this.chart, s._datasetIndex = this.index, s._decimated = !!o._decimated, s.points = n;
    const c = this.resolveDatasetElementOptions(t);
    this.options.showLine || (c.borderWidth = 0), c.segment = this.options.segment, this.updateElement(s, void 0, {
      animated: !r,
      options: c
    }, t), this.updateElements(n, a, l, t);
  }
  updateElements(t, i, s, n) {
    const o = n === "reset", { iScale: r, vScale: a, _stacked: l, _dataset: c } = this._cachedMeta, { sharedOptions: u, includeOptions: h } = this._getSharedOptions(i, n), d = r.axis, f = a.axis, { spanGaps: g, segment: p } = this.options, m = Ze(g) ? g : Number.POSITIVE_INFINITY, b = this.chart._animationsDisabled || o || n === "none", x = i + s, k = t.length;
    let w = i > 0 && this.getParsed(i - 1);
    for (let y = 0; y < k; ++y) {
      const D = t[y], S = b ? D : {};
      if (y < i || y >= x) {
        S.skip = !0;
        continue;
      }
      const $ = this.getParsed(y), C = O($[f]), A = S[d] = r.getPixelForValue($[d], y), L = S[f] = o || C ? a.getBasePixel() : a.getPixelForValue(l ? this.applyStack(a, $, l) : $[f], y);
      S.skip = isNaN(A) || isNaN(L) || C, S.stop = y > 0 && Math.abs($[d] - w[d]) > m, p && (S.parsed = $, S.raw = c.data[y]), h && (S.options = u || this.resolveDataElementOptions(y, D.active ? "active" : n)), b || this.updateElement(D, y, S, n), w = $;
    }
  }
  getMaxOverflow() {
    const t = this._cachedMeta, i = t.dataset, s = i.options && i.options.borderWidth || 0, n = t.data || [];
    if (!n.length)
      return s;
    const o = n[0].size(this.resolveDataElementOptions(0)), r = n[n.length - 1].size(this.resolveDataElementOptions(n.length - 1));
    return Math.max(s, o, r) / 2;
  }
  draw() {
    const t = this._cachedMeta;
    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis), super.draw();
  }
}
function Zt() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
class qs {
  /**
  * Override default date adapter methods.
  * Accepts type parameter to define options type.
  * @example
  * Chart._adapters._date.override<{myAdapterOption: string}>({
  *   init() {
  *     console.log(this.options.myAdapterOption);
  *   }
  * })
  */
  static override(t) {
    Object.assign(qs.prototype, t);
  }
  options;
  constructor(t) {
    this.options = t || {};
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {
  }
  formats() {
    return Zt();
  }
  parse() {
    return Zt();
  }
  format() {
    return Zt();
  }
  add() {
    return Zt();
  }
  diff() {
    return Zt();
  }
  startOf() {
    return Zt();
  }
  endOf() {
    return Zt();
  }
}
var xu = {
  _date: qs
};
function wu(e, t, i, s) {
  const { controller: n, data: o, _sorted: r } = e, a = n._cachedMeta.iScale, l = e.dataset && e.dataset.options ? e.dataset.options.spanGaps : null;
  if (a && t === a.axis && t !== "r" && r && o.length) {
    const c = a._reversePixels ? Kl : se;
    if (s) {
      if (n._sharedOptions) {
        const u = o[0], h = typeof u.getRange == "function" && u.getRange(t);
        if (h) {
          const d = c(o, t, i - h), f = c(o, t, i + h);
          return {
            lo: d.lo,
            hi: f.hi
          };
        }
      }
    } else {
      const u = c(o, t, i);
      if (l) {
        const { vScale: h } = n._cachedMeta, { _parsed: d } = e, f = d.slice(0, u.lo + 1).reverse().findIndex((p) => !O(p[h.axis]));
        u.lo -= Math.max(0, f);
        const g = d.slice(u.hi).findIndex((p) => !O(p[h.axis]));
        u.hi += Math.max(0, g);
      }
      return u;
    }
  }
  return {
    lo: 0,
    hi: o.length - 1
  };
}
function Wi(e, t, i, s, n) {
  const o = e.getSortedVisibleDatasetMetas(), r = i[t];
  for (let a = 0, l = o.length; a < l; ++a) {
    const { index: c, data: u } = o[a], { lo: h, hi: d } = wu(o[a], t, r, n);
    for (let f = h; f <= d; ++f) {
      const g = u[f];
      g.skip || s(g, c, f);
    }
  }
}
function ku(e) {
  const t = e.indexOf("x") !== -1, i = e.indexOf("y") !== -1;
  return function(s, n) {
    const o = t ? Math.abs(s.x - n.x) : 0, r = i ? Math.abs(s.y - n.y) : 0;
    return Math.sqrt(Math.pow(o, 2) + Math.pow(r, 2));
  };
}
function os(e, t, i, s, n) {
  const o = [];
  return !n && !e.isPointInArea(t) || Wi(e, i, t, function(a, l, c) {
    !n && !Ge(a, e.chartArea, 0) || a.inRange(t.x, t.y, s) && o.push({
      element: a,
      datasetIndex: l,
      index: c
    });
  }, !0), o;
}
function Su(e, t, i, s) {
  let n = [];
  function o(r, a, l) {
    const { startAngle: c, endAngle: u } = r.getProps([
      "startAngle",
      "endAngle"
    ], s), { angle: h } = jl(r, {
      x: t.x,
      y: t.y
    });
    sr(h, c, u) && n.push({
      element: r,
      datasetIndex: a,
      index: l
    });
  }
  return Wi(e, i, t, o), n;
}
function $u(e, t, i, s, n, o) {
  let r = [];
  const a = ku(i);
  let l = Number.POSITIVE_INFINITY;
  function c(u, h, d) {
    const f = u.inRange(t.x, t.y, n);
    if (s && !f)
      return;
    const g = u.getCenterPoint(n);
    if (!(!!o || e.isPointInArea(g)) && !f)
      return;
    const m = a(t, g);
    m < l ? (r = [
      {
        element: u,
        datasetIndex: h,
        index: d
      }
    ], l = m) : m === l && r.push({
      element: u,
      datasetIndex: h,
      index: d
    });
  }
  return Wi(e, i, t, c), r;
}
function rs(e, t, i, s, n, o) {
  return !o && !e.isPointInArea(t) ? [] : i === "r" && !s ? Su(e, t, i, n) : $u(e, t, i, s, n, o);
}
function Wn(e, t, i, s, n) {
  const o = [], r = i === "x" ? "inXRange" : "inYRange";
  let a = !1;
  return Wi(e, i, t, (l, c, u) => {
    l[r] && l[r](t[i], n) && (o.push({
      element: l,
      datasetIndex: c,
      index: u
    }), a = a || l.inRange(t.x, t.y, n));
  }), s && !a ? [] : o;
}
var Du = {
  modes: {
    index(e, t, i, s) {
      const n = Gt(t, e), o = i.axis || "x", r = i.includeInvisible || !1, a = i.intersect ? os(e, n, o, s, r) : rs(e, n, o, !1, s, r), l = [];
      return a.length ? (e.getSortedVisibleDatasetMetas().forEach((c) => {
        const u = a[0].index, h = c.data[u];
        h && !h.skip && l.push({
          element: h,
          datasetIndex: c.index,
          index: u
        });
      }), l) : [];
    },
    dataset(e, t, i, s) {
      const n = Gt(t, e), o = i.axis || "xy", r = i.includeInvisible || !1;
      let a = i.intersect ? os(e, n, o, s, r) : rs(e, n, o, !1, s, r);
      if (a.length > 0) {
        const l = a[0].datasetIndex, c = e.getDatasetMeta(l).data;
        a = [];
        for (let u = 0; u < c.length; ++u)
          a.push({
            element: c[u],
            datasetIndex: l,
            index: u
          });
      }
      return a;
    },
    point(e, t, i, s) {
      const n = Gt(t, e), o = i.axis || "xy", r = i.includeInvisible || !1;
      return os(e, n, o, s, r);
    },
    nearest(e, t, i, s) {
      const n = Gt(t, e), o = i.axis || "xy", r = i.includeInvisible || !1;
      return rs(e, n, o, i.intersect, s, r);
    },
    x(e, t, i, s) {
      const n = Gt(t, e);
      return Wn(e, n, "x", i.intersect, s);
    },
    y(e, t, i, s) {
      const n = Gt(t, e);
      return Wn(e, n, "y", i.intersect, s);
    }
  }
};
const kr = [
  "left",
  "top",
  "right",
  "bottom"
];
function ze(e, t) {
  return e.filter((i) => i.pos === t);
}
function Hn(e, t) {
  return e.filter((i) => kr.indexOf(i.pos) === -1 && i.box.axis === t);
}
function Te(e, t) {
  return e.sort((i, s) => {
    const n = t ? s : i, o = t ? i : s;
    return n.weight === o.weight ? n.index - o.index : n.weight - o.weight;
  });
}
function Cu(e) {
  const t = [];
  let i, s, n, o, r, a;
  for (i = 0, s = (e || []).length; i < s; ++i)
    n = e[i], { position: o, options: { stack: r, stackWeight: a = 1 } } = n, t.push({
      index: i,
      box: n,
      pos: o,
      horizontal: n.isHorizontal(),
      weight: n.weight,
      stack: r && o + r,
      stackWeight: a
    });
  return t;
}
function Mu(e) {
  const t = {};
  for (const i of e) {
    const { stack: s, pos: n, stackWeight: o } = i;
    if (!s || !kr.includes(n))
      continue;
    const r = t[s] || (t[s] = {
      count: 0,
      placed: 0,
      weight: 0,
      size: 0
    });
    r.count++, r.weight += o;
  }
  return t;
}
function zu(e, t) {
  const i = Mu(e), { vBoxMaxWidth: s, hBoxMaxHeight: n } = t;
  let o, r, a;
  for (o = 0, r = e.length; o < r; ++o) {
    a = e[o];
    const { fullSize: l } = a.box, c = i[a.stack], u = c && a.stackWeight / c.weight;
    a.horizontal ? (a.width = u ? u * s : l && t.availableWidth, a.height = n) : (a.width = s, a.height = u ? u * n : l && t.availableHeight);
  }
  return i;
}
function Tu(e) {
  const t = Cu(e), i = Te(t.filter((c) => c.box.fullSize), !0), s = Te(ze(t, "left"), !0), n = Te(ze(t, "right")), o = Te(ze(t, "top"), !0), r = Te(ze(t, "bottom")), a = Hn(t, "x"), l = Hn(t, "y");
  return {
    fullSize: i,
    leftAndTop: s.concat(o),
    rightAndBottom: n.concat(l).concat(r).concat(a),
    chartArea: ze(t, "chartArea"),
    vertical: s.concat(n).concat(l),
    horizontal: o.concat(r).concat(a)
  };
}
function jn(e, t, i, s) {
  return Math.max(e[i], t[i]) + Math.max(e[s], t[s]);
}
function Sr(e, t) {
  e.top = Math.max(e.top, t.top), e.left = Math.max(e.left, t.left), e.bottom = Math.max(e.bottom, t.bottom), e.right = Math.max(e.right, t.right);
}
function Pu(e, t, i, s) {
  const { pos: n, box: o } = i, r = e.maxPadding;
  if (!M(n)) {
    i.size && (e[n] -= i.size);
    const h = s[i.stack] || {
      size: 0,
      count: 1
    };
    h.size = Math.max(h.size, i.horizontal ? o.height : o.width), i.size = h.size / h.count, e[n] += i.size;
  }
  o.getPadding && Sr(r, o.getPadding());
  const a = Math.max(0, t.outerWidth - jn(r, e, "left", "right")), l = Math.max(0, t.outerHeight - jn(r, e, "top", "bottom")), c = a !== e.w, u = l !== e.h;
  return e.w = a, e.h = l, i.horizontal ? {
    same: c,
    other: u
  } : {
    same: u,
    other: c
  };
}
function Eu(e) {
  const t = e.maxPadding;
  function i(s) {
    const n = Math.max(t[s] - e[s], 0);
    return e[s] += n, n;
  }
  e.y += i("top"), e.x += i("left"), i("right"), i("bottom");
}
function Ou(e, t) {
  const i = t.maxPadding;
  function s(n) {
    const o = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    return n.forEach((r) => {
      o[r] = Math.max(t[r], i[r]);
    }), o;
  }
  return s(e ? [
    "left",
    "right"
  ] : [
    "top",
    "bottom"
  ]);
}
function Le(e, t, i, s) {
  const n = [];
  let o, r, a, l, c, u;
  for (o = 0, r = e.length, c = 0; o < r; ++o) {
    a = e[o], l = a.box, l.update(a.width || t.w, a.height || t.h, Ou(a.horizontal, t));
    const { same: h, other: d } = Pu(t, i, a, s);
    c |= h && n.length, u = u || d, l.fullSize || n.push(a);
  }
  return c && Le(n, t, i, s) || u;
}
function _i(e, t, i, s, n) {
  e.top = i, e.left = t, e.right = t + s, e.bottom = i + n, e.width = s, e.height = n;
}
function qn(e, t, i, s) {
  const n = i.padding;
  let { x: o, y: r } = t;
  for (const a of e) {
    const l = a.box, c = s[a.stack] || {
      placed: 0,
      weight: 1
    }, u = a.stackWeight / c.weight || 1;
    if (a.horizontal) {
      const h = t.w * u, d = c.size || l.height;
      Ri(c.start) && (r = c.start), l.fullSize ? _i(l, n.left, r, i.outerWidth - n.right - n.left, d) : _i(l, t.left + c.placed, r, h, d), c.start = r, c.placed += h, r = l.bottom;
    } else {
      const h = t.h * u, d = c.size || l.width;
      Ri(c.start) && (o = c.start), l.fullSize ? _i(l, o, n.top, d, i.outerHeight - n.bottom - n.top) : _i(l, o, t.top + c.placed, d, h), c.start = o, c.placed += h, o = l.right;
    }
  }
  t.x = o, t.y = r;
}
var xi = {
  addBox(e, t) {
    e.boxes || (e.boxes = []), t.fullSize = t.fullSize || !1, t.position = t.position || "top", t.weight = t.weight || 0, t._layers = t._layers || function() {
      return [
        {
          z: 0,
          draw(i) {
            t.draw(i);
          }
        }
      ];
    }, e.boxes.push(t);
  },
  removeBox(e, t) {
    const i = e.boxes ? e.boxes.indexOf(t) : -1;
    i !== -1 && e.boxes.splice(i, 1);
  },
  configure(e, t, i) {
    t.fullSize = i.fullSize, t.position = i.position, t.weight = i.weight;
  },
  update(e, t, i, s) {
    if (!e)
      return;
    const n = Ut(e.options.layout.padding), o = Math.max(t - n.width, 0), r = Math.max(i - n.height, 0), a = Tu(e.boxes), l = a.vertical, c = a.horizontal;
    P(e.boxes, (p) => {
      typeof p.beforeLayout == "function" && p.beforeLayout();
    });
    const u = l.reduce((p, m) => m.box.options && m.box.options.display === !1 ? p : p + 1, 0) || 1, h = Object.freeze({
      outerWidth: t,
      outerHeight: i,
      padding: n,
      availableWidth: o,
      availableHeight: r,
      vBoxMaxWidth: o / 2 / u,
      hBoxMaxHeight: r / 2
    }), d = Object.assign({}, n);
    Sr(d, Ut(s));
    const f = Object.assign({
      maxPadding: d,
      w: o,
      h: r,
      x: n.left,
      y: n.top
    }, n), g = zu(l.concat(c), h);
    Le(a.fullSize, f, h, g), Le(l, f, h, g), Le(c, f, h, g) && Le(l, f, h, g), Eu(f), qn(a.leftAndTop, f, h, g), f.x += f.w, f.y += f.h, qn(a.rightAndBottom, f, h, g), e.chartArea = {
      left: f.left,
      top: f.top,
      right: f.left + f.w,
      bottom: f.top + f.h,
      height: f.h,
      width: f.w
    }, P(a.chartArea, (p) => {
      const m = p.box;
      Object.assign(m, e.chartArea), m.update(f.w, f.h, {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      });
    });
  }
};
class $r {
  acquireContext(t, i) {
  }
  releaseContext(t) {
    return !1;
  }
  addEventListener(t, i, s) {
  }
  removeEventListener(t, i, s) {
  }
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(t, i, s, n) {
    return i = Math.max(0, i || t.width), s = s || t.height, {
      width: i,
      height: Math.max(0, n ? Math.floor(i / n) : s)
    };
  }
  isAttached(t) {
    return !0;
  }
  updateConfig(t) {
  }
}
class Au extends $r {
  acquireContext(t) {
    return t && t.getContext && t.getContext("2d") || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const zi = "$chartjs", Lu = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
}, Yn = (e) => e === null || e === "";
function Ru(e, t) {
  const i = e.style, s = e.getAttribute("height"), n = e.getAttribute("width");
  if (e[zi] = {
    initial: {
      height: s,
      width: n,
      style: {
        display: i.display,
        height: i.height,
        width: i.width
      }
    }
  }, i.display = i.display || "block", i.boxSizing = i.boxSizing || "border-box", Yn(n)) {
    const o = On(e, "width");
    o !== void 0 && (e.width = o);
  }
  if (Yn(s))
    if (e.style.height === "")
      e.height = e.width / (t || 2);
    else {
      const o = On(e, "height");
      o !== void 0 && (e.height = o);
    }
  return e;
}
const Dr = qc ? {
  passive: !0
} : !1;
function Fu(e, t, i) {
  e && e.addEventListener(t, i, Dr);
}
function Iu(e, t, i) {
  e && e.canvas && e.canvas.removeEventListener(t, i, Dr);
}
function Nu(e, t) {
  const i = Lu[e.type] || e.type, { x: s, y: n } = Gt(e, t);
  return {
    type: i,
    chart: t,
    native: e,
    x: s !== void 0 ? s : null,
    y: n !== void 0 ? n : null
  };
}
function Ni(e, t) {
  for (const i of e)
    if (i === t || i.contains(t))
      return !0;
}
function Bu(e, t, i) {
  const s = e.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || Ni(a.addedNodes, s), r = r && !Ni(a.removedNodes, s);
    r && i();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
function Vu(e, t, i) {
  const s = e.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || Ni(a.removedNodes, s), r = r && !Ni(a.addedNodes, s);
    r && i();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
const Qe = /* @__PURE__ */ new Map();
let Kn = 0;
function Cr() {
  const e = window.devicePixelRatio;
  e !== Kn && (Kn = e, Qe.forEach((t, i) => {
    i.currentDevicePixelRatio !== e && t();
  }));
}
function Uu(e, t) {
  Qe.size || window.addEventListener("resize", Cr), Qe.set(e, t);
}
function Wu(e) {
  Qe.delete(e), Qe.size || window.removeEventListener("resize", Cr);
}
function Hu(e, t, i) {
  const s = e.canvas, n = s && js(s);
  if (!n)
    return;
  const o = ar((a, l) => {
    const c = n.clientWidth;
    i(a, l), c < n.clientWidth && i();
  }, window), r = new ResizeObserver((a) => {
    const l = a[0], c = l.contentRect.width, u = l.contentRect.height;
    c === 0 && u === 0 || o(c, u);
  });
  return r.observe(n), Uu(e, o), r;
}
function as(e, t, i) {
  i && i.disconnect(), t === "resize" && Wu(e);
}
function ju(e, t, i) {
  const s = e.canvas, n = ar((o) => {
    e.ctx !== null && i(Nu(o, e));
  }, e);
  return Fu(s, t, n), n;
}
class qu extends $r {
  acquireContext(t, i) {
    const s = t && t.getContext && t.getContext("2d");
    return s && s.canvas === t ? (Ru(t, i), s) : null;
  }
  releaseContext(t) {
    const i = t.canvas;
    if (!i[zi])
      return !1;
    const s = i[zi].initial;
    [
      "height",
      "width"
    ].forEach((o) => {
      const r = s[o];
      O(r) ? i.removeAttribute(o) : i.setAttribute(o, r);
    });
    const n = s.style || {};
    return Object.keys(n).forEach((o) => {
      i.style[o] = n[o];
    }), i.width = i.width, delete i[zi], !0;
  }
  addEventListener(t, i, s) {
    this.removeEventListener(t, i);
    const n = t.$proxies || (t.$proxies = {}), r = {
      attach: Bu,
      detach: Vu,
      resize: Hu
    }[i] || ju;
    n[i] = r(t, i, s);
  }
  removeEventListener(t, i) {
    const s = t.$proxies || (t.$proxies = {}), n = s[i];
    if (!n)
      return;
    ({
      attach: as,
      detach: as,
      resize: as
    }[i] || Iu)(t, i, n), s[i] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, i, s, n) {
    return jc(t, i, s, n);
  }
  isAttached(t) {
    const i = t && js(t);
    return !!(i && i.isConnected);
  }
}
function Yu(e) {
  return !Hs() || typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas ? Au : qu;
}
class ni {
  static defaults = {};
  static defaultRoutes = void 0;
  x;
  y;
  active = !1;
  options;
  $animations;
  tooltipPosition(t) {
    const { x: i, y: s } = this.getProps([
      "x",
      "y"
    ], t);
    return {
      x: i,
      y: s
    };
  }
  hasValue() {
    return Ze(this.x) && Ze(this.y);
  }
  getProps(t, i) {
    const s = this.$animations;
    if (!i || !s)
      return this;
    const n = {};
    return t.forEach((o) => {
      n[o] = s[o] && s[o].active() ? s[o]._to : this[o];
    }), n;
  }
}
function Ku(e, t) {
  const i = e.options.ticks, s = Xu(e), n = Math.min(i.maxTicksLimit || s, s), o = i.major.enabled ? Gu(t) : [], r = o.length, a = o[0], l = o[r - 1], c = [];
  if (r > n)
    return Qu(t, c, o, r / n), c;
  const u = Zu(o, t, n);
  if (r > 0) {
    let h, d;
    const f = r > 1 ? Math.round((l - a) / (r - 1)) : null;
    for (wi(t, c, u, O(f) ? 0 : a - f, a), h = 0, d = r - 1; h < d; h++)
      wi(t, c, u, o[h], o[h + 1]);
    return wi(t, c, u, l, O(f) ? t.length : l + f), c;
  }
  return wi(t, c, u), c;
}
function Xu(e) {
  const t = e.options.offset, i = e._tickSize(), s = e._length / i + (t ? 0 : 1), n = e._maxLength / i;
  return Math.floor(Math.min(s, n));
}
function Zu(e, t, i) {
  const s = Ju(e), n = t.length / i;
  if (!s)
    return Math.max(n, 1);
  const o = Bl(s);
  for (let r = 0, a = o.length - 1; r < a; r++) {
    const l = o[r];
    if (l > n)
      return l;
  }
  return Math.max(n, 1);
}
function Gu(e) {
  const t = [];
  let i, s;
  for (i = 0, s = e.length; i < s; i++)
    e[i].major && t.push(i);
  return t;
}
function Qu(e, t, i, s) {
  let n = 0, o = i[0], r;
  for (s = Math.ceil(s), r = 0; r < e.length; r++)
    r === o && (t.push(e[r]), n++, o = i[n * s]);
}
function wi(e, t, i, s, n) {
  const o = E(s, 0), r = Math.min(E(n, e.length), e.length);
  let a = 0, l, c, u;
  for (i = Math.ceil(i), n && (l = n - s, i = l / Math.floor(l / i)), u = o; u < 0; )
    a++, u = Math.round(o + a * i);
  for (c = Math.max(o, 0); c < r; c++)
    c === u && (t.push(e[c]), a++, u = Math.round(o + a * i));
}
function Ju(e) {
  const t = e.length;
  let i, s;
  if (t < 2)
    return !1;
  for (s = e[0], i = 1; i < t; ++i)
    if (e[i] - e[i - 1] !== s)
      return !1;
  return s;
}
const th = (e) => e === "left" ? "right" : e === "right" ? "left" : e, Xn = (e, t, i) => t === "top" || t === "left" ? e[t] + i : e[t] - i, Zn = (e, t) => Math.min(t || e, e);
function Gn(e, t) {
  const i = [], s = e.length / t, n = e.length;
  let o = 0;
  for (; o < n; o += s)
    i.push(e[Math.floor(o)]);
  return i;
}
function eh(e, t, i) {
  const s = e.ticks.length, n = Math.min(t, s - 1), o = e._startPixel, r = e._endPixel, a = 1e-6;
  let l = e.getPixelForTick(n), c;
  if (!(i && (s === 1 ? c = Math.max(l - o, r - l) : t === 0 ? c = (e.getPixelForTick(1) - l) / 2 : c = (l - e.getPixelForTick(n - 1)) / 2, l += n < t ? c : -c, l < o - a || l > r + a)))
    return l;
}
function ih(e, t) {
  P(e, (i) => {
    const s = i.gc, n = s.length / 2;
    let o;
    if (n > t) {
      for (o = 0; o < n; ++o)
        delete i.data[s[o]];
      s.splice(0, n);
    }
  });
}
function Pe(e) {
  return e.drawTicks ? e.tickLength : 0;
}
function Qn(e, t) {
  if (!e.display)
    return 0;
  const i = kt(e.font, t), s = Ut(e.padding);
  return (j(e.text) ? e.text.length : 1) * i.lineHeight + s.height;
}
function sh(e, t) {
  return he(e, {
    scale: t,
    type: "scale"
  });
}
function nh(e, t, i) {
  return he(e, {
    tick: i,
    index: t,
    type: "tick"
  });
}
function oh(e, t, i) {
  let s = Jl(e);
  return (i && t !== "right" || !i && t === "right") && (s = th(s)), s;
}
function rh(e, t, i, s) {
  const { top: n, left: o, bottom: r, right: a, chart: l } = e, { chartArea: c, scales: u } = l;
  let h = 0, d, f, g;
  const p = r - n, m = a - o;
  if (e.isHorizontal()) {
    if (f = xn(s, o, a), M(i)) {
      const b = Object.keys(i)[0], x = i[b];
      g = u[b].getPixelForValue(x) + p - t;
    } else i === "center" ? g = (c.bottom + c.top) / 2 + p - t : g = Xn(e, i, t);
    d = a - o;
  } else {
    if (M(i)) {
      const b = Object.keys(i)[0], x = i[b];
      f = u[b].getPixelForValue(x) - m + t;
    } else i === "center" ? f = (c.left + c.right) / 2 - m + t : f = Xn(e, i, t);
    g = xn(s, r, n), h = i === "left" ? -mt : mt;
  }
  return {
    titleX: f,
    titleY: g,
    maxWidth: d,
    rotation: h
  };
}
class we extends ni {
  constructor(t) {
    super(), this.id = t.id, this.type = t.type, this.options = void 0, this.ctx = t.ctx, this.chart = t.chart, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, this.maxWidth = void 0, this.maxHeight = void 0, this.paddingTop = void 0, this.paddingBottom = void 0, this.paddingLeft = void 0, this.paddingRight = void 0, this.axis = void 0, this.labelRotation = void 0, this.min = void 0, this.max = void 0, this._range = void 0, this.ticks = [], this._gridLineItems = null, this._labelItems = null, this._labelSizes = null, this._length = 0, this._maxLength = 0, this._longestTextCache = {}, this._startPixel = void 0, this._endPixel = void 0, this._reversePixels = !1, this._userMax = void 0, this._userMin = void 0, this._suggestedMax = void 0, this._suggestedMin = void 0, this._ticksLength = 0, this._borderValue = 0, this._cache = {}, this._dataLimitsCached = !1, this.$context = void 0;
  }
  init(t) {
    this.options = t.setContext(this.getContext()), this.axis = t.axis, this._userMin = this.parse(t.min), this._userMax = this.parse(t.max), this._suggestedMin = this.parse(t.suggestedMin), this._suggestedMax = this.parse(t.suggestedMax);
  }
  parse(t, i) {
    return t;
  }
  getUserBounds() {
    let { _userMin: t, _userMax: i, _suggestedMin: s, _suggestedMax: n } = this;
    return t = yt(t, Number.POSITIVE_INFINITY), i = yt(i, Number.NEGATIVE_INFINITY), s = yt(s, Number.POSITIVE_INFINITY), n = yt(n, Number.NEGATIVE_INFINITY), {
      min: yt(t, s),
      max: yt(i, n),
      minDefined: X(t),
      maxDefined: X(i)
    };
  }
  getMinMax(t) {
    let { min: i, max: s, minDefined: n, maxDefined: o } = this.getUserBounds(), r;
    if (n && o)
      return {
        min: i,
        max: s
      };
    const a = this.getMatchingVisibleMetas();
    for (let l = 0, c = a.length; l < c; ++l)
      r = a[l].controller.getMinMax(this, t), n || (i = Math.min(i, r.min)), o || (s = Math.max(s, r.max));
    return i = o && i > s ? s : i, s = n && i > s ? i : s, {
      min: yt(i, yt(s, i)),
      max: yt(s, yt(i, s))
    };
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const t = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? t.xLabels : t.yLabels) || t.labels || [];
  }
  getLabelItems(t = this.chart.chartArea) {
    return this._labelItems || (this._labelItems = this._computeLabelItems(t));
  }
  beforeLayout() {
    this._cache = {}, this._dataLimitsCached = !1;
  }
  beforeUpdate() {
    F(this.options.beforeUpdate, [
      this
    ]);
  }
  update(t, i, s) {
    const { beginAtZero: n, grace: o, ticks: r } = this.options, a = r.sampleSize;
    this.beforeUpdate(), this.maxWidth = t, this.maxHeight = i, this._margins = s = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, s), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + s.left + s.right : this.height + s.top + s.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = kc(this, o, n), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
    const l = a < this.ticks.length;
    this._convertTicksToLabels(l ? Gn(this.ticks, a) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), r.display && (r.autoSkip || r.source === "auto") && (this.ticks = Ku(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), l && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
  }
  configure() {
    let t = this.options.reverse, i, s;
    this.isHorizontal() ? (i = this.left, s = this.right) : (i = this.top, s = this.bottom, t = !t), this._startPixel = i, this._endPixel = s, this._reversePixels = t, this._length = s - i, this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    F(this.options.afterUpdate, [
      this
    ]);
  }
  beforeSetDimensions() {
    F(this.options.beforeSetDimensions, [
      this
    ]);
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0;
  }
  afterSetDimensions() {
    F(this.options.afterSetDimensions, [
      this
    ]);
  }
  _callHooks(t) {
    this.chart.notifyPlugins(t, this.getContext()), F(this.options[t], [
      this
    ]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {
  }
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    F(this.options.beforeTickToLabelConversion, [
      this
    ]);
  }
  generateTickLabels(t) {
    const i = this.options.ticks;
    let s, n, o;
    for (s = 0, n = t.length; s < n; s++)
      o = t[s], o.label = F(i.callback, [
        o.value,
        s,
        t
      ], this);
  }
  afterTickToLabelConversion() {
    F(this.options.afterTickToLabelConversion, [
      this
    ]);
  }
  beforeCalculateLabelRotation() {
    F(this.options.beforeCalculateLabelRotation, [
      this
    ]);
  }
  calculateLabelRotation() {
    const t = this.options, i = t.ticks, s = Zn(this.ticks.length, t.ticks.maxTicksLimit), n = i.minRotation || 0, o = i.maxRotation;
    let r = n, a, l, c;
    if (!this._isVisible() || !i.display || n >= o || s <= 1 || !this.isHorizontal()) {
      this.labelRotation = n;
      return;
    }
    const u = this._getLabelSizes(), h = u.widest.width, d = u.highest.height, f = ct(this.chart.width - h, 0, this.maxWidth);
    a = t.offset ? this.maxWidth / s : f / (s - 1), h + 6 > a && (a = f / (s - (t.offset ? 0.5 : 1)), l = this.maxHeight - Pe(t.grid) - i.padding - Qn(t.title, this.chart.options.font), c = Math.sqrt(h * h + d * d), r = Hl(Math.min(Math.asin(ct((u.highest.height + 6) / a, -1, 1)), Math.asin(ct(l / c, -1, 1)) - Math.asin(ct(d / c, -1, 1)))), r = Math.max(n, Math.min(o, r))), this.labelRotation = r;
  }
  afterCalculateLabelRotation() {
    F(this.options.afterCalculateLabelRotation, [
      this
    ]);
  }
  afterAutoSkip() {
  }
  beforeFit() {
    F(this.options.beforeFit, [
      this
    ]);
  }
  fit() {
    const t = {
      width: 0,
      height: 0
    }, { chart: i, options: { ticks: s, title: n, grid: o } } = this, r = this._isVisible(), a = this.isHorizontal();
    if (r) {
      const l = Qn(n, i.options.font);
      if (a ? (t.width = this.maxWidth, t.height = Pe(o) + l) : (t.height = this.maxHeight, t.width = Pe(o) + l), s.display && this.ticks.length) {
        const { first: c, last: u, widest: h, highest: d } = this._getLabelSizes(), f = s.padding * 2, g = ie(this.labelRotation), p = Math.cos(g), m = Math.sin(g);
        if (a) {
          const b = s.mirror ? 0 : m * h.width + p * d.height;
          t.height = Math.min(this.maxHeight, t.height + b + f);
        } else {
          const b = s.mirror ? 0 : p * h.width + m * d.height;
          t.width = Math.min(this.maxWidth, t.width + b + f);
        }
        this._calculatePadding(c, u, m, p);
      }
    }
    this._handleMargins(), a ? (this.width = this._length = i.width - this._margins.left - this._margins.right, this.height = t.height) : (this.width = t.width, this.height = this._length = i.height - this._margins.top - this._margins.bottom);
  }
  _calculatePadding(t, i, s, n) {
    const { ticks: { align: o, padding: r }, position: a } = this.options, l = this.labelRotation !== 0, c = a !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const u = this.getPixelForTick(0) - this.left, h = this.right - this.getPixelForTick(this.ticks.length - 1);
      let d = 0, f = 0;
      l ? c ? (d = n * t.width, f = s * i.height) : (d = s * t.height, f = n * i.width) : o === "start" ? f = i.width : o === "end" ? d = t.width : o !== "inner" && (d = t.width / 2, f = i.width / 2), this.paddingLeft = Math.max((d - u + r) * this.width / (this.width - u), 0), this.paddingRight = Math.max((f - h + r) * this.width / (this.width - h), 0);
    } else {
      let u = i.height / 2, h = t.height / 2;
      o === "start" ? (u = 0, h = t.height) : o === "end" && (u = i.height, h = 0), this.paddingTop = u + r, this.paddingBottom = h + r;
    }
  }
  _handleMargins() {
    this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom));
  }
  afterFit() {
    F(this.options.afterFit, [
      this
    ]);
  }
  isHorizontal() {
    const { axis: t, position: i } = this.options;
    return i === "top" || i === "bottom" || t === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(t) {
    this.beforeTickToLabelConversion(), this.generateTickLabels(t);
    let i, s;
    for (i = 0, s = t.length; i < s; i++)
      O(t[i].label) && (t.splice(i, 1), s--, i--);
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let t = this._labelSizes;
    if (!t) {
      const i = this.options.ticks.sampleSize;
      let s = this.ticks;
      i < s.length && (s = Gn(s, i)), this._labelSizes = t = this._computeLabelSizes(s, s.length, this.options.ticks.maxTicksLimit);
    }
    return t;
  }
  _computeLabelSizes(t, i, s) {
    const { ctx: n, _longestTextCache: o } = this, r = [], a = [], l = Math.floor(i / Zn(i, s));
    let c = 0, u = 0, h, d, f, g, p, m, b, x, k, w, y;
    for (h = 0; h < i; h += l) {
      if (g = t[h].label, p = this._resolveTickFontOptions(h), n.font = m = p.string, b = o[m] = o[m] || {
        data: {},
        gc: []
      }, x = p.lineHeight, k = w = 0, !O(g) && !j(g))
        k = Dn(n, b.data, b.gc, k, g), w = x;
      else if (j(g))
        for (d = 0, f = g.length; d < f; ++d)
          y = g[d], !O(y) && !j(y) && (k = Dn(n, b.data, b.gc, k, y), w += x);
      r.push(k), a.push(w), c = Math.max(k, c), u = Math.max(w, u);
    }
    ih(o, i);
    const D = r.indexOf(c), S = a.indexOf(u), $ = (C) => ({
      width: r[C] || 0,
      height: a[C] || 0
    });
    return {
      first: $(0),
      last: $(i - 1),
      widest: $(D),
      highest: $(S),
      widths: r,
      heights: a
    };
  }
  getLabelForValue(t) {
    return t;
  }
  getPixelForValue(t, i) {
    return NaN;
  }
  getValueForPixel(t) {
  }
  getPixelForTick(t) {
    const i = this.ticks;
    return t < 0 || t > i.length - 1 ? null : this.getPixelForValue(i[t].value);
  }
  getPixelForDecimal(t) {
    this._reversePixels && (t = 1 - t);
    const i = this._startPixel + t * this._length;
    return Yl(this._alignToPixels ? Xt(this.chart, i, 0) : i);
  }
  getDecimalForPixel(t) {
    const i = (t - this._startPixel) / this._length;
    return this._reversePixels ? 1 - i : i;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min: t, max: i } = this;
    return t < 0 && i < 0 ? i : t > 0 && i > 0 ? t : 0;
  }
  getContext(t) {
    const i = this.ticks || [];
    if (t >= 0 && t < i.length) {
      const s = i[t];
      return s.$context || (s.$context = nh(this.getContext(), t, s));
    }
    return this.$context || (this.$context = sh(this.chart.getContext(), this));
  }
  _tickSize() {
    const t = this.options.ticks, i = ie(this.labelRotation), s = Math.abs(Math.cos(i)), n = Math.abs(Math.sin(i)), o = this._getLabelSizes(), r = t.autoSkipPadding || 0, a = o ? o.widest.width + r : 0, l = o ? o.highest.height + r : 0;
    return this.isHorizontal() ? l * s > a * n ? a / s : l / n : l * n < a * s ? l / s : a / n;
  }
  _isVisible() {
    const t = this.options.display;
    return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(t) {
    const i = this.axis, s = this.chart, n = this.options, { grid: o, position: r, border: a } = n, l = o.offset, c = this.isHorizontal(), h = this.ticks.length + (l ? 1 : 0), d = Pe(o), f = [], g = a.setContext(this.getContext()), p = g.display ? g.width : 0, m = p / 2, b = function(q) {
      return Xt(s, q, p);
    };
    let x, k, w, y, D, S, $, C, A, L, B, vt;
    if (r === "top")
      x = b(this.bottom), S = this.bottom - d, C = x - m, L = b(t.top) + m, vt = t.bottom;
    else if (r === "bottom")
      x = b(this.top), L = t.top, vt = b(t.bottom) - m, S = x + m, C = this.top + d;
    else if (r === "left")
      x = b(this.right), D = this.right - d, $ = x - m, A = b(t.left) + m, B = t.right;
    else if (r === "right")
      x = b(this.left), A = t.left, B = b(t.right) - m, D = x + m, $ = this.left + d;
    else if (i === "x") {
      if (r === "center")
        x = b((t.top + t.bottom) / 2 + 0.5);
      else if (M(r)) {
        const q = Object.keys(r)[0], at = r[q];
        x = b(this.chart.scales[q].getPixelForValue(at));
      }
      L = t.top, vt = t.bottom, S = x + m, C = S + d;
    } else if (i === "y") {
      if (r === "center")
        x = b((t.left + t.right) / 2);
      else if (M(r)) {
        const q = Object.keys(r)[0], at = r[q];
        x = b(this.chart.scales[q].getPixelForValue(at));
      }
      D = x - m, $ = D - d, A = t.left, B = t.right;
    }
    const Rt = E(n.ticks.maxTicksLimit, h), R = Math.max(1, Math.ceil(h / Rt));
    for (k = 0; k < h; k += R) {
      const q = this.getContext(k), at = o.setContext(q), ai = a.setContext(q), li = at.lineWidth, de = at.color, ci = ai.dash || [], fe = ai.dashOffset, Se = at.tickWidth, qt = at.tickColor, $e = at.tickBorderDash || [], Yt = at.tickBorderDashOffset;
      w = eh(this, k, l), w !== void 0 && (y = Xt(s, w, li), c ? D = $ = A = B = y : S = C = L = vt = y, f.push({
        tx1: D,
        ty1: S,
        tx2: $,
        ty2: C,
        x1: A,
        y1: L,
        x2: B,
        y2: vt,
        width: li,
        color: de,
        borderDash: ci,
        borderDashOffset: fe,
        tickWidth: Se,
        tickColor: qt,
        tickBorderDash: $e,
        tickBorderDashOffset: Yt
      }));
    }
    return this._ticksLength = h, this._borderValue = x, f;
  }
  _computeLabelItems(t) {
    const i = this.axis, s = this.options, { position: n, ticks: o } = s, r = this.isHorizontal(), a = this.ticks, { align: l, crossAlign: c, padding: u, mirror: h } = o, d = Pe(s.grid), f = d + u, g = h ? -u : f, p = -ie(this.labelRotation), m = [];
    let b, x, k, w, y, D, S, $, C, A, L, B, vt = "middle";
    if (n === "top")
      D = this.bottom - g, S = this._getXAxisLabelAlignment();
    else if (n === "bottom")
      D = this.top + g, S = this._getXAxisLabelAlignment();
    else if (n === "left") {
      const R = this._getYAxisLabelAlignment(d);
      S = R.textAlign, y = R.x;
    } else if (n === "right") {
      const R = this._getYAxisLabelAlignment(d);
      S = R.textAlign, y = R.x;
    } else if (i === "x") {
      if (n === "center")
        D = (t.top + t.bottom) / 2 + f;
      else if (M(n)) {
        const R = Object.keys(n)[0], q = n[R];
        D = this.chart.scales[R].getPixelForValue(q) + f;
      }
      S = this._getXAxisLabelAlignment();
    } else if (i === "y") {
      if (n === "center")
        y = (t.left + t.right) / 2 - f;
      else if (M(n)) {
        const R = Object.keys(n)[0], q = n[R];
        y = this.chart.scales[R].getPixelForValue(q);
      }
      S = this._getYAxisLabelAlignment(d).textAlign;
    }
    i === "y" && (l === "start" ? vt = "top" : l === "end" && (vt = "bottom"));
    const Rt = this._getLabelSizes();
    for (b = 0, x = a.length; b < x; ++b) {
      k = a[b], w = k.label;
      const R = o.setContext(this.getContext(b));
      $ = this.getPixelForTick(b) + o.labelOffset, C = this._resolveTickFontOptions(b), A = C.lineHeight, L = j(w) ? w.length : 1;
      const q = L / 2, at = R.color, ai = R.textStrokeColor, li = R.textStrokeWidth;
      let de = S;
      r ? (y = $, S === "inner" && (b === x - 1 ? de = this.options.reverse ? "left" : "right" : b === 0 ? de = this.options.reverse ? "right" : "left" : de = "center"), n === "top" ? c === "near" || p !== 0 ? B = -L * A + A / 2 : c === "center" ? B = -Rt.highest.height / 2 - q * A + A : B = -Rt.highest.height + A / 2 : c === "near" || p !== 0 ? B = A / 2 : c === "center" ? B = Rt.highest.height / 2 - q * A : B = Rt.highest.height - L * A, h && (B *= -1), p !== 0 && !R.showLabelBackdrop && (y += A / 2 * Math.sin(p))) : (D = $, B = (1 - L) * A / 2);
      let ci;
      if (R.showLabelBackdrop) {
        const fe = Ut(R.backdropPadding), Se = Rt.heights[b], qt = Rt.widths[b];
        let $e = B - fe.top, Yt = 0 - fe.left;
        switch (vt) {
          case "middle":
            $e -= Se / 2;
            break;
          case "bottom":
            $e -= Se;
            break;
        }
        switch (S) {
          case "center":
            Yt -= qt / 2;
            break;
          case "right":
            Yt -= qt;
            break;
          case "inner":
            b === x - 1 ? Yt -= qt : b > 0 && (Yt -= qt / 2);
            break;
        }
        ci = {
          left: Yt,
          top: $e,
          width: qt + fe.width,
          height: Se + fe.height,
          color: R.backdropColor
        };
      }
      m.push({
        label: w,
        font: C,
        textOffset: B,
        options: {
          rotation: p,
          color: at,
          strokeColor: ai,
          strokeWidth: li,
          textAlign: de,
          textBaseline: vt,
          translation: [
            y,
            D
          ],
          backdrop: ci
        }
      });
    }
    return m;
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: i } = this.options;
    if (-ie(this.labelRotation))
      return t === "top" ? "left" : "right";
    let n = "center";
    return i.align === "start" ? n = "left" : i.align === "end" ? n = "right" : i.align === "inner" && (n = "inner"), n;
  }
  _getYAxisLabelAlignment(t) {
    const { position: i, ticks: { crossAlign: s, mirror: n, padding: o } } = this.options, r = this._getLabelSizes(), a = t + o, l = r.widest.width;
    let c, u;
    return i === "left" ? n ? (u = this.right + o, s === "near" ? c = "left" : s === "center" ? (c = "center", u += l / 2) : (c = "right", u += l)) : (u = this.right - a, s === "near" ? c = "right" : s === "center" ? (c = "center", u -= l / 2) : (c = "left", u = this.left)) : i === "right" ? n ? (u = this.left + o, s === "near" ? c = "right" : s === "center" ? (c = "center", u -= l / 2) : (c = "left", u -= l)) : (u = this.left + a, s === "near" ? c = "left" : s === "center" ? (c = "center", u += l / 2) : (c = "right", u = this.right)) : c = "right", {
      textAlign: c,
      x: u
    };
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror)
      return;
    const t = this.chart, i = this.options.position;
    if (i === "left" || i === "right")
      return {
        top: 0,
        left: this.left,
        bottom: t.height,
        right: this.right
      };
    if (i === "top" || i === "bottom")
      return {
        top: this.top,
        left: 0,
        bottom: this.bottom,
        right: t.width
      };
  }
  drawBackground() {
    const { ctx: t, options: { backgroundColor: i }, left: s, top: n, width: o, height: r } = this;
    i && (t.save(), t.fillStyle = i, t.fillRect(s, n, o, r), t.restore());
  }
  getLineWidthForValue(t) {
    const i = this.options.grid;
    if (!this._isVisible() || !i.display)
      return 0;
    const n = this.ticks.findIndex((o) => o.value === t);
    return n >= 0 ? i.setContext(this.getContext(n)).lineWidth : 0;
  }
  drawGrid(t) {
    const i = this.options.grid, s = this.ctx, n = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(t));
    let o, r;
    const a = (l, c, u) => {
      !u.width || !u.color || (s.save(), s.lineWidth = u.width, s.strokeStyle = u.color, s.setLineDash(u.borderDash || []), s.lineDashOffset = u.borderDashOffset, s.beginPath(), s.moveTo(l.x, l.y), s.lineTo(c.x, c.y), s.stroke(), s.restore());
    };
    if (i.display)
      for (o = 0, r = n.length; o < r; ++o) {
        const l = n[o];
        i.drawOnChartArea && a({
          x: l.x1,
          y: l.y1
        }, {
          x: l.x2,
          y: l.y2
        }, l), i.drawTicks && a({
          x: l.tx1,
          y: l.ty1
        }, {
          x: l.tx2,
          y: l.ty2
        }, {
          color: l.tickColor,
          width: l.tickWidth,
          borderDash: l.tickBorderDash,
          borderDashOffset: l.tickBorderDashOffset
        });
      }
  }
  drawBorder() {
    const { chart: t, ctx: i, options: { border: s, grid: n } } = this, o = s.setContext(this.getContext()), r = s.display ? o.width : 0;
    if (!r)
      return;
    const a = n.setContext(this.getContext(0)).lineWidth, l = this._borderValue;
    let c, u, h, d;
    this.isHorizontal() ? (c = Xt(t, this.left, r) - r / 2, u = Xt(t, this.right, a) + a / 2, h = d = l) : (h = Xt(t, this.top, r) - r / 2, d = Xt(t, this.bottom, a) + a / 2, c = u = l), i.save(), i.lineWidth = o.width, i.strokeStyle = o.color, i.beginPath(), i.moveTo(c, h), i.lineTo(u, d), i.stroke(), i.restore();
  }
  drawLabels(t) {
    if (!this.options.ticks.display)
      return;
    const s = this.ctx, n = this._computeLabelArea();
    n && Ns(s, n);
    const o = this.getLabelItems(t);
    for (const r of o) {
      const a = r.options, l = r.font, c = r.label, u = r.textOffset;
      Mn(s, c, 0, u, l, a);
    }
    n && Bs(s);
  }
  drawTitle() {
    const { ctx: t, options: { position: i, title: s, reverse: n } } = this;
    if (!s.display)
      return;
    const o = kt(s.font), r = Ut(s.padding), a = s.align;
    let l = o.lineHeight / 2;
    i === "bottom" || i === "center" || M(i) ? (l += r.bottom, j(s.text) && (l += o.lineHeight * (s.text.length - 1))) : l += r.top;
    const { titleX: c, titleY: u, maxWidth: h, rotation: d } = rh(this, l, i, a);
    Mn(t, s.text, 0, 0, o, {
      color: s.color,
      maxWidth: h,
      rotation: d,
      textAlign: oh(a, i, n),
      textBaseline: "middle",
      translation: [
        c,
        u
      ]
    });
  }
  draw(t) {
    this._isVisible() && (this.drawBackground(), this.drawGrid(t), this.drawBorder(), this.drawTitle(), this.drawLabels(t));
  }
  _layers() {
    const t = this.options, i = t.ticks && t.ticks.z || 0, s = E(t.grid && t.grid.z, -1), n = E(t.border && t.border.z, 0);
    return !this._isVisible() || this.draw !== we.prototype.draw ? [
      {
        z: i,
        draw: (o) => {
          this.draw(o);
        }
      }
    ] : [
      {
        z: s,
        draw: (o) => {
          this.drawBackground(), this.drawGrid(o), this.drawTitle();
        }
      },
      {
        z: n,
        draw: () => {
          this.drawBorder();
        }
      },
      {
        z: i,
        draw: (o) => {
          this.drawLabels(o);
        }
      }
    ];
  }
  getMatchingVisibleMetas(t) {
    const i = this.chart.getSortedVisibleDatasetMetas(), s = this.axis + "AxisID", n = [];
    let o, r;
    for (o = 0, r = i.length; o < r; ++o) {
      const a = i[o];
      a[s] === this.id && (!t || a.type === t) && n.push(a);
    }
    return n;
  }
  _resolveTickFontOptions(t) {
    const i = this.options.ticks.setContext(this.getContext(t));
    return kt(i.font);
  }
  _maxDigits() {
    const t = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / t;
  }
}
class ki {
  constructor(t, i, s) {
    this.type = t, this.scope = i, this.override = s, this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype);
  }
  register(t) {
    const i = Object.getPrototypeOf(t);
    let s;
    ch(i) && (s = this.register(i));
    const n = this.items, o = t.id, r = this.scope + "." + o;
    if (!o)
      throw new Error("class does not have id: " + t);
    return o in n || (n[o] = t, ah(t, r, s), this.override && N.override(t.id, t.overrides)), r;
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const i = this.items, s = t.id, n = this.scope;
    s in i && delete i[s], n && s in N[n] && (delete N[n][s], this.override && delete ae[s]);
  }
}
function ah(e, t, i) {
  const s = Xe(/* @__PURE__ */ Object.create(null), [
    i ? N.get(i) : {},
    N.get(t),
    e.defaults
  ]);
  N.set(t, s), e.defaultRoutes && lh(t, e.defaultRoutes), e.descriptors && N.describe(t, e.descriptors);
}
function lh(e, t) {
  Object.keys(t).forEach((i) => {
    const s = i.split("."), n = s.pop(), o = [
      e
    ].concat(s).join("."), r = t[i].split("."), a = r.pop(), l = r.join(".");
    N.route(o, n, l, a);
  });
}
function ch(e) {
  return "id" in e && "defaults" in e;
}
class uh {
  constructor() {
    this.controllers = new ki(wr, "datasets", !0), this.elements = new ki(ni, "elements"), this.plugins = new ki(Object, "plugins"), this.scales = new ki(we, "scales"), this._typedRegistries = [
      this.controllers,
      this.scales,
      this.elements
    ];
  }
  add(...t) {
    this._each("register", t);
  }
  remove(...t) {
    this._each("unregister", t);
  }
  addControllers(...t) {
    this._each("register", t, this.controllers);
  }
  addElements(...t) {
    this._each("register", t, this.elements);
  }
  addPlugins(...t) {
    this._each("register", t, this.plugins);
  }
  addScales(...t) {
    this._each("register", t, this.scales);
  }
  getController(t) {
    return this._get(t, this.controllers, "controller");
  }
  getElement(t) {
    return this._get(t, this.elements, "element");
  }
  getPlugin(t) {
    return this._get(t, this.plugins, "plugin");
  }
  getScale(t) {
    return this._get(t, this.scales, "scale");
  }
  removeControllers(...t) {
    this._each("unregister", t, this.controllers);
  }
  removeElements(...t) {
    this._each("unregister", t, this.elements);
  }
  removePlugins(...t) {
    this._each("unregister", t, this.plugins);
  }
  removeScales(...t) {
    this._each("unregister", t, this.scales);
  }
  _each(t, i, s) {
    [
      ...i
    ].forEach((n) => {
      const o = s || this._getRegistryForType(n);
      s || o.isForType(n) || o === this.plugins && n.id ? this._exec(t, o, n) : P(n, (r) => {
        const a = s || this._getRegistryForType(r);
        this._exec(t, a, r);
      });
    });
  }
  _exec(t, i, s) {
    const n = Rs(t);
    F(s["before" + n], [], s), i[t](s), F(s["after" + n], [], s);
  }
  _getRegistryForType(t) {
    for (let i = 0; i < this._typedRegistries.length; i++) {
      const s = this._typedRegistries[i];
      if (s.isForType(t))
        return s;
    }
    return this.plugins;
  }
  _get(t, i, s) {
    const n = i.get(t);
    if (n === void 0)
      throw new Error('"' + t + '" is not a registered ' + s + ".");
    return n;
  }
}
var xt = /* @__PURE__ */ new uh();
class hh {
  constructor() {
    this._init = void 0;
  }
  notify(t, i, s, n) {
    if (i === "beforeInit" && (this._init = this._createDescriptors(t, !0), this._notify(this._init, t, "install")), this._init === void 0)
      return;
    const o = n ? this._descriptors(t).filter(n) : this._descriptors(t), r = this._notify(o, t, i, s);
    return i === "afterDestroy" && (this._notify(o, t, "stop"), this._notify(this._init, t, "uninstall"), this._init = void 0), r;
  }
  _notify(t, i, s, n) {
    n = n || {};
    for (const o of t) {
      const r = o.plugin, a = r[s], l = [
        i,
        n,
        o.options
      ];
      if (F(a, l, r) === !1 && n.cancelable)
        return !1;
    }
    return !0;
  }
  invalidate() {
    O(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
  }
  _descriptors(t) {
    if (this._cache)
      return this._cache;
    const i = this._cache = this._createDescriptors(t);
    return this._notifyStateChanges(t), i;
  }
  _createDescriptors(t, i) {
    const s = t && t.config, n = E(s.options && s.options.plugins, {}), o = dh(s);
    return n === !1 && !i ? [] : ph(t, o, n, i);
  }
  _notifyStateChanges(t) {
    const i = this._oldCache || [], s = this._cache, n = (o, r) => o.filter((a) => !r.some((l) => a.plugin.id === l.plugin.id));
    this._notify(n(i, s), t, "stop"), this._notify(n(s, i), t, "start");
  }
}
function dh(e) {
  const t = {}, i = [], s = Object.keys(xt.plugins.items);
  for (let o = 0; o < s.length; o++)
    i.push(xt.getPlugin(s[o]));
  const n = e.plugins || [];
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    i.indexOf(r) === -1 && (i.push(r), t[r.id] = !0);
  }
  return {
    plugins: i,
    localIds: t
  };
}
function fh(e, t) {
  return !t && e === !1 ? null : e === !0 ? {} : e;
}
function ph(e, { plugins: t, localIds: i }, s, n) {
  const o = [], r = e.getContext();
  for (const a of t) {
    const l = a.id, c = fh(s[l], n);
    c !== null && o.push({
      plugin: a,
      options: gh(e.config, {
        plugin: a,
        local: i[l]
      }, c, r)
    });
  }
  return o;
}
function gh(e, { plugin: t, local: i }, s, n) {
  const o = e.pluginScopeKeys(t), r = e.getOptionScopes(s, o);
  return i && t.defaults && r.push(t.defaults), e.createResolver(r, n, [
    ""
  ], {
    scriptable: !1,
    indexable: !1,
    allKeys: !0
  });
}
function vs(e, t) {
  const i = N.datasets[e] || {};
  return ((t.datasets || {})[e] || {}).indexAxis || t.indexAxis || i.indexAxis || "x";
}
function mh(e, t) {
  let i = e;
  return e === "_index_" ? i = t : e === "_value_" && (i = t === "x" ? "y" : "x"), i;
}
function bh(e, t) {
  return e === t ? "_index_" : "_value_";
}
function Jn(e) {
  if (e === "x" || e === "y" || e === "r")
    return e;
}
function vh(e) {
  if (e === "top" || e === "bottom")
    return "x";
  if (e === "left" || e === "right")
    return "y";
}
function ys(e, ...t) {
  if (Jn(e))
    return e;
  for (const i of t) {
    const s = i.axis || vh(i.position) || e.length > 1 && Jn(e[0].toLowerCase());
    if (s)
      return s;
  }
  throw new Error(`Cannot determine type of '${e}' axis. Please provide 'axis' or 'position' option.`);
}
function to(e, t, i) {
  if (i[t + "AxisID"] === e)
    return {
      axis: t
    };
}
function yh(e, t) {
  if (t.data && t.data.datasets) {
    const i = t.data.datasets.filter((s) => s.xAxisID === e || s.yAxisID === e);
    if (i.length)
      return to(e, "x", i[0]) || to(e, "y", i[0]);
  }
  return {};
}
function _h(e, t) {
  const i = ae[e.type] || {
    scales: {}
  }, s = t.scales || {}, n = vs(e.type, t), o = /* @__PURE__ */ Object.create(null);
  return Object.keys(s).forEach((r) => {
    const a = s[r];
    if (!M(a))
      return console.error(`Invalid scale configuration for scale: ${r}`);
    if (a._proxy)
      return console.warn(`Ignoring resolver passed as options for scale: ${r}`);
    const l = ys(r, a, yh(r, e), N.scales[a.type]), c = bh(l, n), u = i.scales || {};
    o[r] = We(/* @__PURE__ */ Object.create(null), [
      {
        axis: l
      },
      a,
      u[l],
      u[c]
    ]);
  }), e.data.datasets.forEach((r) => {
    const a = r.type || e.type, l = r.indexAxis || vs(a, t), u = (ae[a] || {}).scales || {};
    Object.keys(u).forEach((h) => {
      const d = mh(h, l), f = r[d + "AxisID"] || d;
      o[f] = o[f] || /* @__PURE__ */ Object.create(null), We(o[f], [
        {
          axis: d
        },
        s[f],
        u[h]
      ]);
    });
  }), Object.keys(o).forEach((r) => {
    const a = o[r];
    We(a, [
      N.scales[a.type],
      N.scale
    ]);
  }), o;
}
function Mr(e) {
  const t = e.options || (e.options = {});
  t.plugins = E(t.plugins, {}), t.scales = _h(e, t);
}
function zr(e) {
  return e = e || {}, e.datasets = e.datasets || [], e.labels = e.labels || [], e;
}
function xh(e) {
  return e = e || {}, e.data = zr(e.data), Mr(e), e;
}
const eo = /* @__PURE__ */ new Map(), Tr = /* @__PURE__ */ new Set();
function Si(e, t) {
  let i = eo.get(e);
  return i || (i = t(), eo.set(e, i), Tr.add(i)), i;
}
const Ee = (e, t, i) => {
  const s = Li(t, i);
  s !== void 0 && e.add(s);
};
class wh {
  constructor(t) {
    this._config = xh(t), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(t) {
    this._config.type = t;
  }
  get data() {
    return this._config.data;
  }
  set data(t) {
    this._config.data = zr(t);
  }
  get options() {
    return this._config.options;
  }
  set options(t) {
    this._config.options = t;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const t = this._config;
    this.clearCache(), Mr(t);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(t) {
    return Si(t, () => [
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(t, i) {
    return Si(`${t}.transition.${i}`, () => [
      [
        `datasets.${t}.transitions.${i}`,
        `transitions.${i}`
      ],
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetElementScopeKeys(t, i) {
    return Si(`${t}-${i}`, () => [
      [
        `datasets.${t}.elements.${i}`,
        `datasets.${t}`,
        `elements.${i}`,
        ""
      ]
    ]);
  }
  pluginScopeKeys(t) {
    const i = t.id, s = this.type;
    return Si(`${s}-plugin-${i}`, () => [
      [
        `plugins.${i}`,
        ...t.additionalOptionScopes || []
      ]
    ]);
  }
  _cachedScopes(t, i) {
    const s = this._scopeCache;
    let n = s.get(t);
    return (!n || i) && (n = /* @__PURE__ */ new Map(), s.set(t, n)), n;
  }
  getOptionScopes(t, i, s) {
    const { options: n, type: o } = this, r = this._cachedScopes(t, s), a = r.get(i);
    if (a)
      return a;
    const l = /* @__PURE__ */ new Set();
    i.forEach((u) => {
      t && (l.add(t), u.forEach((h) => Ee(l, t, h))), u.forEach((h) => Ee(l, n, h)), u.forEach((h) => Ee(l, ae[o] || {}, h)), u.forEach((h) => Ee(l, N, h)), u.forEach((h) => Ee(l, ms, h));
    });
    const c = Array.from(l);
    return c.length === 0 && c.push(/* @__PURE__ */ Object.create(null)), Tr.has(i) && r.set(i, c), c;
  }
  chartOptionScopes() {
    const { options: t, type: i } = this;
    return [
      t,
      ae[i] || {},
      N.datasets[i] || {},
      {
        type: i
      },
      N,
      ms
    ];
  }
  resolveNamedOptions(t, i, s, n = [
    ""
  ]) {
    const o = {
      $shared: !0
    }, { resolver: r, subPrefixes: a } = io(this._resolverCache, t, n);
    let l = r;
    if (Sh(r, i)) {
      o.$shared = !1, s = Vt(s) ? s() : s;
      const c = this.createResolver(t, s, a);
      l = ve(r, s, c);
    }
    for (const c of i)
      o[c] = l[c];
    return o;
  }
  createResolver(t, i, s = [
    ""
  ], n) {
    const { resolver: o } = io(this._resolverCache, t, s);
    return M(i) ? ve(o, i, void 0, n) : o;
  }
}
function io(e, t, i) {
  let s = e.get(t);
  s || (s = /* @__PURE__ */ new Map(), e.set(t, s));
  const n = i.join();
  let o = s.get(n);
  return o || (o = {
    resolver: Vs(t, i),
    subPrefixes: i.filter((a) => !a.toLowerCase().includes("hover"))
  }, s.set(n, o)), o;
}
const kh = (e) => M(e) && Object.getOwnPropertyNames(e).some((t) => Vt(e[t]));
function Sh(e, t) {
  const { isScriptable: i, isIndexable: s } = hr(e);
  for (const n of t) {
    const o = i(n), r = s(n), a = (r || o) && e[n];
    if (o && (Vt(a) || kh(a)) || r && j(a))
      return !0;
  }
  return !1;
}
var $h = "4.5.1";
const Dh = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function so(e, t) {
  return e === "top" || e === "bottom" || Dh.indexOf(e) === -1 && t === "x";
}
function no(e, t) {
  return function(i, s) {
    return i[e] === s[e] ? i[t] - s[t] : i[e] - s[e];
  };
}
function oo(e) {
  const t = e.chart, i = t.options.animation;
  t.notifyPlugins("afterRender"), F(i && i.onComplete, [
    e
  ], t);
}
function Ch(e) {
  const t = e.chart, i = t.options.animation;
  F(i && i.onProgress, [
    e
  ], t);
}
function Pr(e) {
  return Hs() && typeof e == "string" ? e = document.getElementById(e) : e && e.length && (e = e[0]), e && e.canvas && (e = e.canvas), e;
}
const Ti = {}, ro = (e) => {
  const t = Pr(e);
  return Object.values(Ti).filter((i) => i.canvas === t).pop();
};
function Mh(e, t, i) {
  const s = Object.keys(e);
  for (const n of s) {
    const o = +n;
    if (o >= t) {
      const r = e[n];
      delete e[n], (i > 0 || o > t) && (e[o + i] = r);
    }
  }
}
function zh(e, t, i, s) {
  return !i || e.type === "mouseout" ? null : s ? t : e;
}
class Ys {
  static defaults = N;
  static instances = Ti;
  static overrides = ae;
  static registry = xt;
  static version = $h;
  static getChart = ro;
  static register(...t) {
    xt.add(...t), ao();
  }
  static unregister(...t) {
    xt.remove(...t), ao();
  }
  constructor(t, i) {
    const s = this.config = new wh(i), n = Pr(t), o = ro(n);
    if (o)
      throw new Error("Canvas is already in use. Chart with ID '" + o.id + "' must be destroyed before the canvas with ID '" + o.canvas.id + "' can be reused.");
    const r = s.createResolver(s.chartOptionScopes(), this.getContext());
    this.platform = new (s.platform || Yu(n))(), this.platform.updateConfig(s);
    const a = this.platform.acquireContext(n, r.aspectRatio), l = a && a.canvas, c = l && l.height, u = l && l.width;
    if (this.id = Pl(), this.ctx = a, this.canvas = l, this.width = u, this.height = c, this._options = r, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new hh(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = Ql((h) => this.update(h), r.resizeDelay || 0), this._dataChanges = [], Ti[this.id] = this, !a || !l) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    zt.listen(this, "complete", oo), zt.listen(this, "progress", Ch), this._initialize(), this.attached && this.update();
  }
  get aspectRatio() {
    const { options: { aspectRatio: t, maintainAspectRatio: i }, width: s, height: n, _aspectRatio: o } = this;
    return O(t) ? i && o ? o : n ? s / n : null : t;
  }
  get data() {
    return this.config.data;
  }
  set data(t) {
    this.config.data = t;
  }
  get options() {
    return this._options;
  }
  set options(t) {
    this.config.options = t;
  }
  get registry() {
    return xt;
  }
  _initialize() {
    return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : En(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
  }
  clear() {
    return Cn(this.canvas, this.ctx), this;
  }
  stop() {
    return zt.stop(this), this;
  }
  resize(t, i) {
    zt.running(this) ? this._resizeBeforeDraw = {
      width: t,
      height: i
    } : this._resize(t, i);
  }
  _resize(t, i) {
    const s = this.options, n = this.canvas, o = s.maintainAspectRatio && this.aspectRatio, r = this.platform.getMaximumSize(n, t, i, o), a = s.devicePixelRatio || this.platform.getDevicePixelRatio(), l = this.width ? "resize" : "attach";
    this.width = r.width, this.height = r.height, this._aspectRatio = this.aspectRatio, En(this, a, !0) && (this.notifyPlugins("resize", {
      size: r
    }), F(s.onResize, [
      this,
      r
    ], this), this.attached && this._doResize(l) && this.render());
  }
  ensureScalesHaveIDs() {
    const i = this.options.scales || {};
    P(i, (s, n) => {
      s.id = n;
    });
  }
  buildOrUpdateScales() {
    const t = this.options, i = t.scales, s = this.scales, n = Object.keys(s).reduce((r, a) => (r[a] = !1, r), {});
    let o = [];
    i && (o = o.concat(Object.keys(i).map((r) => {
      const a = i[r], l = ys(r, a), c = l === "r", u = l === "x";
      return {
        options: a,
        dposition: c ? "chartArea" : u ? "bottom" : "left",
        dtype: c ? "radialLinear" : u ? "category" : "linear"
      };
    }))), P(o, (r) => {
      const a = r.options, l = a.id, c = ys(l, a), u = E(a.type, r.dtype);
      (a.position === void 0 || so(a.position, c) !== so(r.dposition)) && (a.position = r.dposition), n[l] = !0;
      let h = null;
      if (l in s && s[l].type === u)
        h = s[l];
      else {
        const d = xt.getScale(u);
        h = new d({
          id: l,
          type: u,
          ctx: this.ctx,
          chart: this
        }), s[h.id] = h;
      }
      h.init(a, t);
    }), P(n, (r, a) => {
      r || delete s[a];
    }), P(s, (r) => {
      xi.configure(this, r, r.options), xi.addBox(this, r);
    });
  }
  _updateMetasets() {
    const t = this._metasets, i = this.data.datasets.length, s = t.length;
    if (t.sort((n, o) => n.index - o.index), s > i) {
      for (let n = i; n < s; ++n)
        this._destroyDatasetMeta(n);
      t.splice(i, s - i);
    }
    this._sortedMetasets = t.slice(0).sort(no("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const { _metasets: t, data: { datasets: i } } = this;
    t.length > i.length && delete this._stacks, t.forEach((s, n) => {
      i.filter((o) => o === s._dataset).length === 0 && this._destroyDatasetMeta(n);
    });
  }
  buildOrUpdateControllers() {
    const t = [], i = this.data.datasets;
    let s, n;
    for (this._removeUnreferencedMetasets(), s = 0, n = i.length; s < n; s++) {
      const o = i[s];
      let r = this.getDatasetMeta(s);
      const a = o.type || this.config.type;
      if (r.type && r.type !== a && (this._destroyDatasetMeta(s), r = this.getDatasetMeta(s)), r.type = a, r.indexAxis = o.indexAxis || vs(a, this.options), r.order = o.order || 0, r.index = s, r.label = "" + o.label, r.visible = this.isDatasetVisible(s), r.controller)
        r.controller.updateIndex(s), r.controller.linkScales();
      else {
        const l = xt.getController(a), { datasetElementType: c, dataElementType: u } = N.datasets[a];
        Object.assign(l, {
          dataElementType: xt.getElement(u),
          datasetElementType: c && xt.getElement(c)
        }), r.controller = new l(this, s), t.push(r.controller);
      }
    }
    return this._updateMetasets(), t;
  }
  _resetElements() {
    P(this.data.datasets, (t, i) => {
      this.getDatasetMeta(i).controller.reset();
    }, this);
  }
  reset() {
    this._resetElements(), this.notifyPlugins("reset");
  }
  update(t) {
    const i = this.config;
    i.update();
    const s = this._options = i.createResolver(i.chartOptionScopes(), this.getContext()), n = this._animationsDisabled = !s.animation;
    if (this._updateScales(), this._checkEventBindings(), this._updateHiddenIndices(), this._plugins.invalidate(), this.notifyPlugins("beforeUpdate", {
      mode: t,
      cancelable: !0
    }) === !1)
      return;
    const o = this.buildOrUpdateControllers();
    this.notifyPlugins("beforeElementsUpdate");
    let r = 0;
    for (let c = 0, u = this.data.datasets.length; c < u; c++) {
      const { controller: h } = this.getDatasetMeta(c), d = !n && o.indexOf(h) === -1;
      h.buildOrUpdateElements(d), r = Math.max(+h.getMaxOverflow(), r);
    }
    r = this._minPadding = s.layout.autoPadding ? r : 0, this._updateLayout(r), n || P(o, (c) => {
      c.reset();
    }), this._updateDatasets(t), this.notifyPlugins("afterUpdate", {
      mode: t
    }), this._layers.sort(no("z", "_idx"));
    const { _active: a, _lastEvent: l } = this;
    l ? this._eventHandler(l, !0) : a.length && this._updateHoverStyles(a, a, !0), this.render();
  }
  _updateScales() {
    P(this.scales, (t) => {
      xi.removeBox(this, t);
    }), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const t = this.options, i = new Set(Object.keys(this._listeners)), s = new Set(t.events);
    (!mn(i, s) || !!this._responsiveListeners !== t.responsive) && (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    const { _hiddenIndices: t } = this, i = this._getUniformDataChanges() || [];
    for (const { method: s, start: n, count: o } of i) {
      const r = s === "_removeElements" ? -o : o;
      Mh(t, n, r);
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges;
    if (!t || !t.length)
      return;
    this._dataChanges = [];
    const i = this.data.datasets.length, s = (o) => new Set(t.filter((r) => r[0] === o).map((r, a) => a + "," + r.splice(1).join(","))), n = s(0);
    for (let o = 1; o < i; o++)
      if (!mn(n, s(o)))
        return;
    return Array.from(n).map((o) => o.split(",")).map((o) => ({
      method: o[1],
      start: +o[2],
      count: +o[3]
    }));
  }
  _updateLayout(t) {
    if (this.notifyPlugins("beforeLayout", {
      cancelable: !0
    }) === !1)
      return;
    xi.update(this, this.width, this.height, t);
    const i = this.chartArea, s = i.width <= 0 || i.height <= 0;
    this._layers = [], P(this.boxes, (n) => {
      s && n.position === "chartArea" || (n.configure && n.configure(), this._layers.push(...n._layers()));
    }, this), this._layers.forEach((n, o) => {
      n._idx = o;
    }), this.notifyPlugins("afterLayout");
  }
  _updateDatasets(t) {
    if (this.notifyPlugins("beforeDatasetsUpdate", {
      mode: t,
      cancelable: !0
    }) !== !1) {
      for (let i = 0, s = this.data.datasets.length; i < s; ++i)
        this.getDatasetMeta(i).controller.configure();
      for (let i = 0, s = this.data.datasets.length; i < s; ++i)
        this._updateDataset(i, Vt(t) ? t({
          datasetIndex: i
        }) : t);
      this.notifyPlugins("afterDatasetsUpdate", {
        mode: t
      });
    }
  }
  _updateDataset(t, i) {
    const s = this.getDatasetMeta(t), n = {
      meta: s,
      index: t,
      mode: i,
      cancelable: !0
    };
    this.notifyPlugins("beforeDatasetUpdate", n) !== !1 && (s.controller._update(i), n.cancelable = !1, this.notifyPlugins("afterDatasetUpdate", n));
  }
  render() {
    this.notifyPlugins("beforeRender", {
      cancelable: !0
    }) !== !1 && (zt.has(this) ? this.attached && !zt.running(this) && zt.start(this) : (this.draw(), oo({
      chart: this
    })));
  }
  draw() {
    let t;
    if (this._resizeBeforeDraw) {
      const { width: s, height: n } = this._resizeBeforeDraw;
      this._resizeBeforeDraw = null, this._resize(s, n);
    }
    if (this.clear(), this.width <= 0 || this.height <= 0 || this.notifyPlugins("beforeDraw", {
      cancelable: !0
    }) === !1)
      return;
    const i = this._layers;
    for (t = 0; t < i.length && i[t].z <= 0; ++t)
      i[t].draw(this.chartArea);
    for (this._drawDatasets(); t < i.length; ++t)
      i[t].draw(this.chartArea);
    this.notifyPlugins("afterDraw");
  }
  _getSortedDatasetMetas(t) {
    const i = this._sortedMetasets, s = [];
    let n, o;
    for (n = 0, o = i.length; n < o; ++n) {
      const r = i[n];
      (!t || r.visible) && s.push(r);
    }
    return s;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(!0);
  }
  _drawDatasets() {
    if (this.notifyPlugins("beforeDatasetsDraw", {
      cancelable: !0
    }) === !1)
      return;
    const t = this.getSortedVisibleDatasetMetas();
    for (let i = t.length - 1; i >= 0; --i)
      this._drawDataset(t[i]);
    this.notifyPlugins("afterDatasetsDraw");
  }
  _drawDataset(t) {
    const i = this.ctx, s = {
      meta: t,
      index: t.index,
      cancelable: !0
    }, n = yr(this, t);
    this.notifyPlugins("beforeDatasetDraw", s) !== !1 && (n && Ns(i, n), t.controller.draw(), n && Bs(i), s.cancelable = !1, this.notifyPlugins("afterDatasetDraw", s));
  }
  isPointInArea(t) {
    return Ge(t, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(t, i, s, n) {
    const o = Du.modes[i];
    return typeof o == "function" ? o(this, t, s, n) : [];
  }
  getDatasetMeta(t) {
    const i = this.data.datasets[t], s = this._metasets;
    let n = s.filter((o) => o && o._dataset === i).pop();
    return n || (n = {
      type: null,
      data: [],
      dataset: null,
      controller: null,
      hidden: null,
      xAxisID: null,
      yAxisID: null,
      order: i && i.order || 0,
      index: t,
      _dataset: i,
      _parsed: [],
      _sorted: !1
    }, s.push(n)), n;
  }
  getContext() {
    return this.$context || (this.$context = he(null, {
      chart: this,
      type: "chart"
    }));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(t) {
    const i = this.data.datasets[t];
    if (!i)
      return !1;
    const s = this.getDatasetMeta(t);
    return typeof s.hidden == "boolean" ? !s.hidden : !i.hidden;
  }
  setDatasetVisibility(t, i) {
    const s = this.getDatasetMeta(t);
    s.hidden = !i;
  }
  toggleDataVisibility(t) {
    this._hiddenIndices[t] = !this._hiddenIndices[t];
  }
  getDataVisibility(t) {
    return !this._hiddenIndices[t];
  }
  _updateVisibility(t, i, s) {
    const n = s ? "show" : "hide", o = this.getDatasetMeta(t), r = o.controller._resolveAnimations(void 0, n);
    Ri(i) ? (o.data[i].hidden = !s, this.update()) : (this.setDatasetVisibility(t, s), r.update(o, {
      visible: s
    }), this.update((a) => a.datasetIndex === t ? n : void 0));
  }
  hide(t, i) {
    this._updateVisibility(t, i, !1);
  }
  show(t, i) {
    this._updateVisibility(t, i, !0);
  }
  _destroyDatasetMeta(t) {
    const i = this._metasets[t];
    i && i.controller && i.controller._destroy(), delete this._metasets[t];
  }
  _stop() {
    let t, i;
    for (this.stop(), zt.remove(this), t = 0, i = this.data.datasets.length; t < i; ++t)
      this._destroyDatasetMeta(t);
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas: t, ctx: i } = this;
    this._stop(), this.config.clearCache(), t && (this.unbindEvents(), Cn(t, i), this.platform.releaseContext(i), this.canvas = null, this.ctx = null), delete Ti[this.id], this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...t) {
    return this.canvas.toDataURL(...t);
  }
  bindEvents() {
    this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0;
  }
  bindUserEvents() {
    const t = this._listeners, i = this.platform, s = (o, r) => {
      i.addEventListener(this, o, r), t[o] = r;
    }, n = (o, r, a) => {
      o.offsetX = r, o.offsetY = a, this._eventHandler(o);
    };
    P(this.options.events, (o) => s(o, n));
  }
  bindResponsiveEvents() {
    this._responsiveListeners || (this._responsiveListeners = {});
    const t = this._responsiveListeners, i = this.platform, s = (l, c) => {
      i.addEventListener(this, l, c), t[l] = c;
    }, n = (l, c) => {
      t[l] && (i.removeEventListener(this, l, c), delete t[l]);
    }, o = (l, c) => {
      this.canvas && this.resize(l, c);
    };
    let r;
    const a = () => {
      n("attach", a), this.attached = !0, this.resize(), s("resize", o), s("detach", r);
    };
    r = () => {
      this.attached = !1, n("resize", o), this._stop(), this._resize(0, 0), s("attach", a);
    }, i.isAttached(this.canvas) ? a() : r();
  }
  unbindEvents() {
    P(this._listeners, (t, i) => {
      this.platform.removeEventListener(this, i, t);
    }), this._listeners = {}, P(this._responsiveListeners, (t, i) => {
      this.platform.removeEventListener(this, i, t);
    }), this._responsiveListeners = void 0;
  }
  updateHoverStyle(t, i, s) {
    const n = s ? "set" : "remove";
    let o, r, a, l;
    for (i === "dataset" && (o = this.getDatasetMeta(t[0].datasetIndex), o.controller["_" + n + "DatasetHoverStyle"]()), a = 0, l = t.length; a < l; ++a) {
      r = t[a];
      const c = r && this.getDatasetMeta(r.datasetIndex).controller;
      c && c[n + "HoverStyle"](r.element, r.datasetIndex, r.index);
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t) {
    const i = this._active || [], s = t.map(({ datasetIndex: o, index: r }) => {
      const a = this.getDatasetMeta(o);
      if (!a)
        throw new Error("No dataset found at index " + o);
      return {
        datasetIndex: o,
        element: a.data[r],
        index: r
      };
    });
    !Oi(s, i) && (this._active = s, this._lastEvent = null, this._updateHoverStyles(s, i));
  }
  notifyPlugins(t, i, s) {
    return this._plugins.notify(this, t, i, s);
  }
  isPluginEnabled(t) {
    return this._plugins._cache.filter((i) => i.plugin.id === t).length === 1;
  }
  _updateHoverStyles(t, i, s) {
    const n = this.options.hover, o = (l, c) => l.filter((u) => !c.some((h) => u.datasetIndex === h.datasetIndex && u.index === h.index)), r = o(i, t), a = s ? t : o(t, i);
    r.length && this.updateHoverStyle(r, n.mode, !1), a.length && n.mode && this.updateHoverStyle(a, n.mode, !0);
  }
  _eventHandler(t, i) {
    const s = {
      event: t,
      replay: i,
      cancelable: !0,
      inChartArea: this.isPointInArea(t)
    }, n = (r) => (r.options.events || this.options.events).includes(t.native.type);
    if (this.notifyPlugins("beforeEvent", s, n) === !1)
      return;
    const o = this._handleEvent(t, i, s.inChartArea);
    return s.cancelable = !1, this.notifyPlugins("afterEvent", s, n), (o || s.changed) && this.render(), this;
  }
  _handleEvent(t, i, s) {
    const { _active: n = [], options: o } = this, r = i, a = this._getActiveElements(t, n, s, r), l = Fl(t), c = zh(t, this._lastEvent, s, l);
    s && (this._lastEvent = null, F(o.onHover, [
      t,
      a,
      this
    ], this), l && F(o.onClick, [
      t,
      a,
      this
    ], this));
    const u = !Oi(a, n);
    return (u || i) && (this._active = a, this._updateHoverStyles(a, n, i)), this._lastEvent = c, u;
  }
  _getActiveElements(t, i, s, n) {
    if (t.type === "mouseout")
      return [];
    if (!s)
      return i;
    const o = this.options.hover;
    return this.getElementsAtEventForMode(t, o.mode, o, n);
  }
}
function ao() {
  return P(Ys.instances, (e) => e._plugins.invalidate());
}
function Er(e, t, i = t) {
  e.lineCap = E(i.borderCapStyle, t.borderCapStyle), e.setLineDash(E(i.borderDash, t.borderDash)), e.lineDashOffset = E(i.borderDashOffset, t.borderDashOffset), e.lineJoin = E(i.borderJoinStyle, t.borderJoinStyle), e.lineWidth = E(i.borderWidth, t.borderWidth), e.strokeStyle = E(i.borderColor, t.borderColor);
}
function Th(e, t, i) {
  e.lineTo(i.x, i.y);
}
function Ph(e) {
  return e.stepped ? fc : e.tension || e.cubicInterpolationMode === "monotone" ? pc : Th;
}
function Or(e, t, i = {}) {
  const s = e.length, { start: n = 0, end: o = s - 1 } = i, { start: r, end: a } = t, l = Math.max(n, r), c = Math.min(o, a), u = n < r && o < r || n > a && o > a;
  return {
    count: s,
    start: l,
    loop: t.loop,
    ilen: c < l && !u ? s + c - l : c - l
  };
}
function Eh(e, t, i, s) {
  const { points: n, options: o } = t, { count: r, start: a, loop: l, ilen: c } = Or(n, i, s), u = Ph(o);
  let { move: h = !0, reverse: d } = s || {}, f, g, p;
  for (f = 0; f <= c; ++f)
    g = n[(a + (d ? c - f : f)) % r], !g.skip && (h ? (e.moveTo(g.x, g.y), h = !1) : u(e, p, g, d, o.stepped), p = g);
  return l && (g = n[(a + (d ? c : 0)) % r], u(e, p, g, d, o.stepped)), !!l;
}
function Oh(e, t, i, s) {
  const n = t.points, { count: o, start: r, ilen: a } = Or(n, i, s), { move: l = !0, reverse: c } = s || {};
  let u = 0, h = 0, d, f, g, p, m, b;
  const x = (w) => (r + (c ? a - w : w)) % o, k = () => {
    p !== m && (e.lineTo(u, m), e.lineTo(u, p), e.lineTo(u, b));
  };
  for (l && (f = n[x(0)], e.moveTo(f.x, f.y)), d = 0; d <= a; ++d) {
    if (f = n[x(d)], f.skip)
      continue;
    const w = f.x, y = f.y, D = w | 0;
    D === g ? (y < p ? p = y : y > m && (m = y), u = (h * u + w) / ++h) : (k(), e.lineTo(w, y), g = D, h = 0, p = m = y), b = y;
  }
  k();
}
function _s(e) {
  const t = e.options, i = t.borderDash && t.borderDash.length;
  return !e._decimated && !e._loop && !t.tension && t.cubicInterpolationMode !== "monotone" && !t.stepped && !i ? Oh : Eh;
}
function Ah(e) {
  return e.stepped ? Yc : e.tension || e.cubicInterpolationMode === "monotone" ? Kc : Qt;
}
function Lh(e, t, i, s) {
  let n = t._path;
  n || (n = t._path = new Path2D(), t.path(n, i, s) && n.closePath()), Er(e, t.options), e.stroke(n);
}
function Rh(e, t, i, s) {
  const { segments: n, options: o } = t, r = _s(t);
  for (const a of n)
    Er(e, o, a.style), e.beginPath(), r(e, t, a, {
      start: i,
      end: i + s - 1
    }) && e.closePath(), e.stroke();
}
const Fh = typeof Path2D == "function";
function Ih(e, t, i, s) {
  Fh && !t.options.segment ? Lh(e, t, i, s) : Rh(e, t, i, s);
}
class Hi extends ni {
  static id = "line";
  static defaults = {
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderWidth: 3,
    capBezierPoints: !0,
    cubicInterpolationMode: "default",
    fill: !1,
    spanGaps: !1,
    stepped: !1,
    tension: 0
  };
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  static descriptors = {
    _scriptable: !0,
    _indexable: (t) => t !== "borderDash" && t !== "fill"
  };
  constructor(t) {
    super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, t && Object.assign(this, t);
  }
  updateControlPoints(t, i) {
    const s = this.options;
    if ((s.tension || s.cubicInterpolationMode === "monotone") && !s.stepped && !this._pointsUpdated) {
      const n = s.spanGaps ? this._loop : this._fullLoop;
      Nc(this._points, s, t, n, i), this._pointsUpdated = !0;
    }
  }
  set points(t) {
    this._points = t, delete this._segments, delete this._path, this._pointsUpdated = !1;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = iu(this, this.options.segment));
  }
  first() {
    const t = this.segments, i = this.points;
    return t.length && i[t[0].start];
  }
  last() {
    const t = this.segments, i = this.points, s = t.length;
    return s && i[t[s - 1].end];
  }
  interpolate(t, i) {
    const s = this.options, n = t[i], o = this.points, r = vr(this, {
      property: i,
      start: n,
      end: n
    });
    if (!r.length)
      return;
    const a = [], l = Ah(s);
    let c, u;
    for (c = 0, u = r.length; c < u; ++c) {
      const { start: h, end: d } = r[c], f = o[h], g = o[d];
      if (f === g) {
        a.push(f);
        continue;
      }
      const p = Math.abs((n - f[i]) / (g[i] - f[i])), m = l(f, g, p, s.stepped);
      m[i] = t[i], a.push(m);
    }
    return a.length === 1 ? a[0] : a;
  }
  pathSegment(t, i, s) {
    return _s(this)(t, this, i, s);
  }
  path(t, i, s) {
    const n = this.segments, o = _s(this);
    let r = this._loop;
    i = i || 0, s = s || this.points.length - i;
    for (const a of n)
      r &= o(t, this, a, {
        start: i,
        end: i + s - 1
      });
    return !!r;
  }
  draw(t, i, s, n) {
    const o = this.options || {};
    (this.points || []).length && o.borderWidth && (t.save(), Ih(t, this, s, n), t.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
  }
}
function lo(e, t, i, s) {
  const n = e.options, { [i]: o } = e.getProps([
    i
  ], s);
  return Math.abs(t - o) < n.radius + n.hitRadius;
}
class Nh extends ni {
  static id = "point";
  parsed;
  skip;
  stop;
  /**
  * @type {any}
  */
  static defaults = {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: "circle",
    radius: 3,
    rotation: 0
  };
  /**
  * @type {any}
  */
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  constructor(t) {
    super(), this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, t && Object.assign(this, t);
  }
  inRange(t, i, s) {
    const n = this.options, { x: o, y: r } = this.getProps([
      "x",
      "y"
    ], s);
    return Math.pow(t - o, 2) + Math.pow(i - r, 2) < Math.pow(n.hitRadius + n.radius, 2);
  }
  inXRange(t, i) {
    return lo(this, t, "x", i);
  }
  inYRange(t, i) {
    return lo(this, t, "y", i);
  }
  getCenterPoint(t) {
    const { x: i, y: s } = this.getProps([
      "x",
      "y"
    ], t);
    return {
      x: i,
      y: s
    };
  }
  size(t) {
    t = t || this.options || {};
    let i = t.radius || 0;
    i = Math.max(i, i && t.hoverRadius || 0);
    const s = i && t.borderWidth || 0;
    return (i + s) * 2;
  }
  draw(t, i) {
    const s = this.options;
    this.skip || s.radius < 0.1 || !Ge(this, i, this.size(s) / 2) || (t.strokeStyle = s.borderColor, t.lineWidth = s.borderWidth, t.fillStyle = s.backgroundColor, bs(t, s, this.x, this.y));
  }
  getRange() {
    const t = this.options || {};
    return t.radius + t.hitRadius;
  }
}
function Bh(e, t, i) {
  const s = e.segments, n = e.points, o = t.points, r = [];
  for (const a of s) {
    let { start: l, end: c } = a;
    c = ji(l, c, n);
    const u = xs(i, n[l], n[c], a.loop);
    if (!t.segments) {
      r.push({
        source: a,
        target: u,
        start: n[l],
        end: n[c]
      });
      continue;
    }
    const h = vr(t, u);
    for (const d of h) {
      const f = xs(i, o[d.start], o[d.end], d.loop), g = br(a, n, f);
      for (const p of g)
        r.push({
          source: p,
          target: d,
          start: {
            [i]: co(u, f, "start", Math.max)
          },
          end: {
            [i]: co(u, f, "end", Math.min)
          }
        });
    }
  }
  return r;
}
function xs(e, t, i, s) {
  if (s)
    return;
  let n = t[e], o = i[e];
  return e === "angle" && (n = wt(n), o = wt(o)), {
    property: e,
    start: n,
    end: o
  };
}
function Vh(e, t) {
  const { x: i = null, y: s = null } = e || {}, n = t.points, o = [];
  return t.segments.forEach(({ start: r, end: a }) => {
    a = ji(r, a, n);
    const l = n[r], c = n[a];
    s !== null ? (o.push({
      x: l.x,
      y: s
    }), o.push({
      x: c.x,
      y: s
    })) : i !== null && (o.push({
      x: i,
      y: l.y
    }), o.push({
      x: i,
      y: c.y
    }));
  }), o;
}
function ji(e, t, i) {
  for (; t > e; t--) {
    const s = i[t];
    if (!isNaN(s.x) && !isNaN(s.y))
      break;
  }
  return t;
}
function co(e, t, i, s) {
  return e && t ? s(e[i], t[i]) : e ? e[i] : t ? t[i] : 0;
}
function Ar(e, t) {
  let i = [], s = !1;
  return j(e) ? (s = !0, i = e) : i = Vh(e, t), i.length ? new Hi({
    points: i,
    options: {
      tension: 0
    },
    _loop: s,
    _fullLoop: s
  }) : null;
}
function uo(e) {
  return e && e.fill !== !1;
}
function Uh(e, t, i) {
  let n = e[t].fill;
  const o = [
    t
  ];
  let r;
  if (!i)
    return n;
  for (; n !== !1 && o.indexOf(n) === -1; ) {
    if (!X(n))
      return n;
    if (r = e[n], !r)
      return !1;
    if (r.visible)
      return n;
    o.push(n), n = r.fill;
  }
  return !1;
}
function Wh(e, t, i) {
  const s = Yh(e);
  if (M(s))
    return isNaN(s.value) ? !1 : s;
  let n = parseFloat(s);
  return X(n) && Math.floor(n) === n ? Hh(s[0], t, n, i) : [
    "origin",
    "start",
    "end",
    "stack",
    "shape"
  ].indexOf(s) >= 0 && s;
}
function Hh(e, t, i, s) {
  return (e === "-" || e === "+") && (i = t + i), i === t || i < 0 || i >= s ? !1 : i;
}
function jh(e, t) {
  let i = null;
  return e === "start" ? i = t.bottom : e === "end" ? i = t.top : M(e) ? i = t.getPixelForValue(e.value) : t.getBasePixel && (i = t.getBasePixel()), i;
}
function qh(e, t, i) {
  let s;
  return e === "start" ? s = i : e === "end" ? s = t.options.reverse ? t.min : t.max : M(e) ? s = e.value : s = t.getBaseValue(), s;
}
function Yh(e) {
  const t = e.options, i = t.fill;
  let s = E(i && i.target, i);
  return s === void 0 && (s = !!t.backgroundColor), s === !1 || s === null ? !1 : s === !0 ? "origin" : s;
}
function Kh(e) {
  const { scale: t, index: i, line: s } = e, n = [], o = s.segments, r = s.points, a = Xh(t, i);
  a.push(Ar({
    x: null,
    y: t.bottom
  }, s));
  for (let l = 0; l < o.length; l++) {
    const c = o[l];
    for (let u = c.start; u <= c.end; u++)
      Zh(n, r[u], a);
  }
  return new Hi({
    points: n,
    options: {}
  });
}
function Xh(e, t) {
  const i = [], s = e.getMatchingVisibleMetas("line");
  for (let n = 0; n < s.length; n++) {
    const o = s[n];
    if (o.index === t)
      break;
    o.hidden || i.unshift(o.dataset);
  }
  return i;
}
function Zh(e, t, i) {
  const s = [];
  for (let n = 0; n < i.length; n++) {
    const o = i[n], { first: r, last: a, point: l } = Gh(o, t, "x");
    if (!(!l || r && a)) {
      if (r)
        s.unshift(l);
      else if (e.push(l), !a)
        break;
    }
  }
  e.push(...s);
}
function Gh(e, t, i) {
  const s = e.interpolate(t, i);
  if (!s)
    return {};
  const n = s[i], o = e.segments, r = e.points;
  let a = !1, l = !1;
  for (let c = 0; c < o.length; c++) {
    const u = o[c], h = r[u.start][i], d = r[u.end][i];
    if (nr(n, h, d)) {
      a = n === h, l = n === d;
      break;
    }
  }
  return {
    first: a,
    last: l,
    point: s
  };
}
class Lr {
  constructor(t) {
    this.x = t.x, this.y = t.y, this.radius = t.radius;
  }
  pathSegment(t, i, s) {
    const { x: n, y: o, radius: r } = this;
    return i = i || {
      start: 0,
      end: St
    }, t.arc(n, o, r, i.end, i.start, !0), !s.bounds;
  }
  interpolate(t) {
    const { x: i, y: s, radius: n } = this, o = t.angle;
    return {
      x: i + Math.cos(o) * n,
      y: s + Math.sin(o) * n,
      angle: o
    };
  }
}
function Qh(e) {
  const { chart: t, fill: i, line: s } = e;
  if (X(i))
    return Jh(t, i);
  if (i === "stack")
    return Kh(e);
  if (i === "shape")
    return !0;
  const n = td(e);
  return n instanceof Lr ? n : Ar(n, s);
}
function Jh(e, t) {
  const i = e.getDatasetMeta(t);
  return i && e.isDatasetVisible(t) ? i.dataset : null;
}
function td(e) {
  return (e.scale || {}).getPointPositionForValue ? id(e) : ed(e);
}
function ed(e) {
  const { scale: t = {}, fill: i } = e, s = jh(i, t);
  if (X(s)) {
    const n = t.isHorizontal();
    return {
      x: n ? s : null,
      y: n ? null : s
    };
  }
  return null;
}
function id(e) {
  const { scale: t, fill: i } = e, s = t.options, n = t.getLabels().length, o = s.reverse ? t.max : t.min, r = qh(i, t, o), a = [];
  if (s.grid.circular) {
    const l = t.getPointPositionForValue(0, o);
    return new Lr({
      x: l.x,
      y: l.y,
      radius: t.getDistanceFromCenterForValue(r)
    });
  }
  for (let l = 0; l < n; ++l)
    a.push(t.getPointPositionForValue(l, r));
  return a;
}
function ls(e, t, i) {
  const s = Qh(t), { chart: n, index: o, line: r, scale: a, axis: l } = t, c = r.options, u = c.fill, h = c.backgroundColor, { above: d = h, below: f = h } = u || {}, g = n.getDatasetMeta(o), p = yr(n, g);
  s && r.points.length && (Ns(e, i), sd(e, {
    line: r,
    target: s,
    above: d,
    below: f,
    area: i,
    scale: a,
    axis: l,
    clip: p
  }), Bs(e));
}
function sd(e, t) {
  const { line: i, target: s, above: n, below: o, area: r, scale: a, clip: l } = t, c = i._loop ? "angle" : t.axis;
  e.save();
  let u = o;
  o !== n && (c === "x" ? (ho(e, s, r.top), cs(e, {
    line: i,
    target: s,
    color: n,
    scale: a,
    property: c,
    clip: l
  }), e.restore(), e.save(), ho(e, s, r.bottom)) : c === "y" && (fo(e, s, r.left), cs(e, {
    line: i,
    target: s,
    color: o,
    scale: a,
    property: c,
    clip: l
  }), e.restore(), e.save(), fo(e, s, r.right), u = n)), cs(e, {
    line: i,
    target: s,
    color: u,
    scale: a,
    property: c,
    clip: l
  }), e.restore();
}
function ho(e, t, i) {
  const { segments: s, points: n } = t;
  let o = !0, r = !1;
  e.beginPath();
  for (const a of s) {
    const { start: l, end: c } = a, u = n[l], h = n[ji(l, c, n)];
    o ? (e.moveTo(u.x, u.y), o = !1) : (e.lineTo(u.x, i), e.lineTo(u.x, u.y)), r = !!t.pathSegment(e, a, {
      move: r
    }), r ? e.closePath() : e.lineTo(h.x, i);
  }
  e.lineTo(t.first().x, i), e.closePath(), e.clip();
}
function fo(e, t, i) {
  const { segments: s, points: n } = t;
  let o = !0, r = !1;
  e.beginPath();
  for (const a of s) {
    const { start: l, end: c } = a, u = n[l], h = n[ji(l, c, n)];
    o ? (e.moveTo(u.x, u.y), o = !1) : (e.lineTo(i, u.y), e.lineTo(u.x, u.y)), r = !!t.pathSegment(e, a, {
      move: r
    }), r ? e.closePath() : e.lineTo(i, h.y);
  }
  e.lineTo(i, t.first().y), e.closePath(), e.clip();
}
function cs(e, t) {
  const { line: i, target: s, property: n, color: o, scale: r, clip: a } = t, l = Bh(i, s, n);
  for (const { source: c, target: u, start: h, end: d } of l) {
    const { style: { backgroundColor: f = o } = {} } = c, g = s !== !0;
    e.save(), e.fillStyle = f, nd(e, r, a, g && xs(n, h, d)), e.beginPath();
    const p = !!i.pathSegment(e, c);
    let m;
    if (g) {
      p ? e.closePath() : po(e, s, d, n);
      const b = !!s.pathSegment(e, u, {
        move: p,
        reverse: !0
      });
      m = p && b, m || po(e, s, h, n);
    }
    e.closePath(), e.fill(m ? "evenodd" : "nonzero"), e.restore();
  }
}
function nd(e, t, i, s) {
  const n = t.chart.chartArea, { property: o, start: r, end: a } = s || {};
  if (o === "x" || o === "y") {
    let l, c, u, h;
    o === "x" ? (l = r, c = n.top, u = a, h = n.bottom) : (l = n.left, c = r, u = n.right, h = a), e.beginPath(), i && (l = Math.max(l, i.left), u = Math.min(u, i.right), c = Math.max(c, i.top), h = Math.min(h, i.bottom)), e.rect(l, c, u - l, h - c), e.clip();
  }
}
function po(e, t, i, s) {
  const n = t.interpolate(i, s);
  n && e.lineTo(n.x, n.y);
}
var od = {
  id: "filler",
  afterDatasetsUpdate(e, t, i) {
    const s = (e.data.datasets || []).length, n = [];
    let o, r, a, l;
    for (r = 0; r < s; ++r)
      o = e.getDatasetMeta(r), a = o.dataset, l = null, a && a.options && a instanceof Hi && (l = {
        visible: e.isDatasetVisible(r),
        index: r,
        fill: Wh(a, r, s),
        chart: e,
        axis: o.controller.options.indexAxis,
        scale: o.vScale,
        line: a
      }), o.$filler = l, n.push(l);
    for (r = 0; r < s; ++r)
      l = n[r], !(!l || l.fill === !1) && (l.fill = Uh(n, r, i.propagate));
  },
  beforeDraw(e, t, i) {
    const s = i.drawTime === "beforeDraw", n = e.getSortedVisibleDatasetMetas(), o = e.chartArea;
    for (let r = n.length - 1; r >= 0; --r) {
      const a = n[r].$filler;
      a && (a.line.updateControlPoints(o, a.axis), s && a.fill && ls(e.ctx, a, o));
    }
  },
  beforeDatasetsDraw(e, t, i) {
    if (i.drawTime !== "beforeDatasetsDraw")
      return;
    const s = e.getSortedVisibleDatasetMetas();
    for (let n = s.length - 1; n >= 0; --n) {
      const o = s[n].$filler;
      uo(o) && ls(e.ctx, o, e.chartArea);
    }
  },
  beforeDatasetDraw(e, t, i) {
    const s = t.meta.$filler;
    !uo(s) || i.drawTime !== "beforeDatasetDraw" || ls(e.ctx, s, e.chartArea);
  },
  defaults: {
    propagate: !0,
    drawTime: "beforeDatasetDraw"
  }
};
const Re = {
  average(e) {
    if (!e.length)
      return !1;
    let t, i, s = /* @__PURE__ */ new Set(), n = 0, o = 0;
    for (t = 0, i = e.length; t < i; ++t) {
      const a = e[t].element;
      if (a && a.hasValue()) {
        const l = a.tooltipPosition();
        s.add(l.x), n += l.y, ++o;
      }
    }
    return o === 0 || s.size === 0 ? !1 : {
      x: [
        ...s
      ].reduce((a, l) => a + l) / s.size,
      y: n / o
    };
  },
  nearest(e, t) {
    if (!e.length)
      return !1;
    let i = t.x, s = t.y, n = Number.POSITIVE_INFINITY, o, r, a;
    for (o = 0, r = e.length; o < r; ++o) {
      const l = e[o].element;
      if (l && l.hasValue()) {
        const c = l.getCenterPoint(), u = gs(t, c);
        u < n && (n = u, a = l);
      }
    }
    if (a) {
      const l = a.tooltipPosition();
      i = l.x, s = l.y;
    }
    return {
      x: i,
      y: s
    };
  }
};
function _t(e, t) {
  return t && (j(t) ? Array.prototype.push.apply(e, t) : e.push(t)), e;
}
function Tt(e) {
  return (typeof e == "string" || e instanceof String) && e.indexOf(`
`) > -1 ? e.split(`
`) : e;
}
function rd(e, t) {
  const { element: i, datasetIndex: s, index: n } = t, o = e.getDatasetMeta(s).controller, { label: r, value: a } = o.getLabelAndValue(n);
  return {
    chart: e,
    label: r,
    parsed: o.getParsed(n),
    raw: e.data.datasets[s].data[n],
    formattedValue: a,
    dataset: o.getDataset(),
    dataIndex: n,
    datasetIndex: s,
    element: i
  };
}
function go(e, t) {
  const i = e.chart.ctx, { body: s, footer: n, title: o } = e, { boxWidth: r, boxHeight: a } = t, l = kt(t.bodyFont), c = kt(t.titleFont), u = kt(t.footerFont), h = o.length, d = n.length, f = s.length, g = Ut(t.padding);
  let p = g.height, m = 0, b = s.reduce((w, y) => w + y.before.length + y.lines.length + y.after.length, 0);
  if (b += e.beforeBody.length + e.afterBody.length, h && (p += h * c.lineHeight + (h - 1) * t.titleSpacing + t.titleMarginBottom), b) {
    const w = t.displayColors ? Math.max(a, l.lineHeight) : l.lineHeight;
    p += f * w + (b - f) * l.lineHeight + (b - 1) * t.bodySpacing;
  }
  d && (p += t.footerMarginTop + d * u.lineHeight + (d - 1) * t.footerSpacing);
  let x = 0;
  const k = function(w) {
    m = Math.max(m, i.measureText(w).width + x);
  };
  return i.save(), i.font = c.string, P(e.title, k), i.font = l.string, P(e.beforeBody.concat(e.afterBody), k), x = t.displayColors ? r + 2 + t.boxPadding : 0, P(s, (w) => {
    P(w.before, k), P(w.lines, k), P(w.after, k);
  }), x = 0, i.font = u.string, P(e.footer, k), i.restore(), m += g.width, {
    width: m,
    height: p
  };
}
function ad(e, t) {
  const { y: i, height: s } = t;
  return i < s / 2 ? "top" : i > e.height - s / 2 ? "bottom" : "center";
}
function ld(e, t, i, s) {
  const { x: n, width: o } = s, r = i.caretSize + i.caretPadding;
  if (e === "left" && n + o + r > t.width || e === "right" && n - o - r < 0)
    return !0;
}
function cd(e, t, i, s) {
  const { x: n, width: o } = i, { width: r, chartArea: { left: a, right: l } } = e;
  let c = "center";
  return s === "center" ? c = n <= (a + l) / 2 ? "left" : "right" : n <= o / 2 ? c = "left" : n >= r - o / 2 && (c = "right"), ld(c, e, t, i) && (c = "center"), c;
}
function mo(e, t, i) {
  const s = i.yAlign || t.yAlign || ad(e, i);
  return {
    xAlign: i.xAlign || t.xAlign || cd(e, t, i, s),
    yAlign: s
  };
}
function ud(e, t) {
  let { x: i, width: s } = e;
  return t === "right" ? i -= s : t === "center" && (i -= s / 2), i;
}
function hd(e, t, i) {
  let { y: s, height: n } = e;
  return t === "top" ? s += i : t === "bottom" ? s -= n + i : s -= n / 2, s;
}
function bo(e, t, i, s) {
  const { caretSize: n, caretPadding: o, cornerRadius: r } = e, { xAlign: a, yAlign: l } = i, c = n + o, { topLeft: u, topRight: h, bottomLeft: d, bottomRight: f } = Mi(r);
  let g = ud(t, a);
  const p = hd(t, l, c);
  return l === "center" ? a === "left" ? g += c : a === "right" && (g -= c) : a === "left" ? g -= Math.max(u, d) + n : a === "right" && (g += Math.max(h, f) + n), {
    x: ct(g, 0, s.width - t.width),
    y: ct(p, 0, s.height - t.height)
  };
}
function $i(e, t, i) {
  const s = Ut(i.padding);
  return t === "center" ? e.x + e.width / 2 : t === "right" ? e.x + e.width - s.right : e.x + s.left;
}
function vo(e) {
  return _t([], Tt(e));
}
function dd(e, t, i) {
  return he(e, {
    tooltip: t,
    tooltipItems: i,
    type: "tooltip"
  });
}
function yo(e, t) {
  const i = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return i ? e.override(i) : e;
}
const Rr = {
  beforeTitle: Mt,
  title(e) {
    if (e.length > 0) {
      const t = e[0], i = t.chart.data.labels, s = i ? i.length : 0;
      if (this && this.options && this.options.mode === "dataset")
        return t.dataset.label || "";
      if (t.label)
        return t.label;
      if (s > 0 && t.dataIndex < s)
        return i[t.dataIndex];
    }
    return "";
  },
  afterTitle: Mt,
  beforeBody: Mt,
  beforeLabel: Mt,
  label(e) {
    if (this && this.options && this.options.mode === "dataset")
      return e.label + ": " + e.formattedValue || e.formattedValue;
    let t = e.dataset.label || "";
    t && (t += ": ");
    const i = e.formattedValue;
    return O(i) || (t += i), t;
  },
  labelColor(e) {
    const i = e.chart.getDatasetMeta(e.datasetIndex).controller.getStyle(e.dataIndex);
    return {
      borderColor: i.borderColor,
      backgroundColor: i.backgroundColor,
      borderWidth: i.borderWidth,
      borderDash: i.borderDash,
      borderDashOffset: i.borderDashOffset,
      borderRadius: 0
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(e) {
    const i = e.chart.getDatasetMeta(e.datasetIndex).controller.getStyle(e.dataIndex);
    return {
      pointStyle: i.pointStyle,
      rotation: i.rotation
    };
  },
  afterLabel: Mt,
  afterBody: Mt,
  beforeFooter: Mt,
  footer: Mt,
  afterFooter: Mt
};
function J(e, t, i, s) {
  const n = e[t].call(i, s);
  return typeof n > "u" ? Rr[t].call(i, s) : n;
}
class _o extends ni {
  static positioners = Re;
  constructor(t) {
    super(), this.opacity = 0, this._active = [], this._eventPosition = void 0, this._size = void 0, this._cachedAnimations = void 0, this._tooltipItems = [], this.$animations = void 0, this.$context = void 0, this.chart = t.chart, this.options = t.options, this.dataPoints = void 0, this.title = void 0, this.beforeBody = void 0, this.body = void 0, this.afterBody = void 0, this.footer = void 0, this.xAlign = void 0, this.yAlign = void 0, this.x = void 0, this.y = void 0, this.height = void 0, this.width = void 0, this.caretX = void 0, this.caretY = void 0, this.labelColors = void 0, this.labelPointStyles = void 0, this.labelTextColors = void 0;
  }
  initialize(t) {
    this.options = t, this._cachedAnimations = void 0, this.$context = void 0;
  }
  _resolveAnimations() {
    const t = this._cachedAnimations;
    if (t)
      return t;
    const i = this.chart, s = this.options.setContext(this.getContext()), n = s.enabled && i.options.animation && s.animations, o = new _r(this.chart, n);
    return n._cacheable && (this._cachedAnimations = Object.freeze(o)), o;
  }
  getContext() {
    return this.$context || (this.$context = dd(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(t, i) {
    const { callbacks: s } = i, n = J(s, "beforeTitle", this, t), o = J(s, "title", this, t), r = J(s, "afterTitle", this, t);
    let a = [];
    return a = _t(a, Tt(n)), a = _t(a, Tt(o)), a = _t(a, Tt(r)), a;
  }
  getBeforeBody(t, i) {
    return vo(J(i.callbacks, "beforeBody", this, t));
  }
  getBody(t, i) {
    const { callbacks: s } = i, n = [];
    return P(t, (o) => {
      const r = {
        before: [],
        lines: [],
        after: []
      }, a = yo(s, o);
      _t(r.before, Tt(J(a, "beforeLabel", this, o))), _t(r.lines, J(a, "label", this, o)), _t(r.after, Tt(J(a, "afterLabel", this, o))), n.push(r);
    }), n;
  }
  getAfterBody(t, i) {
    return vo(J(i.callbacks, "afterBody", this, t));
  }
  getFooter(t, i) {
    const { callbacks: s } = i, n = J(s, "beforeFooter", this, t), o = J(s, "footer", this, t), r = J(s, "afterFooter", this, t);
    let a = [];
    return a = _t(a, Tt(n)), a = _t(a, Tt(o)), a = _t(a, Tt(r)), a;
  }
  _createItems(t) {
    const i = this._active, s = this.chart.data, n = [], o = [], r = [];
    let a = [], l, c;
    for (l = 0, c = i.length; l < c; ++l)
      a.push(rd(this.chart, i[l]));
    return t.filter && (a = a.filter((u, h, d) => t.filter(u, h, d, s))), t.itemSort && (a = a.sort((u, h) => t.itemSort(u, h, s))), P(a, (u) => {
      const h = yo(t.callbacks, u);
      n.push(J(h, "labelColor", this, u)), o.push(J(h, "labelPointStyle", this, u)), r.push(J(h, "labelTextColor", this, u));
    }), this.labelColors = n, this.labelPointStyles = o, this.labelTextColors = r, this.dataPoints = a, a;
  }
  update(t, i) {
    const s = this.options.setContext(this.getContext()), n = this._active;
    let o, r = [];
    if (!n.length)
      this.opacity !== 0 && (o = {
        opacity: 0
      });
    else {
      const a = Re[s.position].call(this, n, this._eventPosition);
      r = this._createItems(s), this.title = this.getTitle(r, s), this.beforeBody = this.getBeforeBody(r, s), this.body = this.getBody(r, s), this.afterBody = this.getAfterBody(r, s), this.footer = this.getFooter(r, s);
      const l = this._size = go(this, s), c = Object.assign({}, a, l), u = mo(this.chart, s, c), h = bo(s, c, u, this.chart);
      this.xAlign = u.xAlign, this.yAlign = u.yAlign, o = {
        opacity: 1,
        x: h.x,
        y: h.y,
        width: l.width,
        height: l.height,
        caretX: a.x,
        caretY: a.y
      };
    }
    this._tooltipItems = r, this.$context = void 0, o && this._resolveAnimations().update(this, o), t && s.external && s.external.call(this, {
      chart: this.chart,
      tooltip: this,
      replay: i
    });
  }
  drawCaret(t, i, s, n) {
    const o = this.getCaretPosition(t, s, n);
    i.lineTo(o.x1, o.y1), i.lineTo(o.x2, o.y2), i.lineTo(o.x3, o.y3);
  }
  getCaretPosition(t, i, s) {
    const { xAlign: n, yAlign: o } = this, { caretSize: r, cornerRadius: a } = s, { topLeft: l, topRight: c, bottomLeft: u, bottomRight: h } = Mi(a), { x: d, y: f } = t, { width: g, height: p } = i;
    let m, b, x, k, w, y;
    return o === "center" ? (w = f + p / 2, n === "left" ? (m = d, b = m - r, k = w + r, y = w - r) : (m = d + g, b = m + r, k = w - r, y = w + r), x = m) : (n === "left" ? b = d + Math.max(l, u) + r : n === "right" ? b = d + g - Math.max(c, h) - r : b = this.caretX, o === "top" ? (k = f, w = k - r, m = b - r, x = b + r) : (k = f + p, w = k + r, m = b + r, x = b - r), y = k), {
      x1: m,
      x2: b,
      x3: x,
      y1: k,
      y2: w,
      y3: y
    };
  }
  drawTitle(t, i, s) {
    const n = this.title, o = n.length;
    let r, a, l;
    if (o) {
      const c = es(s.rtl, this.x, this.width);
      for (t.x = $i(this, s.titleAlign, s), i.textAlign = c.textAlign(s.titleAlign), i.textBaseline = "middle", r = kt(s.titleFont), a = s.titleSpacing, i.fillStyle = s.titleColor, i.font = r.string, l = 0; l < o; ++l)
        i.fillText(n[l], c.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + a, l + 1 === o && (t.y += s.titleMarginBottom - a);
    }
  }
  _drawColorBox(t, i, s, n, o) {
    const r = this.labelColors[s], a = this.labelPointStyles[s], { boxHeight: l, boxWidth: c } = o, u = kt(o.bodyFont), h = $i(this, "left", o), d = n.x(h), f = l < u.lineHeight ? (u.lineHeight - l) / 2 : 0, g = i.y + f;
    if (o.usePointStyle) {
      const p = {
        radius: Math.min(c, l) / 2,
        pointStyle: a.pointStyle,
        rotation: a.rotation,
        borderWidth: 1
      }, m = n.leftForLtr(d, c) + c / 2, b = g + l / 2;
      t.strokeStyle = o.multiKeyBackground, t.fillStyle = o.multiKeyBackground, bs(t, p, m, b), t.strokeStyle = r.borderColor, t.fillStyle = r.backgroundColor, bs(t, p, m, b);
    } else {
      t.lineWidth = M(r.borderWidth) ? Math.max(...Object.values(r.borderWidth)) : r.borderWidth || 1, t.strokeStyle = r.borderColor, t.setLineDash(r.borderDash || []), t.lineDashOffset = r.borderDashOffset || 0;
      const p = n.leftForLtr(d, c), m = n.leftForLtr(n.xPlus(d, 1), c - 2), b = Mi(r.borderRadius);
      Object.values(b).some((x) => x !== 0) ? (t.beginPath(), t.fillStyle = o.multiKeyBackground, zn(t, {
        x: p,
        y: g,
        w: c,
        h: l,
        radius: b
      }), t.fill(), t.stroke(), t.fillStyle = r.backgroundColor, t.beginPath(), zn(t, {
        x: m,
        y: g + 1,
        w: c - 2,
        h: l - 2,
        radius: b
      }), t.fill()) : (t.fillStyle = o.multiKeyBackground, t.fillRect(p, g, c, l), t.strokeRect(p, g, c, l), t.fillStyle = r.backgroundColor, t.fillRect(m, g + 1, c - 2, l - 2));
    }
    t.fillStyle = this.labelTextColors[s];
  }
  drawBody(t, i, s) {
    const { body: n } = this, { bodySpacing: o, bodyAlign: r, displayColors: a, boxHeight: l, boxWidth: c, boxPadding: u } = s, h = kt(s.bodyFont);
    let d = h.lineHeight, f = 0;
    const g = es(s.rtl, this.x, this.width), p = function($) {
      i.fillText($, g.x(t.x + f), t.y + d / 2), t.y += d + o;
    }, m = g.textAlign(r);
    let b, x, k, w, y, D, S;
    for (i.textAlign = r, i.textBaseline = "middle", i.font = h.string, t.x = $i(this, m, s), i.fillStyle = s.bodyColor, P(this.beforeBody, p), f = a && m !== "right" ? r === "center" ? c / 2 + u : c + 2 + u : 0, w = 0, D = n.length; w < D; ++w) {
      for (b = n[w], x = this.labelTextColors[w], i.fillStyle = x, P(b.before, p), k = b.lines, a && k.length && (this._drawColorBox(i, t, w, g, s), d = Math.max(h.lineHeight, l)), y = 0, S = k.length; y < S; ++y)
        p(k[y]), d = h.lineHeight;
      P(b.after, p);
    }
    f = 0, d = h.lineHeight, P(this.afterBody, p), t.y -= o;
  }
  drawFooter(t, i, s) {
    const n = this.footer, o = n.length;
    let r, a;
    if (o) {
      const l = es(s.rtl, this.x, this.width);
      for (t.x = $i(this, s.footerAlign, s), t.y += s.footerMarginTop, i.textAlign = l.textAlign(s.footerAlign), i.textBaseline = "middle", r = kt(s.footerFont), i.fillStyle = s.footerColor, i.font = r.string, a = 0; a < o; ++a)
        i.fillText(n[a], l.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + s.footerSpacing;
    }
  }
  drawBackground(t, i, s, n) {
    const { xAlign: o, yAlign: r } = this, { x: a, y: l } = t, { width: c, height: u } = s, { topLeft: h, topRight: d, bottomLeft: f, bottomRight: g } = Mi(n.cornerRadius);
    i.fillStyle = n.backgroundColor, i.strokeStyle = n.borderColor, i.lineWidth = n.borderWidth, i.beginPath(), i.moveTo(a + h, l), r === "top" && this.drawCaret(t, i, s, n), i.lineTo(a + c - d, l), i.quadraticCurveTo(a + c, l, a + c, l + d), r === "center" && o === "right" && this.drawCaret(t, i, s, n), i.lineTo(a + c, l + u - g), i.quadraticCurveTo(a + c, l + u, a + c - g, l + u), r === "bottom" && this.drawCaret(t, i, s, n), i.lineTo(a + f, l + u), i.quadraticCurveTo(a, l + u, a, l + u - f), r === "center" && o === "left" && this.drawCaret(t, i, s, n), i.lineTo(a, l + h), i.quadraticCurveTo(a, l, a + h, l), i.closePath(), i.fill(), n.borderWidth > 0 && i.stroke();
  }
  _updateAnimationTarget(t) {
    const i = this.chart, s = this.$animations, n = s && s.x, o = s && s.y;
    if (n || o) {
      const r = Re[t.position].call(this, this._active, this._eventPosition);
      if (!r)
        return;
      const a = this._size = go(this, t), l = Object.assign({}, r, this._size), c = mo(i, t, l), u = bo(t, l, c, i);
      (n._to !== u.x || o._to !== u.y) && (this.xAlign = c.xAlign, this.yAlign = c.yAlign, this.width = a.width, this.height = a.height, this.caretX = r.x, this.caretY = r.y, this._resolveAnimations().update(this, u));
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(t) {
    const i = this.options.setContext(this.getContext());
    let s = this.opacity;
    if (!s)
      return;
    this._updateAnimationTarget(i);
    const n = {
      width: this.width,
      height: this.height
    }, o = {
      x: this.x,
      y: this.y
    };
    s = Math.abs(s) < 1e-3 ? 0 : s;
    const r = Ut(i.padding), a = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    i.enabled && a && (t.save(), t.globalAlpha = s, this.drawBackground(o, t, n, i), Gc(t, i.textDirection), o.y += r.top, this.drawTitle(o, t, i), this.drawBody(o, t, i), this.drawFooter(o, t, i), Qc(t, i.textDirection), t.restore());
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t, i) {
    const s = this._active, n = t.map(({ datasetIndex: a, index: l }) => {
      const c = this.chart.getDatasetMeta(a);
      if (!c)
        throw new Error("Cannot find a dataset at index " + a);
      return {
        datasetIndex: a,
        element: c.data[l],
        index: l
      };
    }), o = !Oi(s, n), r = this._positionChanged(n, i);
    (o || r) && (this._active = n, this._eventPosition = i, this._ignoreReplayEvents = !0, this.update(!0));
  }
  handleEvent(t, i, s = !0) {
    if (i && this._ignoreReplayEvents)
      return !1;
    this._ignoreReplayEvents = !1;
    const n = this.options, o = this._active || [], r = this._getActiveElements(t, o, i, s), a = this._positionChanged(r, t), l = i || !Oi(r, o) || a;
    return l && (this._active = r, (n.enabled || n.external) && (this._eventPosition = {
      x: t.x,
      y: t.y
    }, this.update(!0, i))), l;
  }
  _getActiveElements(t, i, s, n) {
    const o = this.options;
    if (t.type === "mouseout")
      return [];
    if (!n)
      return i.filter((a) => this.chart.data.datasets[a.datasetIndex] && this.chart.getDatasetMeta(a.datasetIndex).controller.getParsed(a.index) !== void 0);
    const r = this.chart.getElementsAtEventForMode(t, o.mode, o, s);
    return o.reverse && r.reverse(), r;
  }
  _positionChanged(t, i) {
    const { caretX: s, caretY: n, options: o } = this, r = Re[o.position].call(this, t, i);
    return r !== !1 && (s !== r.x || n !== r.y);
  }
}
var fd = {
  id: "tooltip",
  _element: _o,
  positioners: Re,
  afterInit(e, t, i) {
    i && (e.tooltip = new _o({
      chart: e,
      options: i
    }));
  },
  beforeUpdate(e, t, i) {
    e.tooltip && e.tooltip.initialize(i);
  },
  reset(e, t, i) {
    e.tooltip && e.tooltip.initialize(i);
  },
  afterDraw(e) {
    const t = e.tooltip;
    if (t && t._willRender()) {
      const i = {
        tooltip: t
      };
      if (e.notifyPlugins("beforeTooltipDraw", {
        ...i,
        cancelable: !0
      }) === !1)
        return;
      t.draw(e.ctx), e.notifyPlugins("afterTooltipDraw", i);
    }
  },
  afterEvent(e, t) {
    if (e.tooltip) {
      const i = t.replay;
      e.tooltip.handleEvent(t.event, i, t.inChartArea) && (t.changed = !0);
    }
  },
  defaults: {
    enabled: !0,
    external: null,
    position: "average",
    backgroundColor: "rgba(0,0,0,0.8)",
    titleColor: "#fff",
    titleFont: {
      weight: "bold"
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: "left",
    bodyColor: "#fff",
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: "left",
    footerColor: "#fff",
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: "bold"
    },
    footerAlign: "left",
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (e, t) => t.bodyFont.size,
    boxWidth: (e, t) => t.bodyFont.size,
    multiKeyBackground: "#fff",
    displayColors: !0,
    boxPadding: 0,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: "easeOutQuart"
    },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "width",
          "height",
          "caretX",
          "caretY"
        ]
      },
      opacity: {
        easing: "linear",
        duration: 200
      }
    },
    callbacks: Rr
  },
  defaultRoutes: {
    bodyFont: "font",
    footerFont: "font",
    titleFont: "font"
  },
  descriptors: {
    _scriptable: (e) => e !== "filter" && e !== "itemSort" && e !== "external",
    _indexable: !1,
    callbacks: {
      _scriptable: !1,
      _indexable: !1
    },
    animation: {
      _fallback: !1
    },
    animations: {
      _fallback: "animation"
    }
  },
  additionalOptionScopes: [
    "interaction"
  ]
};
const pd = (e, t, i, s) => (typeof t == "string" ? (i = e.push(t) - 1, s.unshift({
  index: i,
  label: t
})) : isNaN(t) && (i = null), i);
function gd(e, t, i, s) {
  const n = e.indexOf(t);
  if (n === -1)
    return pd(e, t, i, s);
  const o = e.lastIndexOf(t);
  return n !== o ? i : n;
}
const md = (e, t) => e === null ? null : ct(Math.round(e), 0, t);
function xo(e) {
  const t = this.getLabels();
  return e >= 0 && e < t.length ? t[e] : e;
}
class bd extends we {
  static id = "category";
  static defaults = {
    ticks: {
      callback: xo
    }
  };
  constructor(t) {
    super(t), this._startValue = void 0, this._valueRange = 0, this._addedLabels = [];
  }
  init(t) {
    const i = this._addedLabels;
    if (i.length) {
      const s = this.getLabels();
      for (const { index: n, label: o } of i)
        s[n] === o && s.splice(n, 1);
      this._addedLabels = [];
    }
    super.init(t);
  }
  parse(t, i) {
    if (O(t))
      return null;
    const s = this.getLabels();
    return i = isFinite(i) && s[i] === t ? i : gd(s, t, E(i, t), this._addedLabels), md(i, s.length - 1);
  }
  determineDataLimits() {
    const { minDefined: t, maxDefined: i } = this.getUserBounds();
    let { min: s, max: n } = this.getMinMax(!0);
    this.options.bounds === "ticks" && (t || (s = 0), i || (n = this.getLabels().length - 1)), this.min = s, this.max = n;
  }
  buildTicks() {
    const t = this.min, i = this.max, s = this.options.offset, n = [];
    let o = this.getLabels();
    o = t === 0 && i === o.length - 1 ? o : o.slice(t, i + 1), this._valueRange = Math.max(o.length - (s ? 0 : 1), 1), this._startValue = this.min - (s ? 0.5 : 0);
    for (let r = t; r <= i; r++)
      n.push({
        value: r
      });
    return n;
  }
  getLabelForValue(t) {
    return xo.call(this, t);
  }
  configure() {
    super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels);
  }
  getPixelForValue(t) {
    return typeof t != "number" && (t = this.parse(t)), t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getPixelForTick(t) {
    const i = this.ticks;
    return t < 0 || t > i.length - 1 ? null : this.getPixelForValue(i[t].value);
  }
  getValueForPixel(t) {
    return Math.round(this._startValue + this.getDecimalForPixel(t) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
}
function vd(e, t) {
  const i = [], { bounds: n, step: o, min: r, max: a, precision: l, count: c, maxTicks: u, maxDigits: h, includeBounds: d } = e, f = o || 1, g = u - 1, { min: p, max: m } = t, b = !O(r), x = !O(a), k = !O(c), w = (m - p) / (h + 1);
  let y = vn((m - p) / g / f) * f, D, S, $, C;
  if (y < 1e-14 && !b && !x)
    return [
      {
        value: p
      },
      {
        value: m
      }
    ];
  C = Math.ceil(m / y) - Math.floor(p / y), C > g && (y = vn(C * y / g / f) * f), O(l) || (D = Math.pow(10, l), y = Math.ceil(y * D) / D), n === "ticks" ? (S = Math.floor(p / y) * y, $ = Math.ceil(m / y) * y) : (S = p, $ = m), b && x && o && Ul((a - r) / o, y / 1e3) ? (C = Math.round(Math.min((a - r) / y, u)), y = (a - r) / C, S = r, $ = a) : k ? (S = b ? r : S, $ = x ? a : $, C = c - 1, y = ($ - S) / C) : (C = ($ - S) / y, He(C, Math.round(C), y / 1e3) ? C = Math.round(C) : C = Math.ceil(C));
  const A = Math.max(yn(y), yn(S));
  D = Math.pow(10, O(l) ? A : l), S = Math.round(S * D) / D, $ = Math.round($ * D) / D;
  let L = 0;
  for (b && (d && S !== r ? (i.push({
    value: r
  }), S < r && L++, He(Math.round((S + L * y) * D) / D, r, wo(r, w, e)) && L++) : S < r && L++); L < C; ++L) {
    const B = Math.round((S + L * y) * D) / D;
    if (x && B > a)
      break;
    i.push({
      value: B
    });
  }
  return x && d && $ !== a ? i.length && He(i[i.length - 1].value, a, wo(a, w, e)) ? i[i.length - 1].value = a : i.push({
    value: a
  }) : (!x || $ === a) && i.push({
    value: $
  }), i;
}
function wo(e, t, { horizontal: i, minRotation: s }) {
  const n = ie(s), o = (i ? Math.sin(n) : Math.cos(n)) || 1e-3, r = 0.75 * t * ("" + e).length;
  return Math.min(t / o, r);
}
class yd extends we {
  constructor(t) {
    super(t), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
  }
  parse(t, i) {
    return O(t) || (typeof t == "number" || t instanceof Number) && !isFinite(+t) ? null : +t;
  }
  handleTickRangeOptions() {
    const { beginAtZero: t } = this.options, { minDefined: i, maxDefined: s } = this.getUserBounds();
    let { min: n, max: o } = this;
    const r = (l) => n = i ? n : l, a = (l) => o = s ? o : l;
    if (t) {
      const l = be(n), c = be(o);
      l < 0 && c < 0 ? a(0) : l > 0 && c > 0 && r(0);
    }
    if (n === o) {
      let l = o === 0 ? 1 : Math.abs(o * 0.05);
      a(o + l), t || r(n - l);
    }
    this.min = n, this.max = o;
  }
  getTickLimit() {
    const t = this.options.ticks;
    let { maxTicksLimit: i, stepSize: s } = t, n;
    return s ? (n = Math.ceil(this.max / s) - Math.floor(this.min / s) + 1, n > 1e3 && (console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${n} ticks. Limiting to 1000.`), n = 1e3)) : (n = this.computeTickLimit(), i = i || 11), i && (n = Math.min(i, n)), n;
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const t = this.options, i = t.ticks;
    let s = this.getTickLimit();
    s = Math.max(2, s);
    const n = {
      maxTicks: s,
      bounds: t.bounds,
      min: t.min,
      max: t.max,
      precision: i.precision,
      step: i.stepSize,
      count: i.count,
      maxDigits: this._maxDigits(),
      horizontal: this.isHorizontal(),
      minRotation: i.minRotation || 0,
      includeBounds: i.includeBounds !== !1
    }, o = this._range || this, r = vd(n, o);
    return t.bounds === "ticks" && Wl(r, this, "value"), t.reverse ? (r.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), r;
  }
  configure() {
    const t = this.ticks;
    let i = this.min, s = this.max;
    if (super.configure(), this.options.offset && t.length) {
      const n = (s - i) / Math.max(t.length - 1, 1) / 2;
      i -= n, s += n;
    }
    this._startValue = i, this._endValue = s, this._valueRange = s - i;
  }
  getLabelForValue(t) {
    return lr(t, this.chart.options.locale, this.options.ticks.format);
  }
}
class _d extends yd {
  static id = "linear";
  static defaults = {
    ticks: {
      callback: cr.formatters.numeric
    }
  };
  determineDataLimits() {
    const { min: t, max: i } = this.getMinMax(!0);
    this.min = X(t) ? t : 0, this.max = X(i) ? i : 1, this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const t = this.isHorizontal(), i = t ? this.width : this.height, s = ie(this.options.ticks.minRotation), n = (t ? Math.sin(s) : Math.cos(s)) || 1e-3, o = this._resolveTickFontOptions(0);
    return Math.ceil(i / Math.min(40, o.lineHeight / n));
  }
  getPixelForValue(t) {
    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
const qi = {
  millisecond: {
    common: !0,
    size: 1,
    steps: 1e3
  },
  second: {
    common: !0,
    size: 1e3,
    steps: 60
  },
  minute: {
    common: !0,
    size: 6e4,
    steps: 60
  },
  hour: {
    common: !0,
    size: 36e5,
    steps: 24
  },
  day: {
    common: !0,
    size: 864e5,
    steps: 30
  },
  week: {
    common: !1,
    size: 6048e5,
    steps: 4
  },
  month: {
    common: !0,
    size: 2628e6,
    steps: 12
  },
  quarter: {
    common: !1,
    size: 7884e6,
    steps: 4
  },
  year: {
    common: !0,
    size: 3154e7
  }
}, et = /* @__PURE__ */ Object.keys(qi);
function ko(e, t) {
  return e - t;
}
function So(e, t) {
  if (O(t))
    return null;
  const i = e._adapter, { parser: s, round: n, isoWeekday: o } = e._parseOpts;
  let r = t;
  return typeof s == "function" && (r = s(r)), X(r) || (r = typeof s == "string" ? i.parse(r, s) : i.parse(r)), r === null ? null : (n && (r = n === "week" && (Ze(o) || o === !0) ? i.startOf(r, "isoWeek", o) : i.startOf(r, n)), +r);
}
function $o(e, t, i, s) {
  const n = et.length;
  for (let o = et.indexOf(e); o < n - 1; ++o) {
    const r = qi[et[o]], a = r.steps ? r.steps : Number.MAX_SAFE_INTEGER;
    if (r.common && Math.ceil((i - t) / (a * r.size)) <= s)
      return et[o];
  }
  return et[n - 1];
}
function xd(e, t, i, s, n) {
  for (let o = et.length - 1; o >= et.indexOf(i); o--) {
    const r = et[o];
    if (qi[r].common && e._adapter.diff(n, s, r) >= t - 1)
      return r;
  }
  return et[i ? et.indexOf(i) : 0];
}
function wd(e) {
  for (let t = et.indexOf(e) + 1, i = et.length; t < i; ++t)
    if (qi[et[t]].common)
      return et[t];
}
function Do(e, t, i) {
  if (!i)
    e[t] = !0;
  else if (i.length) {
    const { lo: s, hi: n } = Fs(i, t), o = i[s] >= t ? i[s] : i[n];
    e[o] = !0;
  }
}
function kd(e, t, i, s) {
  const n = e._adapter, o = +n.startOf(t[0].value, s), r = t[t.length - 1].value;
  let a, l;
  for (a = o; a <= r; a = +n.add(a, 1, s))
    l = i[a], l >= 0 && (t[l].major = !0);
  return t;
}
function Co(e, t, i) {
  const s = [], n = {}, o = t.length;
  let r, a;
  for (r = 0; r < o; ++r)
    a = t[r], n[a] = r, s.push({
      value: a,
      major: !1
    });
  return o === 0 || !i ? s : kd(e, s, n, i);
}
class Mo extends we {
  static id = "time";
  static defaults = {
    bounds: "data",
    adapters: {},
    time: {
      parser: !1,
      unit: !1,
      round: !1,
      isoWeekday: !1,
      minUnit: "millisecond",
      displayFormats: {}
    },
    ticks: {
      source: "auto",
      callback: !1,
      major: {
        enabled: !1
      }
    }
  };
  constructor(t) {
    super(t), this._cache = {
      data: [],
      labels: [],
      all: []
    }, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
  }
  init(t, i = {}) {
    const s = t.time || (t.time = {}), n = this._adapter = new xu._date(t.adapters.date);
    n.init(i), We(s.displayFormats, n.formats()), this._parseOpts = {
      parser: s.parser,
      round: s.round,
      isoWeekday: s.isoWeekday
    }, super.init(t), this._normalized = i.normalized;
  }
  parse(t, i) {
    return t === void 0 ? null : So(this, t);
  }
  beforeLayout() {
    super.beforeLayout(), this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }
  determineDataLimits() {
    const t = this.options, i = this._adapter, s = t.time.unit || "day";
    let { min: n, max: o, minDefined: r, maxDefined: a } = this.getUserBounds();
    function l(c) {
      !r && !isNaN(c.min) && (n = Math.min(n, c.min)), !a && !isNaN(c.max) && (o = Math.max(o, c.max));
    }
    (!r || !a) && (l(this._getLabelBounds()), (t.bounds !== "ticks" || t.ticks.source !== "labels") && l(this.getMinMax(!1))), n = X(n) && !isNaN(n) ? n : +i.startOf(Date.now(), s), o = X(o) && !isNaN(o) ? o : +i.endOf(Date.now(), s) + 1, this.min = Math.min(n, o - 1), this.max = Math.max(n + 1, o);
  }
  _getLabelBounds() {
    const t = this.getLabelTimestamps();
    let i = Number.POSITIVE_INFINITY, s = Number.NEGATIVE_INFINITY;
    return t.length && (i = t[0], s = t[t.length - 1]), {
      min: i,
      max: s
    };
  }
  buildTicks() {
    const t = this.options, i = t.time, s = t.ticks, n = s.source === "labels" ? this.getLabelTimestamps() : this._generate();
    t.bounds === "ticks" && n.length && (this.min = this._userMin || n[0], this.max = this._userMax || n[n.length - 1]);
    const o = this.min, r = this.max, a = Xl(n, o, r);
    return this._unit = i.unit || (s.autoSkip ? $o(i.minUnit, this.min, this.max, this._getLabelCapacity(o)) : xd(this, a.length, i.minUnit, this.min, this.max)), this._majorUnit = !s.major.enabled || this._unit === "year" ? void 0 : wd(this._unit), this.initOffsets(n), t.reverse && a.reverse(), Co(this, a, this._majorUnit);
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((t) => +t.value));
  }
  initOffsets(t = []) {
    let i = 0, s = 0, n, o;
    this.options.offset && t.length && (n = this.getDecimalForValue(t[0]), t.length === 1 ? i = 1 - n : i = (this.getDecimalForValue(t[1]) - n) / 2, o = this.getDecimalForValue(t[t.length - 1]), t.length === 1 ? s = o : s = (o - this.getDecimalForValue(t[t.length - 2])) / 2);
    const r = t.length < 3 ? 0.5 : 0.25;
    i = ct(i, 0, r), s = ct(s, 0, r), this._offsets = {
      start: i,
      end: s,
      factor: 1 / (i + 1 + s)
    };
  }
  _generate() {
    const t = this._adapter, i = this.min, s = this.max, n = this.options, o = n.time, r = o.unit || $o(o.minUnit, i, s, this._getLabelCapacity(i)), a = E(n.ticks.stepSize, 1), l = r === "week" ? o.isoWeekday : !1, c = Ze(l) || l === !0, u = {};
    let h = i, d, f;
    if (c && (h = +t.startOf(h, "isoWeek", l)), h = +t.startOf(h, c ? "day" : r), t.diff(s, i, r) > 1e5 * a)
      throw new Error(i + " and " + s + " are too far apart with stepSize of " + a + " " + r);
    const g = n.ticks.source === "data" && this.getDataTimestamps();
    for (d = h, f = 0; d < s; d = +t.add(d, a, r), f++)
      Do(u, d, g);
    return (d === s || n.bounds === "ticks" || f === 1) && Do(u, d, g), Object.keys(u).sort(ko).map((p) => +p);
  }
  getLabelForValue(t) {
    const i = this._adapter, s = this.options.time;
    return s.tooltipFormat ? i.format(t, s.tooltipFormat) : i.format(t, s.displayFormats.datetime);
  }
  format(t, i) {
    const n = this.options.time.displayFormats, o = this._unit, r = i || n[o];
    return this._adapter.format(t, r);
  }
  _tickFormatFunction(t, i, s, n) {
    const o = this.options, r = o.ticks.callback;
    if (r)
      return F(r, [
        t,
        i,
        s
      ], this);
    const a = o.time.displayFormats, l = this._unit, c = this._majorUnit, u = l && a[l], h = c && a[c], d = s[i], f = c && h && d && d.major;
    return this._adapter.format(t, n || (f ? h : u));
  }
  generateTickLabels(t) {
    let i, s, n;
    for (i = 0, s = t.length; i < s; ++i)
      n = t[i], n.label = this._tickFormatFunction(n.value, i, t);
  }
  getDecimalForValue(t) {
    return t === null ? NaN : (t - this.min) / (this.max - this.min);
  }
  getPixelForValue(t) {
    const i = this._offsets, s = this.getDecimalForValue(t);
    return this.getPixelForDecimal((i.start + s) * i.factor);
  }
  getValueForPixel(t) {
    const i = this._offsets, s = this.getDecimalForPixel(t) / i.factor - i.end;
    return this.min + s * (this.max - this.min);
  }
  _getLabelSize(t) {
    const i = this.options.ticks, s = this.ctx.measureText(t).width, n = ie(this.isHorizontal() ? i.maxRotation : i.minRotation), o = Math.cos(n), r = Math.sin(n), a = this._resolveTickFontOptions(0).size;
    return {
      w: s * o + a * r,
      h: s * r + a * o
    };
  }
  _getLabelCapacity(t) {
    const i = this.options.time, s = i.displayFormats, n = s[i.unit] || s.millisecond, o = this._tickFormatFunction(t, 0, Co(this, [
      t
    ], this._majorUnit), n), r = this._getLabelSize(o), a = Math.floor(this.isHorizontal() ? this.width / r.w : this.height / r.h) - 1;
    return a > 0 ? a : 1;
  }
  getDataTimestamps() {
    let t = this._cache.data || [], i, s;
    if (t.length)
      return t;
    const n = this.getMatchingVisibleMetas();
    if (this._normalized && n.length)
      return this._cache.data = n[0].controller.getAllParsedValues(this);
    for (i = 0, s = n.length; i < s; ++i)
      t = t.concat(n[i].controller.getAllParsedValues(this));
    return this._cache.data = this.normalize(t);
  }
  getLabelTimestamps() {
    const t = this._cache.labels || [];
    let i, s;
    if (t.length)
      return t;
    const n = this.getLabels();
    for (i = 0, s = n.length; i < s; ++i)
      t.push(So(this, n[i]));
    return this._cache.labels = this._normalized ? t : this.normalize(t);
  }
  normalize(t) {
    return Gl(t.sort(ko));
  }
}
function Di(e, t, i) {
  let s = 0, n = e.length - 1, o, r, a, l;
  i ? (t >= e[s].pos && t <= e[n].pos && ({ lo: s, hi: n } = se(e, "pos", t)), { pos: o, time: a } = e[s], { pos: r, time: l } = e[n]) : (t >= e[s].time && t <= e[n].time && ({ lo: s, hi: n } = se(e, "time", t)), { time: o, pos: a } = e[s], { time: r, pos: l } = e[n]);
  const c = r - o;
  return c ? a + (l - a) * (t - o) / c : a;
}
class Cf extends Mo {
  static id = "timeseries";
  static defaults = Mo.defaults;
  constructor(t) {
    super(t), this._table = [], this._minPos = void 0, this._tableRange = void 0;
  }
  initOffsets() {
    const t = this._getTimestampsForTable(), i = this._table = this.buildLookupTable(t);
    this._minPos = Di(i, this.min), this._tableRange = Di(i, this.max) - this._minPos, super.initOffsets(t);
  }
  buildLookupTable(t) {
    const { min: i, max: s } = this, n = [], o = [];
    let r, a, l, c, u;
    for (r = 0, a = t.length; r < a; ++r)
      c = t[r], c >= i && c <= s && n.push(c);
    if (n.length < 2)
      return [
        {
          time: i,
          pos: 0
        },
        {
          time: s,
          pos: 1
        }
      ];
    for (r = 0, a = n.length; r < a; ++r)
      u = n[r + 1], l = n[r - 1], c = n[r], Math.round((u + l) / 2) !== c && o.push({
        time: c,
        pos: r / (a - 1)
      });
    return o;
  }
  _generate() {
    const t = this.min, i = this.max;
    let s = super.getDataTimestamps();
    return (!s.includes(t) || !s.length) && s.splice(0, 0, t), (!s.includes(i) || s.length === 1) && s.push(i), s.sort((n, o) => n - o);
  }
  _getTimestampsForTable() {
    let t = this._cache.all || [];
    if (t.length)
      return t;
    const i = this.getDataTimestamps(), s = this.getLabelTimestamps();
    return i.length && s.length ? t = this.normalize(i.concat(s)) : t = i.length ? i : s, t = this._cache.all = t, t;
  }
  getDecimalForValue(t) {
    return (Di(this._table, t) - this._minPos) / this._tableRange;
  }
  getValueForPixel(t) {
    const i = this._offsets, s = this.getDecimalForPixel(t) / i.factor - i.end;
    return Di(this._table, s * this._tableRange + this._minPos, !0);
  }
}
function Sd(e, t = (i, s) => i.toLocaleString(void 0, s)) {
  if (Math.abs(e) < 1e3) return t(e);
  const i = Math.round(e / 1e3 * 10) / 10;
  return `${t(i, { maximumFractionDigits: 1 })}k`;
}
var $d = Object.defineProperty, Dd = Object.getOwnPropertyDescriptor, Fr = (e) => {
  throw TypeError(e);
}, oi = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Dd(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && $d(t, i, n), n;
}, Ks = (e, t, i) => t.has(e) || Fr("Cannot " + i), Ir = (e, t, i) => (Ks(e, t, "read from private field"), t.get(e)), zo = (e, t, i) => t.has(e) ? Fr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Cd = (e, t, i, s) => (Ks(e, t, "write to private field"), t.set(e, i), i), ws = (e, t, i) => (Ks(e, t, "access private method"), i), Je, Ye, Nr, Xs;
Ys.register(_u, Hi, Nh, _d, bd, od, fd);
let le = class extends ft(ht) {
  constructor() {
    super(...arguments), zo(this, Ye), this.points = [], this.metric = "visitors", this.interval = "Day", this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", zo(this, Je);
  }
  updated() {
    ws(this, Ye, Nr).call(this);
  }
  disconnectedCallback() {
    Ir(this, Je)?.destroy(), super.disconnectedCallback();
  }
  render() {
    const e = ws(this, Ye, Xs).call(this), t = this.points[this.points.length - 1], s = (t ? Ro(t.timestamp, this.interval) : !1) ? ". The final period is still in progress" : "";
    return v`
      <div class="chart" role="img" aria-label="${e} history for ${this.points.length} periods${s}">
        <canvas aria-hidden="true"></canvas>
      </div>
    `;
  }
};
Je = /* @__PURE__ */ new WeakMap();
Ye = /* @__PURE__ */ new WeakSet();
Nr = function() {
  const e = this.shadowRoot?.querySelector("canvas");
  if (!e) return;
  Ir(this, Je)?.destroy();
  const t = getComputedStyle(this), i = t.getPropertyValue("--vercel-analytics-chart-color").trim() || "oklch(51.51% .2399 257.85)", s = t.getPropertyValue("--vercel-analytics-chart-fill").trim() || "oklch(51.51% .2399 257.85 / 0.12)", n = t.getPropertyValue("--uui-color-text").trim() || "#1b264f", o = t.getPropertyValue("--uui-color-text-alt").trim() || "#5c5c5c", r = t.getPropertyValue("--uui-color-surface").trim() || "#ffffff", a = t.getPropertyValue("--uui-color-border").trim() || "#d8d7d9", l = ws(this, Ye, Xs).call(this), c = this.points[this.points.length - 1], u = c ? Ro(c.timestamp, this.interval) : !1, h = {
    id: "vercelAnalyticsHoverGuide",
    afterDatasetsDraw: (f) => {
      const g = f.tooltip?.getActiveElements()[0];
      if (!g) return;
      const { ctx: p, chartArea: m } = f;
      p.save(), p.beginPath(), p.moveTo(g.element.x, m.top), p.lineTo(g.element.x, m.bottom), p.lineWidth = 1, p.strokeStyle = n, p.stroke(), p.beginPath(), p.arc(g.element.x, g.element.y, 4, 0, Math.PI * 2), p.fillStyle = i, p.fill(), p.restore();
    }
  }, d = this.localize.lang() || void 0;
  Cd(this, Je, new Ys(e, {
    type: "line",
    data: {
      labels: this.points.map((f) => Lo(f.timestamp, this.interval, d, this.timeZone)),
      datasets: [{
        label: l,
        data: this.points.map((f) => f[this.metric] ?? 0),
        borderColor: i,
        borderWidth: 2,
        backgroundColor: s,
        fill: !0,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.2,
        segment: {
          borderDash: (f) => u && f.p1DataIndex === this.points.length - 1 ? [6, 6] : void 0
        }
      }]
    },
    options: {
      animation: !1,
      interaction: {
        axis: "x",
        intersect: !1,
        mode: "index"
      },
      maintainAspectRatio: !1,
      plugins: {
        tooltip: {
          backgroundColor: r,
          bodyColor: n,
          borderColor: a,
          borderWidth: 1,
          callbacks: {
            label: (f) => `${l}  ${this.localize.number(f.parsed.y ?? 0)}`,
            title: (f) => {
              const g = this.points[f[0]?.dataIndex ?? -1];
              return g ? Ia(g.timestamp, this.interval, d, this.timeZone) : "";
            }
          },
          cornerRadius: 3,
          caretPadding: 8,
          caretSize: 6,
          padding: 12,
          titleColor: n,
          enabled: !0
        }
      },
      scales: {
        x: {
          border: { display: !1 },
          grid: { display: !1 },
          ticks: { autoSkip: !0, color: o, maxTicksLimit: 7, maxRotation: 0, padding: 8 }
        },
        y: {
          beginAtZero: !0,
          border: { display: !1 },
          grid: { color: a },
          ticks: {
            callback: (f) => Sd(
              Number(f),
              (g, p) => this.localize.number(g, p)
            ),
            color: o,
            maxTicksLimit: 5,
            padding: 8
          }
        }
      }
    },
    plugins: [h]
  }));
};
Xs = function() {
  return this.metric === "visitors" ? "Visitors" : this.metric === "pageViews" ? "Page views" : "Total events";
};
le.styles = ut`
    :host { display: block; }
    .chart { height: 18rem; }
    canvas { width: 100%; height: 100%; }
  `;
oi([
  _({ attribute: !1 })
], le.prototype, "points", 2);
oi([
  _()
], le.prototype, "metric", 2);
oi([
  _()
], le.prototype, "interval", 2);
oi([
  _()
], le.prototype, "timeZone", 2);
le = oi([
  dt("vercel-analytics-history-chart")
], le);
var Md = Object.defineProperty, zd = Object.getOwnPropertyDescriptor, Br = (e) => {
  throw TypeError(e);
}, Yi = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? zd(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && Md(t, i, n), n;
}, Td = (e, t, i) => t.has(e) || Br("Cannot " + i), Pd = (e, t, i) => t.has(e) ? Br("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), oe = (e, t, i) => (Td(e, t, "access private method"), i), Ot, Vr, Ur, Wr, Hr, jr, ks;
let _e = class extends ft(ht) {
  constructor() {
    super(...arguments), Pd(this, Ot), this.report = { status: "loading" }, this.metric = "visitors";
  }
  render() {
    return this.report.status === "error" && !this.report.previous ? v`
      <uui-box class="summary-error">
        <div class="summary-error-content" role="status">
          <uui-icon name="icon-alert" aria-hidden="true"></uui-icon>
          <div class="summary-error-copy">
            <strong>Analytics unavailable</strong>
            <p>${this.report.message}</p>
          </div>
          <uui-button look="secondary" label="Retry analytics summary" @click=${oe(this, Ot, Ur)}>Retry</uui-button>
        </div>
      </uui-box>
    ` : v`
      <uui-box class="history" aria-busy=${this.report.status === "loading" ? "true" : "false"}>
        <div class="metric-tabs" role="tablist" aria-label="Traffic metric">
          ${oe(this, Ot, ks).call(this, "visitors", "Visitors")}
          ${oe(this, Ot, ks).call(this, "pageViews", "Page views")}
        </div>
        <div
          id="history-panel"
          class="history-panel"
          role="tabpanel"
          aria-labelledby=${`metric-${this.metric}-tab`}>
          ${this.report.status === "loading" ? v`
            <span class="visually-hidden" role="status">Loading traffic summary and history</span>
            <div class="chart-skeleton" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          ` : it(this.report)?.points.length ? v`<vercel-analytics-history-chart .points=${it(this.report).points} .metric=${this.metric} .interval=${this.range.interval} .timeZone=${this.range.timeZone}></vercel-analytics-history-chart>` : v`<umb-empty-state headline="No history"><p>No traffic was recorded in this period.</p></umb-empty-state>`}
        </div>
      </uui-box>
    `;
  }
};
Ot = /* @__PURE__ */ new WeakSet();
Vr = function(e) {
  this.dispatchEvent(new CustomEvent("metric-change", {
    bubbles: !0,
    composed: !0,
    detail: { metric: e }
  }));
};
Ur = function() {
  this.dispatchEvent(new CustomEvent("retry-summary", { bubbles: !0, composed: !0 }));
};
Wr = function(e) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
  e.preventDefault();
  const t = Array.from(this.shadowRoot?.querySelectorAll("[role=tab]") ?? []), i = t.indexOf(e.currentTarget), s = e.key === "Home" ? 0 : e.key === "End" ? t.length - 1 : e.key === "ArrowLeft" ? (i - 1 + t.length) % t.length : (i + 1) % t.length;
  t[s]?.click(), t[s]?.focus();
};
Hr = function(e) {
  const t = e === "visitors" ? "visitors" : "page views";
  return ll(
    it(this.report)?.totals[e] ?? 0,
    it(this.report)?.previousTotals?.[e],
    t,
    La(this.range)
  );
};
jr = function(e) {
  const t = oe(this, Ot, Hr).call(this, e);
  return t ? v`
      <span class=${`comparison ${t.direction}`} title=${t.description}>
        <span aria-hidden="true">${t.display}</span>
        <span class="visually-hidden">${t.description}</span>
      </span>
    ` : "";
};
ks = function(e, t) {
  return v`
      <button
        id=${`metric-${e}-tab`}
        class="metric-tab"
        type="button"
        role="tab"
        aria-controls="history-panel"
        aria-selected=${this.metric === e}
        tabindex=${this.metric === e ? 0 : -1}
        @click=${() => oe(this, Ot, Vr).call(this, e)}
        @keydown=${oe(this, Ot, Wr)}>
        <span class="eyebrow">${t}</span>
        ${this.report.status === "loading" ? v`<span class="metric-skeleton" aria-hidden="true"></span>` : v`<span class="metric-value">
              <strong>${this.localize.number(it(this.report)?.totals[e] ?? 0)}</strong>
              ${oe(this, Ot, jr).call(this, e)}
            </span>`}
      </button>
    `;
};
_e.styles = [Lt, ut`
    .history, .summary-error { --uui-box-default-padding: 0; margin-bottom: var(--uui-size-layout-1); overflow: hidden; }
    .history { --vercel-analytics-chart-color: oklch(51.51% .2399 257.85); }
    .metric-tabs { background: var(--uui-color-surface-alt); border-bottom: 1px solid var(--uui-color-border); display: flex; flex-wrap: nowrap; }
    .metric-tab { --metric-font-size: clamp(2rem, 3cqi, 3rem); appearance: none; background: transparent; border: 0; border-bottom: 3px solid transparent; color: var(--uui-color-text-alt); cursor: pointer; flex: 0 0 auto; font: inherit; inline-size: max-content; min-block-size: 7.75rem; min-inline-size: 18rem; padding: var(--uui-size-space-5); text-align: left; transition: background-color 160ms ease-out, color 160ms ease-out; }
    .metric-tab:last-child { border-inline-end: 1px solid var(--uui-color-border); }
    .metric-tab[aria-selected="true"] { background: var(--uui-color-surface); border-bottom-color: var(--vercel-analytics-chart-color); color: var(--uui-color-text); }
    .metric-tab[aria-selected="false"]:hover { background: color-mix(in srgb, var(--uui-color-interactive) 7%, var(--uui-color-surface)); }
    .metric-tab[aria-selected="false"]:active { background: color-mix(in srgb, var(--uui-color-interactive) 11%, var(--uui-color-surface)); }
    .metric-tab:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: -2px; }
    .metric-value { align-items: center; display: flex; flex-wrap: nowrap; gap: var(--uui-size-space-4); margin-top: var(--uui-size-space-3); }
    .metric-tab strong { font-size: var(--metric-font-size); font-variant-numeric: tabular-nums; line-height: 1.1; white-space: nowrap; }
    .eyebrow { color: currentColor; font-weight: 700; }
    .comparison { border-radius: var(--uui-border-radius); flex: 0 0 auto; font-weight: 700; padding: var(--uui-size-space-2) var(--uui-size-space-3); white-space: nowrap; }
    .comparison.increase { background: color-mix(in srgb, var(--uui-color-positive-standalone) 14%, var(--uui-color-surface)); color: var(--uui-color-positive-standalone); }
    .comparison.decrease { background: color-mix(in srgb, var(--uui-color-danger-standalone) 14%, var(--uui-color-surface)); color: var(--uui-color-danger-standalone); }
    .comparison.unchanged { background: var(--uui-color-surface-alt); color: var(--uui-color-text-alt); }
    .metric-skeleton { background: var(--uui-color-surface-alt); block-size: 1.1em; border-radius: var(--uui-border-radius); display: block; font-size: var(--metric-font-size); inline-size: 58%; margin-top: var(--uui-size-space-3); max-inline-size: 14rem; }
    .history-panel { padding: var(--uui-size-space-3); }
    .chart-skeleton { block-size: 18rem; display: grid; }
    .chart-skeleton span { border-top: 1px solid var(--uui-color-border); }
    .summary-error { --uui-box-border-width: 1px; --uui-box-border-color: color-mix(in srgb, var(--uui-color-warning-standalone) 35%, var(--uui-color-border)); --uui-box-box-shadow: none; }
    .summary-error-content { align-items: center; background: color-mix(in srgb, var(--uui-color-warning) 8%, var(--uui-color-surface)); display: flex; flex-wrap: wrap; gap: var(--uui-size-space-5); padding: var(--uui-size-space-5); }
    .summary-error-content uui-icon { color: var(--uui-color-warning-standalone); font-size: 1.5rem; }
    .summary-error-copy { flex: 1 1 22rem; }
    .summary-error-copy p { color: var(--uui-color-text-alt); margin: var(--uui-size-space-1) 0 0; }
    .visually-hidden { clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px; }
    @container (max-width: 48rem) {
      .metric-tab { --metric-font-size: clamp(1.5rem, 4cqi, 2rem); flex: 1 1 50%; min-block-size: 6.5rem; min-inline-size: 0; padding: var(--uui-size-space-4); }
      .metric-value { gap: var(--uui-size-space-2); }
      .comparison { font-size: 0.875rem; padding: var(--uui-size-space-1) var(--uui-size-space-2); }
    }
    @container (max-width: 40rem) {
      .metric-tab { --metric-font-size: clamp(1.25rem, 5cqi, 1.75rem); box-sizing: border-box; min-block-size: 5.5rem; padding: var(--uui-size-space-3); }
      .eyebrow { font-size: 0.875rem; }
      .comparison { font-size: 0.75rem; }
    }
    @media (prefers-reduced-motion: reduce) { .metric-tab { transition: none; } }
  `];
Yi([
  _({ attribute: !1 })
], _e.prototype, "report", 2);
Yi([
  _({ attribute: !1 })
], _e.prototype, "range", 2);
Yi([
  _()
], _e.prototype, "metric", 2);
_e = Yi([
  dt("vercel-analytics-summary")
], _e);
const Ed = "others", qr = "unknown", Od = /* @__PURE__ */ new Set([
  "Country",
  "DeviceType",
  "BrowserName",
  "OsName"
]);
function Ad(e) {
  return e.filter((t) => t.value.trim().toLocaleLowerCase() !== Ed);
}
function Zs(e) {
  return Ad(e).filter((t) => t.value.trim().length > 0);
}
function Ld(e) {
  return e ? Od.has(e) : !1;
}
function Ss(e, t) {
  return e[t];
}
function Gs(e, t) {
  return Zs(e).reduce((i, s) => i + Ss(s, t), 0);
}
function Rd(e, t) {
  return t > 0 ? Math.min(Math.max(e / t, 0), 1) : 0;
}
function Fd(e, t, i = (s, n) => s.toLocaleString(void 0, n)) {
  const s = t > 0 ? e / t * 100 : 0;
  return {
    display: s > 0 && s < 0.5 ? "<1%" : `${Math.round(s)}%`,
    precise: `${i(s, { maximumFractionDigits: 2 })}%`
  };
}
function Id(e, t) {
  const i = e.trim();
  return t === "DeviceType" && i ? `${i.charAt(0).toLocaleUpperCase()}${i.slice(1)}` : i;
}
function Yr(e, t = 10) {
  return Zs(e).slice(0, t);
}
function Nd(e) {
  const t = e.trim();
  if (!(!t || t.toLocaleLowerCase() === qr))
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(t)}&sz=32`;
}
function Bd(e) {
  const t = e.trim();
  if (!(!t || t.toLocaleLowerCase() === qr || /\s/.test(t)))
    try {
      const i = new URL(`https://${t}`);
      return i.username || i.password || i.pathname !== "/" || i.search || i.hash ? void 0 : i.href;
    } catch {
      return;
    }
}
function Vd(e, t) {
  if (!(!e || !t.startsWith("/")))
    try {
      const i = new URL(e);
      return i.protocol !== "https:" && i.protocol !== "http:" ? void 0 : new URL(t, i.origin).href;
    } catch {
      return;
    }
}
var Ud = Object.defineProperty, Wd = Object.getOwnPropertyDescriptor, Kr = (e) => {
  throw TypeError(e);
}, ot = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Wd(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && Ud(t, i, n), n;
}, Hd = (e, t, i) => t.has(e) || Kr("Cannot " + i), jd = (e, t, i) => t.has(e) ? Kr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pi = (e, t, i) => (Hd(e, t, "access private method"), i), me, Qs, $s;
let G = class extends ft(ht) {
  constructor() {
    super(...arguments), jd(this, me), this.headline = "Breakdown", this.metric = "visitors", this.loading = !1, this.linkValues = !1, this.hasSubheading = !1, this.skeletonRows = 10, this.total = 0, this.rows = [], this.filters = [];
  }
  render() {
    if (this.loading)
      return v`
        <span class="visually-hidden" role="status">Loading ${this.headline}</span>
        <table class="skeleton-table" aria-hidden="true">
          <caption>${this.headline}</caption>
          ${Pi(this, me, $s).call(this)}
          <tbody>${Array.from({ length: this.skeletonRows }, () => v`
            <tr>
              <th scope="row"><span class="skeleton-line"></span></th>
              <td><span class="skeleton-number"></span></td>
            </tr>
          `)}</tbody>
        </table>
      `;
    if (this.unavailable) return v`<p class="message">${this.unavailable}</p>`;
    const e = Zs(this.rows);
    if (e.length === 0) return v`<p class="message">No traffic was recorded for this breakdown.</p>`;
    const t = Math.max(...e.map((s) => Ss(s, this.metric)), 1), i = Ld(this.dimension);
    return v`
      <table>
        <caption>${this.headline}</caption>
        ${Pi(this, me, $s).call(this)}
        <tbody>${e.map((s, n) => {
      const o = this.dimension === "ReferrerHostname" ? Bd(s.value) : this.linkValues ? Vd(this.baseUrl, s.value) : void 0, r = this.dimension === "Country" ? ii(s.value) : void 0, a = this.dimension === "ReferrerHostname" ? Nd(s.value) : void 0, l = r ? Po(r, navigator.languages) : Id(s.value, this.dimension), c = Ss(s, this.metric), u = Fd(
        c,
        this.total,
        (p, m) => this.localize.number(p, m)
      ), h = Rd(c, t), d = `breakdown-value-${n}`, f = this.filters.some((p) => p.dimension === this.dimension && p.value === s.value), g = f ? `Remove ${l} filter` : `Filter analytics by ${l}`;
      return v`
          <tr>
            <th scope="row">
              <span class="bar" style=${`--bar-width:${h * 100}%;--bar-minimum:${c > 0 ? "4px" : "0px"}`}></span>
              <span class="row-value">
                ${r ? v`<img class="country-flag" src=${Ma(r)} alt="" width="20" height="15" loading="lazy" referrerpolicy="no-referrer" @error=${(p) => p.currentTarget.style.visibility = "hidden"}>` : ""}
                ${a ? v`<img class="referrer-favicon" src=${a} alt="" width="20" height="20" loading="lazy" referrerpolicy="no-referrer" @error=${(p) => p.currentTarget.style.visibility = "hidden"}>` : ""}
                <span class="row-label" title=${l}>${o ? v`<a href=${o} target="_blank" rel="noopener noreferrer">${l}<span class="visually-hidden"> (opens in a new tab)</span></a>` : l}</span>
              </span>
            </th>
            <td><span class="metric-cell">
              <button
                class="filter-action"
                type="button"
                aria-label=${g}
                aria-pressed=${f}
                title=${g}
                @click=${() => this.dispatchEvent(new CustomEvent("toggle-filter", {
        bubbles: !0,
        composed: !0,
        detail: { dimension: this.dimension, value: s.value }
      }))}>
                <uui-icon name="icon-filter" aria-hidden="true"></uui-icon>
              </button>
              ${i ? v`
                <span class="percentage-value" tabindex="0" aria-describedby=${d}>
                  <span aria-hidden="true">${u.display}</span>
                  <span class="visually-hidden">${this.localize.number(c)} ${Pi(this, me, Qs).call(this).toLocaleLowerCase()}, ${u.precise} of the total</span>
                  <span id=${d} class=${`percentage-tooltip${n === 0 ? " below" : ""}`} role="tooltip">
                    <strong>${this.localize.number(c)}</strong>
                    <span>${u.precise}</span>
                  </span>
                </span>
              ` : v`<span class="metric-number">${this.localize.number(c)}</span>`}
            </span></td>
          </tr>
        `;
    })}</tbody>
      </table>
    `;
  }
};
me = /* @__PURE__ */ new WeakSet();
Qs = function() {
  return this.metric === "visitors" ? "Visitors" : "Page views";
};
$s = function() {
  return v`
      <thead>
        <tr>
          <th scope="col"><slot name="heading">${this.headline}</slot></th>
          <th scope="col" rowspan=${this.hasSubheading ? 2 : 1}>${Pi(this, me, Qs).call(this)}</th>
        </tr>
        ${this.hasSubheading ? v`<tr class="subheading-row"><th scope="col"><slot name="subheading"></slot></th></tr>` : ""}
      </thead>
    `;
};
G.styles = ut`
    :host { display: block; overflow-x: clip; overflow-y: visible; }
    table {
      --bar-inset: var(--uui-size-space-3);
      --metric-column-width: 8.5rem;
      border-collapse: collapse;
      min-inline-size: 20rem;
      table-layout: fixed;
      width: 100%;
    }
    caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    thead th { border-bottom: 1px solid var(--uui-color-border); font-weight: 700; }
    thead th:nth-child(2) { color: var(--uui-color-text-alt); text-align: right; width: var(--metric-column-width); }
    .subheading-row th { background: color-mix(in srgb, var(--uui-color-surface-alt) 35%, var(--uui-color-surface)); padding-block: 0; }
    th, td { box-sizing: border-box; padding: var(--uui-size-space-3) var(--uui-size-space-5); text-align: left; }
    td { font-variant-numeric: tabular-nums; position: relative; text-align: right; z-index: 1; }
    tbody tr:hover, tbody tr:focus-within { position: relative; z-index: 2; }
    .metric-cell { align-items: center; display: flex; gap: var(--uui-size-space-2); justify-content: flex-end; }
    .metric-number { font-weight: 700; min-inline-size: 0; }
    .filter-action { align-items: center; appearance: none; background: transparent; border: 0; border-radius: var(--uui-border-radius); color: var(--uui-color-text-alt); cursor: pointer; display: inline-flex; font: inherit; justify-content: center; opacity: 0; padding: var(--uui-size-space-2); }
    tbody tr:hover .filter-action, .filter-action:focus-visible, .filter-action[aria-pressed="true"] { opacity: 1; }
    .filter-action:hover, .filter-action[aria-pressed="true"] { background: var(--uui-color-surface-alt); color: var(--uui-color-interactive-emphasis); }
    .filter-action:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 1px; }
    tbody th { position: relative; font-weight: 500; min-width: 10rem; }
    .row-value { align-items: center; display: flex; gap: var(--uui-size-space-3); min-inline-size: 0; position: relative; z-index: 1; }
    .row-label { min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .row-label a { color: inherit; text-decoration: none; }
    .row-label a:hover, .row-label a:focus-visible { text-decoration: underline; text-underline-offset: 0.12em; }
    .country-flag { border-radius: 2px; flex: 0 0 auto; object-fit: cover; }
    .referrer-favicon { border-radius: var(--uui-border-radius); flex: 0 0 auto; object-fit: contain; }
    .percentage-value { display: inline-block; font-weight: 700; outline: none; position: relative; }
    .percentage-value:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .percentage-tooltip {
      align-items: end;
      background: var(--uui-color-text);
      border-radius: var(--uui-border-radius);
      bottom: calc(100% + var(--uui-size-space-3));
      box-shadow: var(--uui-shadow-depth-2);
      color: var(--uui-color-surface);
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
      gap: var(--uui-size-space-1);
      opacity: 0;
      padding: var(--uui-size-space-3) var(--uui-size-space-4);
      pointer-events: none;
      position: absolute;
      right: calc(-1 * var(--uui-size-space-3));
      transform: translateY(var(--uui-size-space-2));
      transition: opacity 120ms ease-out, transform 120ms ease-out;
      visibility: hidden;
      white-space: nowrap;
      z-index: 3;
    }
    .percentage-tooltip::after {
      border: var(--uui-size-space-2) solid transparent;
      border-top-color: var(--uui-color-text);
      content: "";
      position: absolute;
      right: var(--uui-size-space-4);
      top: 100%;
    }
    .percentage-tooltip.below {
      bottom: auto;
      top: calc(100% + var(--uui-size-space-3));
      transform: translateY(calc(-1 * var(--uui-size-space-2)));
    }
    .percentage-tooltip.below::after {
      border-bottom-color: var(--uui-color-text);
      border-top-color: transparent;
      bottom: 100%;
      top: auto;
    }
    .percentage-tooltip strong { font-size: 1rem; }
    .percentage-tooltip span { color: color-mix(in srgb, var(--uui-color-surface) 70%, transparent); }
    .percentage-value:hover .percentage-tooltip,
    .percentage-value:focus .percentage-tooltip { opacity: 1; transform: translateY(0); visibility: visible; }
    a { color: var(--uui-color-interactive-emphasis); text-decoration-thickness: 1px; text-underline-offset: 0.18em; }
    a:hover { text-decoration-thickness: 2px; }
    a:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .bar {
      inset-block: var(--uui-size-space-1);
      inset-inline-start: var(--bar-inset);
      inline-size: calc(100% + var(--metric-column-width) - var(--bar-inset) - var(--bar-inset));
      position: absolute;
    }
    .bar::before {
      background: color-mix(in srgb, var(--uui-color-interactive) 4%, var(--uui-color-surface));
      border-radius: var(--uui-border-radius);
      block-size: 100%;
      content: "";
      display: block;
      inline-size: max(var(--bar-minimum), var(--bar-width));
    }
    .skeleton-line, .skeleton-number {
      background: var(--uui-color-surface-alt);
      block-size: 1lh;
      border-radius: var(--uui-border-radius);
      display: block;
    }
    .skeleton-line { width: 72%; }
    .skeleton-number { margin-inline-start: auto; width: 3.5rem; }
    .skeleton-table tbody tr:nth-child(3n + 2) .skeleton-line { width: 56%; }
    .skeleton-table tbody tr:nth-child(3n) .skeleton-line { width: 84%; }
    .visually-hidden { clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px; }
    .message { color: var(--uui-color-text-alt); padding: var(--uui-size-space-5); }
    @media (hover: none) { .filter-action { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .percentage-tooltip { transition: none; } }
  `;
ot([
  _()
], G.prototype, "headline", 2);
ot([
  _()
], G.prototype, "unavailable", 2);
ot([
  _()
], G.prototype, "baseUrl", 2);
ot([
  _()
], G.prototype, "dimension", 2);
ot([
  _()
], G.prototype, "metric", 2);
ot([
  _({ type: Boolean })
], G.prototype, "loading", 2);
ot([
  _({ type: Boolean })
], G.prototype, "linkValues", 2);
ot([
  _({ type: Boolean })
], G.prototype, "hasSubheading", 2);
ot([
  _({ type: Number })
], G.prototype, "skeletonRows", 2);
ot([
  _({ type: Number })
], G.prototype, "total", 2);
ot([
  _({ attribute: !1 })
], G.prototype, "rows", 2);
ot([
  _({ attribute: !1 })
], G.prototype, "filters", 2);
G = ot([
  dt("vercel-analytics-breakdown-table")
], G);
var qd = Object.defineProperty, Yd = Object.getOwnPropertyDescriptor, Xr = (e) => {
  throw TypeError(e);
}, ri = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Yd(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && qd(t, i, n), n;
}, Kd = (e, t, i) => t.has(e) || Xr("Cannot " + i), Xd = (e, t, i) => t.has(e) ? Xr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Zd = (e, t, i) => (Kd(e, t, "access private method"), i), Ds, Zr;
const Gd = "https://vercel.com/docs/analytics/custom-events";
let ce = class extends ft(ht) {
  constructor() {
    super(...arguments), Xd(this, Ds), this.loading = !1, this.skeletonRows = 10, this.rows = [], this.filters = [];
  }
  render() {
    const e = Ps(this.rows), t = !this.loading && e.length === 0, i = Math.max(...e.map((s) => s.count), 1);
    return v`
      ${this.loading ? v`<span class="visually-hidden" role="status">Loading events</span>` : ""}
      <table aria-busy=${this.loading ? "true" : "false"}>
        <caption>Custom events</caption>
        <thead><tr><th scope="col">Events</th><th scope="col">Visitors</th><th scope="col">Total events</th></tr></thead>
        <tbody>${this.loading ? Array.from({ length: this.skeletonRows }, () => v`
              <tr><th scope="row"><span class="skeleton-line"></span></th><td><span class="skeleton-number"></span></td><td><span class="skeleton-number"></span></td></tr>
            `) : e.map((s) => {
      const n = this.filters.some((r) => r.dimension === "EventName" && r.value === s.eventName), o = n ? `Remove ${s.eventName} event filter` : `Filter analytics by ${s.eventName} event`;
      return v`
              <tr>
                <th scope="row">
                  <span class="bar" style=${`--bar-width:${s.count / i * 100}%;--bar-minimum:${s.count > 0 ? "4px" : "0px"}`}></span>
                  <button class="details-action" type="button" title=${`View details for ${s.eventName}`} @click=${() => Zd(this, Ds, Zr).call(this, s.eventName)}>${s.eventName}</button>
                </th>
                <td><span class="metric-cell">
                  <button
                    class="filter-action"
                    type="button"
                    aria-label=${o}
                    aria-pressed=${n}
                    title=${o}
                    @click=${() => this.dispatchEvent(new CustomEvent("toggle-filter", {
        bubbles: !0,
        composed: !0,
        detail: { dimension: "EventName", value: s.eventName }
      }))}>
                    <uui-icon name="icon-filter" aria-hidden="true"></uui-icon>
                  </button>
                  <span>${this.localize.number(s.visitors)}</span>
                </span></td>
                <td>${this.localize.number(s.count)}</td>
              </tr>
            `;
    })}</tbody>
      </table>
      ${t ? v`
        <div class="empty">
          <span class="empty-icon"><uui-icon name="icon-lightning" aria-hidden="true"></uui-icon></span>
          <strong>No events</strong>
          <p>Track custom events to understand which actions visitors take.</p>
          <a href=${Gd} target="_blank" rel="noopener noreferrer">Set up event tracking <uui-icon name="icon-out" aria-hidden="true"></uui-icon></a>
        </div>
      ` : ""}
    `;
  }
};
Ds = /* @__PURE__ */ new WeakSet();
Zr = function(e) {
  this.dispatchEvent(new CustomEvent("select-event", {
    bubbles: !0,
    composed: !0,
    detail: { eventName: e }
  }));
};
ce.styles = ut`
    :host { block-size: 100%; display: flex; flex-direction: column; overflow-x: auto; }
    table { --bar-inset: var(--uui-size-space-3); border-collapse: collapse; min-inline-size: 30rem; table-layout: fixed; width: 100%; }
    caption { clip: rect(0 0 0 0); height: 1px; overflow: hidden; position: absolute; width: 1px; }
    th, td { box-sizing: border-box; padding: var(--uui-size-space-3) var(--uui-size-space-5); text-align: left; }
    thead th { border-bottom: 1px solid var(--uui-color-border); font-weight: 700; }
    thead th:not(:first-child), td { text-align: right; width: 8rem; }
    tbody th { font-weight: 500; min-width: 12rem; position: relative; }
    td { font-variant-numeric: tabular-nums; position: relative; z-index: 1; }
    tbody tr:hover, tbody tr:focus-within { position: relative; z-index: 2; }
    .details-action { appearance: none; background: transparent; border: 0; color: var(--uui-color-text); cursor: pointer; font: inherit; max-width: 100%; overflow: hidden; padding: 0; position: relative; text-align: left; text-overflow: ellipsis; white-space: nowrap; z-index: 1; }
    .details-action:hover { text-decoration: underline; text-underline-offset: 0.18em; }
    .details-action:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .metric-cell { align-items: center; display: flex; gap: var(--uui-size-space-2); justify-content: flex-end; }
    .filter-action { align-items: center; appearance: none; background: transparent; border: 0; border-radius: var(--uui-border-radius); color: var(--uui-color-text-alt); cursor: pointer; display: inline-flex; font: inherit; justify-content: center; opacity: 0; padding: var(--uui-size-space-2); }
    tbody tr:hover .filter-action, .filter-action:focus-visible, .filter-action[aria-pressed="true"] { opacity: 1; }
    .filter-action:hover, .filter-action[aria-pressed="true"] { background: var(--uui-color-surface-alt); color: var(--uui-color-interactive-emphasis); }
    .filter-action:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 1px; }
    .bar { inset-block: var(--uui-size-space-1); inset-inline-start: var(--bar-inset); inline-size: calc(100% + 16rem - 2 * var(--bar-inset)); position: absolute; }
    .bar::before { background: color-mix(in srgb, var(--uui-color-interactive) 4%, var(--uui-color-surface)); block-size: 100%; border-radius: var(--uui-border-radius); content: ""; display: block; inline-size: max(var(--bar-minimum), var(--bar-width)); }
    .skeleton-line, .skeleton-number { background: var(--uui-color-surface-alt); block-size: 1lh; border-radius: var(--uui-border-radius); display: block; }
    .skeleton-line { width: 70%; }
    .skeleton-number { margin-inline-start: auto; width: 3.5rem; }
    .empty { align-items: center; display: flex; flex: 1; flex-direction: column; gap: var(--uui-size-space-3); justify-content: center; min-block-size: 16rem; padding: var(--uui-size-layout-1); text-align: center; }
    .empty-icon { align-items: center; border: 1px solid var(--uui-color-border); border-radius: 50%; color: var(--uui-color-text-alt); display: inline-flex; font-size: 1.5rem; height: 3rem; justify-content: center; width: 3rem; }
    .empty p { color: var(--uui-color-text-alt); margin: 0; max-width: 34rem; }
    .empty a { align-items: center; color: var(--uui-color-interactive-emphasis); display: inline-flex; gap: var(--uui-size-space-1); }
    .empty a:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .visually-hidden { clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px; }
    @media (hover: none) { .filter-action { opacity: 1; } }
  `;
ri([
  _({ type: Boolean })
], ce.prototype, "loading", 2);
ri([
  _({ type: Number })
], ce.prototype, "skeletonRows", 2);
ri([
  _({ attribute: !1 })
], ce.prototype, "rows", 2);
ri([
  _({ attribute: !1 })
], ce.prototype, "filters", 2);
ce = ri([
  dt("vercel-analytics-event-table")
], ce);
var Qd = Object.defineProperty, Jd = Object.getOwnPropertyDescriptor, Gr = (e) => {
  throw TypeError(e);
}, Js = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Jd(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && Qd(t, i, n), n;
}, tf = (e, t, i) => t.has(e) || Gr("Cannot " + i), ef = (e, t, i) => t.has(e) ? Gr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), us = (e, t, i) => (tf(e, t, "access private method"), i), Fe, Qr, Jr, ta;
const sf = "https://vercel.com/docs/flags/observability/web-analytics";
let ti = class extends ft(ht) {
  constructor() {
    super(...arguments), ef(this, Fe), this.report = { status: "loading" };
  }
  render() {
    const e = this.selected ?? this.report, t = it(e), i = us(this, Fe, ta).call(this, t), s = e.status === "idle" || e.status === "loading", n = e.status === "error" ? e.message : void 0, o = t?.flagKey, r = Math.max(...i.map(({ pageViews: a }) => a), 1);
    return v`
      <div class="header">
        <div class="title">
          <strong>Flags</strong>
          ${o ? v`<button class="selected-flag" type="button" aria-label=${`Show all flags instead of ${o}`} @click=${us(this, Fe, Jr)}><span class="selected-label">${o}</span><span aria-hidden="true">×</span></button>` : ""}
        </div>
        <span>Visitors</span><span>Total</span>
      </div>
      ${s ? v`
        <div class="rows" aria-busy="true"><span class="visually-hidden" role="status">Loading feature flags</span>
          ${Array.from({ length: 3 }, () => v`<div class="row skeleton"><span></span><span></span><span></span></div>`)}
        </div>
      ` : n ? v`
        <div class="empty error"><uui-icon name="icon-alert" aria-hidden="true"></uui-icon><strong>Flags could not be loaded</strong><p>${n}</p></div>
      ` : i.length === 0 ? v`
        <div class="empty">
          <span class="empty-icon"><uui-icon name="icon-flag" aria-hidden="true"></uui-icon></span>
          <strong>No flags</strong>
          <p>Track feature flags to understand how they affect visitor behaviour.</p>
          <a href=${sf} target="_blank" rel="noopener noreferrer">Set up flag tracking <uui-icon name="icon-out" aria-hidden="true"></uui-icon></a>
        </div>
      ` : v`
        <div class="rows">
          ${i.map((a) => v`
            <div class="row">
              <span class="bar" style=${`--bar-width:${a.pageViews / r * 100}%`}></span>
              ${o ? v`<strong class="value">${a.value}</strong>` : v`<button class="value select" type="button" @click=${() => us(this, Fe, Qr).call(this, a.value)}>${a.value}</button>`}
              <strong>${this.localize.number(a.visitors)}</strong>
              <strong>${this.localize.number(a.pageViews)}</strong>
            </div>
          `)}
        </div>
      `}
    `;
  }
};
Fe = /* @__PURE__ */ new WeakSet();
Qr = function(e) {
  this.dispatchEvent(new CustomEvent("select-flag", { bubbles: !0, composed: !0, detail: { flagKey: e } }));
};
Jr = function() {
  this.dispatchEvent(new CustomEvent("clear-selected-flag", { bubbles: !0, composed: !0 }));
};
ta = function(e) {
  return (e?.rows ?? []).filter(({ value: t }) => t !== "Others");
};
ti.styles = [Lt, ut`
    :host { block-size: 100%; display: flex; flex-direction: column; min-block-size: 22rem; }
    .header { align-items: center; border-bottom: 1px solid var(--uui-color-border); display: grid; gap: var(--uui-size-space-4); grid-template-columns: minmax(0, 1fr) 8rem 8rem; padding: var(--uui-size-space-3) var(--uui-size-space-5); }
    .header > span { font-weight: 700; text-align: right; }
    .title { align-items: center; display: flex; gap: var(--uui-size-space-3); min-width: 0; }
    .selected-flag { align-items: center; appearance: none; background: var(--uui-color-surface-alt); border: 0; border-radius: 999px; color: var(--uui-color-text); cursor: pointer; display: inline-flex; font: inherit; gap: var(--uui-size-space-2); max-width: 100%; overflow: hidden; padding: var(--uui-size-space-1) var(--uui-size-space-3); text-overflow: ellipsis; white-space: nowrap; }
    .selected-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .selected-flag:hover { background: color-mix(in srgb, var(--uui-color-selected) 10%, var(--uui-color-surface)); }
    .selected-flag:focus-visible, .select:focus-visible, a:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 2px; }
    .rows { padding: 0; }
    .row { align-items: center; display: grid; gap: var(--uui-size-space-4); grid-template-columns: minmax(0, 1fr) 8rem 8rem; min-block-size: 3rem; padding: 0 var(--uui-size-space-5); position: relative; }
    .row > :not(.bar) { position: relative; z-index: 1; }
    .row > strong:not(.value) { font-variant-numeric: tabular-nums; text-align: right; }
    .bar { inset-block: var(--uui-size-space-1); inset-inline: var(--uui-size-space-3); position: absolute; }
    .bar::before { background: color-mix(in srgb, var(--uui-color-interactive) 4%, var(--uui-color-surface)); border-radius: var(--uui-border-radius); block-size: 100%; content: ""; display: block; inline-size: max(4px, var(--bar-width)); }
    .value { overflow: hidden; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
    .select { appearance: none; background: transparent; border: 0; color: var(--uui-color-text); cursor: pointer; font: inherit; font-weight: 600; padding: 0; }
    .select:hover { text-decoration: underline; text-underline-offset: .18em; }
    .empty { align-items: center; display: flex; flex: 1; flex-direction: column; gap: var(--uui-size-space-3); justify-content: center; padding: var(--uui-size-layout-1); text-align: center; }
    .empty-icon { align-items: center; border: 1px solid var(--uui-color-border); border-radius: 50%; color: var(--uui-color-text-alt); display: inline-flex; font-size: 1.5rem; height: 3rem; justify-content: center; width: 3rem; }
    .empty p { color: var(--uui-color-text-alt); margin: 0; max-width: 34rem; }
    .empty a { align-items: center; color: var(--uui-color-interactive-emphasis); display: inline-flex; gap: var(--uui-size-space-1); }
    .error { color: var(--uui-color-danger); }
    .skeleton span { background: var(--uui-color-surface-alt); border-radius: var(--uui-border-radius); block-size: 1rem; }
    .skeleton span:first-child { inline-size: 55%; }
    .visually-hidden { clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px; }
    @media (max-width: 36rem) {
      .header, .row { grid-template-columns: minmax(0, 1fr) 5rem 5rem; }
      .header, .row { padding-inline: var(--uui-size-space-4); }
    }
  `];
Js([
  _({ attribute: !1 })
], ti.prototype, "report", 2);
Js([
  _({ attribute: !1 })
], ti.prototype, "selected", 2);
ti = Js([
  dt("vercel-analytics-flag-card")
], ti);
var nf = Object.defineProperty, of = Object.getOwnPropertyDescriptor, ea = (e) => {
  throw TypeError(e);
}, pt = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? of(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && nf(t, i, n), n;
}, rf = (e, t, i) => t.has(e) || ea("Cannot " + i), af = (e, t, i) => t.has(e) ? ea("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Y = (e, t, i) => (rf(e, t, "access private method"), i), W, Wt, ei, ia, sa, na, oa, ra, aa;
let st = class extends ft(ht) {
  constructor() {
    super(...arguments), af(this, W), this.cards = [], this.breakdowns = {}, this.events = { status: "loading" }, this.flags = { status: "loading" }, this.filters = [], this.metric = "visitors", this.audienceDimension = "DeviceType", this.utmDimension = "UtmSource", this.acquisitionView = "referrers";
  }
  render() {
    const e = this.cards.filter((a) => a.kind !== "tabbed-breakdown" || a.id !== "utm"), t = this.cards.find((a) => a.kind === "tabbed-breakdown" && a.id === "utm"), i = e.find((a) => a.kind === "breakdown" && a.dimension === "ReferrerHostname"), s = (a) => a === i ? Y(this, W, ra).call(this, a, t) : Y(this, W, oa).call(this, a), n = !e.some((a) => a.kind === "breakdown" && a.dimension === "RequestPath"), o = n ? e.slice(0, 1) : e, r = n ? e.slice(1) : [];
    return v`
      <section class="grid" aria-label="Traffic breakdowns">
        ${o.map(s)}
        ${Y(this, W, aa).call(this)}
        <uui-box class="breakdown-card wide flags-card">
          <vercel-analytics-flag-card .report=${this.flags} .selected=${this.selectedFlag}></vercel-analytics-flag-card>
        </uui-box>
        ${r.map(s)}
      </section>
    `;
  }
};
W = /* @__PURE__ */ new WeakSet();
Wt = function(e, t) {
  this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0, detail: t }));
};
ei = function(e) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
  e.preventDefault();
  const t = Array.from(e.currentTarget.parentElement?.querySelectorAll("[role=tab]") ?? []), i = t.indexOf(e.currentTarget), s = e.key === "Home" ? 0 : e.key === "End" ? t.length - 1 : e.key === "ArrowLeft" ? (i - 1 + t.length) % t.length : (i + 1) % t.length;
  t[s]?.click(), t[s]?.focus();
};
ia = function(e) {
  const t = e.id === "audience" ? this.audienceDimension : this.utmDimension, i = e.id === "utm" ? Oo : e.options;
  return v`
      <div slot="heading" class="breakdown-tabs" role="tablist" aria-label=${e.id === "audience" ? "Audience technology" : "UTM parameter"}>
        ${i.map(({ dimension: s, label: n }) => v`
          <button
            type="button"
            role="tab"
            aria-selected=${t === s}
            tabindex=${t === s ? 0 : -1}
            @click=${() => Y(this, W, Wt).call(this, e.id === "audience" ? "audience-change" : "utm-change", { dimension: s })}
            @keydown=${Y(this, W, ei)}>${n}</button>
        `)}
      </div>
    `;
};
sa = function(e) {
  const t = e ? this.acquisitionView : "referrers";
  return v`
      <div slot="heading" class="breakdown-tabs acquisition-tabs" role="tablist" aria-label="Traffic source">
        <button
          type="button"
          role="tab"
          aria-selected=${t === "referrers"}
          tabindex=${t === "referrers" ? 0 : -1}
          @click=${() => {
    this.acquisitionView = "referrers";
  }}
          @keydown=${Y(this, W, ei)}>Referrers</button>
        ${e ? v`
          <button
            type="button"
            role="tab"
            aria-selected=${t === "utm"}
            tabindex=${t === "utm" ? 0 : -1}
            @click=${() => {
    this.acquisitionView = "utm";
  }}
            @keydown=${Y(this, W, ei)}>UTM Parameters</button>
        ` : ""}
      </div>
    `;
};
na = function(e) {
  return v`
      <div slot="subheading" class="utm-tabs" role="tablist" aria-label="UTM parameter">
        ${e.options.map(({ dimension: t, label: i }) => v`
          <button
            type="button"
            role="tab"
            aria-selected=${this.utmDimension === t}
            tabindex=${this.utmDimension === t ? 0 : -1}
            @click=${() => Y(this, W, Wt).call(this, "utm-change", { dimension: t })}
            @keydown=${Y(this, W, ei)}>${i}</button>
        `)}
      </div>
    `;
};
oa = function(e) {
  const t = hs(e, this.audienceDimension, this.utmDimension), i = this.breakdowns[t.dimension], s = !i || i.status === "idle" || i.status === "loading", n = i ? it(i)?.rows ?? [] : [], o = Yr(n, 10), r = Gs(n, this.metric), a = i?.status === "error" ? i.message : void 0, l = e.kind === "tabbed-breakdown" && e.planLimited, c = t.dimension === "RequestPath" || t.dimension === "Route";
  return v`
      <uui-box class=${`breakdown-card ${e.span === "wide" ? "wide" : ""}`}>
        <div class="breakdown-card-layout">
          <vercel-analytics-breakdown-table
            .headline=${t.headline}
            .dimension=${t.dimension}
            .metric=${this.metric}
            .total=${r}
            .rows=${o}
            .loading=${s}
            .filters=${this.filters}
            .baseUrl=${this.baseUrl}
            .linkValues=${c}
            .unavailable=${a}>
            ${e.kind === "tabbed-breakdown" ? Y(this, W, ia).call(this, e) : ""}
          </vercel-analytics-breakdown-table>
          ${l && a ? v`<p class="hint breakdown-hint">UTM reporting availability depends on your Vercel plan and reporting window.</p>` : ""}
          <footer class="breakdown-footer">
            ${!s && !a && o.length ? v`
              <uui-button look="secondary" label=${`View all ${t.headline}`} @click=${() => Y(this, W, Wt).call(this, "view-breakdown", t)}>View all</uui-button>
            ` : !s && a ? v`
              <uui-button look="secondary" label=${`Retry ${t.headline} report`} @click=${() => Y(this, W, Wt).call(this, "retry-reports")}>Retry</uui-button>
            ` : ""}
          </footer>
        </div>
      </uui-box>
    `;
};
ra = function(e, t) {
  const i = !!t?.options.some(({ dimension: h }) => {
    const d = this.breakdowns[h];
    return d ? it(d) !== void 0 : !1;
  }), s = i && this.acquisitionView === "utm" && t, n = s ? hs(t, this.audienceDimension, this.utmDimension) : hs(e, this.audienceDimension, this.utmDimension), o = this.breakdowns[n.dimension], r = !o || o.status === "idle" || o.status === "loading", a = o ? it(o)?.rows ?? [] : [], l = Yr(a, 10), c = Gs(a, this.metric), u = o?.status === "error" ? o.message : void 0;
  return v`
      <uui-box class="breakdown-card wide">
        <div class="breakdown-card-layout">
          <vercel-analytics-breakdown-table
            .headline=${n.headline}
            .dimension=${n.dimension}
            .metric=${this.metric}
            .total=${c}
            .rows=${l}
            .loading=${r}
            .filters=${this.filters}
            .baseUrl=${this.baseUrl}
            .hasSubheading=${!!s}
            .unavailable=${u}>
            ${Y(this, W, sa).call(this, i)}
            ${s ? Y(this, W, na).call(this, t) : ""}
          </vercel-analytics-breakdown-table>
          <footer class="breakdown-footer">
            ${!r && !u && l.length ? v`
              <uui-button look="secondary" label=${`View all ${n.headline}`} @click=${() => Y(this, W, Wt).call(this, "view-breakdown", n)}>View all</uui-button>
            ` : !r && u ? v`
              <uui-button look="secondary" label=${`Retry ${n.headline} report`} @click=${() => Y(this, W, Wt).call(this, "retry-reports")}>Retry</uui-button>
            ` : ""}
          </footer>
        </div>
      </uui-box>
    `;
};
aa = function() {
  const e = this.events.status === "idle" || this.events.status === "loading", t = Za(it(this.events)?.rows ?? [], 10), i = !e && t.length === 0;
  return v`
      <uui-box class="breakdown-card wide">
        <div class=${`breakdown-card-layout${i ? " empty-card-layout" : ""}`}>
          <vercel-analytics-event-table .rows=${t} .filters=${this.filters} .loading=${e}></vercel-analytics-event-table>
          ${i ? "" : v`<footer class="breakdown-footer">
            ${!e && t.length ? v`<uui-button look="secondary" label="View all events" @click=${() => Y(this, W, Wt).call(this, "view-events")}>View all</uui-button>` : ""}
          </footer>`}
        </div>
      </uui-box>
    `;
};
st.styles = [Lt, ut`
    .grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: var(--uui-size-layout-1); }
    .breakdown-card { --uui-box-default-padding: 0; grid-column: span 2; overflow: hidden; position: relative; }
    .wide { grid-column: span 3; }
    .flags-card { --uui-box-default-padding: 0; }
    .breakdown-card-layout { box-sizing: border-box; min-block-size: 100%; padding-bottom: 3.25rem; }
    .empty-card-layout { block-size: 100%; padding-bottom: 0; }
    .breakdown-footer { align-items: center; background: color-mix(in srgb, var(--uui-color-surface-alt) 18%, var(--uui-color-surface)); border-top: 1px solid var(--uui-color-border); bottom: 0; box-sizing: border-box; display: flex; justify-content: flex-end; left: 0; min-block-size: 3.25rem; padding: var(--uui-size-space-1) var(--uui-size-space-4); position: absolute; right: 0; }
    .hint { color: var(--uui-color-text-alt); }
    .breakdown-hint { margin: 0; padding: var(--uui-size-space-3) var(--uui-size-space-5); }
    .breakdown-tabs { align-items: stretch; display: flex; margin: calc(-1 * var(--uui-size-space-3)); }
    .breakdown-tabs button { appearance: none; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--uui-color-text-alt); cursor: pointer; font: inherit; font-weight: 500; padding: calc(var(--uui-size-space-3) - 1px) var(--uui-size-space-3); }
    .breakdown-tabs button[aria-selected="true"] { border-bottom-color: var(--uui-color-selected); color: var(--uui-color-text); }
    .breakdown-tabs button:hover { background: var(--uui-color-surface-alt); }
    .breakdown-tabs button:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: -2px; }
    .utm-tabs { align-items: center; display: flex; gap: var(--uui-size-space-1); min-inline-size: 0; overflow-x: auto; padding: var(--uui-size-space-2) var(--uui-size-space-3); scrollbar-width: thin; }
    .utm-tabs button { appearance: none; background: transparent; border: 0; border-radius: var(--uui-border-radius); color: var(--uui-color-text-alt); cursor: pointer; flex: 0 0 auto; font: inherit; padding: var(--uui-size-space-2) var(--uui-size-space-3); }
    .utm-tabs button[aria-selected="true"] { background: var(--uui-color-surface-alt); color: var(--uui-color-text); font-weight: 600; }
    .utm-tabs button:hover { background: color-mix(in srgb, var(--uui-color-selected) 8%, transparent); color: var(--uui-color-text); }
    .utm-tabs button:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: -2px; }
    @container (max-width: 62rem) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .breakdown-card, .wide { grid-column: auto; }
    }
    @container (max-width: 48rem) { .grid { grid-template-columns: 1fr; } }
  `];
pt([
  _({ attribute: !1 })
], st.prototype, "cards", 2);
pt([
  _({ attribute: !1 })
], st.prototype, "breakdowns", 2);
pt([
  _({ attribute: !1 })
], st.prototype, "events", 2);
pt([
  _({ attribute: !1 })
], st.prototype, "flags", 2);
pt([
  _({ attribute: !1 })
], st.prototype, "selectedFlag", 2);
pt([
  _({ attribute: !1 })
], st.prototype, "filters", 2);
pt([
  _()
], st.prototype, "metric", 2);
pt([
  _()
], st.prototype, "audienceDimension", 2);
pt([
  _()
], st.prototype, "utmDimension", 2);
pt([
  _()
], st.prototype, "baseUrl", 2);
pt([
  Dt()
], st.prototype, "acquisitionView", 2);
st = pt([
  dt("vercel-analytics-breakdown-grid")
], st);
var lf = Object.defineProperty, cf = Object.getOwnPropertyDescriptor, la = (e) => {
  throw TypeError(e);
}, bt = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? cf(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && lf(t, i, n), n;
}, uf = (e, t, i) => t.has(e) || la("Cannot " + i), hf = (e, t, i) => t.has(e) ? la("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ie = (e, t, i) => (uf(e, t, "access private method"), i), Jt, tn, ca, ua, ha;
let nt = class extends ft(ht) {
  constructor() {
    super(...arguments), hf(this, Jt), this.headline = "Breakdown", this.loading = !1, this.metric = "visitors", this.linkValues = !1, this.rows = [], this.filters = [], this._search = "";
  }
  firstUpdated() {
    this.shadowRoot?.querySelector("dialog")?.showModal();
  }
  render() {
    return v`
      <dialog aria-label=${this.headline} @cancel=${Ie(this, Jt, ua)} @close=${Ie(this, Jt, ca)}>
        <uui-dialog-layout headline=${this.headline}>
          <uui-input
            type="search"
            label=${`Search ${this.headline}`}
            maxlength="200"
            placeholder="Search"
            .value=${this._search}
            @input=${Ie(this, Jt, ha)}>
            <uui-icon name="icon-search" slot="prepend"></uui-icon>
          </uui-input>
          <div class="results" aria-busy=${this.loading} aria-live="polite">
            ${!this.loading && this.unavailable ? v`<umb-empty-state headline="Results unavailable"><p>${this.unavailable}</p></umb-empty-state>` : ""}
            ${!this.loading && !this.unavailable && this._search && this.rows.length === 0 ? v`<umb-empty-state headline="No matching results"><p>Try a different search.</p></umb-empty-state>` : ""}
            ${this.loading || !this.unavailable && (!this._search || this.rows.length > 0) ? v`
              <vercel-analytics-breakdown-table
                .headline=${this.headline}
                .dimension=${this.dimension}
                .metric=${this.metric}
                .total=${Gs(this.rows, this.metric)}
                .rows=${this.rows}
                .loading=${this.loading}
                .baseUrl=${this.baseUrl}
                .filters=${this.filters}
                .linkValues=${this.linkValues}></vercel-analytics-breakdown-table>
            ` : ""}
          </div>
          <uui-button slot="actions" look="secondary" label="Close breakdown" @click=${Ie(this, Jt, tn)}>Close</uui-button>
        </uui-dialog-layout>
      </dialog>
    `;
  }
};
Jt = /* @__PURE__ */ new WeakSet();
tn = function() {
  this.shadowRoot?.querySelector("dialog")?.close();
};
ca = function() {
  this.dispatchEvent(new CustomEvent("close-breakdown", { bubbles: !0, composed: !0 }));
};
ua = function(e) {
  e.preventDefault(), Ie(this, Jt, tn).call(this);
};
ha = function(e) {
  this._search = String(e.target.value ?? ""), this.dispatchEvent(new CustomEvent("search-breakdown", {
    bubbles: !0,
    composed: !0,
    detail: { search: this._search.trim() }
  }));
};
nt.styles = [Lt, ut`
    dialog {
      border: 0;
      border-radius: var(--uui-border-radius);
      box-shadow: var(--uui-shadow-depth-5);
      box-sizing: border-box;
      margin: auto;
      max-height: min(52rem, calc(100dvh - 2 * var(--uui-size-layout-1)));
      max-width: min(50rem, calc(100vw - 2 * var(--uui-size-layout-1)));
      padding: 0;
      width: 100%;
    }
    dialog::backdrop { background: rgb(0 0 0 / 45%); }
    uui-dialog-layout {
      --uui-size-10: var(--uui-size-space-5);
      --uui-size-14: var(--uui-size-space-6);
    }
    uui-input { box-sizing: border-box; width: 100%; }
    uui-input [slot="prepend"] { align-items: center; display: flex; margin-inline: var(--uui-size-space-3) var(--uui-size-space-2); }
    .results { block-size: min(30rem, 52dvh); margin-top: var(--uui-size-space-4); overflow: auto; scrollbar-gutter: stable; }
    @media (max-width: 600px) {
      dialog { max-height: 100dvh; max-width: 100vw; }
      .results { block-size: 48dvh; }
    }
  `];
bt([
  _()
], nt.prototype, "headline", 2);
bt([
  _()
], nt.prototype, "loading", 2);
bt([
  _()
], nt.prototype, "unavailable", 2);
bt([
  _()
], nt.prototype, "baseUrl", 2);
bt([
  _()
], nt.prototype, "dimension", 2);
bt([
  _()
], nt.prototype, "metric", 2);
bt([
  _({ type: Boolean })
], nt.prototype, "linkValues", 2);
bt([
  _({ attribute: !1 })
], nt.prototype, "rows", 2);
bt([
  _({ attribute: !1 })
], nt.prototype, "filters", 2);
bt([
  Dt()
], nt.prototype, "_search", 2);
nt = bt([
  dt("vercel-analytics-breakdown-dialog")
], nt);
var df = Object.defineProperty, ff = Object.getOwnPropertyDescriptor, da = (e) => {
  throw TypeError(e);
}, ke = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? ff(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && df(t, i, n), n;
}, pf = (e, t, i) => t.has(e) || da("Cannot " + i), gf = (e, t, i) => t.has(e) ? da("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ne = (e, t, i) => (pf(e, t, "access private method"), i), te, en, fa, pa, ga;
let Ht = class extends ft(ht) {
  constructor() {
    super(...arguments), gf(this, te), this.loading = !1, this.rows = [], this.filters = [], this._search = "";
  }
  firstUpdated() {
    this.shadowRoot?.querySelector("dialog")?.showModal();
  }
  render() {
    return v`
      <dialog aria-label="Events" @cancel=${Ne(this, te, pa)} @close=${Ne(this, te, fa)}>
        <uui-dialog-layout headline="Events">
          <uui-input type="search" label="Search events" maxlength="200" placeholder="Search" .value=${this._search} @input=${Ne(this, te, ga)}>
            <uui-icon name="icon-search" slot="prepend"></uui-icon>
          </uui-input>
          <div class="results" aria-busy=${this.loading} aria-live="polite">
            ${!this.loading && this.unavailable ? v`<umb-empty-state headline="Events unavailable"><p>${this.unavailable}</p></umb-empty-state>` : ""}
            ${!this.loading && !this.unavailable && this._search && this.rows.length === 0 ? v`<umb-empty-state headline="No matching events"><p>Try a different search.</p></umb-empty-state>` : ""}
            ${this.loading || !this.unavailable && (!this._search || this.rows.length > 0) ? v`
              <vercel-analytics-event-table .rows=${this.rows} .filters=${this.filters} .loading=${this.loading}></vercel-analytics-event-table>
            ` : ""}
          </div>
          <uui-button slot="actions" look="secondary" label="Close events" @click=${Ne(this, te, en)}>Close</uui-button>
        </uui-dialog-layout>
      </dialog>
    `;
  }
};
te = /* @__PURE__ */ new WeakSet();
en = function() {
  this.shadowRoot?.querySelector("dialog")?.close();
};
fa = function() {
  this.dispatchEvent(new CustomEvent("close-events", { bubbles: !0, composed: !0 }));
};
pa = function(e) {
  e.preventDefault(), Ne(this, te, en).call(this);
};
ga = function(e) {
  this._search = String(e.target.value ?? ""), this.dispatchEvent(new CustomEvent("search-events", { bubbles: !0, composed: !0, detail: { search: this._search.trim() } }));
};
Ht.styles = [Lt, ut`
    dialog { border: 0; border-radius: var(--uui-border-radius); box-shadow: var(--uui-shadow-depth-5); box-sizing: border-box; margin: auto; max-height: min(52rem, calc(100dvh - 2 * var(--uui-size-layout-1))); max-width: min(58rem, calc(100vw - 2 * var(--uui-size-layout-1))); padding: 0; width: 100%; }
    dialog::backdrop { background: rgb(0 0 0 / 45%); }
    uui-dialog-layout { --uui-size-10: var(--uui-size-space-5); --uui-size-14: var(--uui-size-space-6); }
    uui-input { box-sizing: border-box; width: 100%; }
    uui-input [slot="prepend"] { align-items: center; display: flex; margin-inline: var(--uui-size-space-3) var(--uui-size-space-2); }
    .results { block-size: min(30rem, 52dvh); margin-top: var(--uui-size-space-4); overflow: auto; scrollbar-gutter: stable; }
  `];
ke([
  _({ type: Boolean })
], Ht.prototype, "loading", 2);
ke([
  _()
], Ht.prototype, "unavailable", 2);
ke([
  _({ attribute: !1 })
], Ht.prototype, "rows", 2);
ke([
  _({ attribute: !1 })
], Ht.prototype, "filters", 2);
ke([
  Dt()
], Ht.prototype, "_search", 2);
Ht = ke([
  dt("vercel-analytics-event-dialog")
], Ht);
var mf = Object.defineProperty, bf = Object.getOwnPropertyDescriptor, ma = (e) => {
  throw TypeError(e);
}, rt = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? bf(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && mf(t, i, n), n;
}, vf = (e, t, i) => t.has(e) || ma("Cannot " + i), yf = (e, t, i) => t.has(e) ? ma("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), U = (e, t, i) => (vf(e, t, "access private method"), i), I, sn, ba, va, Ki, ya, _a, nn, Xi, xa, Cs, wa, ka;
let Q = class extends ft(ht) {
  constructor() {
    super(...arguments), yf(this, I), this.eventName = "Event", this.loading = !1, this.searchLoading = !1, this._search = "";
  }
  firstUpdated() {
    this.shadowRoot?.querySelector("dialog")?.showModal();
  }
  render() {
    const e = U(this, I, Ki).call(this);
    return v`
      <dialog aria-label=${`${this.eventName} event details`} @cancel=${U(this, I, va)} @close=${U(this, I, ba)}>
        <uui-dialog-layout headline=${this.eventName}>
          <div class="dialog-content" aria-busy=${this.loading}>
            ${this.details ? v`
              ${e ? v`
                ${U(this, I, ka).call(this, e)}
              ` : v`<div class="state-message"><umb-empty-state headline="No event properties"><p>This event has totals, but no custom data properties were recorded in the selected period.</p></umb-empty-state></div>`}
              ${this.loading ? v`<div class="loading-overlay" role="status">Updating event details…</div>` : ""}
              ${this.unavailable ? v`<div class="error-overlay" role="alert">${this.unavailable}</div>` : ""}
            ` : this.loading ? v`<div class="loading" role="status">Loading event details…</div>` : this.unavailable ? v`<div class="state-message"><umb-empty-state headline="Event details unavailable"><p>${this.unavailable}</p></umb-empty-state></div>` : ""}
          </div>
          <uui-button slot="actions" look="secondary" label="Close event details" @click=${U(this, I, sn)}>Close</uui-button>
        </uui-dialog-layout>
      </dialog>
    `;
  }
};
I = /* @__PURE__ */ new WeakSet();
sn = function() {
  this.shadowRoot?.querySelector("dialog")?.close();
};
ba = function() {
  this.dispatchEvent(new CustomEvent("close-event-details", { bubbles: !0, composed: !0 }));
};
va = function(e) {
  e.preventDefault(), U(this, I, sn).call(this);
};
Ki = function() {
  return this.details?.properties.find((e) => e.name === this._propertyName) ?? this.details?.properties[0];
};
ya = function(e) {
  this._propertyName = e, U(this, I, Xi).call(this, e);
};
_a = function(e) {
  this._search = String(e.target.value ?? ""), U(this, I, nn).call(this, U(this, I, Ki).call(this)?.name ?? "", this._search);
};
nn = function(e, t) {
  this.dispatchEvent(new CustomEvent("search-event-property", {
    bubbles: !0,
    composed: !0,
    detail: { propertyName: e, search: t.trim() }
  }));
};
Xi = function(e) {
  this._search = "", U(this, I, nn).call(this, e, "");
};
xa = function(e) {
  const t = this.details?.properties ?? [];
  if (!t.length || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
  e.preventDefault();
  const i = Math.max(0, t.findIndex((n) => n.name === U(this, I, Ki).call(this)?.name)), s = e.key === "Home" ? 0 : e.key === "End" ? t.length - 1 : (i + (e.key === "ArrowLeft" ? -1 : 1) + t.length) % t.length;
  this._propertyName = t[s].name, U(this, I, Xi).call(this, t[s].name), this.updateComplete.then(() => this.shadowRoot?.querySelector(`[data-property-index="${s}"]`)?.focus());
};
Cs = function(e, t) {
  U(this, I, Xi).call(this, e), this.dispatchEvent(new CustomEvent("toggle-event-property-filter", {
    bubbles: !0,
    composed: !0,
    detail: { property: e, value: t }
  }));
};
wa = function(e) {
  return v`
      <div class="property-tabs" role="tablist" aria-label="Event properties">
        ${this.details?.properties.map((t, i) => v`
          <button
            id=${`event-property-${i}`}
            data-property-index=${i}
            type="button"
            role="tab"
            aria-controls="event-property-panel"
            aria-selected=${e.name === t.name}
            tabindex=${e.name === t.name ? 0 : -1}
            @click=${() => U(this, I, ya).call(this, t.name)}
            @keydown=${U(this, I, xa)}>${t.name}</button>
        `)}
      </div>
    `;
};
ka = function(e) {
  const t = this._search.trim().toLocaleLowerCase(), s = this.searchedProperty?.name === e.name && this.searchedTerm?.toLocaleLowerCase() === t ? this.searchedProperty?.values ?? [] : t ? [] : e.values, n = Math.max(...s.map((o) => o.count), 1);
  return v`
      <div id="event-property-panel" role="tabpanel" aria-labelledby=${`event-property-${this.details?.properties.indexOf(e) ?? 0}`}>
        <table>
          <caption>${e.name} values for ${this.eventName}</caption>
          <thead>
            <tr class="metric-headings">
              <th scope="col">${U(this, I, wa).call(this, e)}</th>
              <th scope="col">Visitors</th>
              <th scope="col">Total events</th>
            </tr>
            ${this.filterProperty !== void 0 && this.filterValue !== void 0 ? v`
              <tr class="active-filter-row"><th colspan="3">
                <button type="button" class="active-filter" @click=${() => U(this, I, Cs).call(this, this.filterProperty, this.filterValue)}>
                  <uui-icon name="icon-filter"></uui-icon>
                  <span>${this.filterProperty}: ${this.filterValue || "(empty)"}</span>
                  <uui-icon name="icon-delete"></uui-icon>
                </button>
              </th></tr>
            ` : ""}
            ${e.values.length ? v`
              <tr class="search-row"><th colspan="3">
                <uui-input
                  type="search"
                  label=${`Search ${e.name} values`}
                  maxlength="200"
                  placeholder="Search"
                  .value=${this._search}
                  @input=${U(this, I, _a)}>
                  <uui-icon name="icon-search" slot="prepend"></uui-icon>
                </uui-input>
              </th></tr>
            ` : ""}
          </thead>
          <tbody>${this.searchLoading ? v`
            <tr class="empty-row"><td colspan="3"><umb-empty-state headline="Searching"><p>Looking up matching values…</p></umb-empty-state></td></tr>
          ` : this.searchUnavailable ? v`
            <tr class="empty-row"><td colspan="3"><umb-empty-state headline="Search unavailable"><p>${this.searchUnavailable}</p></umb-empty-state></td></tr>
          ` : s.length ? s.map((o) => {
    const r = this.filterProperty === e.name && this.filterValue === o.value;
    return v`
              <tr>
                <th scope="row">
                  <span class="bar" style=${`--bar-width:${o.count / n * 100}%;--bar-minimum:${o.count > 0 ? "4px" : "0px"}`}></span>
                  <span class="value-label">${o.value || "(empty)"}</span>
                </th>
                <td>
                  <span class="visitors-content">
                    <button
                      type="button"
                      class="filter-button"
                      aria-pressed=${r}
                      aria-label=${r ? `Remove ${e.name} filter ${o.value || "empty"}` : `Filter by ${e.name} ${o.value || "empty"}`}
                      title=${r ? "Remove filter" : "Filter by this value"}
                      @click=${() => U(this, I, Cs).call(this, e.name, o.value)}>
                      <uui-icon name=${r ? "icon-delete" : "icon-filter"}></uui-icon>
                    </button>
                    <span>${this.localize.number(o.visitors)}</span>
                  </span>
                </td>
                <td>${this.localize.number(o.count)}</td>
              </tr>
            `;
  }) : v`<tr class="empty-row"><td colspan="3"><umb-empty-state headline=${t ? "No matching values" : "No values"}><p>${t ? "Try a different search." : "No values were recorded for this property in the selected period."}</p></umb-empty-state></td></tr>`}</tbody>
        </table>
      </div>
    `;
};
Q.styles = [Lt, ut`
    dialog { border: 0; border-radius: var(--uui-border-radius); box-shadow: var(--uui-shadow-depth-5); box-sizing: border-box; margin: auto; max-height: min(52rem, calc(100dvh - 2 * var(--uui-size-layout-1))); max-width: min(52rem, calc(100vw - 2 * var(--uui-size-layout-1))); padding: 0; width: 100%; }
    dialog::backdrop { background: rgb(0 0 0 / 45%); }
    uui-dialog-layout { --uui-size-10: var(--uui-size-space-5); --uui-size-14: var(--uui-size-space-6); }
    .dialog-content { block-size: min(30rem, 52dvh); display: flex; flex-direction: column; min-block-size: 0; position: relative; }
    .property-tabs { display: flex; gap: var(--uui-size-space-1); inline-size: calc(100% + var(--uui-size-space-5)); margin-inline-start: calc(-1 * var(--uui-size-space-5)); overflow-x: auto; overscroll-behavior-inline: contain; scrollbar-width: thin; }
    .property-tabs button { appearance: none; background: transparent; border: 0; border-bottom: 3px solid transparent; color: var(--uui-color-text-alt); cursor: pointer; flex: 0 0 auto; font: inherit; padding: var(--uui-size-space-3) var(--uui-size-space-4); }
    .property-tabs button:first-child { padding-inline-start: var(--uui-size-space-5); }
    .property-tabs button:hover { color: var(--uui-color-text); }
    .property-tabs button[aria-selected="true"] { border-bottom-color: var(--uui-color-selected); color: var(--uui-color-text); font-weight: 700; }
    .property-tabs button:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: -3px; }
    #event-property-panel { flex: 1; margin-inline: calc(-1 * var(--uui-size-space-5)); min-block-size: 0; overflow: auto; scrollbar-gutter: stable; }
    table { --bar-inset: var(--uui-size-space-3); border-collapse: separate; border-spacing: 0; min-inline-size: 34rem; table-layout: fixed; width: 100%; }
    caption { clip: rect(0 0 0 0); height: 1px; overflow: hidden; position: absolute; width: 1px; }
    th, td { box-sizing: border-box; padding: var(--uui-size-space-3) var(--uui-size-space-5); text-align: left; }
    thead { background: var(--uui-color-surface); box-shadow: 0 1px 0 var(--uui-color-border); position: sticky; top: 0; z-index: 3; }
    thead th { background: var(--uui-color-surface); font-weight: 700; }
    .metric-headings th:first-child { padding-block: 0; }
    .active-filter-row th { padding-block: var(--uui-size-space-2); }
    .active-filter { align-items: center; background: var(--uui-color-surface-alt); border: 1px solid var(--uui-color-border); border-radius: var(--uui-border-radius); color: var(--uui-color-text); cursor: pointer; display: inline-flex; gap: var(--uui-size-space-2); max-inline-size: 100%; padding: var(--uui-size-space-2) var(--uui-size-space-3); }
    .active-filter span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .search-row th { padding-block: var(--uui-size-space-3); }
    .search-row uui-input { box-sizing: border-box; width: 100%; }
    .search-row uui-input [slot="prepend"] { align-items: center; display: flex; margin-inline: var(--uui-size-space-3) var(--uui-size-space-2); }
    .metric-headings th { box-shadow: 0 1px 0 var(--uui-color-border); }
    thead th:not(:first-child), td { text-align: right; width: 8rem; }
    tbody th { font-weight: 500; min-width: 12rem; position: relative; }
    td { font-variant-numeric: tabular-nums; position: relative; z-index: 1; }
    .visitors-content { display: inline-flex; position: relative; }
    .filter-button { align-items: center; background: transparent; border: 0; border-radius: var(--uui-border-radius); color: var(--uui-color-interactive); cursor: pointer; display: inline-flex; inset-block-start: 50%; inset-inline-end: calc(100% + var(--uui-size-space-2)); justify-content: center; min-block-size: 2rem; min-inline-size: 2rem; opacity: 0; position: absolute; transform: translateY(-50%); }
    tr:hover .filter-button, .filter-button:focus-visible, .filter-button[aria-pressed="true"] { opacity: 1; }
    .filter-button:hover { background: var(--uui-color-surface-emphasis); }
    .filter-button:focus-visible { outline: 2px solid var(--uui-color-selected); outline-offset: 1px; }
    .value-label { overflow-wrap: anywhere; position: relative; z-index: 1; }
    .bar { inset-block: var(--uui-size-space-1); inset-inline-start: var(--bar-inset); inline-size: calc(100% + 16rem - 2 * var(--bar-inset)); position: absolute; }
    .bar::before { background: color-mix(in srgb, var(--uui-color-interactive) 4%, var(--uui-color-surface)); block-size: 100%; border-radius: var(--uui-border-radius); content: ""; display: block; inline-size: max(var(--bar-minimum), var(--bar-width)); }
    .loading, .state-message { box-sizing: border-box; flex: 1; padding: var(--uui-size-space-5); }
    .loading-overlay { background: color-mix(in srgb, var(--uui-color-surface) 82%, transparent); inset: 0; padding: var(--uui-size-space-5); position: absolute; z-index: 4; }
    .error-overlay { background: color-mix(in srgb, var(--uui-color-warning) 8%, var(--uui-color-surface)); border: 1px solid color-mix(in srgb, var(--uui-color-warning) 28%, var(--uui-color-border)); border-radius: var(--uui-border-radius); inset-block-start: var(--uui-size-space-3); inset-inline: var(--uui-size-space-3); padding: var(--uui-size-space-4); position: absolute; z-index: 5; }
    .empty-row td { padding: var(--uui-size-space-5); text-align: left; }
    .visually-hidden { clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px; }
    @media (max-width: 600px) {
      dialog { max-height: 100dvh; max-width: 100vw; }
      .dialog-content { block-size: 48dvh; }
    }
    @media (hover: none) { .filter-button { opacity: 1; } }
  `];
rt([
  _()
], Q.prototype, "eventName", 2);
rt([
  _({ type: Boolean })
], Q.prototype, "loading", 2);
rt([
  _()
], Q.prototype, "unavailable", 2);
rt([
  _({ attribute: !1 })
], Q.prototype, "details", 2);
rt([
  _()
], Q.prototype, "filterProperty", 2);
rt([
  _()
], Q.prototype, "filterValue", 2);
rt([
  _({ attribute: !1 })
], Q.prototype, "searchedProperty", 2);
rt([
  _()
], Q.prototype, "searchedTerm", 2);
rt([
  _({ type: Boolean })
], Q.prototype, "searchLoading", 2);
rt([
  _()
], Q.prototype, "searchUnavailable", 2);
rt([
  Dt()
], Q.prototype, "_propertyName", 2);
rt([
  Dt()
], Q.prototype, "_search", 2);
Q = rt([
  dt("vercel-analytics-event-details-dialog")
], Q);
var _f = Object.defineProperty, xf = Object.getOwnPropertyDescriptor, Sa = (e) => {
  throw TypeError(e);
}, Zi = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? xf(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && _f(t, i, n), n;
}, $a = (e, t, i) => t.has(e) || Sa("Cannot " + i), T = (e, t, i) => ($a(e, t, "read from private field"), i ? i.call(e) : t.get(e)), To = (e, t, i) => t.has(e) ? Sa("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ee = (e, t, i) => ($a(e, t, "access private method"), i), z, Et, Ms, Da, Be;
let xe = class extends ft(ht) {
  constructor() {
    super(...arguments), To(this, Et), this._revision = 0, To(this, z, new Qa(() => {
      this._revision += 1;
    }));
  }
  connectedCallback() {
    super.connectedCallback(), T(this, z).connect(this.documentId, this.culture);
  }
  disconnectedCallback() {
    T(this, z).disconnect(), super.disconnectedCallback();
  }
  updated(e) {
    (e.has("documentId") || e.has("culture")) && T(this, z).setScope(this.documentId, this.culture);
  }
  render() {
    this._revision;
    const e = T(this, z).state;
    if (e.configurationError) return v`
      <main><umb-empty-state headline="Analytics is not available"><p>${e.configurationError}</p></umb-empty-state></main>
    `;
    const t = e.expandedBreakdown, i = e.expandedEvents, s = e.selectedEvent;
    return v`
      <main @toggle-filter=${(n) => T(this, z).toggleFilter(n.detail.dimension, n.detail.value)}>
        <vercel-analytics-dashboard-header
          .connections=${e.connections}
          .connection=${e.connection}
          .route=${e.route}
          .range=${e.range}
          .preset=${e.preset}
          .siteUrl=${T(this, z).linkBaseUrl()}
          .documentScoped=${!!this.documentId}
          @connection-change=${(n) => T(this, z).setConnection(n.detail.connection)}
          @analytics-date-range-change=${(n) => T(this, z).setDateRange(n.detail.preset, n.detail.range)}></vercel-analytics-dashboard-header>
        ${ee(this, Et, Da).call(this, e.filters)}
        <vercel-analytics-summary
          .report=${e.summary}
          .range=${e.range}
          .metric=${e.metric}
          @metric-change=${(n) => T(this, z).setMetric(n.detail.metric)}
          @retry-summary=${() => T(this, z).loadReports()}></vercel-analytics-summary>
        <vercel-analytics-breakdown-grid
          .cards=${T(this, z).cards()}
          .breakdowns=${e.breakdowns}
          .events=${e.events}
          .flags=${e.flags}
          .selectedFlag=${e.selectedFlag}
          .filters=${e.filters}
          .metric=${e.metric}
          .audienceDimension=${e.audienceDimension}
          .utmDimension=${e.utmDimension}
          .baseUrl=${T(this, z).linkBaseUrl()}
          @view-breakdown=${(n) => T(this, z).openBreakdown(n.detail.dimension, n.detail.headline)}
          @view-events=${() => T(this, z).openEvents()}
          @select-event=${(n) => T(this, z).selectEvent(n.detail.eventName)}
          @select-flag=${(n) => T(this, z).selectFlag(n.detail.flagKey)}
          @clear-selected-flag=${() => T(this, z).clearSelectedFlag()}
          @retry-reports=${() => T(this, z).loadReports()}
          @audience-change=${(n) => T(this, z).setAudienceDimension(n.detail.dimension)}
          @utm-change=${(n) => T(this, z).setUtmDimension(n.detail.dimension)}></vercel-analytics-breakdown-grid>
        ${t ? v`
          <vercel-analytics-breakdown-dialog
            .headline=${t.headline}
            .dimension=${t.dimension}
            .rows=${it(t.report) ?? []}
            .filters=${e.filters}
            .loading=${t.report.status === "loading"}
            .unavailable=${ee(this, Et, Be).call(this, t.report)}
            .metric=${e.metric}
            .baseUrl=${T(this, z).linkBaseUrl()}
            .linkValues=${t.dimension === "RequestPath" || t.dimension === "Route"}
            @search-breakdown=${(n) => T(this, z).searchBreakdown(n.detail.search)}
            @close-breakdown=${() => T(this, z).closeBreakdown()}></vercel-analytics-breakdown-dialog>
        ` : ""}
        ${i ? v`
          <vercel-analytics-event-dialog
            .rows=${it(i) ?? []}
            .filters=${e.filters}
            .loading=${i.status === "loading"}
            .unavailable=${ee(this, Et, Be).call(this, i)}
            @search-events=${(n) => T(this, z).openEvents(n.detail.search, !0)}
            @select-event=${(n) => T(this, z).selectEvent(n.detail.eventName)}
            @close-events=${() => T(this, z).closeEvents()}></vercel-analytics-event-dialog>
        ` : ""}
        ${s ? v`
          <vercel-analytics-event-details-dialog
            .eventName=${s.eventName}
            .details=${it(s.details)}
            .loading=${s.details.status === "loading"}
            .unavailable=${ee(this, Et, Be).call(this, s.details)}
            .filterProperty=${s.eventProperty}
            .filterValue=${s.eventValue}
            .searchedProperty=${it(s.property)}
            .searchedTerm=${s.propertySearch}
            .searchLoading=${s.property.status === "loading"}
            .searchUnavailable=${ee(this, Et, Be).call(this, s.property)}
            @search-event-property=${(n) => T(this, z).searchEventProperty(n.detail.propertyName, n.detail.search)}
            @toggle-event-property-filter=${(n) => T(this, z).toggleEventPropertyFilter(n.detail.property, n.detail.value)}
            @close-event-details=${() => T(this, z).closeEventDetails()}></vercel-analytics-event-details-dialog>
        ` : ""}
      </main>
    `;
  }
};
z = /* @__PURE__ */ new WeakMap();
Et = /* @__PURE__ */ new WeakSet();
Ms = function(e) {
  if (e.dimension === "Country") {
    const t = ii(e.value);
    if (t) return Po(t, navigator.languages);
  }
  return e.value;
};
Da = function(e) {
  return e.length ? v`
      <section class="active-filters" aria-label="Active analytics filters">
        <div class="filter-heading"><uui-icon name="icon-filter" aria-hidden="true"></uui-icon><strong>Filters</strong></div>
        <div class="filter-list" role="group" aria-label="Applied filters">
          ${e.map((t) => v`
            <button
              type="button"
              class="filter-badge"
              aria-label=${`Remove filter ${ee(this, Et, Ms).call(this, t)}`}
              @click=${() => T(this, z).removeFilter(t.dimension)}>
              <span class="filter-value">${ee(this, Et, Ms).call(this, t)}</span><span class="filter-remove" aria-hidden="true">×</span>
            </button>
          `)}
        </div>
        <uui-button class="clear-filters" look="secondary" compact label="Clear all analytics filters" @click=${T(this, z).clearFilters}>Clear all</uui-button>
      </section>
    ` : "";
};
Be = function(e) {
  return e.status === "error" ? e.message : void 0;
};
xe.styles = Ja;
Zi([
  _({ attribute: !1 })
], xe.prototype, "documentId", 2);
Zi([
  _()
], xe.prototype, "culture", 2);
Zi([
  Dt()
], xe.prototype, "_revision", 2);
xe = Zi([
  dt("vercel-analytics-dashboard")
], xe);
export {
  Df as w
};
//# sourceMappingURL=analytics-dashboard.element-1BXnyzvC.js.map
