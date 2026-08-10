"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    if (pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header data-theme="dark" className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/90 backdrop-blur-md border-b border-[var(--color-border)] select-none transition-colors duration-200">
      {/* Container max-width with full screen edge spacing */}
      <nav className="max-w-[1536px] w-full mx-auto flex items-center justify-between px-6 sm:px-10 lg:px-12 py-4 relative">
        
        {/* Left Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="text-lg font-bold tracking-tight cursor-pointer z-10"
        >
          {SITE_CONFIG.name.split(" ")[0]}
          <span className="text-[var(--color-accent)]">.</span>
        </button>

        {/* Desktop Navigation - Centered Perfectly */}
        <div className="hidden md:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200 cursor-pointer font-medium"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4 z-10">
          {/* Dynamic Resume Link Button */}
          <Link
            href="/resume"
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] border border-[var(--color-border)] hover:border-[var(--color-accent)] px-3.5 py-2 rounded-full transition-colors duration-200"
          >
            <FileText size={14} className="text-[var(--color-accent)]" />
            <span>Resume</span>
          </Link>

          {/* Let's Talk Button (Solid Style Without Neon Glow) */}
          <button
            onClick={() => handleNavClick("contact")}
            className="relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[var(--color-accent)] px-6 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-200 group cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-[var(--color-accent)] translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 transition-colors duration-200 group-hover:text-black">
              Let&apos;s Talk
            </span>
          </button>
        </div>

        {/* Mobile Right Wrapper (Menu Toggle) */}
        <div className="flex md:hidden items-center gap-3 z-10">
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="text-[var(--color-text-primary)] p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[var(--color-background)]/95 backdrop-blur-md border-b border-[var(--color-border)]"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-base text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/resume"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] px-4 py-2 rounded-full"
                >
                  <FileText size={16} className="text-[var(--color-accent)]" />
                  Resume
                </Link>

                <button
                  onClick={() => handleNavClick("contact")}
                  className="relative overflow-hidden rounded-full border border-[var(--color-accent)] px-6 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-200 group cursor-pointer"
                >
                  <span className="absolute inset-0 w-full h-full bg-[var(--color-accent)] translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
                  <span className="relative z-10 transition-colors duration-200 group-hover:text-black">
                    Let&apos;s Talk
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}