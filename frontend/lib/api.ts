import type {
  ApiEnvelope,
  AdminSession,
  ContactMessage,
  ContactPayload,
  Post,
  PostFile,
  Profile,
  Project,
  Resume
} from "@/types/content";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
const internalApiBaseUrl = process.env.INTERNAL_API_URL;

function getApiBaseUrl() {
  if (typeof window === "undefined" && internalApiBaseUrl) {
    return internalApiBaseUrl;
  }

  return apiBaseUrl;
}

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

async function request<T>(path: string, init?: NextFetchInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    next: init?.method && init.method !== "GET" ? undefined : { revalidate: 60 }
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    const message = payload.success ? "Request failed" : payload.error.message;
    throw new Error(message);
  }

  return payload.data;
}

export async function getProfile() {
  return request<Profile>("/profile");
}

export async function getProjects() {
  return request<Project[]>("/projects");
}

export async function getProject(slug: string) {
  return request<Project>(`/projects/${slug}`);
}

export async function getPosts() {
  return request<Post[]>("/posts");
}

export async function getPost(slug: string) {
  return request<Post>(`/posts/${slug}`);
}

export async function getResume() {
  return request<Resume>("/resume");
}

export async function submitContact(payload: ContactPayload) {
  return request<{ message: string; contactMessageId: number; createdAt: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store"
  });
}

async function adminRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}/admin${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    const message = payload.success ? "Admin request failed" : payload.error.message;
    throw new Error(message);
  }

  return payload.data;
}

export async function loginAdmin(credentials: { username: string; password: string }) {
  return request<AdminSession>("/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    cache: "no-store"
  });
}

export async function getAdminMe(token: string) {
  return adminRequest<{ user: { sub: string; role: "admin"; exp: number } }>("/me", token);
}

export async function getAdminProfile(token: string) {
  return adminRequest<Profile | null>("/profile", token);
}

export async function updateAdminProfile(token: string, payload: Profile) {
  return adminRequest<Profile>("/profile", token, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function getAdminProjects(token: string) {
  return adminRequest<Project[]>("/projects", token);
}

export async function createAdminProject(token: string, payload: Omit<Project, "id" | "createdAt" | "updatedAt" | "caseStudy">) {
  return adminRequest<Project>("/projects", token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateAdminProject(
  token: string,
  id: number,
  payload: Omit<Project, "id" | "createdAt" | "updatedAt" | "caseStudy">
) {
  return adminRequest<Project>(`/projects/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function uploadAdminProjectImage(token: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${getApiBaseUrl()}/admin/uploads/project-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
    cache: "no-store"
  });

  const payload = (await response.json()) as ApiEnvelope<{ imageUrl: string }>;

  if (!response.ok || !payload.success) {
    const message = payload.success ? "Image upload failed" : payload.error.message;
    throw new Error(message);
  }

  return payload.data;
}

export async function uploadAdminPostImage(token: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${getApiBaseUrl()}/admin/uploads/post-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
    cache: "no-store"
  });

  const payload = (await response.json()) as ApiEnvelope<{ imageUrl: string }>;

  if (!response.ok || !payload.success) {
    const message = payload.success ? "Image upload failed" : payload.error.message;
    throw new Error(message);
  }

  return payload.data;
}

export async function uploadAdminPostFile(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getApiBaseUrl()}/admin/uploads/post-file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
    cache: "no-store"
  });

  const payload = (await response.json()) as ApiEnvelope<{ file: Omit<PostFile, "createdAt" | "id" | "sortOrder"> }>;

  if (!response.ok || !payload.success) {
    const message = payload.success ? "File upload failed" : payload.error.message;
    throw new Error(message);
  }

  return payload.data;
}

export async function deleteAdminProject(token: string, id: number) {
  return adminRequest<{ id: number }>(`/projects/${id}`, token, {
    method: "DELETE"
  });
}

export async function getAdminPosts(token: string) {
  return adminRequest<Post[]>("/posts", token);
}

export async function createAdminPost(token: string, payload: Omit<Post, "id" | "createdAt" | "updatedAt">) {
  return adminRequest<Post>("/posts", token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateAdminPost(
  token: string,
  id: number,
  payload: Omit<Post, "id" | "createdAt" | "updatedAt">
) {
  return adminRequest<Post>(`/posts/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function deleteAdminPost(token: string, id: number) {
  return adminRequest<{ id: number }>(`/posts/${id}`, token, {
    method: "DELETE"
  });
}

export async function getAdminResume(token: string) {
  return adminRequest<Resume>("/resume", token);
}

export async function updateAdminResume(token: string, payload: Resume) {
  return adminRequest<Resume>("/resume", token, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function getAdminContactMessages(token: string) {
  return adminRequest<ContactMessage[]>("/contact-messages", token);
}

export async function markAdminContactMessageHandled(token: string, id: number) {
  return adminRequest<ContactMessage>(`/contact-messages/${id}/handled`, token, {
    method: "PATCH"
  });
}

export async function deleteAdminContactMessage(token: string, id: number) {
  return adminRequest<{ id: number }>(`/contact-messages/${id}`, token, {
    method: "DELETE"
  });
}
