// Server-side blog fetching for SSR + SEO metadata. Never imported by client code.
import { API_URL } from "@/lib/api";
import type { Blog } from "@/lib/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mamunur-rashid-portfolio-wine.vercel.app"
).replace(/\/$/, "");

export async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${API_URL}/api/blogs/`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Blog[];
  } catch {
    return [];
  }
}

export async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API_URL}/api/blogs/slug/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Blog;
  } catch {
    return null;
  }
}
