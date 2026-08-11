"use client";

import React from "react";
import { Mail, ArrowUpRight, ArrowUp, Code2, Server } from "lucide-react";

// Inline GitHub SVG Icon
const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Inline LinkedIn SVG Icon
const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer data-theme="dark" className="relative w-full bg-[var(--color-background)] text-[var(--color-text-secondary)] border-t-2 border-[var(--color-accent)]/30 pt-16 pb-8 overflow-hidden select-none">
      {/* Background Ambient Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-[var(--color-accent)]/15 blur-[120px] pointer-events-none" />

      {/* Main Wide Container Aligned with Navbar */}
      <div className="max-w-[1536px] w-full mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Top Grid: Brand & Call to Action */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[var(--color-border)]">
          
          {/* Col 1: Brand & Status (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between gap-6">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] font-space-grotesk">
                Mamunur <span className="text-[var(--color-accent)]">Rashid</span>
              </h2>
              <p className="mt-3 text-sm font-medium text-[var(--color-text-secondary)] max-w-md leading-relaxed">
                Full-Stack Software Engineer specializing in building scalable multi-tenant SaaS platforms, REST APIs, and automated business systems.
              </p>
            </div>

            {/* Live Status Indicator */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/40 text-[var(--color-accent)] text-xs font-bold font-mono w-fit">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-accent)]"></span>
              </span>
              Available for full-time roles & high-impact projects
            </div>
          </div>

          {/* Col 2: Navigation & Connect */}
          <div className="md:col-span-6 grid grid-cols-2 justify-between gap-6 md:pl-10">
            
            {/* Navigation Section */}
            <div>
              <h4 className="text-xs font-mono font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-3 text-sm font-semibold">
                {["About", "Skills", "Projects", "Experience", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/portal"
                    className="flex items-center gap-1.5 text-[var(--color-accent)] hover:opacity-80 transition-opacity duration-200"
                  >
                    Client Portal <ArrowUpRight size={13} className="stroke-[2.5]" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect Section */}
            <div>
              <h4 className="text-xs font-mono font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">Connect</h4>
              <ul className="space-y-3 text-sm font-semibold">
                <li>
                  <a
                    href="https://github.com/mamun441998"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                  >
                    <GithubIcon size={16} /> GitHub <ArrowUpRight size={14} className="stroke-[2.5]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                  >
                    <LinkedinIcon size={16} /> LinkedIn <ArrowUpRight size={14} className="stroke-[2.5]" />
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:mamun441998@gmail.com"
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                  >
                    <Mail size={16} className="stroke-[2.5]" /> Email
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright, Tech Stack (Centering Alignment) & Scroll Top */}
        <div className="pt-8 relative flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-semibold text-[var(--color-text-secondary)]">
          
          {/* Copyright (Left Alignment) */}
          <div className="text-[var(--color-text-secondary)]">
            © {new Date().getFullYear()} Mamunur Rashid. Built with precision and care.
          </div>

          {/* Architecture Badge (Perfectly Centered on Desktop) */}
          <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-3.5 py-1.5 rounded-full text-[var(--color-text-primary)] font-medium">
            <Code2 size={14} className="text-[var(--color-accent)] stroke-[2.5]" />
            <span>Next.js</span>
            <span className="text-[var(--color-text-muted)]">•</span>
            <Server size={14} className="text-[var(--color-accent)] stroke-[2.5]" />
            <span>FastAPI</span>
          </div>

          {/* Back to Top (Right Alignment) */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] font-bold transition-colors duration-200 cursor-pointer group"
          >
            <span>Back to top</span>
            <div className="p-1.5 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/10 transition-colors">
              <ArrowUp size={13} className="stroke-[2.5]" />
            </div>
          </button>

        </div>

      </div>
    </footer>
  );
}