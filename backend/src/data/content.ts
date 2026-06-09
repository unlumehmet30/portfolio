export type SeedMetric = {
  label: string;
  value: string;
  context: string;
};

export type SeedProject = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  challenge: string;
  architecture: string;
  results: string;
  tags: string[];
  metrics: SeedMetric[];
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
};

export const profile = {
  name: "Mehmet Ünlü",
  title: "Electronics & Communication Engineering Student",
  bio:
    "I study Electronics and Communication Engineering at ITU and build hands-on projects around forecasting, computer vision, and making data workflows faster.",
  location: "Istanbul, Türkiye",
  email: "unlu.mehmett1@gmail.com",
  githubUrl: "https://github.com/unlumehmet30",
  linkedinUrl: "https://www.linkedin.com/in/unlumehmett1",
  resumeUrl: "/resume.pdf"
};

export const projects: SeedProject[] = [
  {
    title: "Intermittent Demand Forecasting System",
    slug: "intermittent-demand-forecasting-system",
    summary:
      "A two-stage machine learning system for intermittent demand forecasting on daily product-level sales data.",
    description:
      "Designed a production-oriented forecasting workflow for sparse product demand, combining sale/no-sale classification with magnitude regression and recursive multi-step inference.",
    problem:
      "Daily product demand was dominated by zero-sales records, making direct regression unstable and difficult to validate without leakage.",
    challenge:
      "The core challenge was preserving temporal integrity while forecasting many product horizons recursively across rolling validation windows.",
    architecture:
      "Stage 1 predicts sale probability with binary classification. Stage 2 estimates conditional sales magnitude using LightGBM Tweedie regression. The recursive inference loop feeds prior predictions into lag and rolling features.",
    results:
      "The system produced interpretable demand/no-demand decisions, tracked WAPE and RMSSE across rolling windows, and separated zero-demand precision/recall from magnitude error.",
    tags: [
      "Forecasting",
      "LightGBM",
      "Tweedie",
      "Recursive Inference",
      "Leakage-Free Validation",
      "Time Series"
    ],
    metrics: [
      { label: "Products", value: "20k", context: "Daily item-level series" },
      { label: "History", value: "3 yrs", context: "Rolling temporal windows" },
      { label: "Zero demand", value: "85%", context: "Sparse target records" },
      { label: "Metrics", value: "WAPE / RMSSE", context: "Forecast quality" }
    ],
    githubUrl: "https://github.com/mehmetunlu/intermittent-demand-forecasting",
    featured: true
  },
  {
    title: "ML Pipeline Runtime Optimization",
    slug: "ml-pipeline-runtime-optimization",
    summary:
      "Optimized a large-scale ML feature engineering and inference pipeline by reducing unnecessary computation, memory bloat, and Python-level bottlenecks.",
    description:
      "Refactored a feature-heavy ML pipeline around vectorized operations, matrix-based computation, and memory-aware transformations.",
    problem:
      "Pipeline runtime and memory pressure made iteration slow, expensive, and difficult to scale for production-like data sizes.",
    challenge:
      "The pipeline mixed repeated dataframe operations, Python loops, redundant intermediate objects, and compute paths that did not match the shape of the data.",
    architecture:
      "The optimized workflow batches feature transforms, replaces row-wise loops with NumPy/Pandas vectorization, parallelizes independent computation, and controls temporary allocations.",
    results:
      "Runtime was reduced from 40 minutes to 4 minutes on roughly 1 GB and 3 million rows while keeping the modeling behavior intact.",
    tags: ["Optimization", "NumPy", "Pandas", "Vectorization", "Parallelism", "ML Systems"],
    metrics: [
      { label: "Runtime", value: "40m -> 4m", context: "End-to-end pipeline" },
      { label: "Rows", value: "3M", context: "Feature computation scale" },
      { label: "Data", value: "~1 GB", context: "Tabular workload" },
      { label: "Speedup", value: "10x", context: "Iteration velocity" }
    ],
    featured: true
  },
  {
    title: "Hybrid Visual Odometry System",
    slug: "hybrid-visual-odometry-system",
    summary:
      "A confidence-aware visual odometry system combining deep learning-based optical flow and classic computer vision.",
    description:
      "Explored a two-headed visual odometry architecture that combines RAFT optical flow with an ORB-based classical branch and a confidence selector.",
    problem:
      "Single-method visual odometry can degrade under domain shifts, texture changes, motion blur, and uncertain optical flow estimates.",
    challenge:
      "The system needed a practical decision mechanism that could choose between learned flow and classical features without treating either branch as always reliable.",
    architecture:
      "A RAFT branch estimates dense motion, an ORB branch computes feature-based pose signals, and a confidence-aware selector chooses the final pose estimate.",
    results:
      "The hybrid structure creates a controlled research path for comparing branch confidence, motion consistency, and final trajectory stability.",
    tags: ["Computer Vision", "RAFT", "ORB", "Visual Odometry", "Hybrid AI"],
    metrics: [
      { label: "Branches", value: "2", context: "RAFT + ORB" },
      { label: "Selector", value: "Confidence", context: "Prediction routing" },
      { label: "Output", value: "Pose", context: "Trajectory estimation" }
    ],
    featured: true
  },
  {
    title: "Whisper-Based Speech & NLP System",
    slug: "whisper-based-speech-nlp-system",
    summary:
      "A self-hosted speech transcription and text processing system using Whisper and NLP models.",
    description:
      "Built a server-side speech and text pipeline around Whisper transcription, prompt-based summarization, and Hugging Face model integration.",
    problem:
      "Speech workflows often depend on external SaaS layers, making local experimentation, privacy-aware deployment, and custom text processing harder.",
    challenge:
      "The system had to support Turkish and English inputs while keeping transcription, summarization, and downstream NLP steps modular.",
    architecture:
      "Audio enters a Whisper transcription stage, passes into language-aware text normalization, then flows into prompt-based summarization and optional model adapters.",
    results:
      "The pipeline creates a foundation for local/server-side speech-to-text workflows with extensible NLP post-processing.",
    tags: ["Whisper", "NLP", "Hugging Face", "Speech-to-Text", "Self-Hosted AI"],
    metrics: [
      { label: "Languages", value: "TR / EN", context: "Speech support" },
      { label: "Pipeline", value: "STT + NLP", context: "Audio to text insights" },
      { label: "Deploy", value: "Self-hosted", context: "Server-side focus" }
    ],
    featured: false
  },
  {
    title: "AI-Powered Storytelling / Flutter App",
    slug: "ai-powered-storytelling-flutter-app",
    summary:
      "A mobile application concept for children and parents using AI-powered storytelling, video, subtitles, and voice processing.",
    description:
      "Designed a Flutter and Firebase application concept that combines parent/child flows, media upload, subtitles, voice processing, and prompt-based AI generation.",
    problem:
      "Family-oriented storytelling tools need safe flows for parents, understandable content for children, and flexible multimedia generation.",
    challenge:
      "The product concept has to coordinate mobile UX, Firebase-backed storage, uploaded media, prompt orchestration, and speech processing.",
    architecture:
      "Flutter handles the mobile interface, Firebase manages authentication and media state, and AI services provide story generation, subtitle handling, and voice processing.",
    results:
      "The app concept defines a practical architecture for AI-assisted multimedia storytelling with clear user roles and extensible content workflows.",
    tags: ["Flutter", "Firebase", "AI Product", "Speech Processing", "Mobile"],
    metrics: [
      { label: "Roles", value: "Parent / Child", context: "Separated UX" },
      { label: "Media", value: "Video + Voice", context: "Upload workflows" },
      { label: "AI", value: "Prompts", context: "Generated content" }
    ],
    featured: false
  }
];

