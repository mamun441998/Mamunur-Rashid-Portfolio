'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetcher } from '@/lib/api';
import { Experience as ExperienceType } from '@/types';
import ExperienceCard from '@/components/ui/ExperienceCard';
import { Terminal, Cpu, ExternalLink } from 'lucide-react';

// Custom Safe SVG GitHub Icon to prevent lucide-react export issues
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Extended type interface locally to ensure type safety for repository links
interface ExtendedExperience extends ExperienceType {
  repo_url?: string;
}

function ExperienceSkeleton() {
  return (
    <div className="w-full space-y-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="pl-8 md:pl-10 relative animate-pulse">
          <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white/10" />
          <div className="h-44 bg-[var(--panel-2)] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
            <div className="h-6 w-1/3 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-2/3 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Software Engineering Motion Visualizer Wrapper
function TechnicalMotionCard({
  children,
  index,
  repoUrl,
}: {
  children: React.ReactNode;
  index: number;
  repoUrl?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.2,
        ease: [0.215, 0.61, 0.355, 1.0],
      }}
      className="relative group mb-10"
    >
      {/* Circuit Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#081419]/0 via-[#081419]/20 to-[#081419]/0 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Top Corner Icons (Cpu + GitHub Link) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View Repository on GitHub"
            className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-[var(--bd)] text-[var(--txt-2)] hover:text-[var(--color-accent)] hover:border-[#00ffc2]/40 hover:bg-[#00ffc2]/10 transition-all duration-300 group/link"
          >
            <GithubIcon className="w-3.5 h-3.5 transition-transform group-hover/link:scale-110" />
            <span className="hidden sm:inline">Repo</span>
            <ExternalLink className="w-3 h-3 opacity-70 group-hover/link:opacity-100" />
          </a>
        )}
        <div className="p-1 opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Cpu className="w-4 h-4 text-[var(--color-accent)] animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 bg-[var(--panel-3)] border border-[var(--bd)] group-hover:border-[#081419]/30 rounded-2xl p-1 transition-all duration-500 shadow-xl">
        {children}
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { data: apiExperiences = [], isLoading } = useQuery<ExtendedExperience[]>({
    queryKey: ['experiences'],
    queryFn: () => fetcher<ExtendedExperience[]>('/api/experiences/'),
  });

  // 100% admin-controlled: show exactly what the API returns (no mock fallback),
  // so the frontend and the admin Experience Log always match.
  const experiences = apiExperiences;

  return (
    <section
      id="experience" data-theme="light"
      className="min-h-screen w-full py-24 px-6 sm:px-10 lg:px-16 flex flex-col justify-center items-center bg-[var(--sec-bg)] text-[var(--txt)] snap-start relative overflow-hidden select-none"
    >
      {/* Glow Effects */}
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-[#00ffc2]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[350px] h-[350px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ffc2]/10 border border-[#00ffc2]/20 text-[var(--color-accent)] text-xs font-mono mb-4"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CAREER_TIMELINE.LOG</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-space-grotesk"
          >
            Work <span className="text-[var(--color-accent)] text-glow">Experience</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[var(--txt-2)] mt-3 max-w-xl text-sm md:text-base font-inter"
          >
            My professional software engineering roadmap, production platforms, and scalable architecture implementations.
          </motion.p>
        </div>

        {/* Loading State */}
        {isLoading && <ExperienceSkeleton />}

        {/* Dynamic Motion Experience Cards */}
        {!isLoading && (
          <div className="w-full mt-4 relative">
            <div className="absolute left-[11px] md:left-[19px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#00ffc2] via-cyan-500/30 to-transparent z-0 hidden md:block" />

            {experiences.map((exp, index) => (
              <TechnicalMotionCard 
                key={exp.id || index} 
                index={index}
                repoUrl={exp.repo_url}
              >
                <ExperienceCard
                  experience={exp}
                  isLast={index === experiences.length - 1}
                />
              </TechnicalMotionCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}