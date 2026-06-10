"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
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
  uploadAdminProjectImage,
  updateAdminPost,
  updateAdminProfile,
  updateAdminProject,
  updateAdminResume
} from "@/lib/api";
import { defaultProfile } from "@/lib/site";
import type { ContactMessage, Metric, Post, Profile, Project, Resume } from "@/types/content";

type TabKey = "profile" | "projects" | "posts" | "resume" | "contacts";

type ProjectDraft = Omit<Project, "id" | "createdAt" | "updatedAt" | "caseStudy"> & {
  id?: number;
};

type PostDraft = Omit<Post, "id" | "createdAt" | "updatedAt"> & {
  id?: number;
};

const tabs: Array<{ key: TabKey; label: string; icon: typeof UserRound }> = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "projects", label: "Projects", icon: Layers3 },
  { key: "posts", label: "Notes", icon: FileText },
  { key: "resume", label: "Resume", icon: Save },
  { key: "contacts", label: "Messages", icon: Inbox }
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
  githubUrl: "",
  demoUrl: "",
  featured: false
};

const emptyPost: PostDraft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: [],
  published: false
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
  const [postDraft, setPostDraft] = useState<PostDraft>(emptyPost);
  const [postTags, setPostTags] = useState("");

  const selectedProjectTitle = useMemo(
    () => (projectDraft.id ? `Editing #${projectDraft.id}` : "New project"),
    [projectDraft.id]
  );
  const selectedPostTitle = useMemo(() => (postDraft.id ? `Editing #${postDraft.id}` : "New note"), [postDraft.id]);
  const activeMessages = useMemo(() => messages.filter((message) => !message.archived), [messages]);
  const archivedMessages = useMemo(() => messages.filter((message) => message.archived), [messages]);

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
      githubUrl: projectDraft.githubUrl || null,
      demoUrl: projectDraft.demoUrl || null
    };

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
  }

  async function uploadProjectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setProjectImageUploading(true);
    setStatus("Uploading project image...");

    try {
      const { imageUrl } = await uploadAdminProjectImage(token, file);
      setProjectDraft((draft) => ({
        ...draft,
        imageUrl
      }));
      setStatus("Project image uploaded. Save the project to keep it.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Project image upload failed.");
    } finally {
      setProjectImageUploading(false);
      event.target.value = "";
    }
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
      tags: post.tags,
      published: post.published
    });
    setPostTags(tagsToText(post.tags));
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving note...");
    const payload = {
      ...postDraft,
      tags: textToTags(postTags)
    };

    if (postDraft.id) {
      await updateAdminPost(token, postDraft.id, payload);
    } else {
      await createAdminPost(token, payload);
    }

    setPostDraft(emptyPost);
    setPostTags("");
    await loadData(token);
    setStatus("Note saved.");
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
                  ) : (
                    <div className="p-3 text-xs text-muted-foreground">
                      External image URL set. Preview is shown after saving if the domain is allowed.
                    </div>
                  )}
                </div>
              ) : null}
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
              <Button type="submit" className="w-fit">
                {projectImageUploading ? <Upload size={17} /> : <Save size={17} />}
                {projectImageUploading ? "Uploading image..." : "Save project"}
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
              <Field label="Excerpt" value={postDraft.excerpt} onChange={(value) => setPostDraft({ ...postDraft, excerpt: value })} multiline />
              <Field label="Content" value={postDraft.content} onChange={(value) => setPostDraft({ ...postDraft, content: value })} multiline />
              <Field label="Tags comma separated" value={postTags} onChange={setPostTags} />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={postDraft.published}
                  onChange={(event) => setPostDraft({ ...postDraft, published: event.target.checked })}
                />
                Published
              </label>
              <Button type="submit" className="w-fit">
                <Save size={17} />
                Save note
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
                      <p className="mt-1 text-sm text-muted-foreground">{post.published ? "Published" : "Draft"} · {post.slug}</p>
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
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{message.message}</p>
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
  );
}
