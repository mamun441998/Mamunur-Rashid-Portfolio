"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  delay?: number;
}

/** Splits e.g. "18+" -> {num: 18, prefix: "", suffix: "+"}, "100%" -> {100, "", "%"}.
 *  Returns null num when there is no integer to animate. */
function parseValue(value: string): { num: number | null; prefix: string; suffix: string } {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  if (!match) return { num: null, prefix: "", suffix: "" };
  return { prefix: match[1], num: parseInt(match[2], 10), suffix: match[3] };
}

export default function StatCard({ value, label, delay = 0 }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { num, prefix, suffix } = parseValue(value);
  const [display, setDisplay] = useState(num === null ? value : `${prefix}0${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (num === null) {
      setDisplay(value);
      return;
    }
    const duration = 1100;
    const start = performance.now() + delay * 1000;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * num);
      setDisplay(`${prefix}${current}${suffix}`);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 text-center"
    >
      <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] text-glow">
        {display}
      </div>
      <div className="mt-2 text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
        {label}
      </div>
    </motion.div>
  );
}
