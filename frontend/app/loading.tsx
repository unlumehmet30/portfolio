export default function Loading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
      <div className="mt-6 h-20 max-w-3xl animate-pulse rounded-lg bg-muted" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}
