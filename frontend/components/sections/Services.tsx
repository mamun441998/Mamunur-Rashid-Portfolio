'use client';

import { motion } from 'framer-motion';
import { 
  Code2, 
  Cpu, 
  Layers, 
  Zap, 
  Globe2, 
  ShieldCheck, 
  ArrowUpRight, 
  Terminal,
  CheckCircle2
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: any;
  features: string[];
  techStack: string[];
  highlight?: boolean;
}

const services: ServiceItem[] = [
  {
    id: 'saas',
    title: 'Full-Stack SaaS Architecture',
    tagline: 'Scale from Day 0',
    description: 'Design and build multi-tenant, production-ready SaaS platforms with secure authentication, Stripe billing, and high-performance databases.',
    icon: Layers,
    features: ['Multi-Tenant Architecture', 'Automated Subscription Billing', 'Role-Based Access Control (RBAC)'],
    techStack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe'],
    highlight: true,
  },
  {
    id: 'webapps',
    title: 'High-Performance Web Applications',
    tagline: 'Blazing-Fast UX',
    description: 'Pixel-perfect, accessible, and fast web experiences built with modern React standards, server-side rendering, and dynamic motion design.',
    icon: Code2,
    features: ['SEO & Core Web Vitals Optimized', 'Fluid Motion & Micro-Interactions', 'Responsive Across All Devices'],
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'api-backend',
    title: 'Backend Engineering & APIs',
    tagline: 'Robust & Scalable Systems',
    description: 'Architecting resilient RESTful & GraphQL APIs, microservices, and database schemas with ultra-low latency and seamless integration.',
    icon: Cpu,
    features: ['Scalable Microservices', 'Database Query Optimization', 'Real-time WebSockets'],
    techStack: ['Node.js', 'Express', 'Prisma', 'Redis', 'Docker'],
  },
  {
    id: 'performance',
    title: 'Web Performance & Code Audit',
    tagline: 'Fix Bottlenecks Fast',
    description: 'Deep-dive code reviews, memory leak diagnosis, core web vitals optimization, and converting laggy apps into lightning-fast experiences.',
    icon: Zap,
    features: ['Bundle Size Reduction', '95+ Lighthouse Score Guarantee', 'Security & Vulnerability Audits'],
    techStack: ['Lighthouse', 'Chrome DevTools', 'Next.js Analytics'],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Deployment & CI/CD',
    tagline: 'Zero-Downtime Releases',
    description: 'Automated CI/CD pipelines, containerization, and cloud infrastructure setup for high availability and zero-downtime deployments.',
    icon: Globe2,
    features: ['Docker & Containerization', 'Automated Testing Pipelines', 'Vercel & AWS Deployment'],
    techStack: ['Docker', 'GitHub Actions', 'AWS', 'Vercel'],
  },
  {
    id: 'maintenance',
    title: 'Enterprise Technical Advisory',
    tagline: 'Engineering Leadership',
    description: 'Consulting for startups and businesses on tech stack selection, system architecture design, and modernizing legacy codebases.',
    icon: ShieldCheck,
    features: ['Architecture Blueprints', 'Tech Stack Selection', 'Code Quality Guidelines'],
    techStack: ['System Design', 'Code Reviews', 'Agile Architecture'],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="py-24 px-6 sm:px-10 lg:px-16 bg-[var(--color-background)] text-[var(--color-text-primary)] relative overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-mono font-medium tracking-wide"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>ENGINEERING CAPABILITIES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-space-grotesk tracking-tight max-w-3xl"
          >
            Architecting <span className="text-[var(--color-accent)]">Scalable</span> & High-Impact Digital Solutions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[var(--color-text-secondary)] max-w-2xl text-sm md:text-base font-inter"
          >
            I deliver enterprise-grade engineering—combining modern frontend mechanics with resilient backend architectures designed to scale seamlessly.
          </motion.p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group relative p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col justify-between overflow-hidden ${
                  service.highlight ? 'lg:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Top Header: Icon & Tagline */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-accent)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">
                      {service.tagline}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold font-space-grotesk mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] font-inter leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Key Deliverables / Features List */}
                  <div className="space-y-2 mb-8">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-inter text-[var(--color-text-secondary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Footer: Tech Stack Badges */}
                <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {service.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
                    aria-label={`Inquire about ${service.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative overflow-hidden"
        >
          <div className="space-y-2 z-10">
            <h4 className="text-xl font-bold font-space-grotesk">
              Have a custom project or architecture in mind?
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] font-inter max-w-xl">
              Let's build a secure, fast, and scalable solution tailored precisely to your technical requirements.
            </p>
          </div>

          <a
            href="#contact"
            className="z-10 shrink-0 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-black font-semibold font-space-grotesk text-sm"
          >
            Start a Conversation
          </a>
        </motion.div>

      </div>
    </section>
  );
}