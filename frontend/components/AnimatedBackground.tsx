export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-accent/[0.025] to-transparent" />
    </div>
  );
}
