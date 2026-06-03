"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/types/content";
import { localizeProfile } from "@/lib/content-localization";
import { getLocaleFromPath } from "@/lib/locale";
import { defaultProfile, getNavigation } from "@/lib/site";
import { getUiCopy } from "@/lib/ui-copy";

export function Footer({ profile = defaultProfile }: { profile?: Profile }) {
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPath(pathname);
  const navigation = getNavigation(locale);
  const copy = getUiCopy(locale);
  const localizedProfile = localizeProfile(profile, locale);

  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-semibold">{localizedProfile.name}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{localizedProfile.bio}</p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <a className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" href={localizedProfile.githubUrl} target="_blank" rel="noreferrer" aria-label={copy.footer.githubAria}>
              <Github size={18} />
            </a>
            <a className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" href={localizedProfile.linkedinUrl} target="_blank" rel="noreferrer" aria-label={copy.footer.linkedinAria}>
              <Linkedin size={18} />
            </a>
            <a className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" href={`mailto:${localizedProfile.email}`} aria-label={copy.footer.emailAria}>
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
