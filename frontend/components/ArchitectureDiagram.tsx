"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, GitBranch, Globe2, Layers3, Repeat2, Route, ServerCog } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/locale";
import type { CaseStudy } from "@/types/content";

type DiagramType = CaseStudy["diagram"];

const diagramCopy = {
  en: {
    headerTitle: "Architecture View",
    headerDescription: "System structure and decision flow",
    forecasting: {
      nodes: [
        ["Sale / No-sale", "Binary classifier estimates sparse occurrence probability."],
        ["Magnitude", "LightGBM Tweedie predicts conditional demand size."],
        ["Recursive Horizon", "Predictions update lag and rolling features step by step."]
      ],
      windows: ["Train window", "Validation 1", "Validation 2", "Future horizon"]
    },
    optimization: {
      before: "Before",
      after: "After",
      bottlenecks: [
        ["Python loops", "Interpreter overhead"],
        ["Copies", "Memory pressure"],
        ["Repeated joins", "Redundant work"],
        ["Unbatched features", "Slow inference"]
      ]
    },
    visualOdometry: [
      ["RAFT Branch", "Dense optical flow and learned motion cues."],
      ["ORB Branch", "Feature matching and classic pose signal."],
      ["Confidence Selector", "Routes final pose estimate by branch reliability."]
    ],
    speech: [
      ["Audio Input", "Turkish and English speech files."],
      ["Whisper STT", "Server-side transcription and normalization."],
      ["NLP Layer", "Prompt summarization and Hugging Face adapters."]
    ],
    mobile: [
      ["Flutter UX", "Parent and child interaction surfaces."],
      ["Firebase", "Authentication, storage, and media state."],
      ["Story Generation", "Story, subtitle, and voice workflows."]
    ],
    webPlatform: [
      ["Next.js Frontend", "Public portfolio, notes, projects, resume, and localized routes."],
      ["Express API", "REST endpoints for content, uploads, contact messages, and admin actions."],
      ["Admin CMS", "Project galleries, note files, image cropping, and dynamic updates."],
      ["Caddy + Docker", "HTTPS reverse proxy and isolated production services."]
    ]
  },
  tr: {
    headerTitle: "Mimari Görünüm",
    headerDescription: "Sistem yapısı ve karar akışı",
    forecasting: {
      nodes: [
        ["Satış / Satış Yok", "İkili sınıflandırıcı seyrek gerçekleşme olasılığını tahmin eder."],
        ["Miktar", "LightGBM Tweedie koşullu talep miktarını tahmin eder."],
        ["Özyinelemeli Ufuk", "Tahminler gecikmeli ve kayan özellikleri adım adım günceller."]
      ],
      windows: ["Eğitim penceresi", "Doğrulama 1", "Doğrulama 2", "Gelecek ufuk"]
    },
    optimization: {
      before: "Önce",
      after: "Sonra",
      bottlenecks: [
        ["Python döngüleri", "Interpreter maliyeti"],
        ["Kopyalar", "Bellek baskısı"],
        ["Tekrarlı join'ler", "Gereksiz iş yükü"],
        ["Toplu işlenmeyen özellikler", "Yavaş çıkarım"]
      ]
    },
    visualOdometry: [
      ["RAFT Dalı", "Yoğun optik akış ve öğrenilmiş hareket ipuçları."],
      ["ORB Dalı", "Özellik eşleştirme ve klasik poz sinyali."],
      ["Güven Seçici", "Nihai poz tahminini dal güvenilirliğine göre yönlendirir."]
    ],
    speech: [
      ["Ses Girdisi", "Türkçe ve İngilizce konuşma dosyaları."],
      ["Whisper STT", "Sunucu taraflı transkripsiyon ve normalizasyon."],
      ["NLP Katmanı", "Prompt özetleme ve Hugging Face adaptörleri."]
    ],
    mobile: [
      ["Flutter UX", "Ebeveyn ve çocuk etkileşim yüzeyleri."],
      ["Firebase", "Kimlik doğrulama, depolama ve medya durumu."],
      ["Hikaye Üretimi", "Hikaye, altyazı ve ses iş akışları."]
    ],
    webPlatform: [
      ["Next.js Frontend", "Public portfolyo, notlar, projeler, özgeçmiş ve yerelleştirilmiş rotalar."],
      ["Express API", "İçerik, yüklemeler, iletişim mesajları ve admin işlemleri için REST endpoint'leri."],
      ["Admin CMS", "Proje galerileri, not dosyaları, görsel kırpma ve dinamik güncellemeler."],
      ["Caddy + Docker", "HTTPS reverse proxy ve izole production servisleri."]
    ]
  }
} as const;

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

