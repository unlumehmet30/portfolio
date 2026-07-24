"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Crop,
  FileText,
  Inbox,
  Layers3,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  UserRound
} from "lucide-react";
import { adminTokenKey } from "@/components/AdminLoginForm";
import { ImageCropperModal } from "@/components/ImageCropperModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  apiBaseUrl,
  createAdminPost,
  createAdminProject,
  deleteAdminContactMessage,
  deleteAdminPost,
  deleteAdminProject,
  getAdminContactMessages,
  getAdminMe,
  getAdminPosts,
  getAdminProfile,
  getAdminProjects,
  getAdminResume,
  markAdminContactMessageHandled,
  uploadAdminPostFile,
  uploadAdminPostImage,
  uploadAdminProjectImage,
  updateAdminPost,
  updateAdminProfile,
  updateAdminProject,
  updateAdminResume
} from "@/lib/api";
import { defaultProfile } from "@/lib/site";
import type { ContactMessage, Metric, Post, PostFile, PostFileType, PostImage, PostType, Profile, Project, ProjectImage, Resume } from "@/types/content";

type TabKey = "profile" | "projects" | "posts" | "resume" | "contacts";

type ProjectDraft = Omit<Project, "id" | "createdAt" | "updatedAt" | "caseStudy"> & {
  id?: number;
};

type PostDraft = Omit<Post, "id" | "createdAt" | "updatedAt"> & {
  id?: number;
};

type CropDestination = "project-cover" | "project-gallery" | "post-cover" | "post-gallery";

type PendingCrop = {
  allowOriginalUpload?: boolean;
  destination: CropDestination;
  file: File;
  id: string;
  initialAspectRatio: number;
  initialZoom: number;
  replaceIndex?: number;
  title: string;
};

const tabs: Array<{ key: TabKey; label: string; icon: typeof UserRound }> = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "projects", label: "Projects", icon: Layers3 },
  { key: "posts", label: "Notes", icon: FileText },
  { key: "resume", label: "Resume", icon: Save },
  { key: "contacts", label: "Messages", icon: Inbox }
];

const noteTypes: Array<{ value: PostType; label: string }> = [
  { value: "blog", label: "Blog" },
  { value: "course-note", label: "Course note" },
  { value: "visual-note", label: "Visual note" },
  { value: "cheatsheet", label: "Cheat sheet" }
];

const emptyProject: ProjectDraft = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  problem: "",
  challenge: "",
  architecture: "",
  results: "",
  tags: [],
  metrics: [],
  imageUrl: "",
  galleryImages: [],
  githubUrl: "",
  demoUrl: "",
  featured: false
};

const emptyPost: PostDraft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  type: "blog",
  tags: [],
  coverImageUrl: "",
  images: [],
  files: [],
  published: true
};

function tagsToText(tags: string[]) {
  return tags.join(", ");
}

function textToTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function metricsToText(metrics: Metric[]) {
  return metrics.map((metric) => `${metric.label} | ${metric.value} | ${metric.context}`).join("\n");
}

function textToMetrics(value: string): Metric[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", metricValue = "", context = ""] = line.split("|").map((part) => part.trim());
      return { label, value: metricValue, context };
    })
    .filter((metric) => metric.label && metric.value && metric.context);
}

function normalizeGalleryImages(images: ProjectImage[]) {
  return images
    .filter((image) => image.url.trim())
    .map((image, index) => ({
      ...image,
      url: image.url.trim(),
      alt: image.alt?.trim() || null,
      sortOrder: index
    }));
}

function normalizePostImages(images: PostImage[]) {
  return images
    .filter((image) => image.url.trim())
    .map((image, index) => ({
      ...image,
      url: image.url.trim(),
      alt: image.alt?.trim() || null,
      sortOrder: index
    }));
}

