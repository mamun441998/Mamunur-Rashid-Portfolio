"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import StatCard from "@/components/ui/StatCard";
import { ABOUT_CONTENT } from "@/lib/constants";
import { useSettings } from "@/hooks/useSettings";
import { Camera, Video } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function About() {
  const [activeTab, setActiveTab] = useState<"photo" | "video">("photo");
  const { data: settings } = useSettings();

  // Live bio paragraphs from admin settings; fall back to static copy.
  const paragraphs =
    settings?.about_text?.trim()
      ? settings.about_text
          .split(/\n{2,}|\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      : ABOUT_CONTENT.paragraphs;

  // Override the first two stat values from settings; keep labels + rest as-is.
  const stats = ABOUT_CONTENT.stats.map((stat, i) => {
    if (i === 0 && settings?.years_experience?.trim())
      return { ...stat, value: settings.years_experience.trim() };
    if (i === 1 && settings?.projects_completed?.trim())
      return { ...stat, value: settings.projects_completed.trim() };
    return stat;
  });

  return (
    <section
      id="about"
      className="snap-section relative flex items-center justify-center py-24 px-6 sm:px-10 lg:px-16 overflow-hidden bg-[var(--color-background)] select-none"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(0, 255, 194, 0.05), transparent 60%)",
        }}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[var(--color-accent)] font-mono font-semibold">
            About Me
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-bold text-glow text-[var(--color-text-primary)] leading-tight font-space-grotesk">
            Turning Complex Problems Into
            <br className="block sm:hidden" />
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}Scalable Software
            </span>
          </h2>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Framed Profile Media (Image & Video Switcher) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col items-center justify-center gap-4"
          >
            {/* 🎛️ TAB TOGGLE BUTTONS */}
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#0d1117] border border-white/10 shadow-lg">
              <button
                onClick={() => setActiveTab("photo")}
                type="button"
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "photo"
                    ? "bg-[var(--color-accent)] text-black font-semibold shadow-[0_0_15px_rgba(0,255,194,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Photo Profile
              </button>
              
              <button
                onClick={() => setActiveTab("video")}
                type="button"
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "video"
                    ? "bg-[var(--color-accent)] text-black font-semibold shadow-[0_0_15px_rgba(0,255,194,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Watch Intro
              </button>
            </div>

            {/* MEDIA DISPLAY CONTAINER */}
            <div className="relative w-full max-w-md h-[400px] sm:h-[480px] lg:h-[460px] group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[var(--color-accent)] to-cyan-500 blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" />

              <div className="relative w-full h-full rounded-3xl p-2 bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
                
                {/* PHOTO VIEW */}
                {activeTab === "photo" && (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/Profile-Picture.png"
                      alt="Mamunur Rashid"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-md flex items-center justify-between text-xs font-mono z-10">
                      <span className="text-white font-medium">Full Stack Tech Lead</span>
                      <span className="flex items-center gap-2 text-[var(--color-accent)] font-semibold">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
                        </span>
                        Available Worldwide
                      </span>
                    </div>
                  </div>
                )}

                {/* VIDEO VIEW */}
                {activeTab === "video" && (
                  <div className="relative w-full h-full rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-white/5">
                    <iframe
                      src="https://www.youtube.com/embed/L_LUpnjgPso"
                      title="Mamunur Rashid Video Intro"
                      className="w-full h-full border-0 rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio Paragraphs + Developer Code Terminal */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 font-inter"
            >
              {paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  variants={itemVariants}
                  className="text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base md:text-lg"
                >
                  {para}
                </motion.p>
              ))}
            </motion.div>

            {/* Developer IDE Code Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-2xl border border-[var(--color-border)] bg-[#0d1117] p-5 sm:p-6 shadow-2xl font-mono text-xs sm:text-sm relative overflow-hidden group"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                </div>
                <span className="text-gray-500 text-xs">engineer.config.ts</span>
              </div>

              <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
{`const engineer = {
  name: "Mamunur Rashid",
  role: "Full Stack Engineer",
  stack: ["Laravel", "Next.js", "PostgreSQL", "Docker"],
  focus: "SaaS & Multi-Tenant Systems Architecture",
  location: "Worldwide (Remote)",
  available: true,
};`}
              </pre>
            </motion.div>
          </div>

        </div>

        {/* Bottom Section: Stat Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={i * 0.1}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}