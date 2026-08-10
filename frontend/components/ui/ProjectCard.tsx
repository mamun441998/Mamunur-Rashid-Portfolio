'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Convert comma-separated string to array: "Laravel, Next.js" -> ["Laravel", "Next.js"]
  const techList = project.tech_stack
    ? project.tech_stack.split(',').map((tech) => tech.trim())
    : [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="bg-[var(--panel)] border border-[var(--bd)] hover:border-[#00ffc2]/50 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 relative shadow-lg hover:shadow-[0_0_25px_rgba(0,255,194,0.15)]"
    >
      {/* Top Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00ffc2]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Card Header / Image Mockup */}
      <div className="relative w-full h-48 bg-[#111111] overflow-hidden flex items-center justify-center border-b border-white/5">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          /* Sleek Minimal Code Graphic Placeholder if Image is Missing */
          <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#121212] to-[#080808] font-mono text-xs text-gray-500 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <span className="text-gray-600 ml-2">system_architecture.v1</span>
            </div>
            <div className="text-[#00ffc2]/70 font-semibold text-sm tracking-wide">
              {`// ${project.title}`}
            </div>
            <div className="text-gray-600">
              STATUS: <span className="text-emerald-400">PRODUCTION_READY</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow justify-between z-10">
        <div>
          <h3 className="text-xl font-bold text-[var(--txt)] font-space-grotesk group-hover:text-[#00ffc2] transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-[var(--txt-2)] text-sm mt-3 leading-relaxed font-inter line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Pills & Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[var(--bd)] flex flex-col gap-4">
          {/* Tech List */}
          <div className="flex flex-wrap gap-1.5">
            {techList.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-[var(--panel-2)] text-[var(--color-accent)] border border-[#00ffc2]/20"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* External Links */}
          <div className="flex items-center gap-4 pt-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-[var(--txt-2)] hover:text-[var(--color-accent)] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                Source Code
              </a>
            )}

            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-[var(--color-accent)] hover:underline transition-all ml-auto"
              >
                Live Preview
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}