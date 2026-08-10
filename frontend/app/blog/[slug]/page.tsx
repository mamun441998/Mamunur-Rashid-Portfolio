import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogs, getBlog, SITE_URL } from "@/lib/serverBlogs";
import BlogExplorer from "@/components/blog/BlogExplorer";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) return { title: "Article not found | Mamunur Rashid" };

  const desc = post.meta_description || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const images = post.hero_image_url ? [post.hero_image_url] : undefined;

  return {
    title: `${post.title} | Mamunur Rashid`,
    description: desc,
    keywords: (post.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: desc,
      type: "article",
      url,
      images,
      publishedTime: post.created_at,
      modifiedTime: post.updated_at || post.created_at,
      authors: [post.author],
    },
    twitter: { card: "summary_large_image", title: post.title, description: desc, images },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const [posts, post] = await Promise.all([getBlogs(), getBlog(slug)]);
  if (!post) notFound();

  // Guarantee the current post is present in the left list even if it's a draft.
  const allPosts = posts.some((p) => p.slug === post.slug) ? posts : [post, ...posts];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    author: { "@type": "Person", name: post.author, url: SITE_URL },
    publisher: { "@type": "Person", name: post.author },
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    image: post.hero_image_url || undefined,
    keywords: post.tags || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogExplorer posts={allPosts} activeSlug={post.slug} />
    </>
  );
}
