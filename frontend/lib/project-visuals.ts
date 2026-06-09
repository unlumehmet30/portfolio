import type { Locale } from "@/lib/locale";

export type ProjectVisualKind =
  | "forecasting"
  | "optimization"
  | "visual-odometry"
  | "speech"
  | "mobile"
  | "generic";

type ProjectVisual = {
  src: string | null;
  suggestedFile: string;
  kind: ProjectVisualKind;
  alt: Record<Locale, string>;
};

// Add an image under public/projects, then set src to its public URL.
const projectVisuals: Record<string, ProjectVisual> = {
  "intermittent-demand-forecasting-system": {
    src: null,
    suggestedFile: "/projects/demand-forecasting-overview.png",
    kind: "forecasting",
    alt: {
      en: "Forecasting dashboard or demand chart from the intermittent demand project",
      tr: "Seyrek talep projesinden tahminleme paneli veya talep grafiği"
    }
  },
  "ml-pipeline-runtime-optimization": {
    src: null,
    suggestedFile: "/projects/pipeline-runtime-comparison.png",
    kind: "optimization",
    alt: {
      en: "Runtime comparison or profiling output from the ML pipeline optimization project",
      tr: "ML veri hattı optimizasyonu projesinden süre karşılaştırması veya profiling çıktısı"
    }
  },
  "hybrid-visual-odometry-system": {
    src: null,
    suggestedFile: "/projects/visual-odometry-frame.png",
    kind: "visual-odometry",
    alt: {
      en: "Visual odometry frame with motion or feature tracking overlays",
      tr: "Hareket veya özellik takibi katmanları içeren görsel odometri karesi"
    }
  },
  "whisper-based-speech-nlp-system": {
    src: null,
    suggestedFile: "/projects/whisper-transcript-workflow.png",
    kind: "speech",
    alt: {
      en: "Speech transcription and NLP workflow from the Whisper project",
      tr: "Whisper projesinden konuşma transkripsiyonu ve NLP iş akışı"
    }
  },
  "ai-powered-storytelling-flutter-app": {
    src: null,
    suggestedFile: "/projects/storytelling-app-screens.png",
    kind: "mobile",
    alt: {
      en: "Mobile application screens from the storytelling Flutter project",
      tr: "Hikaye anlatımı Flutter projesinden mobil uygulama ekranları"
    }
  }
};

const fallbackVisual: ProjectVisual = {
  src: null,
  suggestedFile: "/projects/project-cover.png",
  kind: "generic",
  alt: {
    en: "Project cover visual",
    tr: "Proje kapak görseli"
  }
};

export function getProjectVisual(slug?: string) {
  return slug ? projectVisuals[slug] ?? fallbackVisual : fallbackVisual;
}
