"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import ParticleField from "@/components/3d/ParticleField";
import SocialLinks from "@/components/ui/SocialLinks";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import TypewriterText from "@/components/ui/TypewriterText";
import { SITE_CONFIG } from "@/lib/constants";
import { useSettings } from "@/hooks/useSettings";
import { Handshake, Play, X } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const letterContainerVariants: Variants = {
  initial: {},
  hover: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      repeat: 1,
      repeatType: "reverse",
    },
  },
};

export default function Hero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { data: settings } = useSettings();

  // Live tagline from admin settings; fall back to the current static copy.
  const heroTagline = settings?.hero_tagline?.trim() || SITE_CONFIG.tagline;
  const heroRoles =
    settings?.role_title?.trim()
      ? [settings.role_title.trim(), ...SITE_CONFIG.roles]
      : SITE_CONFIG.roles;

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const nameFirstName = "MAMUNUR".split("");
  const nameLastName = "RASHID".split("");

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16 py-24 bg-[var(--color-background)] select-none"
    >
      {/* 3D Canvas Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticleField />
      </div>

      {/* Main Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl w-full text-center flex flex-col items-center"
      >
        {/* Role Badge */}
        <motion.div
          variants={itemVariants}
          className="mb-6 h-6 flex items-center justify-center"
        >
          <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[var(--color-accent)] font-mono font-medium">
            <TypewriterText words={heroRoles} />
          </span>
        </motion.div>

        {/* Interactive Name Container */}
        <motion.div variants={itemVariants} className="relative group cursor-pointer my-4 py-2">
          <motion.h1
            initial="initial"
            whileHover="hover"
            variants={letterContainerVariants}
            className="relative text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight font-space-grotesk flex items-center justify-center gap-3 sm:gap-6 px-4"
          >
            {/* First Name with Theme Adaptive Gradient */}
            <span className="relative inline-flex items-center tracking-tight group-hover:tracking-wider transition-all duration-500 bg-clip-text text-transparent bg-[length:200%_100%] bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-accent)] to-[var(--color-text-primary)] animate-text-shine">
              {nameFirstName.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>

            {/* Last Name with Theme Adaptive Gradient */}
            <span className="relative inline-flex items-center tracking-tight group-hover:tracking-wider transition-all duration-500 bg-clip-text text-transparent bg-[length:200%_100%] bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-text-primary)] to-[var(--color-accent)] animate-text-shine">
              {nameLastName.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <div className="flex items-center justify-center gap-2 mt-3 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="w-16 h-[1px] bg-gradient-to-r from-[var(--color-accent)] to-transparent" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-2xl text-base md:text-lg lg:text-xl text-[var(--color-text-secondary)] leading-relaxed font-inter"
        >
          {heroTagline}
        </motion.p>

        {/* Action Buttons & Social Links */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 w-full"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* View My Work Button */}
            <button
              onClick={scrollToProjects}
              type="button"
              className="rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-105 cursor-pointer whitespace-nowrap shadow-[0_0_20px_var(--color-accent-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]"
            >
              View My Work
            </button>

            {/* 🎥 WATCH 90s INTRO VIDEO BUTTON */}
            <button
              onClick={() => setIsVideoModalOpen(true)}
              type="button"
              className="group relative rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-surface)]/50 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-[var(--color-accent)] transition-all duration-300 hover:scale-105 hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)] cursor-pointer whitespace-nowrap flex items-center justify-center gap-2.5 shadow-[0_0_15px_var(--color-accent-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
                <Play className="w-3.5 h-3.5 fill-[var(--color-accent)] text-[var(--color-accent)] relative z-10" />
              </span>
              <span>Watch 90s Pitch</span>
            </button>

            {/* Get In Touch Button */}
            <button
              onClick={scrollToContact}
              type="button"
              className="group relative rounded-full border-2 border-[var(--color-border-hover)] px-7 py-3.5 text-sm font-medium text-[var(--color-text-primary)] transition-all duration-500 hover:border-[var(--color-accent)] cursor-pointer whitespace-nowrap overflow-hidden flex items-center justify-center min-w-[150px] h-[48px] shadow-lg hover:shadow-[0_0_25px_var(--color-accent-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]"
            >
              <span className="absolute inset-0 w-full h-full bg-[var(--color-accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0 rounded-full" />
              <span className="relative z-10 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2 group-hover:scale-90 font-medium">
                Get In Touch
              </span>
              <span className="absolute z-10 opacity-0 translate-y-2 scale-75 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-110 transition-all duration-300 text-black flex items-center justify-center">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
                >
                  <Handshake className="w-6 h-6 stroke-[2.2]" />
                </motion.div>
              </span>
            </button>
          </div>

          <div className="hidden sm:block w-px h-10 bg-[var(--color-border)]" />

          <SocialLinks />
        </motion.div>
      </motion.div>

      <ScrollIndicator />

      {/* 🎬 VIDEO MODAL POPUP */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md select-none"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-3 sm:p-5 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border)] px-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <span className="ml-2 text-xs font-mono text-[var(--color-text-secondary)] font-semibold">
                    Mamunur_Rashid_Professional_Pitch.mp4
                  </span>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="rounded-full p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Container (16:9 Aspect Ratio) */}
              <div className="relative aspect-video w-full rounded-xl bg-black overflow-hidden flex items-center justify-center border border-[var(--color-border)]">
                <iframe
                  src="https://www.youtube.com/embed/L_LUpnjgPso?autoplay=1"
                  title="Mamunur Rashid - Professional Intro Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}