import type { ReactNode } from "react";

export function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
