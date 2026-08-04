'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetcher } from '@/lib/api';
import { Project } from '@/types';
import ProjectCard from '@/components/ui/ProjectCard';
import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-96 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 animate-pulse flex flex-col justify-between"
        >
          <div>
            <div className="w-full h-40 bg-white/5 rounded-xl mb-6" />
            <div className="h-6 w-3/4 bg-white/10 rounded mb-3" />
            <div className="h-4 w-full bg-white/5 rounded mb-2" />
            <div className="h-4 w-2/3 bg-white/5 rounded" />
          </div>
          <div className="flex gap-2 pt-4 border-t border-white/5">
            <div className="h-6 w-16 bg-white/10 rounded-md" />
            <div className="h-6 w-16 bg-white/10 rounded-md" />
            <div className="h-6 w-16 bg-white/10 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<'All' | 'SaaS' | 'Web Apps'>('All');

  const { data: projects = [], isLoading, isError } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => fetcher<Project[]>('/api/projects/'),
  });

  // Client-side filtering logic based on tech stack or title keywords
  const filteredProjects = projects.filter((project) => {
    if (filter === 'SaaS') {
      return (
        project.title.toLowerCase().includes('saas') ||
        project.description.toLowerCase().includes('saas') ||
        project.description.toLowerCase().includes('multi-tenant')
      );
    }
    if (filter === 'Web Apps') {
      return (
        !project.title.toLowerCase().includes('saas') &&
        !project.description.toLowerCase().includes('saas')
      );
    }
    return true; // 'All'
  });

  return (
    <section
      id="projects"
      className="min-h-screen w-full py-24 px-6 sm:px-10 lg:px-16 flex flex-col justify-center items-center bg-[#050505] text-white snap-start relative overflow-hidden select-none"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#00ffc2]/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Wide Container */}
      <div className="max-w-7xl w-full z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-space-grotesk"
          >
            Featured <span className="text-[#00ffc2] text-glow">Projects</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 mt-3 max-w-xl text-sm md:text-base font-inter"
          >
            Production-grade SaaS platforms, multi-tenant architectures, and scalable web applications.
          </motion.p>
        </div>

        {/* Filter Buttons */}
        {!isLoading && !isError && (
          <div className="flex justify-center gap-2 mb-12">
            {(['All', 'SaaS', 'Web Apps'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 border cursor-pointer ${
                  filter === tab
                    ? 'bg-[#00ffc2]/10 border-[#00ffc2] text-[#00ffc2] shadow-[0_0_15px_rgba(0,255,194,0.2)]'
                    : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-10 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl w-full font-mono text-sm">
            Failed to load projects from API. Ensure FastAPI backend is running.
          </div>
        )}

        {/* Skeleton Loading State */}
        {isLoading && <ProjectsSkeleton />}

        {/* Projects Grid */}
        {!isLoading && !isError && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty Filter Fallback */}
        {!isLoading && !isError && filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-mono text-sm">
            No projects found for the selected category.
          </div>
        )}

        {/* Glass Liquid Filling Animated CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex justify-center"
        >
          <Link
            href="/projects/auto-marketplace-modernization"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl overflow-hidden font-mono text-sm font-semibold tracking-wide border border-[#00ffc2]/40 bg-white/[0.03] text-white shadow-[0_0_20px_rgba(0,255,194,0.15)] transition-all duration-500 hover:border-[#00ffc2] hover:shadow-[0_0_35px_rgba(0,255,194,0.35)] active:scale-95"
          >
            {/* Glass Liquid Water Fill Wave Effect */}
            <span className="absolute inset-0 w-full h-full bg-[#00ffc2] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0 opacity-90 rounded-2xl" />

            {/* Glowing Particle Backdrop */}
            <span className="absolute -top-10 -left-10 w-24 h-24 bg-[#00ffc2]/30 rounded-full blur-xl group-hover:opacity-0 transition-opacity" />

            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-2.5 text-gray-200 group-hover:text-black font-bold transition-colors duration-300">
              <Layers className="w-4 h-4 text-[#00ffc2] group-hover:text-black transition-colors" />
              <span>Explore Architecture Case Study</span>
              <ArrowRight className="w-4 h-4 text-[#00ffc2] group-hover:text-black group-hover:translate-x-1 transition-all duration-300" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}