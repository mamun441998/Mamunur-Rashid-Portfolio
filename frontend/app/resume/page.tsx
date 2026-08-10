"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Printer,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Code2,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG, RESUME_DATA } from "@/lib/constants";

export default function ResumePage() {
  const [filter, setFilter] = useState<"all" | "experience" | "projects" | "skills">("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Print Handle with Automatic Zoom Reset for PDF
  const handlePrint = () => {
    const currentZoom = zoomLevel;
    // Temporarily reset zoom to 100% for 100% accurate PDF output
    setZoomLevel(1);
    
    setTimeout(() => {
      window.print();
      // Restore previous zoom level after print dialog opens
      setZoomLevel(currentZoom);
    }, 50);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] pt-20 pb-16 px-2 md:px-6 selection:bg-[#00ffc2] selection:text-black print:p-0 print:m-0 print:bg-white print:text-black">
      
      {/* PERFECT FULL-PAGE COVERAGE PRINT CSS (FORCE 100% SCALE IN PRINT) */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }

          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }

          /* Hide UI Overlays */
          nav, header:not(.print-header), .print-hide {
            display: none !important;
          }

          /* FORCE RESET ZOOM AND TRANSFORM ON PRINT */
          .print-zoom-wrapper {
            transform: none !important;
            zoom: 1 !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Force Container to Cover the full A4 page.
             Use fixed mm (not vw/vh) so mobile browsers size it to the A4 sheet,
             not the small device viewport — otherwise mobile PDFs come out squished. */
          .print-resume-card {
            transform: none !important;
            zoom: 1 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            margin: 0 auto !important;
            padding: 10mm 12mm !important;
            background-color: #FAF9F6 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }

          /* Print Header Styling */
          .print-header {
            display: flex !important;
            background: #f3f4f6 !important;
            border: 1px solid #e5e7eb !important;
            padding: 12px 16px !important;
            border-radius: 12px !important;
            margin-bottom: 12px !important;
            align-items: center !important;
            justify-content: space-between !important;
          }

          .print-header h1 {
            color: #111827 !important;
            font-size: 26px !important;
            font-weight: 800 !important;
          }

          .print-header p {
            color: #0f766e !important;
            font-size: 13px !important;
            font-weight: 700 !important;
          }

          .print-contact-badge {
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            color: #374151 !important;
            padding: 4px 8px !important;
            border-radius: 6px !important;
            font-size: 11px !important;
          }

          .print-icon-teal {
            color: #0f766e !important;
          }

          .print-resume-card h2 {
            color: #0f766e !important;
            font-size: 12px !important;
            font-weight: 800 !important;
            border-bottom: 1px solid #d1d5db !important;
            padding-bottom: 3px !important;
            margin-bottom: 8px !important;
            text-transform: uppercase !important;
          }

          .print-resume-card h3 {
            color: #111827 !important;
          }

          .print-resume-card p, 
          .print-resume-card span, 
          .print-resume-card li {
            color: #374151 !important;
          }

          .print-box-padding {
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            padding: 8px 10px !important;
            border-radius: 8px !important;
          }

          .print-chip {
            background-color: #f0fdf4 !important;
            border: 1px solid #bbf7d0 !important;
            color: #166534 !important;
            font-size: 10px !important;
            padding: 2px 7px !important;
            border-radius: 4px !important;
          }

          /* Two-Column Grid Setup with Stretch Fill */
          .print-grid {
            display: grid !important;
            grid-template-columns: 58% 40% !important;
            gap: 2% !important;
            flex-grow: 1 !important;
          }

          .print-compact-gap {
            gap: 12px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
          }

          .print-text-shrink {
            font-size: 10.5px !important;
            line-height: 1.4 !important;
          }

          .print-footer {
            border-top: 1px solid #e5e7eb !important;
            background: transparent !important;
            color: #6b7280 !important;
            padding-top: 8px !important;
            font-size: 10px !important;
            text-align: center !important;
            margin-top: auto !important;
          }
        }
      `}</style>

      {/* Control Action Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print-hide">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[#00ffc2] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Controls: Zoom & Print Buttons */}
        <div className="flex items-center gap-3">
          
          {/* Zoom Buttons Container */}
          <div className="flex items-center gap-1 bg-white/10 border border-white/15 rounded-full px-3 py-1 font-mono text-xs backdrop-blur-md">
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1 hover:text-[#00ffc2] transition-colors disabled:opacity-30 cursor-pointer"
              disabled={zoomLevel <= 0.6}
            >
              <ZoomOut size={16} />
            </button>
            
            <span className="px-2 text-[var(--color-text-secondary)] min-w-[50px] text-center font-bold">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1 hover:text-[#00ffc2] transition-colors disabled:opacity-30 cursor-pointer"
              disabled={zoomLevel >= 1.6}
            >
              <ZoomIn size={16} />
            </button>

            {zoomLevel !== 1 && (
              <button
                onClick={handleResetZoom}
                title="Reset Zoom"
                className="p-1 ml-1 text-[var(--color-text-muted)] hover:text-[#00ffc2] transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          {/* Download PDF / Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00ffc2] text-black font-bold text-xs font-mono hover:bg-[#00e6af] transition-all shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:shadow-[0_0_30px_rgba(0,255,194,0.5)] cursor-pointer"
          >
            <Printer size={16} />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-center gap-2 font-mono text-xs print-hide">
        {(["all", "experience", "projects", "skills"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full capitalize transition-all cursor-pointer ${
              filter === tab
                ? "bg-[#00ffc2] text-black font-bold shadow-[0_0_15px_rgba(0,255,194,0.3)] scale-105"
                : "bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[#00ffc2]/40"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Container for Dynamic Zooming */}
      <div className="w-full flex justify-center items-start overflow-x-auto py-4 min-h-[85vh]">
        
        {/* Actual Zoom Wrapper */}
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="print-zoom-wrapper w-full max-w-4xl flex justify-center shrink-0"
        >
          <motion.main
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="print-resume-card w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col justify-between"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#00ffc2]/5 blur-[120px] rounded-full pointer-events-none print-hide" />

            {/* Header */}
            <header className="print-header bg-[var(--color-surface-elevated)] p-4 md:p-5 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between gap-4 w-full">
                
                {/* Left Header Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 print-hide">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00ffc2]/10 border border-[#00ffc2]/30 text-[#00ffc2] font-mono text-[10px] font-semibold">
                      <Sparkles size={11} /> {SITE_CONFIG.roles[0]}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                    {SITE_CONFIG.name}
                  </h1>
                  <p className="text-[#00ffc2] font-mono text-xs md:text-sm mt-0.5 font-semibold tracking-wide">
                    Full Stack Web Developer & SaaS Architect
                  </p>

                  {/* Contact Grid */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px] md:text-[11px] text-[var(--color-text-secondary)] mt-2.5">
                    <div className="print-contact-badge flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-[var(--color-border)]">
                      <Phone size={12} className="text-[#00ffc2] print-icon-teal" />
                      <span className="font-medium">{SITE_CONFIG.phone}</span>
                    </div>
                    <div className="print-contact-badge flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-[var(--color-border)]">
                      <Mail size={12} className="text-[#00ffc2] print-icon-teal" />
                      <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-[#00ffc2] transition-colors truncate font-medium">
                        {SITE_CONFIG.email}
                      </a>
                    </div>
                    <div className="print-contact-badge flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-[var(--color-border)]">
                      <MapPin size={12} className="text-[#00ffc2] print-icon-teal" />
                      <span className="font-medium">{SITE_CONFIG.location}</span>
                    </div>
                    <div className="print-contact-badge flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-[var(--color-border)]">
                      <Globe size={12} className="text-[#00ffc2] print-icon-teal" />
                      <span className="font-medium">{SITE_CONFIG.nationality}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="relative shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-[#00ffc2]/40 shadow-lg bg-white/5 print:border-gray-300">
                  <Image
                    src="/Profile-Picture.png"
                    alt={SITE_CONFIG.name}
                    fill
                    sizes="(max-width: 768px) 96px, 112px"
                    className="object-cover"
                    priority
                  />
                </div>

              </div>
            </header>

            {/* Main Content Layout */}
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 print-grid print:p-0 flex-grow">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-3.5 print-compact-gap">
                
                {/* Executive Summary */}
                {(filter === "all" || filter === "experience") && (
                  <section className="space-y-1">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-[#00ffc2] font-bold flex items-center gap-1.5 border-b border-[var(--color-border)] pb-1">
                      <Code2 size={13} /> Executive Summary
                    </h2>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-[var(--color-border)] print-box-padding print-text-shrink">
                      {RESUME_DATA.summary}
                    </p>
                  </section>
                )}

                {/* Work Experience */}
                {(filter === "all" || filter === "experience") && (
                  <section className="space-y-1.5">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-[#00ffc2] font-bold flex items-center gap-1.5 border-b border-[var(--color-border)] pb-1">
                      <Briefcase size={13} /> Work Experience
                    </h2>

                    {RESUME_DATA.experience.map((exp, idx) => (
                      <div 
                        key={idx} 
                        className="space-y-1 bg-gradient-to-b from-white/[0.03] to-transparent p-2.5 rounded-xl border border-[var(--color-border)] print-box-padding"
                      >
                        <div className="flex items-baseline justify-between gap-1">
                          <h3 className="text-xs font-bold text-[var(--color-text-primary)]">{exp.role}</h3>
                          <span className="print-chip text-[10px] font-mono font-semibold text-[#00ffc2] bg-[#00ffc2]/10 px-2 py-0.5 rounded border border-[#00ffc2]/20">
                            {exp.period}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-[var(--color-text-muted)] font-medium">{exp.company} • {exp.location}</div>
                        
                        <ul className="mt-1 space-y-1 text-[11px] text-[var(--color-text-secondary)]">
                          {exp.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5 leading-relaxed print-text-shrink">
                              <span className="text-[#00ffc2] print-icon-teal font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>
                )}

                {/* Featured Projects */}
                {(filter === "all" || filter === "projects") && (
                  <section className="space-y-1.5">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-[#00ffc2] font-bold flex items-center gap-1.5 border-b border-[var(--color-border)] pb-1">
                      <Layers size={13} /> Featured SaaS Projects
                    </h2>

                    {RESUME_DATA.projects.map((proj, idx) => (
                      <div key={idx} className="space-y-1 bg-white/[0.02] p-2.5 rounded-xl border border-[var(--color-border)] print-box-padding">
                        <div className="flex items-baseline justify-between flex-wrap gap-1">
                          <h3 className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1">
                            {proj.name} 
                            <span className="text-[10px] font-normal text-[var(--color-text-muted)]">({proj.subtitle})</span>
                          </h3>
                          <span className="text-[10px] font-mono text-[var(--color-text-muted)] font-medium">{proj.period}</span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed print-text-shrink">{proj.description}</p>
                        
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {proj.highlights.map((h, hIdx) => (
                            <span key={hIdx} className="print-chip px-1.5 py-0.5 rounded bg-[#00ffc2]/10 text-[#00ffc2] text-[9px] font-mono font-medium border border-[#00ffc2]/20">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {/* Programming Languages */}
                {(filter === "all" || filter === "skills") && (
                  <section className="space-y-1.5">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-[#00ffc2] font-bold flex items-center gap-1.5 border-b border-[var(--color-border)] pb-1">
                      <Code2 size={13} /> Programming Languages
                    </h2>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      {RESUME_DATA.programmingLanguages.map((lang, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white/[0.02] p-2 rounded-lg border border-[var(--color-border)] print-box-padding">
                          <span className="text-[var(--color-text-secondary)] font-semibold truncate pr-1">{lang.name}</span>
                          <div className="flex gap-1 shrink-0">
                            {[1, 2, 3, 4, 5].map((step) => (
                              <div
                                key={step}
                                className={`w-2 h-1.5 rounded-sm ${
                                  step <= lang.score
                                    ? "bg-[#00ffc2] print:bg-[#0f766e]"
                                    : "bg-white/10 print:bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-3.5 print-compact-gap">
                
                {/* Tech Stack */}
                {(filter === "all" || filter === "skills") && (
                  <section className="space-y-1.5">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-[#00ffc2] font-bold flex items-center gap-1.5 border-b border-[var(--color-border)] pb-1">
                      <Code2 size={13} /> Technical Stack
                    </h2>

                    <div className="flex flex-wrap gap-1.5">
                      {RESUME_DATA.technicalStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="print-chip px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Achievements */}
                {(filter === "all" || filter === "experience") && (
                  <section className="space-y-1.5">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-[#00ffc2] font-bold flex items-center gap-1.5 border-b border-[var(--color-border)] pb-1">
                      <Award size={13} /> Engineering Achievements
                    </h2>

                    <div className="space-y-1.5">
                      {RESUME_DATA.achievements.map((ach, idx) => (
                        <div key={idx} className="space-y-0.5 bg-white/[0.02] p-2 rounded-xl border border-[var(--color-border)] print-box-padding">
                          <h3 className="text-[11px] font-bold text-[var(--color-text-primary)] flex items-center gap-1">
                            <span className="text-[#00ffc2] print-icon-teal">⚡</span> {ach.title}
                          </h3>
                          <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed print-text-shrink">{ach.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {(filter === "all" || filter === "experience") && (
                  <section className="space-y-1.5">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-[#00ffc2] font-bold flex items-center gap-1.5 border-b border-[var(--color-border)] pb-1">
                      <GraduationCap size={13} /> Education
                    </h2>

                    {RESUME_DATA.education.map((edu, idx) => (
                      <div key={idx} className="bg-white/[0.02] p-2 rounded-xl border border-[var(--color-border)] print-box-padding">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-xs font-bold text-[var(--color-text-primary)]">{edu.degree}</h3>
                          <span className="text-[9px] font-mono text-[var(--color-text-muted)] font-medium">{edu.period}</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)] font-medium mt-0.5">{edu.institution} • {edu.location}</p>
                      </div>
                    ))}
                  </section>
                )}

              </div>

            </div>

            {/* Footer */}
            <footer className="print-footer border-t border-[var(--color-border)] py-2 px-4 text-center font-mono text-[9px] text-[var(--color-text-muted)] bg-black/40 mt-auto">
              Designed & Executed by {SITE_CONFIG.name} — Full Stack Engineer
            </footer>

          </motion.main>
        </div>
      </div>

    </div>
  );
}