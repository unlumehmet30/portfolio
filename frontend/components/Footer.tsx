import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/types/content";
import { defaultProfile, navigation } from "@/lib/site";

export function Footer({ profile = defaultProfile }: { profile?: Profile }) {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 sm:px-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{profile.bio}</p>
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
            <a className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" href={`mailto:${profile.email}`} aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
