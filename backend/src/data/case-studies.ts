export const caseStudyDetails: Record<
  string,
  {
    dataset: string;
    technicalDecisions: string[];
    implementationDetails: string[];
    lessonsLearned: string[];
    futureImprovements: string[];
    diagram: "forecasting" | "optimization" | "visual-odometry" | "speech" | "mobile" | "web-platform";
  }
> = {
  "personal-portfolio-platform": {
    dataset:
      "Portfolio content, uploaded project media, technical notes, resume data, contact messages, and production deployment configuration.",
    technicalDecisions: [
      "Use a full-stack architecture instead of a static-only portfolio so content can be managed without code changes.",
      "Keep public content cached with ISR while preserving no-store behavior for authenticated admin workflows.",
      "Store uploaded media persistently and reference files through controlled API paths.",
      "Place the app behind an HTTPS edge layer and keep administrative workflows separated from public content."
    ],
    implementationDetails: [
      "Next.js renders the public portfolio, localized routes, project pages, notes, and resume views.",
      "Express and Prisma expose REST endpoints for projects, notes, uploads, profile data, contact messages, and admin actions.",
      "The admin dashboard supports project galleries, cover images, image cropping, PDF/HTML note files, and Markdown content.",
      "Production is deployed as separated application services behind a public HTTPS entry point."
    ],
    lessonsLearned: [
      "A portfolio becomes more useful when content operations are part of the system, not manual code edits.",
      "Caching improves perceived speed, but admin routes and public routes need different freshness rules.",
      "Upload handling has to consider persistence, validation, previews, and long-term deploy behavior together."
    ],
    futureImprovements: [
      "Move uploads to object storage for simpler backups and CDN delivery.",
      "Add search and filtering across projects and technical notes.",
      "Introduce richer analytics and uptime monitoring after the custom domain is attached.",
      "Continue expanding the admin workflow as new portfolio needs appear."
    ],
    diagram: "web-platform"
  },
  "intermittent-demand-forecasting-system": {
    dataset:
      "20k products, three years of daily sales, strongly sparse product-level targets, and approximately 85% zero-demand rows.",
    technicalDecisions: [
      "Split sale occurrence and magnitude into separate modeling stages.",
      "Use LightGBM Tweedie regression for non-negative sparse magnitude prediction.",
      "Treat recursive inference as production simulation during validation.",
      "Track zero-demand precision, recall, and F1 separately from aggregate forecast error."
    ],
    implementationDetails: [
      "Lag and rolling features are recomputed step by step during multi-horizon inference.",
      "Rolling validation windows preserve time order and prevent future leakage.",
      "Metric reporting includes WAPE, RMSSE, MAE, RMSE, and classification diagnostics.",
      "Feature computation is organized around product-level daily state updates."
    ],
    lessonsLearned: [
      "Sparse demand forecasting is partly a classification problem.",
      "Validation code has to look like inference code when recursive features are used.",
      "A single metric cannot explain both no-sale decisions and magnitude quality."
    ],
    futureImprovements: [
      "Add probabilistic calibration for sale/no-sale thresholds.",
      "Benchmark hierarchical aggregation across product categories.",
      "Introduce drift monitoring for seasonal product behavior."
    ],
    diagram: "forecasting"
  },
  "ml-pipeline-runtime-optimization": {
    dataset: "Approximately 1 GB of tabular data and 3 million rows flowing through feature engineering and inference steps.",
    technicalDecisions: [
      "Profile first, then optimize the hottest compute paths.",
      "Replace row-level Python operations with vectorized NumPy/Pandas transformations.",
      "Batch repeated feature calculations and remove redundant intermediate frames.",
      "Use parallelism only for independent workloads with clear memory boundaries."
    ],
    implementationDetails: [
      "Converted repeated loops into matrix-oriented operations.",
      "Reduced dataframe copies and temporary object growth.",
      "Moved computation toward C-backed array operations.",
      "Kept output parity checks around key feature columns."
    ],
    lessonsLearned: [
      "Runtime optimization is usually data-layout work before it is model work.",
      "Memory bloat can hide inside convenient dataframe chains.",
      "Small Python operations become expensive when repeated millions of times."
    ],
    futureImprovements: [
      "Add automated profiling snapshots to CI.",
      "Explore Polars or DuckDB for larger-than-memory feature workloads.",
      "Track memory high-water marks in production runs."
    ],
    diagram: "optimization"
  },
  "hybrid-visual-odometry-system": {
    dataset:
      "Frame sequences with motion cues suitable for comparing dense optical flow, feature correspondences, and pose estimation behavior.",
    technicalDecisions: [
      "Keep learned and classic branches independent before selection.",
      "Use branch confidence as a first-class signal rather than a logging artifact.",
      "Compare motion consistency before committing to a final pose estimate."
    ],
    implementationDetails: [
      "RAFT estimates dense optical flow between consecutive frames.",
      "ORB extracts and matches keypoints for a classical pose signal.",
      "A confidence selector routes the stronger prediction into final pose estimation."
    ],
    lessonsLearned: [
      "Hybrid systems are useful when failure modes are complementary.",
      "Confidence estimation matters as much as raw branch accuracy.",
      "Classical CV remains valuable as an interpretable fallback branch."
    ],
    futureImprovements: [
      "Add trajectory-level smoothing and bundle adjustment experiments.",
      "Benchmark selection logic on sequences with motion blur and low texture.",
      "Calibrate branch confidence with held-out scene conditions."
    ],
    diagram: "visual-odometry"
  },
  "whisper-based-speech-nlp-system": {
    dataset:
      "Turkish and English audio inputs with downstream text processing requirements for summarization and analysis.",
    technicalDecisions: [
      "Keep transcription, normalization, summarization, and model adapters modular.",
      "Treat deployment constraints as part of the pipeline design.",
      "Support prompt templates for repeatable NLP outputs."
    ],
    implementationDetails: [
      "Whisper handles speech-to-text on the server side.",
      "Text is normalized before prompt-based summarization.",
      "Hugging Face adapters can be attached for task-specific NLP processing."
    ],
    lessonsLearned: [
      "Speech-to-text quality is only one part of the user-facing workflow.",
      "Language-aware cleanup improves downstream model behavior.",
      "Self-hosting makes observability and customization easier."
    ],
    futureImprovements: [
      "Add diarization for multi-speaker audio.",
      "Introduce async job queues for long transcriptions.",
      "Store transcript versions and prompt outputs for review."
    ],
    diagram: "speech"
  },
  "ai-powered-storytelling-flutter-app": {
    dataset:
      "User-provided video, subtitle selections, uploaded voice samples, and prompt inputs for story generation workflows.",
    technicalDecisions: [
      "Separate parent and child UX flows.",
      "Use Firebase for authentication, storage, and app state.",
      "Keep AI generation behind structured prompt orchestration."
    ],
    implementationDetails: [
      "Flutter owns the cross-platform mobile interface.",
      "Media upload flows collect video, subtitles, and voice inputs.",
      "AI services generate story content and assist with speech-related features."
    ],
    lessonsLearned: [
      "AI product design needs role-aware guardrails.",
      "Media workflows require clear progress and failure states.",
      "Prompt systems benefit from structured user inputs."
    ],
    futureImprovements: [
      "Add moderation and parent approval flows.",
      "Introduce offline drafts and background upload retries.",
      "Evaluate generated content quality with age-aware rubrics."
    ],
    diagram: "mobile"
  }
};
