"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  delay?: number;
}

export default function StatCard({ value, label, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 text-center"
    >
      <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] text-glow">
        {value}
      </div>
      <div className="mt-2 text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
        {label}
      </div>
    </motion.div>
  );
}