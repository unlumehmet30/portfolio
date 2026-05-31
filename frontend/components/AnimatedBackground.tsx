"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="technical-grid absolute inset-0 opacity-35 dark:opacity-25" />
      <motion.div
        className="subtle-rule absolute left-0 top-24 h-px w-full"
        animate={{ y: [0, 120, 0], opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="subtle-rule absolute bottom-28 left-0 h-px w-full"
        animate={{ y: [0, -96, 0], opacity: [0.06, 0.18, 0.06] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
    </div>
  );
}
