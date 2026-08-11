"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { fetcher } from "@/lib/api";
import type { Testimonial } from "@/lib/types";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= n ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-[var(--color-border)]"}`}
        />
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <div className="mrp-tcard group/card w-[300px] sm:w-[360px] shrink-0 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 mx-3 transition-all duration-300 hover:border-[var(--color-accent)]/50 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(45,212,191,0.10)]">
      <div className="flex items-center justify-between mb-4">
        <Quote className="w-7 h-7 text-[var(--color-accent)]/40 group-hover/card:text-[var(--color-accent)] transition-colors" />
        <Stars n={t.rating || 5} />
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] font-inter line-clamp-5 min-h-[100px]">
        “{t.quote}”
      </p>
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[var(--color-border)]">
        {t.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.avatar_url} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-[var(--color-border)]" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] font-bold text-sm font-space-grotesk">
            {initials(t.name)}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--color-text-primary)] truncate font-space-grotesk">{t.name}</div>
          <div className="text-[11px] font-mono text-[var(--color-text-secondary)] truncate">
            {[t.role, t.company].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ items, dir, dur }: { items: Testimonial[]; dir: "to-left" | "to-right"; dur: number }) {
  // Duplicate the content so the -50% translate loops seamlessly.
  const doubled = [...items, ...items];
  return (
    <div className="mrp-marquee py-2">
      <div className={`mrp-marquee-track ${dir}`} style={{ ["--dur" as string]: `${dur}s` }}>
        {doubled.map((t, i) => (
          <Card key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { data: items = [] } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: () => fetcher<Testimonial[]>("/api/testimonials/"),
  });

  if (!items.length) return null;

  // Ensure each row is wide enough to fill the viewport before we duplicate it.
  const minCards = 6;
  const filled: Testimonial[] =
    items.length >= minCards
      ? items
      : Array.from({ length: Math.ceil(minCards / items.length) }).flatMap(() => items);
  const rowA = filled;
  const rowB = [...filled].reverse();

  return (
    <section
      id="testimonials"
      data-theme="dark"
      className="relative w-full py-24 bg-[var(--color-background)] text-[var(--color-text-primary)] overflow-hidden select-none"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-14 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-mono mb-4"
        >
          <Star className="w-3.5 h-3.5 fill-[var(--color-accent)]" /> CLIENT_STORIES.LOG
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-space-grotesk"
        >
          Trusted by <span className="text-[var(--color-accent)] text-glow">Founders & Teams</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[var(--color-text-secondary)] mt-3 max-w-xl mx-auto text-sm md:text-base font-inter"
        >
          Real words from the people I&apos;ve shipped production software for.
        </motion.p>
      </div>

      {/* Dual-row marquee with edge fades */}
      <div className="relative">
        {/* left/right fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-[var(--color-background)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-[var(--color-background)] to-transparent" />
        <Row items={rowA} dir="to-left" dur={46} />
        <Row items={rowB} dir="to-right" dur={62} />
      </div>
    </section>
  );
}
