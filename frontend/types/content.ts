export type ApiEnvelope<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        message: string;
        code: string;
      };
    };

export type Profile = {
  id?: number;
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
};

export type Metric = {
  label: string;
  value: string;
  context: string;
};

export type CaseStudy = {
  dataset: string;
  technicalDecisions: string[];
  implementationDetails: string[];
  lessonsLearned: string[];
  futureImprovements: string[];
  diagram: "forecasting" | "optimization" | "visual-odometry" | "speech" | "mobile";
};

export type ProjectImage = {
  id?: number;
  url: string;
  alt?: string | null;
  sortOrder?: number;
  createdAt?: string;
};

export type PostType = "blog" | "course-note" | "visual-note" | "cheatsheet";

export type PostImage = {
  id?: number;
  url: string;
  alt?: string | null;
  sortOrder?: number;
  createdAt?: string;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  challenge: string;
  architecture: string;
  results: string;
  tags: string[];
  metrics: Metric[];
  imageUrl?: string | null;
  galleryImages: ProjectImage[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  caseStudy: CaseStudy | null;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  type: PostType;
  tags: string[];
  coverImageUrl?: string | null;
  images: PostImage[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Resume = {
  summary: string;
  experience: Array<{
    role: string;
    organization: string;
    period: string;
    highlights: string[];
  }>;
  projects: string[];
  education: Array<{
    degree: string;
    school: string;
    period: string;
  }>;
  skills: string[];
  tools: string[];
  researchInterests?: string[];
  certifications?: string[];
  contact: {
    email: string;
    githubUrl: string;
    linkedinUrl: string;
  };
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  companyWebsite?: string;
  formStartedAt?: number;
};

export type ContactMessage = ContactPayload & {
  id: number;
  archived: boolean;
  handledAt: string | null;
  lastReminderAt: string | null;
  reminderCount: number;
  createdAt: string;
};

export type AdminSession = {
  token: string;
  user: {
    username: string;
    role: "admin";
  };
};
