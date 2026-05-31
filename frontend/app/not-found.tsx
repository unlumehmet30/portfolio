import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-24 text-center sm:px-6">
      <p className="text-sm uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="mt-4 text-4xl font-semibold">This page is outside the current route graph.</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        The content may have moved or the API has not provided it yet.
      </p>
      <div className="mt-8">
        <ButtonLink href="/projects">View projects</ButtonLink>
      </div>
    </div>
  );
}
