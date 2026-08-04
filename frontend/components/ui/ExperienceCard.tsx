'use client';

import { motion } from 'framer-motion';
import { Experience } from '@/types';

interface ExperienceCardProps {
  experience: Experience;
  isLast?: boolean;
}

export default function ExperienceCard({ experience, isLast = false }: ExperienceCardProps) {
  // Format Date (e.g., "Dec 2025 - Present")
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const startDateFormatted = formatDate(experience.start_date);
  const endDateFormatted = experience.is_current
    ? 'Present'
    : formatDate(experience.end_date);

  return (
    <div className="relative pl-8 md:pl-10 group">
      {/* Timeline Vertical Line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-[#00ffc2]/50 via-white/10 to-transparent group-hover:from-[#00ffc2] transition-colors duration-500" />
      )}

      {/* Timeline Glowing Node */}
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[#050505] border-2 border-[#00ffc2] flex items-center justify-center shadow-[0_0_10px_rgba(0,255,194,0.4)] group-hover:scale-110 transition-transform duration-300">
        <div className="w-2 h-2 rounded-full bg-[#00ffc2] animate-pulse" />
      </div>

      {/* Experience Content Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-[#0a0a0a] border border-white/10 hover:border-[#00ffc2]/50 rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(0,255,194,0.1)] mb-10"
      >
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffc2]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00ffc2]/10 transition-colors duration-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white font-space-grotesk group-hover:text-[#00ffc2] transition-colors">
              {experience.role}
            </h3>
            <p className="text-[#00ffc2] font-mono text-sm mt-1 font-medium">
              @{experience.company}
            </p>
          </div>

          {/* Date Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-white/10 text-xs font-mono text-gray-300 self-start md:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffc2]" />
            {startDateFormatted} — {endDateFormatted}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm md:text-base leading-relaxed font-inter mt-4 whitespace-pre-line">
          {experience.description}
        </p>
      </motion.div>
    </div>
  );
}