export const posts = [
  {
    title: "Avoiding Data Leakage in Recursive Forecasting",
    slug: "avoiding-data-leakage-in-recursive-forecasting",
    excerpt:
      "A practical note on preserving temporal integrity when lagged features depend on previous predictions.",
    content:
      "Recursive forecasting breaks quickly when validation features accidentally see the future. A leakage-free setup recomputes lag and rolling features at each horizon step using only observed history and prior predictions.\n\nThe safest mental model is to treat validation like production: every feature must be available at the exact timestamp where the prediction is made.",
    tags: ["Forecasting", "Validation", "ML Systems"],
    published: true
  },
  {
    title: "Why WAPE Alone Can Be Misleading",
    slug: "why-wape-alone-can-be-misleading",
    excerpt:
      "WAPE is useful, but sparse demand and high zero ratios can hide important failure modes.",
    content:
      "WAPE summarizes aggregate absolute error, but it can underexpose no-sale classification behavior in intermittent demand. Pairing WAPE with RMSSE, MAE, RMSE, and zero-demand precision/recall gives a more complete view.\n\nThe goal is not one perfect metric; it is a metric set that reflects the real business and modeling risks.",
    tags: ["Metrics", "Forecasting"],
    published: true
  },
  {
    title: "Two-Stage Modeling for Intermittent Demand",
    slug: "two-stage-modeling-for-intermittent-demand",
    excerpt:
      "Separating sale occurrence from sale magnitude can make sparse forecasting systems easier to reason about.",
    content:
      "A two-stage demand model first estimates whether a sale will happen, then estimates the magnitude conditional on sale. This separation gives clearer diagnostics when most rows are zero.\n\nIt also lets the model optimize different objectives for occurrence and amount, which is often useful in product-level daily data.",
    tags: ["Intermittent Demand", "LightGBM"],
    published: true
  },
  {
    title: "Vectorization vs Python Loops in ML Pipelines",
    slug: "vectorization-vs-python-loops-in-ml-pipelines",
    excerpt:
      "The fastest pipeline improvement is often moving repeated Python-level work into vectorized array operations.",
    content:
      "Python loops are easy to write, but expensive in large feature pipelines. NumPy and Pandas vectorization move computation closer to optimized C-level paths and reduce interpreter overhead.\n\nThe best optimization work starts with profiling, then removes repeated allocations and row-wise operations from the hottest path.",
    tags: ["Optimization", "NumPy", "Pandas"],
    published: true
  },
  {
    title: "Hybrid Visual Odometry: RAFT + ORB",
    slug: "hybrid-visual-odometry-raft-orb",
    excerpt:
      "A confidence selector can turn deep and classical visual odometry branches into a more robust research architecture.",
    content:
      "RAFT provides dense optical flow, while ORB provides a classic feature-based signal. A hybrid visual odometry system can compare confidence and consistency across both branches before selecting a pose estimate.\n\nThe interesting engineering problem is not just model accuracy; it is deciding when each branch should be trusted.",
    tags: ["Computer Vision", "Visual Odometry"],
    published: true
  },
  {
    title: "Building Self-Hosted Whisper Pipelines",
    slug: "building-self-hosted-whisper-pipelines",
    excerpt:
      "Whisper becomes more useful when transcription is treated as one stage in a larger NLP system.",
    content:
      "A self-hosted Whisper pipeline can handle transcription, language-aware cleanup, summarization, and task-specific NLP adapters. Keeping stages modular makes the system easier to deploy and improve.\n\nFor Turkish and English workflows, explicit language handling and prompt templates help keep downstream outputs more predictable.",
    tags: ["Whisper", "NLP", "Deployment"],
    published: true
  }
];
