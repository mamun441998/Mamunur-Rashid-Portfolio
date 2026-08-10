import { getToken } from "@/lib/auth";
import type {
  AnalyticsStats,
  CaseStudy,
  ContactMessage,
  ContactStats,
  Experience,
  LeadStatus,
  MeetingsResponse,
  Project,
  Service,
  SiteSetting,
  Skill,
} from "@/lib/types";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  cache?: RequestCache;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, cache = "no-store" } = options;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const headers: Record<string, string> = {};

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache,
    });
  } catch (err) {
    throw new ApiError(`Network error: ${(err as Error).message}`, 0);
  }

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      detail = data.detail || data.message || detail;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(typeof detail === "string" ? detail : JSON.stringify(detail), res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Backward-compatible simple GET helper used by existing section components. */
export async function fetcher<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: "GET" });
}

/** OAuth2 password login — must be form-urlencoded for FastAPI. */
export async function loginRequest(
  username: string,
  password: string
): Promise<{ access_token: string; token_type: string }> {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });

  if (!res.ok) {
    let detail = "Invalid username or password";
    try {
      const data = await res.json();
      detail = data.detail || data.message || detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(typeof detail === "string" ? detail : JSON.stringify(detail), res.status);
  }
  return res.json();
}

export const api = {
  settings: {
    get: () => request<SiteSetting>("/api/settings"),
    update: (data: Partial<SiteSetting>) =>
      request<SiteSetting>("/api/settings", { method: "PUT", body: data, auth: true }),
  },
  projects: {
    list: () => request<Project[]>("/api/projects/"),
    create: (data: Partial<Project>) =>
      request<Project>("/api/projects/", { method: "POST", body: data, auth: true }),
    update: (id: number, data: Partial<Project>) =>
      request<Project>(`/api/projects/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
      request<{ message: string }>(`/api/projects/${id}`, { method: "DELETE", auth: true }),
  },
  skills: {
    list: () => request<Skill[]>("/api/skills/"),
    create: (data: Partial<Skill>) =>
      request<Skill>("/api/skills/", { method: "POST", body: data, auth: true }),
    update: (id: number, data: Partial<Skill>) =>
      request<Skill>(`/api/skills/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
      request<{ message: string }>(`/api/skills/${id}`, { method: "DELETE", auth: true }),
  },
  experiences: {
    list: () => request<Experience[]>("/api/experiences"),
    create: (data: Partial<Experience>) =>
      request<Experience>("/api/experiences/", { method: "POST", body: data, auth: true }),
    update: (id: number, data: Partial<Experience>) =>
      request<Experience>(`/api/experiences/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
      request<{ message: string }>(`/api/experiences/${id}`, { method: "DELETE", auth: true }),
  },
  services: {
    list: () => request<Service[]>("/api/services"),
    create: (data: Partial<Service>) =>
      request<Service>("/api/services", { method: "POST", body: data, auth: true }),
    update: (id: number, data: Partial<Service>) =>
      request<Service>(`/api/services/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
      request<{ message: string }>(`/api/services/${id}`, { method: "DELETE", auth: true }),
  },
  caseStudies: {
    list: () => request<CaseStudy[]>("/api/case-studies"),
    bySlug: (slug: string) => request<CaseStudy>(`/api/case-studies/slug/${slug}`),
    create: (data: Partial<CaseStudy>) =>
      request<CaseStudy>("/api/case-studies", { method: "POST", body: data, auth: true }),
    update: (id: number, data: Partial<CaseStudy>) =>
      request<CaseStudy>(`/api/case-studies/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
      request<{ message: string }>(`/api/case-studies/${id}`, { method: "DELETE", auth: true }),
  },
  contact: {
    send: (data: { name: string; email: string; subject?: string; message: string }) =>
      request<ContactMessage>("/api/contact", { method: "POST", body: data }),
    list: (status?: LeadStatus) =>
      request<ContactMessage[]>(`/api/contact${status ? `?status=${status}` : ""}`, { auth: true }),
    stats: () => request<ContactStats>("/api/contact/stats", { auth: true }),
    markRead: (id: number) =>
      request<ContactMessage>(`/api/contact/${id}/read`, { method: "PUT", auth: true }),
    updateStatus: (id: number, status: LeadStatus) =>
      request<ContactMessage>(`/api/contact/${id}/status`, {
        method: "PUT",
        body: { status },
        auth: true,
      }),
    remove: (id: number) =>
      request<{ message: string }>(`/api/contact/${id}`, { method: "DELETE", auth: true }),
    reply: (data: { to_email: string; subject: string; reply_message: string }) =>
      request<{ status: string; message: string }>("/api/contact/reply", {
        method: "POST",
        body: data,
        auth: true,
      }),
    testEmail: () =>
      request<{ status: string; message: string }>("/api/contact/test-email", {
        method: "POST",
        auth: true,
      }),
  },
  meetings: {
    // Backed by the Google Calendar iCal feed (GOOGLE_CALENDAR_ICAL_URL on the backend).
    list: () => request<MeetingsResponse>("/api/meetings", { auth: true }),
  },
  analytics: {
    stats: () => request<AnalyticsStats>("/api/analytics/stats", { auth: true }),
    track: (path: string, referrer?: string) =>
      request<{ status: string }>("/api/analytics/track", {
        method: "POST",
        body: { path, referrer },
      }),
  },
};
