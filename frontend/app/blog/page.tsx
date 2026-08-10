import type { Metadata } from "next";
import { getBlogs, SITE_URL } from "@/lib/serverBlogs";
import BlogExplorer from "@/components/blog/BlogExplorer";

export const dynamic = "force-dynamic";

const DESC =
  "Engineering deep-dives on multi-tenant SaaS architecture, backend engineering with FastAPI and Laravel, Next.js, PostgreSQL, and building production software that scales.";

export const metadata: Metadata = {
  title: "Engineering Blog | Mamunur Rashid — SaaS & Full-Stack Architecture",
  description: DESC,
  keywords: [
    "software engineering blog",
    "SaaS architecture",
    "multi-tenant",
    "FastAPI",
    "Laravel",
    "Next.js",
    "PostgreSQL",
    "Mamunur Rashid",
  ],
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Engineering Blog | Mamunur Rashid",
    description: DESC,
    type: "website",
    url: `${SITE_URL}/blog`,
  },
  twitter: { card: "summary_large_image", title: "Engineering Blog | Mamunur Rashid", description: DESC },
};

export default async function BlogIndexPage() {
  const posts = await getBlogs();
  return <BlogExplorer posts={posts} activeSlug={posts[0]?.slug} />;
}
