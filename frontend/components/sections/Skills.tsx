'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { fetcher } from '@/lib/api';
import { Skill } from '@/types';

// Map skill names to official SVG icons (Devicon / Simple Icons CDN)
const ICON_MAP: Record<string, string> = {
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  fastapi: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  laravel: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  php: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'rest apis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'authentication & authorization': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'object-oriented programming': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'react.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'tailwind css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  mysql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'query optimization': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'database design': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'git & github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  linux: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
};

function SkillSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-36 bg-[var(--input)] border border-white/5 rounded-2xl p-5 animate-pulse flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-xl"></div>
              <div className="h-5 w-28 bg-white/10 rounded"></div>
            </div>
            <div className="h-4 w-8 bg-white/10 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/10 rounded-full"></div>
            <div className="h-3 w-16 bg-white/10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data: skills = [], isLoading, isError } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: () => fetcher<Skill[]>('/api/skills/'),
  });

  const categories = useMemo(() => {
    if (!skills.length) return ['All'];
    const uniqueCategories = Array.from(new Set(skills.map((s) => s.category)));
    return ['All', ...uniqueCategories];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter((skill) => skill.category === selectedCategory);
  }, [skills, selectedCategory]);

  const getSkillIcon = (name: string) => {
    const key = name.toLowerCase();
    return ICON_MAP[key] || null;
  };

  return (
    <section
      id="skills"
      className="min-h-screen w-full py-24 px-6 sm:px-10 lg:px-16 flex flex-col justify-center items-center bg-[var(--sec-bg)] text-[var(--txt)] snap-start relative overflow-hidden select-none"
    >
      {/* Background Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ffc2]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Main Wide Container */}
      <div className="max-w-7xl w-full z-10">
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-space-grotesk"
          >
            Technical <span className="text-[#00ffc2] text-glow">Expertise</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 mt-3 max-w-xl text-sm md:text-base font-inter"
          >
            My production-tested tech stack and core engineering capabilities.
          </motion.p>
        </div>

        {/* Category Filter Tabs */}
        {!isLoading && !isError && (
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 border cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#00ffc2]/10 border-[#00ffc2] text-[#00ffc2] shadow-[0_0_15px_rgba(0,255,194,0.25)]'
                    : 'bg-[var(--panel-2)] border-[var(--bd)] text-gray-400 hover:border-white/20 hover:text-[var(--txt)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-10 text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl font-mono text-sm">
            Failed to load skills from backend API. Make sure FastAPI server is running.
          </div>
        )}

        {isLoading && <SkillSkeleton />}

        {/* Optimized Grid Layout for 1280px+ Wide Screens */}
        {!isLoading && !isError && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            <AnimatePresence>
              {filteredSkills.map((skill) => {
                const iconUrl = getSkillIcon(skill.name);
                return (
                  <motion.div
                    layout
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--panel)] border border-[var(--bd)] hover:border-[#00ffc2]/40 rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ffc2]/0 via-[#00ffc2]/5 to-[#00ffc2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          {iconUrl ? (
                            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
                              <Image
                                src={iconUrl}
                                alt={skill.name}
                                width={32}
                                height={32}
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-[#00ffc2]/10 border border-[#00ffc2]/30 flex items-center justify-center shrink-0 text-[#00ffc2]">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                          )}
                          <h3 className="font-semibold text-base sm:text-lg text-[var(--txt)] font-space-grotesk group-hover:text-[#00ffc2] transition-colors leading-snug">
                            {skill.name}
                          </h3>
                        </div>
                        <span className="text-xs font-mono text-gray-400">{skill.proficiency}%</span>
                      </div>
                    </div>

                    <div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mt-2">
                        <motion.div
                          className="bg-[#00ffc2] h-full rounded-full shadow-[0_0_8px_#00ffc2]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>

                      <div className="mt-3 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                        {skill.category}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}