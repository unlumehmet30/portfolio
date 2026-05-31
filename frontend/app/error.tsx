"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-24 text-center sm:px-6">
      <p className="text-sm uppercase tracking-[0.22em] text-rose-400">Runtime error</p>
      <h1 className="mt-4 text-4xl font-semibold">Something in the interface failed to render.</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{error.message}</p>
      <div className="mt-8">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
