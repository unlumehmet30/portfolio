"use client";

import { Languages, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { getLocaleFromPath, switchLocalePath } from "@/lib/locale";
import { getNavigation } from "@/lib/site";
import { getUiCopy } from "@/lib/ui-copy";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPath(pathname);
  const copy = getUiCopy(locale);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const languageTarget = switchLocalePath(pathname, locale === "en" ? "tr" : "en");
  const localeRootPath = locale === "tr" ? "/tr" : "/";

  useEffect(() => setMounted(true), []);

  const navItems = getNavigation(locale).map((item) => {
    const active =
      pathname === item.href ||
      (item.href !== localeRootPath && pathname.startsWith(item.href));

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground",
          active && "bg-muted text-foreground"
        )}
      >
        {item.label}
      </Link>
    );
  });

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link href={locale === "tr" ? "/tr" : "/"} className="flex items-center gap-3" aria-label={copy.navbar.brandHomeAria}>
          <span className="grid h-8 w-8 place-items-center rounded-md border border-accent/30 bg-accent/10 font-mono text-sm font-semibold text-accent">
            M
          </span>
          <span className="hidden text-sm font-semibold text-foreground sm:inline">Mehmet Ünlü</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">{navItems}</div>

        <div className="flex items-center gap-2">
          {!isAdminRoute ? (
            <ButtonLink
              href={languageTarget}
              variant="outline"
              size="sm"
              aria-label={copy.navbar.switchLanguageAria}
            >
              <Languages size={15} />
              {copy.navbar.languageSwitchLabel}
            </ButtonLink>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={copy.navbar.toggleThemeAria}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {mounted && resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={copy.navbar.openMenuAria}
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </nav>
      {open ? (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1">{navItems}</div>
        </div>
      ) : null}
    </header>
  );
}
