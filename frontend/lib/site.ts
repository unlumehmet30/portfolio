import type { Profile } from "@/types/content";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const defaultProfile: Profile = {
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

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" }
];
