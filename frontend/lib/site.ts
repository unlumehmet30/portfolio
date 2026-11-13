import type { Profile } from "@/types/content";
import { localizePath, type Locale } from "@/lib/locale";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://unlumehmet.com";

export const defaultProfile: Profile = {
  name: "Mehmet Ünlü",
  title: "Electronics & Communication Engineering Student",
  bio:
    "I study Electronics and Communication Engineering at ITU and build hands-on projects around forecasting, computer vision, and making data workflows faster.",
  location: "Istanbul, Türkiye",
  email: "unlu.mehmett1@gmail.com",
  githubUrl: "https://github.com/unlumehmet30",
  linkedinUrl: "https://www.linkedin.com/in/unlumehmett1",
  resumeUrl: "/resume.pdf"
};

const navigation = [
  { href: "/", label: { en: "Home", tr: "Ana Sayfa" } },
  { href: "/about", label: { en: "About", tr: "Hakkında" } },
  { href: "/projects", label: { en: "Projects", tr: "Projeler" } },
  { href: "/notes", label: { en: "Notes", tr: "Notlar" } },
  { href: "/resume", label: { en: "Resume", tr: "CV" } },
  { href: "/contact", label: { en: "Contact", tr: "İletişim" } }
] as const;

export function getNavigation(locale: Locale) {
  return navigation.map((item) => ({
    href: localizePath(locale, item.href),
    label: item.label[locale]
  }));
}