function ForecastingDiagram({ locale }: { locale: Locale }) {
  const copy = diagramCopy[locale].forecasting;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Node label={copy.nodes[0][0]} detail={copy.nodes[0][1]} />
        <Connector />
        <Node label={copy.nodes[1][0]} detail={copy.nodes[1][1]} accent="sky" />
        <Connector />
        <Node label={copy.nodes[2][0]} detail={copy.nodes[2][1]} accent="emerald" />
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {copy.windows.map((label, index) => (
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

function OptimizationDiagram({ locale }: { locale: Locale }) {
  const copy = diagramCopy[locale].optimization;
  const bottlenecks = copy.bottlenecks;

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span>{copy.before}</span>
            <span className="font-mono text-muted-foreground">40m</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-muted">
            <div className="h-3 w-full rounded-full bg-rose-400/80" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <span>{copy.after}</span>
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

function VisualOdometryDiagram({ locale }: { locale: Locale }) {
  const copy = diagramCopy[locale].visualOdometry;

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <Node label={copy[0][0]} detail={copy[0][1]} accent="green" />
      <Connector />
      <Node label={copy[1][0]} detail={copy[1][1]} accent="amber" />
      <Connector />
      <Node label={copy[2][0]} detail={copy[2][1]} accent="emerald" />
    </div>
  );
}

function SpeechDiagram({ locale }: { locale: Locale }) {
  const copy = diagramCopy[locale].speech;

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <Node label={copy[0][0]} detail={copy[0][1]} accent="green" />
      <Connector />
      <Node label={copy[1][0]} detail={copy[1][1]} accent="sky" />
      <Connector />
      <Node label={copy[2][0]} detail={copy[2][1]} accent="emerald" />
    </div>
  );
}

function MobileDiagram({ locale }: { locale: Locale }) {
  const copy = diagramCopy[locale].mobile;

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <Node label={copy[0][0]} detail={copy[0][1]} accent="green" />
      <Connector />
      <Node label={copy[1][0]} detail={copy[1][1]} accent="amber" />
      <Connector />
      <Node label={copy[2][0]} detail={copy[2][1]} accent="sky" />
    </div>
  );
}

function WebPlatformDiagram({ locale }: { locale: Locale }) {
  const copy = diagramCopy[locale].webPlatform;

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
      <Node label={copy[0][0]} detail={copy[0][1]} accent="green" />
      <Connector />
      <Node label={copy[1][0]} detail={copy[1][1]} accent="sky" />
      <Connector />
      <Node label={copy[2][0]} detail={copy[2][1]} accent="emerald" />
      <Connector />
      <Node label={copy[3][0]} detail={copy[3][1]} accent="amber" />
    </div>
  );
}

const iconMap: Record<DiagramType, typeof BrainCircuit> = {
  forecasting: Repeat2,
  optimization: ServerCog,
  "visual-odometry": Route,
  speech: BrainCircuit,
  mobile: Layers3,
  "web-platform": Globe2
};

export function ArchitectureDiagram({ type, locale = "en" }: { type: DiagramType; locale?: Locale }) {
  const Icon = iconMap[type] ?? GitBranch;
  const copy = diagramCopy[locale];

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
          <p className="text-sm font-semibold">{copy.headerTitle}</p>
          <p className="text-xs text-muted-foreground">{copy.headerDescription}</p>
        </div>
      </div>
      {type === "forecasting" ? <ForecastingDiagram locale={locale} /> : null}
      {type === "optimization" ? <OptimizationDiagram locale={locale} /> : null}
      {type === "visual-odometry" ? <VisualOdometryDiagram locale={locale} /> : null}
      {type === "speech" ? <SpeechDiagram locale={locale} /> : null}
      {type === "mobile" ? <MobileDiagram locale={locale} /> : null}
      {type === "web-platform" ? <WebPlatformDiagram locale={locale} /> : null}
    </motion.div>
  );
}
