"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowLeft, User } from "lucide-react";
import type { Blog } from "@/lib/types";

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function tagList(tags?: string) {
  return (tags || "").split(",").map((t) => t.trim()).filter(Boolean);
}

export default function BlogExplorer({ posts, activeSlug }: { posts: Blog[]; activeSlug?: string }) {
  const active = posts.find((p) => p.slug === activeSlug) || posts[0];
  const contentRef = useRef<HTMLDivElement>(null);

  // On mobile, scroll the article into view when the selection changes.
  useEffect(() => {
    if (activeSlug && window.innerWidth < 1024) {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSlug]);

  return (
    <section
      data-theme="dark"
      className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text-primary)] pt-28 pb-20 px-4 sm:px-6 lg:px-10 select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page heading */}
        <div className="mb-10 text-center lg:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-space-grotesk">
            The <span className="text-[var(--color-accent)]">Engineering</span> Blog
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-3 max-w-2xl mx-auto lg:mx-0 font-inter">
            Deep-dives on SaaS architecture, backend engineering, and building production software that scales.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-[var(--color-text-secondary)] font-mono">
            No articles published yet — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-10 items-start">
            {/* LEFT: list of posts */}
            <aside className="lg:sticky lg:top-24 space-y-3 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto custom-scrollbar pr-1">
              {posts.map((post) => {
                const isActive = post.slug === active?.slug;
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    scroll={false}
                    className={`block rounded-2xl p-4 border transition-all duration-300 group ${
                      isActive
                        ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/50 shadow-[0_0_20px_rgba(45,212,191,0.12)]"
                        : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/40"
                    }`}
                  >
                    <h3
                      className={`font-semibold font-space-grotesk leading-snug line-clamp-2 transition-colors ${
                        isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]"
                      }`}
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 line-clamp-2 font-inter">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-[11px] font-mono text-[var(--color-text-secondary)]">
                      <span className="inline-flex items-center gap-1"><Calendar size={11} />{formatDate(post.created_at)}</span>
                      {post.read_time && <span className="inline-flex items-center gap-1"><Clock size={11} />{post.read_time}</span>}
                    </div>
                  </Link>
                );
              })}
            </aside>

            {/* RIGHT: active article */}
            <motion.article
              ref={contentRef}
              key={active?.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-xl"
            >
              {/* Hero banner */}
              <div className="relative h-56 sm:h-72 w-full overflow-hidden">
                {active?.hero_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={active.hero_image_url}
                    alt={active.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0F1E24] via-[#0b2a2a] to-[#081419]">
                    <div className="absolute -top-10 -right-10 w-72 h-72 bg-[var(--color-accent)]/20 blur-[100px] rounded-full" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {tagList(active?.tags).slice(0, 4).map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                        <Tag size={10} />{t}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-space-grotesk text-white drop-shadow-lg">
                    {active?.title}
                  </h2>
                </div>
              </div>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 px-6 sm:px-8 py-4 border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)]">
                <span className="inline-flex items-center gap-1.5"><User size={13} className="text-[var(--color-accent)]" />{active?.author}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar size={13} className="text-[var(--color-accent)]" />{formatDate(active?.created_at)}</span>
                {active?.read_time && <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-[var(--color-accent)]" />{active.read_time}</span>}
              </div>

              {/* HTML content */}
              <div
                className="blog-content px-6 sm:px-8 py-8 max-w-none"
                dangerouslySetInnerHTML={{ __html: active?.content_html || "" }}
              />
            </motion.article>
          </div>
        )}
      </div>
    </section>
  );
}