function normalizePostFiles(files: PostFile[]) {
  return files
    .filter((file) => file.url.trim() && file.title.trim())
    .map((file, index) => ({
      ...file,
      title: file.title.trim(),
      url: file.url.trim(),
      fileType: file.fileType,
      mimeType: file.mimeType.trim() || (file.fileType === "pdf" ? "application/pdf" : "text/html"),
      sizeBytes: Number.isFinite(file.sizeBytes) ? file.sizeBytes : 0,
      sortOrder: index
    }));
}

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "size unknown";
  }

  if (value < 1024 * 1024) {
    return `${Math.max(1, Math.round(value / 1024))} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function fileNameFromImageUrl(url: string, fallback: string) {
  try {
    const { pathname } = new URL(url, window.location.origin);
    const fileName = decodeURIComponent(pathname.split("/").filter(Boolean).pop() ?? "");

    if (fileName) {
      return fileName;
    }
  } catch {
    // Use the fallback name below when the URL is malformed.
  }

  return `${fallback.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image"}.jpg`;
}

function resolveImageFetchUrl(url: string) {
  if (!url.startsWith("/api/")) {
    return url;
  }

  try {
    return `${new URL(apiBaseUrl).origin}${url}`;
  } catch {
    return url;
  }
}

function Field({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {multiline ? (
        <Textarea value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <Input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function AdminShell({
  activeTab,
  setActiveTab,
  onLogout,
  onRefresh,
  children,
  status
}: {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  onLogout: () => void;
  onRefresh: () => void;
  children: ReactNode;
  status: string;
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold">Portfolio Admin</h1>
          <p className="mt-3 text-muted-foreground">Edit content, publish notes, and review contact messages.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onRefresh}>
            <RefreshCw size={17} />
            Refresh
          </Button>
          <Button type="button" variant="secondary" onClick={onLogout}>
            <LogOut size={17} />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm transition ${
                  activeTab === tab.key
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </Card>

        <div>
          {status ? (
            <div className="mb-4 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground" role="status">
              {status}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [status, setStatus] = useState("Loading admin session...");
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [resumeJson, setResumeJson] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>(emptyProject);
  const [projectTags, setProjectTags] = useState("");
  const [projectMetrics, setProjectMetrics] = useState("");
  const [projectImageUploading, setProjectImageUploading] = useState(false);
  const [projectGalleryUploading, setProjectGalleryUploading] = useState(false);
  const [postDraft, setPostDraft] = useState<PostDraft>(emptyPost);
  const [postTags, setPostTags] = useState("");
  const [postCoverUploading, setPostCoverUploading] = useState(false);
  const [postGalleryUploading, setPostGalleryUploading] = useState(false);
  const [postFileUploading, setPostFileUploading] = useState(false);
  const [pendingCrops, setPendingCrops] = useState<PendingCrop[]>([]);
  const [cropProcessing, setCropProcessing] = useState(false);

  const selectedProjectTitle = useMemo(
    () => (projectDraft.id ? `Editing #${projectDraft.id}` : "New project"),
    [projectDraft.id]
  );
  const selectedPostTitle = useMemo(() => (postDraft.id ? `Editing #${postDraft.id}` : "New note"), [postDraft.id]);
  const activeMessages = useMemo(() => messages.filter((message) => !message.archived), [messages]);
  const archivedMessages = useMemo(() => messages.filter((message) => message.archived), [messages]);
  const activeCrop = pendingCrops[0] ?? null;

  const loadData = useCallback(async (activeToken: string) => {
    if (!activeToken) return;

    setStatus("Loading admin data...");
    try {
      await getAdminMe(activeToken);
      const [profileData, projectData, postData, resumeData, messageData] = await Promise.all([
        getAdminProfile(activeToken),
        getAdminProjects(activeToken),
        getAdminPosts(activeToken),
        getAdminResume(activeToken),
        getAdminContactMessages(activeToken)
      ]);

      setProfile(profileData ?? defaultProfile);
      setProjects(projectData);
      setPosts(postData);
      setResumeJson(JSON.stringify(resumeData, null, 2));
      setMessages(messageData);
      setStatus("Admin data loaded.");
    } catch (error) {
      window.sessionStorage.removeItem(adminTokenKey);
      setStatus(error instanceof Error ? error.message : "Admin session failed.");
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem(adminTokenKey);
    if (!storedToken) {
      router.push("/admin/login");
      return;
    }

    setToken(storedToken);
    void loadData(storedToken);
  }, [loadData, router]);

  function logout() {
    window.sessionStorage.removeItem(adminTokenKey);
    router.push("/admin/login");
  }

  function setDestinationUploading(destination: CropDestination, value: boolean) {
    if (destination === "project-cover") {
      setProjectImageUploading(value);
      return;
    }

    if (destination === "project-gallery") {
      setProjectGalleryUploading(value);
      return;
    }

    if (destination === "post-cover") {
      setPostCoverUploading(value);
      return;
    }

    setPostGalleryUploading(value);
  }

  function finishCropRequest(request: PendingCrop, nextStatus: string) {
    const remainingCrops = pendingCrops.slice(1);

    setPendingCrops(remainingCrops);
    if (!remainingCrops.some((crop) => crop.destination === request.destination)) {
      setDestinationUploading(request.destination, false);
    }
    setStatus(nextStatus);
  }

  function queueCropUploads(
    files: File[],
    destination: CropDestination,
    initialAspectRatio: number,
    title: string,
    options: { allowOriginalUpload?: boolean; initialZoom?: number; replaceIndex?: number; status?: string } = {}
  ) {
    if (!files.length) return;

    setDestinationUploading(destination, true);
    setPendingCrops((queue) => [
      ...queue,
      ...files.map((file, index) => ({
        destination,
        file,
        id: `${destination}-${file.name}-${file.lastModified}-${index}`,
        allowOriginalUpload: options.allowOriginalUpload ?? true,
        initialAspectRatio,
        initialZoom: options.initialZoom ?? 1,
        replaceIndex: files.length === 1 ? options.replaceIndex : undefined,
        title: files.length > 1 ? `${title} (${index + 1}/${files.length})` : title
      }))
    ]);
    setStatus(options.status ?? "Crop the selected image before upload.");
  }

  async function loadExistingImageFile(url: string, title: string) {
    const response = await fetch(resolveImageFetchUrl(url), {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Existing image could not be loaded for cropping.");
    }

    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
      throw new Error("Existing file is not an image.");
    }

    return new File([blob], fileNameFromImageUrl(url, title), {
      type: blob.type
    });
  }

  async function cropExistingImage(
    url: string,
    destination: CropDestination,
    initialAspectRatio: number,
    title: string,
    replaceIndex?: number
  ) {
    if (!url.trim()) return;

    setDestinationUploading(destination, true);
    setStatus("Loading existing image for cropping...");

    try {
      const file = await loadExistingImageFile(url, title);
      queueCropUploads([file], destination, initialAspectRatio, title, {
        allowOriginalUpload: false,
        initialZoom: 1,
        replaceIndex,
        status: "Crop the existing image before upload."
      });
    } catch (error) {
      setDestinationUploading(destination, false);
      setStatus(error instanceof Error ? error.message : "Existing image could not be loaded for cropping.");
    }
  }

  async function uploadPreparedImage(request: PendingCrop, file: File) {
    if (request.destination === "project-cover") {
      const { imageUrl } = await uploadAdminProjectImage(token, file);
      setProjectDraft((draft) => ({
        ...draft,
        imageUrl
      }));
      return;
    }

    if (request.destination === "project-gallery") {
      const { imageUrl } = await uploadAdminProjectImage(token, file);
      setProjectDraft((draft) => {
        const existingImages = draft.galleryImages ?? [];
        if (request.replaceIndex !== undefined) {
          const nextImages = [...existingImages];
          const previousImage = nextImages[request.replaceIndex];

          if (!previousImage) {
            return draft;
          }

          nextImages[request.replaceIndex] = {
            ...previousImage,
            url: imageUrl
          };

          return {
            ...draft,
            galleryImages: normalizeGalleryImages(nextImages)
          };
        }

        const nextImage = {
          url: imageUrl,
          alt: draft.title ? `${draft.title} screenshot ${existingImages.length + 1}` : null,
          sortOrder: existingImages.length
        };

        return {
          ...draft,
          galleryImages: normalizeGalleryImages([...existingImages, nextImage])
        };
      });
      return;
    }

    if (request.destination === "post-cover") {
      const { imageUrl } = await uploadAdminPostImage(token, file);
      setPostDraft((draft) => ({
        ...draft,
        coverImageUrl: imageUrl
      }));
      return;
    }

    const { imageUrl } = await uploadAdminPostImage(token, file);
    setPostDraft((draft) => {
      const existingImages = draft.images ?? [];
      if (request.replaceIndex !== undefined) {
        const nextImages = [...existingImages];
        const previousImage = nextImages[request.replaceIndex];

        if (!previousImage) {
          return draft;
        }

        nextImages[request.replaceIndex] = {
          ...previousImage,
          url: imageUrl
        };

        return {
          ...draft,
          images: normalizePostImages(nextImages)
        };
      }

      const nextImage = {
        url: imageUrl,
        alt: draft.title ? `${draft.title} visual ${existingImages.length + 1}` : null,
        sortOrder: existingImages.length
      };

      return {
        ...draft,
        images: normalizePostImages([...existingImages, nextImage])
      };
    });
  }

  async function uploadCurrentCrop(file: File, useOriginal = false) {
    if (!activeCrop) return;

    setCropProcessing(true);
    setStatus(useOriginal ? "Uploading original image..." : "Uploading cropped image...");

    try {
      await uploadPreparedImage(activeCrop, file);
      finishCropRequest(activeCrop, "Image uploaded. Save the content to keep it.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setCropProcessing(false);
    }
  }

  function skipCurrentCrop() {
    if (!activeCrop || cropProcessing) return;
    finishCropRequest(activeCrop, "Image skipped.");
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving profile...");
    const updated = await updateAdminProfile(token, profile);
    setProfile(updated);
    setStatus("Profile saved.");
  }

  function editProject(project: Project) {
    setProjectDraft({
      id: project.id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      problem: project.problem,
      challenge: project.challenge,
      architecture: project.architecture,
      results: project.results,
      tags: project.tags,
      metrics: project.metrics,
      imageUrl: project.imageUrl ?? "",
      galleryImages: project.galleryImages ?? [],
      githubUrl: project.githubUrl ?? "",
      demoUrl: project.demoUrl ?? "",
      featured: project.featured
    });
    setProjectTags(tagsToText(project.tags));
    setProjectMetrics(metricsToText(project.metrics));
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving project...");
    const payload = {
      ...projectDraft,
      tags: textToTags(projectTags),
      metrics: textToMetrics(projectMetrics),
      imageUrl: projectDraft.imageUrl || null,
      galleryImages: normalizeGalleryImages(projectDraft.galleryImages ?? []),
      githubUrl: projectDraft.githubUrl || null,
      demoUrl: projectDraft.demoUrl || null
    };

    try {
      if (projectDraft.id) {
        await updateAdminProject(token, projectDraft.id, payload);
      } else {
        await createAdminProject(token, payload);
      }

      setProjectDraft(emptyProject);
      setProjectTags("");
      setProjectMetrics("");
      await loadData(token);
      setStatus("Project saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Project save failed.");
    }
  }

  function uploadProjectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    queueCropUploads([file], "project-cover", 16 / 9, "Project cover");
    event.target.value = "";
  }

  function uploadProjectGalleryImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    queueCropUploads(files, "project-gallery", 16 / 9, "Project gallery image");
    event.target.value = "";
  }

  function updateProjectGalleryImage(index: number, patch: Partial<ProjectImage>) {
    setProjectDraft((draft) => ({
      ...draft,
      galleryImages: (draft.galleryImages ?? []).map((image, imageIndex) =>
        imageIndex === index ? { ...image, ...patch } : image
      )
    }));
  }

  function removeProjectGalleryImage(index: number) {
    setProjectDraft((draft) => ({
      ...draft,
      galleryImages: normalizeGalleryImages((draft.galleryImages ?? []).filter((_, imageIndex) => imageIndex !== index))
    }));
  }

  function moveProjectGalleryImage(index: number, direction: -1 | 1) {
    setProjectDraft((draft) => {
      const images = [...(draft.galleryImages ?? [])];
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= images.length) {
        return draft;
      }

      [images[index], images[nextIndex]] = [images[nextIndex], images[index]];

      return {
        ...draft,
        galleryImages: normalizeGalleryImages(images)
      };
    });
  }

  async function removeProject(id: number) {
    if (!window.confirm("Delete this project?")) return;
    await deleteAdminProject(token, id);
    await loadData(token);
    setStatus("Project deleted.");
  }

  function editPost(post: Post) {
    setPostDraft({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      type: post.type,
      tags: post.tags,
      coverImageUrl: post.coverImageUrl ?? "",
      images: post.images ?? [],
      files: post.files ?? [],
      published: post.published
    });
    setPostTags(tagsToText(post.tags));
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving note...");
    const payload = {
      ...postDraft,
      tags: textToTags(postTags),
      coverImageUrl: postDraft.coverImageUrl || null,
      images: normalizePostImages(postDraft.images ?? []),
      files: normalizePostFiles(postDraft.files ?? [])
    };

    try {
      if (postDraft.id) {
        await updateAdminPost(token, postDraft.id, payload);
      } else {
        await createAdminPost(token, payload);
      }

      setPostDraft(emptyPost);
      setPostTags("");
      await loadData(token);
      setStatus("Note saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Note save failed.");
    }
  }

  function uploadPostCoverImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    queueCropUploads([file], "post-cover", 2, "Note cover");
    event.target.value = "";
  }

  function uploadPostGalleryImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    queueCropUploads(files, "post-gallery", 16 / 9, "Note image");
    event.target.value = "";
  }

  function updatePostImage(index: number, patch: Partial<PostImage>) {
    setPostDraft((draft) => ({
      ...draft,
      images: (draft.images ?? []).map((image, imageIndex) =>
        imageIndex === index ? { ...image, ...patch } : image
      )
    }));
  }

  function removePostImage(index: number) {
    setPostDraft((draft) => ({
      ...draft,
      images: normalizePostImages((draft.images ?? []).filter((_, imageIndex) => imageIndex !== index))
    }));
  }

  function movePostImage(index: number, direction: -1 | 1) {
    setPostDraft((draft) => {
      const images = [...(draft.images ?? [])];
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= images.length) {
        return draft;
      }

      [images[index], images[nextIndex]] = [images[nextIndex], images[index]];

      return {
        ...draft,
        images: normalizePostImages(images)
      };
    });
  }

  async function uploadPostFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setPostFileUploading(true);
    setStatus(files.length > 1 ? "Uploading note files..." : "Uploading note file...");

    try {
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const response = await uploadAdminPostFile(token, file);
          return response;
        })
      );
      const uploadedFiles = uploadResults.map((result) => result.file);
      const convertedMarkdown = uploadResults
        .map((result) => result.markdown?.trim())
        .filter((markdown): markdown is string => Boolean(markdown))
        .join("\n\n---\n\n");
      const shouldImportMarkdown = convertedMarkdown
        ? window.confirm("HTML file converted to Markdown. Add the converted content to the note body?")
        : false;

      setPostDraft((draft) => {
        const existingFiles = draft.files ?? [];
        const nextContent = shouldImportMarkdown
          ? [draft.content.trim(), convertedMarkdown].filter(Boolean).join("\n\n")
          : draft.content;

        return {
          ...draft,
          content: nextContent,
          files: normalizePostFiles([...existingFiles, ...uploadedFiles])
        };
      });
      setStatus(shouldImportMarkdown
        ? "Note file uploaded and converted Markdown was added. Save the note to keep it."
        : "Note file uploaded. Save the note to keep it.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Note file upload failed.");
    } finally {
      setPostFileUploading(false);
      event.target.value = "";
    }
  }

  function updatePostFile(index: number, patch: Partial<PostFile>) {
    setPostDraft((draft) => ({
      ...draft,
      files: (draft.files ?? []).map((file, fileIndex) =>
        fileIndex === index ? { ...file, ...patch } : file
      )
    }));
  }

  function removePostFile(index: number) {
    setPostDraft((draft) => ({
      ...draft,
      files: normalizePostFiles((draft.files ?? []).filter((_, fileIndex) => fileIndex !== index))
    }));
  }

  function movePostFile(index: number, direction: -1 | 1) {
    setPostDraft((draft) => {
      const files = [...(draft.files ?? [])];
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= files.length) {
        return draft;
      }

      [files[index], files[nextIndex]] = [files[nextIndex], files[index]];

      return {
        ...draft,
        files: normalizePostFiles(files)
      };
    });
  }

  async function removePost(id: number) {
    if (!window.confirm("Delete this note?")) return;
    await deleteAdminPost(token, id);
    await loadData(token);
    setStatus("Note deleted.");
  }

  async function saveResume(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving resume...");
    const parsed = JSON.parse(resumeJson) as Resume;
    const updated = await updateAdminResume(token, parsed);
    setResumeJson(JSON.stringify(updated, null, 2));
    setStatus("Resume saved.");
  }

  async function removeMessage(id: number) {
    await deleteAdminContactMessage(token, id);
    await loadData(token);
    setStatus("Message deleted.");
  }

  async function markMessageHandled(id: number) {
    setStatus("Archiving message...");
    await markAdminContactMessageHandled(token, id);
    await loadData(token);
    setStatus("Message marked as handled and archived.");
  }

  return (
    <>
      <AdminShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        onRefresh={() => void loadData(token)}
        status={status}
      >
      {activeTab === "profile" ? (
        <Card className="p-5">
          <form onSubmit={saveProfile} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" value={profile.name} onChange={(value) => setProfile({ ...profile, name: value })} />
              <Field label="Title" value={profile.title} onChange={(value) => setProfile({ ...profile, title: value })} />
              <Field label="Location" value={profile.location} onChange={(value) => setProfile({ ...profile, location: value })} />
              <Field label="Email" value={profile.email} onChange={(value) => setProfile({ ...profile, email: value })} />
              <Field label="GitHub URL" value={profile.githubUrl} onChange={(value) => setProfile({ ...profile, githubUrl: value })} />
              <Field label="LinkedIn URL" value={profile.linkedinUrl} onChange={(value) => setProfile({ ...profile, linkedinUrl: value })} />
            </div>
            <Field label="Resume URL" value={profile.resumeUrl} onChange={(value) => setProfile({ ...profile, resumeUrl: value })} />
            <Field label="Bio" value={profile.bio} onChange={(value) => setProfile({ ...profile, bio: value })} multiline />
            <Button type="submit" className="w-fit">
              <Save size={17} />
              Save profile
            </Button>
          </form>
        </Card>
      ) : null}

      {activeTab === "projects" ? (
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{selectedProjectTitle}</h2>
              <Button type="button" variant="outline" onClick={() => { setProjectDraft(emptyProject); setProjectTags(""); setProjectMetrics(""); }}>
                <Plus size={17} />
                New
              </Button>
            </div>
            <form onSubmit={saveProject} className="grid gap-4">
              <Field label="Title" value={projectDraft.title} onChange={(value) => setProjectDraft({ ...projectDraft, title: value })} />
              <Field label="Slug" value={projectDraft.slug} onChange={(value) => setProjectDraft({ ...projectDraft, slug: value })} />
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <Field label="Image URL" value={projectDraft.imageUrl ?? ""} onChange={(value) => setProjectDraft({ ...projectDraft, imageUrl: value })} />
                <label className="block space-y-2 text-sm">
                  <span className="text-muted-foreground">Upload image</span>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={projectImageUploading}
                    onChange={(event) => void uploadProjectImage(event)}
                  />
                </label>
              </div>
              {projectDraft.imageUrl ? (
                <div className="relative overflow-hidden rounded-md border border-border bg-muted">
                  {projectDraft.imageUrl.startsWith("/") ? (
                    <>
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={projectDraft.imageUrl}
                          alt="Project image preview"
                          fill
                          sizes="(min-width: 1280px) 420px, 100vw"
                          unoptimized={projectDraft.imageUrl.startsWith("/api/uploads/")}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex justify-end border-t border-border bg-card p-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={projectImageUploading}
                          onClick={() =>
                            void cropExistingImage(projectDraft.imageUrl ?? "", "project-cover", 16 / 9, "Project cover")
                          }
                        >
                          <Crop size={15} />
                          Crop current image
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-xs text-muted-foreground">
                      External image URL set. Preview is shown after saving if the domain is allowed.
                    </div>
                  )}
                </div>
              ) : null}
              <div className="grid gap-3 border-t border-border pt-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <label className="block min-w-[220px] flex-1 space-y-2 text-sm">
                    <span className="text-muted-foreground">Gallery images</span>
                    <Input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={projectGalleryUploading}
                      onChange={(event) => void uploadProjectGalleryImages(event)}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {(projectDraft.galleryImages ?? []).length} image{(projectDraft.galleryImages ?? []).length === 1 ? "" : "s"}
                  </p>
                </div>
                {(projectDraft.galleryImages ?? []).length ? (
                  <div className="grid gap-3">
                    {(projectDraft.galleryImages ?? []).map((image, index) => (
                      <div key={`${image.url}-${index}`} className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-[150px_1fr]">
                        <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                          {image.url.startsWith("/") ? (
                            <Image
                              src={image.url}
                              alt={image.alt || "Gallery image preview"}
                              fill
                              sizes="150px"
                              unoptimized={image.url.startsWith("/api/uploads/")}
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
                              External image
                            </div>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Input
                            value={image.url}
                            onChange={(event) => updateProjectGalleryImage(index, { url: event.target.value })}
                            aria-label={`Gallery image ${index + 1} URL`}
                          />
                          <Input
                            value={image.alt ?? ""}
                            onChange={(event) => updateProjectGalleryImage(index, { alt: event.target.value })}
                            aria-label={`Gallery image ${index + 1} alt text`}
                            placeholder="Alt text"
                          />
                          <div className="flex flex-wrap gap-2">
                            {image.url.startsWith("/") ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={projectGalleryUploading}
                                onClick={() =>
                                  void cropExistingImage(
                                    image.url,
                                    "project-gallery",
                                    16 / 9,
                                    `Project gallery image ${index + 1}`,
                                    index
                                  )
                                }
                              >
                                <Crop size={15} />
                                Crop
                              </Button>
                            ) : null}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setProjectDraft({ ...projectDraft, imageUrl: image.url })}
                            >
                              Use as cover
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Move up"
                              disabled={index === 0}
                              onClick={() => moveProjectGalleryImage(index, -1)}
                            >
                              <ArrowUp size={15} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Move down"
                              disabled={index === (projectDraft.galleryImages ?? []).length - 1}
                              onClick={() => moveProjectGalleryImage(index, 1)}
                            >
                              <ArrowDown size={15} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Remove image"
                              onClick={() => removeProjectGalleryImage(index)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <Field label="Summary" value={projectDraft.summary} onChange={(value) => setProjectDraft({ ...projectDraft, summary: value })} multiline />
              <Field label="Description" value={projectDraft.description} onChange={(value) => setProjectDraft({ ...projectDraft, description: value })} multiline />
              <Field label="Problem" value={projectDraft.problem} onChange={(value) => setProjectDraft({ ...projectDraft, problem: value })} multiline />
              <Field label="Challenge" value={projectDraft.challenge} onChange={(value) => setProjectDraft({ ...projectDraft, challenge: value })} multiline />
              <Field label="Architecture" value={projectDraft.architecture} onChange={(value) => setProjectDraft({ ...projectDraft, architecture: value })} multiline />
              <Field label="Results" value={projectDraft.results} onChange={(value) => setProjectDraft({ ...projectDraft, results: value })} multiline />
              <Field label="Tags comma separated" value={projectTags} onChange={setProjectTags} />
              <Field label="Metrics: label | value | context" value={projectMetrics} onChange={setProjectMetrics} multiline />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="GitHub URL" value={projectDraft.githubUrl ?? ""} onChange={(value) => setProjectDraft({ ...projectDraft, githubUrl: value })} />
                <Field label="Demo URL" value={projectDraft.demoUrl ?? ""} onChange={(value) => setProjectDraft({ ...projectDraft, demoUrl: value })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={projectDraft.featured}
                  onChange={(event) => setProjectDraft({ ...projectDraft, featured: event.target.checked })}
                />
                Featured project
              </label>
              <Button type="submit" className="w-fit" disabled={projectImageUploading || projectGalleryUploading}>
                {projectImageUploading || projectGalleryUploading ? <Upload size={17} /> : <Save size={17} />}
                {projectImageUploading || projectGalleryUploading ? "Uploading image..." : "Save project"}
              </Button>
            </form>
          </Card>
          <Card className="p-5">
            <h2 className="text-xl font-semibold">Projects</h2>
            <div className="mt-4 space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{project.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{project.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => editProject(project)}>Edit</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => void removeProject(project.id)}>
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === "posts" ? (
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{selectedPostTitle}</h2>
              <Button type="button" variant="outline" onClick={() => { setPostDraft(emptyPost); setPostTags(""); }}>
                <Plus size={17} />
                New
              </Button>
            </div>
            <form onSubmit={savePost} className="grid gap-4">
              <Field label="Title" value={postDraft.title} onChange={(value) => setPostDraft({ ...postDraft, title: value })} />
              <Field label="Slug" value={postDraft.slug} onChange={(value) => setPostDraft({ ...postDraft, slug: value })} />
              <label className="block space-y-2 text-sm">
                <span className="text-muted-foreground">Note type</span>
                <select
                  value={postDraft.type}
                  onChange={(event) => setPostDraft({ ...postDraft, type: event.target.value as PostType })}
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {noteTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <Field label="Cover image URL" value={postDraft.coverImageUrl ?? ""} onChange={(value) => setPostDraft({ ...postDraft, coverImageUrl: value })} />
                <label className="block space-y-2 text-sm">
                  <span className="text-muted-foreground">Upload cover</span>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={postCoverUploading}
                    onChange={(event) => void uploadPostCoverImage(event)}
                  />
                </label>
              </div>
              {postDraft.coverImageUrl ? (
                <div className="relative overflow-hidden rounded-md border border-border bg-muted">
                  {postDraft.coverImageUrl.startsWith("/") ? (
                    <>
                      <div className="relative aspect-[16/8]">
                        <Image
                          src={postDraft.coverImageUrl}
                          alt="Note cover preview"
                          fill
                          sizes="(min-width: 1280px) 520px, 100vw"
                          unoptimized={postDraft.coverImageUrl.startsWith("/api/uploads/")}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex justify-end border-t border-border bg-card p-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={postCoverUploading}
                          onClick={() =>
                            void cropExistingImage(postDraft.coverImageUrl ?? "", "post-cover", 2, "Note cover")
                          }
                        >
                          <Crop size={15} />
                          Crop current image
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-xs text-muted-foreground">
                      External cover URL set. Preview is shown after saving if the domain is allowed.
                    </div>
                  )}
                </div>
              ) : null}
              <Field label="Excerpt" value={postDraft.excerpt} onChange={(value) => setPostDraft({ ...postDraft, excerpt: value })} multiline />
              <Field label="Content" value={postDraft.content} onChange={(value) => setPostDraft({ ...postDraft, content: value })} multiline />
              <div className="grid gap-3 border-t border-border pt-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <label className="block min-w-[220px] flex-1 space-y-2 text-sm">
                    <span className="text-muted-foreground">Note images / diagrams</span>
                    <Input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={postGalleryUploading}
                      onChange={(event) => void uploadPostGalleryImages(event)}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {(postDraft.images ?? []).length} image{(postDraft.images ?? []).length === 1 ? "" : "s"}
                  </p>
                </div>
                {(postDraft.images ?? []).length ? (
                  <div className="grid gap-3">
                    {(postDraft.images ?? []).map((image, index) => (
                      <div key={`${image.url}-${index}`} className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-[150px_1fr]">
                        <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                          {image.url.startsWith("/") ? (
                            <Image
                              src={image.url}
                              alt={image.alt || "Note image preview"}
                              fill
                              sizes="150px"
                              unoptimized={image.url.startsWith("/api/uploads/")}
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
                              External image
                            </div>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Input
                            value={image.url}
                            onChange={(event) => updatePostImage(index, { url: event.target.value })}
                            aria-label={`Note image ${index + 1} URL`}
                          />
                          <Input
                            value={image.alt ?? ""}
                            onChange={(event) => updatePostImage(index, { alt: event.target.value })}
                            aria-label={`Note image ${index + 1} alt text`}
                            placeholder="Alt text"
                          />
                          <div className="flex flex-wrap gap-2">
                            {image.url.startsWith("/") ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={postGalleryUploading}
                                onClick={() =>
                                  void cropExistingImage(
                                    image.url,
                                    "post-gallery",
                                    16 / 9,
                                    `Note image ${index + 1}`,
                                    index
                                  )
                                }
                              >
                                <Crop size={15} />
                                Crop
                              </Button>
                            ) : null}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPostDraft({ ...postDraft, coverImageUrl: image.url })}
                            >
                              Use as cover
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Move up"
                              disabled={index === 0}
                              onClick={() => movePostImage(index, -1)}
                            >
                              <ArrowUp size={15} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Move down"
                              disabled={index === (postDraft.images ?? []).length - 1}
                              onClick={() => movePostImage(index, 1)}
                            >
                              <ArrowDown size={15} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Remove image"
                              onClick={() => removePostImage(index)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="grid gap-3 border-t border-border pt-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <label className="block min-w-[220px] flex-1 space-y-2 text-sm">
                    <span className="text-muted-foreground">Note files</span>
                    <Input
                      type="file"
                      multiple
                      accept="application/pdf,text/html,.pdf,.html,.htm"
                      disabled={postFileUploading}
                      onChange={(event) => void uploadPostFiles(event)}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {(postDraft.files ?? []).length} file{(postDraft.files ?? []).length === 1 ? "" : "s"}
                  </p>
                </div>
                {(postDraft.files ?? []).length ? (
                  <div className="grid gap-3">
                    {(postDraft.files ?? []).map((file, index) => (
                      <div key={`${file.url}-${index}`} className="grid gap-3 rounded-md border border-border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{file.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {file.fileType.toUpperCase()} · {file.mimeType} · {formatBytes(file.sizeBytes)}
                            </p>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-accent hover:underline"
                          >
                            Preview
                          </a>
                        </div>
                        <div className="grid gap-2 md:grid-cols-[1fr_120px]">
                          <Input
                            value={file.title}
                            onChange={(event) => updatePostFile(index, { title: event.target.value })}
                            aria-label={`Note file ${index + 1} title`}
                            placeholder="File title"
                          />
                          <select
                            value={file.fileType}
                            onChange={(event) => {
                              const fileType = event.target.value as PostFileType;
                              updatePostFile(index, {
                                fileType,
                                mimeType: fileType === "pdf" ? "application/pdf" : "text/html"
                              });
                            }}
                            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-label={`Note file ${index + 1} type`}
                          >
                            <option value="pdf">PDF</option>
                            <option value="html">HTML</option>
                          </select>
                        </div>
                        <Input
                          value={file.url}
                          onChange={(event) => updatePostFile(index, { url: event.target.value })}
                          aria-label={`Note file ${index + 1} URL`}
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="Move up"
                            disabled={index === 0}
                            onClick={() => movePostFile(index, -1)}
                          >
                            <ArrowUp size={15} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="Move down"
                            disabled={index === (postDraft.files ?? []).length - 1}
                            onClick={() => movePostFile(index, 1)}
                          >
                            <ArrowDown size={15} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="Remove file"
                            onClick={() => removePostFile(index)}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <Field label="Tags comma separated" value={postTags} onChange={setPostTags} />
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={postDraft.published}
                    onChange={(event) => setPostDraft({ ...postDraft, published: event.target.checked })}
                  />
                  Published
                </label>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Published notes appear on the public Notes page. Turn this off to keep the note as a draft.
                </p>
              </div>
              <Button type="submit" className="w-fit" disabled={postCoverUploading || postGalleryUploading || postFileUploading}>
                {postCoverUploading || postGalleryUploading || postFileUploading ? <Upload size={17} /> : <Save size={17} />}
                {postCoverUploading || postGalleryUploading || postFileUploading ? "Uploading file..." : "Save note"}
              </Button>
            </form>
          </Card>
          <Card className="p-5">
            <h2 className="text-xl font-semibold">Notes</h2>
            <div className="mt-4 space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
	                    <div>
	                      <p className="font-semibold">{post.title}</p>
	                      <p className="mt-1 text-sm text-muted-foreground">
	                        {noteTypes.find((type) => type.value === post.type)?.label ?? post.type} · {post.published ? "Published" : "Draft"} · {post.slug}
	                      </p>
	                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => editPost(post)}>Edit</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => void removePost(post.id)}>
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === "resume" ? (
        <Card className="p-5">
          <form onSubmit={saveResume}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Resume JSON</h2>
              <p className="mt-2 text-sm text-muted-foreground">Edit structured resume data. Invalid JSON will not be saved.</p>
            </div>
            <Textarea value={resumeJson} onChange={(event) => setResumeJson(event.target.value)} className="min-h-[560px] font-mono text-xs" />
            <Button type="submit" className="mt-4">
              <Save size={17} />
              Save resume
            </Button>
          </form>
        </Card>
      ) : null}

      {activeTab === "contacts" ? (
        <Card className="p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Contact Messages</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Active messages send a reminder email every 7 days until they are marked as handled.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {activeMessages.length} active · {archivedMessages.length} archived
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {activeMessages.length ? activeMessages.map((message) => (
              <div key={message.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{message.subject}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{message.name} · {message.email}</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground" dangerouslySetInnerHTML={{ __html: message.message }}></p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Received {new Date(message.createdAt).toLocaleString()}
                      {message.reminderCount ? ` · ${message.reminderCount} reminder${message.reminderCount > 1 ? "s" : ""} sent` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => void markMessageHandled(message.id)}>
                      <CheckCircle2 size={15} />
                      Mark handled
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => void removeMessage(message.id)}>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            )) : (
              <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">No active contact messages.</p>
            )}
          </div>

          {archivedMessages.length ? (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Archived</h3>
              <div className="mt-4 space-y-3">
                {archivedMessages.map((message) => (
                  <div key={message.id} className="rounded-lg border border-border bg-muted/35 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{message.subject}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{message.name} · {message.email}</p>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message.message}</p>
                        <p className="mt-3 text-xs text-muted-foreground">
                          Handled {message.handledAt ? new Date(message.handledAt).toLocaleString() : "date unknown"}
                          {message.reminderCount ? ` · ${message.reminderCount} reminder${message.reminderCount > 1 ? "s" : ""} sent` : ""}
                        </p>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => void removeMessage(message.id)}>
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}
      </AdminShell>
      {activeCrop ? (
        <ImageCropperModal
          allowOriginalUpload={activeCrop.allowOriginalUpload ?? true}
          file={activeCrop.file}
          initialAspectRatio={activeCrop.initialAspectRatio}
          initialZoom={activeCrop.initialZoom}
          isUploading={cropProcessing}
          onCancel={skipCurrentCrop}
          onCropped={(file) => uploadCurrentCrop(file)}
          onOriginal={(file) => uploadCurrentCrop(file, true)}
          title={activeCrop.title}
        />
      ) : null}
    </>
  );
}
