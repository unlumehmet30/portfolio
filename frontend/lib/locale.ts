export const locales = ["en", "tr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === "/tr" || pathname.startsWith("/tr/") ? "tr" : "en";
}

function toBasePath(pathname: string) {
  if (pathname === "/tr") return "/";
  if (pathname.startsWith("/tr/")) return pathname.slice(3) || "/";
  return pathname;
}

export function localizePath(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (locale === "tr") {
    return normalized === "/" ? "/tr" : `/tr${normalized}`;
  }

  return normalized;
}

export function switchLocalePath(pathname: string, locale: Locale) {
  return localizePath(locale, toBasePath(pathname));
}
