"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, GitBranch, Layers3, Repeat2, Route, ServerCog } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/types/content";

type DiagramType = CaseStudy["diagram"];

function Node({
  label,
  detail,
  accent = "green"
}: {
  label: string;
  detail: string;
  accent?: "green" | "sky" | "emerald" | "amber";
}) {
  const colors = {
    green: "border-accent/30 bg-accent/10 text-accent",
    sky: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-300"
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={cn("rounded-lg border p-4", colors[accent])}
    >
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
    </motion.div>
  );
}

function Connector() {
  return (
    <div className="hidden items-center justify-center text-muted-foreground md:flex">
      <ArrowRight size={18} />
    </div>
  );
}

function ForecastingDiagram() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Node label="Sale / No-sale" detail="Binary classifier estimates sparse occurrence probability." />
        <Connector />
        <Node label="Magnitude" detail="LightGBM Tweedie predicts conditional demand size." accent="sky" />
        <Connector />
        <Node label="Recursive Horizon" detail="Predictions update lag and rolling features step by step." accent="emerald" />
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {["Train window", "Validation 1", "Validation 2", "Future horizon"].map((label, index) => (
          <motion.div
            key={label}
            initial={{ scaleX: 0.85, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="rounded-md border border-border bg-muted/45 p-3"
          >
            <p className="text-xs font-medium text-foreground">{label}</p>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-accent"
                style={{ width: `${52 + index * 12}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OptimizationDiagram() {
  const bottlenecks = [
    ["Python loops", "Interpreter overhead"],
    ["Copies", "Memory pressure"],
    ["Repeated joins", "Redundant work"],
    ["Unbatched features", "Slow inference"]
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span>Before</span>
            <span className="font-mono text-muted-foreground">40m</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-muted">
            <div className="h-3 w-full rounded-full bg-rose-400/80" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <span>After</span>
            <span className="font-mono text-muted-foreground">4m</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-muted">
            <div className="h-3 w-[10%] rounded-full bg-emerald-300" />
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {bottlenecks.map(([label, detail], index) => (
          <Node key={label} label={label} detail={detail} accent={index % 2 ? "sky" : "green"} />
        ))}
      </div>
    </div>
  );
}

function VisualOdometryDiagram() {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <Node label="RAFT Branch" detail="Dense optical flow and learned motion cues." accent="green" />
      <Connector />
      <Node label="ORB Branch" detail="Feature matching and classic pose signal." accent="amber" />
      <Connector />
      <Node label="Confidence Selector" detail="Routes final pose estimate by branch reliability." accent="emerald" />
    </div>
  );
}

function SpeechDiagram() {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <Node label="Audio Input" detail="Turkish and English speech files." accent="green" />
      <Connector />
      <Node label="Whisper STT" detail="Server-side transcription and normalization." accent="sky" />
      <Connector />
      <Node label="NLP Layer" detail="Prompt summarization and Hugging Face adapters." accent="emerald" />
    </div>
  );
}

function MobileDiagram() {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <Node label="Flutter UX" detail="Parent and child interaction surfaces." accent="green" />
      <Connector />
      <Node label="Firebase" detail="Authentication, storage, and media state." accent="amber" />
      <Connector />
      <Node label="Story Generation" detail="Story, subtitle, and voice workflows." accent="sky" />
    </div>
  );
}

const iconMap: Record<DiagramType, typeof BrainCircuit> = {
  forecasting: Repeat2,
  optimization: ServerCog,
  "visual-odometry": Route,
  speech: BrainCircuit,
  mobile: Layers3
};

export function ArchitectureDiagram({ type }: { type: DiagramType }) {
  const Icon = iconMap[type] ?? GitBranch;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border border-border bg-card p-5"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold">Architecture View</p>
          <p className="text-xs text-muted-foreground">System structure and decision flow</p>
        </div>
      </div>
      {type === "forecasting" ? <ForecastingDiagram /> : null}
      {type === "optimization" ? <OptimizationDiagram /> : null}
      {type === "visual-odometry" ? <VisualOdometryDiagram /> : null}
      {type === "speech" ? <SpeechDiagram /> : null}
      {type === "mobile" ? <MobileDiagram /> : null}
    </motion.div>
  );
}
