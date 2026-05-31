"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Metric } from "@/types/content";

function useAnimatedValue(value: string) {
  const match = useMemo(() => value.match(/^(\d+)(.*)$/), [value]);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";
  const [current, setCurrent] = useState(target ? 0 : null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (!inView || target === null) return;

    const duration = 800;
    const start = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setCurrent(Math.round(target * progress));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return { ref, displayValue: target === null || current === null ? value : `${current}${suffix}` };
}

export function MetricCard({ metric }: { metric: Metric }) {
  const { ref, displayValue } = useAnimatedValue(metric.value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="rounded-lg border border-border bg-card/82 p-4"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold text-foreground">{displayValue}</p>
      <p className="mt-2 text-sm leading-5 text-muted-foreground">{metric.context}</p>
    </motion.div>
  );
}
