const BROWSER_ICON_PATHS = new Map<string, string>([
  ["brave", "brave.svg"],
  ["chrome", "chrome.svg"],
  ["chrome mobile", "chrome.svg"],
  ["duckduckgo", "duckduckgo.svg"],
  ["duckduckgo privacy browser", "duckduckgo.svg"],
  ["ecosia", "ecosia.svg"],
  ["edge", "edge.svg"],
  ["firefox", "firefox.svg"],
  ["jio", "jio.svg"],
  ["jiosphere", "jio.svg"],
  ["microsoft edge", "edge.svg"],
  ["mobile firefox", "firefox.svg"],
  ["mobile safari", "safari.svg"],
  ["opera", "opera.svg"],
  ["opera gx", "opera-gx.svg"],
  ["opera touch", "opera.svg"],
  ["qwant", "qwant.svg"],
  ["qwant mobile", "qwant.svg"],
  ["safari", "safari.svg"],
  ["samsung browser", "samsung-browser.svg"],
  ["samsung internet", "samsung-browser.svg"],
  ["sberbrowser", "sberbank.svg"],
  ["vivo", "vivo.svg"],
  ["vivo browser", "vivo.svg"],
  ["yandex", "yandex.svg"],
  ["yandex browser", "yandex.svg"],
]);

const BROWSER_ICON_ROOT = "/App_Plugins/TheBuilder.WebAnalytics/icons/browsers/";

export function browserIconPath(value: string): string | undefined {
  const icon = BROWSER_ICON_PATHS.get(value.trim().toLowerCase());
  return icon ? `${BROWSER_ICON_ROOT}${icon}` : undefined;
}
