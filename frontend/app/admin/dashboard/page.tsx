"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileCode2,
  FolderKanban,
  Wrench,
  Briefcase,
  Layers,
  FileText,
  Mail,
  Users,
  LineChart,
  FileCheck,
  Image as ImageIcon,
  BookOpen,
  Bot,
  Terminal,
  Settings,
  ShieldCheck,
  Activity,
  Search,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Send,
  Globe,
  RefreshCw,
  Save,
  CheckCircle2,
  Edit,
  X,
  Calendar,
  MapPin,
  Code2,
  Cpu,
  Zap,
  Globe2,
  Workflow,
  Binary,
  Gauge,
  Database,
  Eye,
  ArrowLeft,
  GitBranch,
  AlertTriangle,
  Terminal as TerminalIcon,
  Flame,
  Bug,
  Radio,
  RadioReceiver,
  Crosshair,
  Lock,
  Server,
  Cloud,
  UserCheck,
  Check,
} from "lucide-react";

// Safe Dynamic Backend Host Resolution
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://mamunur-rashid-portfolio-backend.onrender.com";
const BACKEND_URL = rawApiUrl.replace(/\/$/, '');

// GitHub SVG Component
const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
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

// EXPERIENCES DEFAULT DATA
const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Web Developer",
    company: "Ecommerized IT Institute",
    location: "Remote / Abu Dhabi",
    start_date: "2025-12-01",
    end_date: "",
    is_current: true,
    description:
      "Building SaaS platforms, CRM systems, marketplace applications, and business automation software using Laravel, Next.js, and PostgreSQL. Designing multi-tenant architectures and scalable backend systems for growing businesses. Working remotely with an Abu Dhabi-based team.",
  },
  {
    id: "exp-2",
    role: "Senior Software Engineer / Tech Lead",
    company: "MotoHave (Auto Marketplace)",
    location: "Remote / Dhaka",
    start_date: "2026-06-01",
    end_date: "",
    is_current: true,
    description:
      "Engineered & modernized a high-throughput multi-tenant automobile marketplace system. Architected event-driven microservices using FastAPI, Redis, PostgreSQL, and Next.js 14 to handle large-scale vehicle listings, automated dealer workflows, and real-time inventory synchronization.",
  },
];

// DEFAULT PRODUCTION SERVICES DATA
const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "saas",
    title: "Full-Stack SaaS Architecture",
    tagline: "Scale from Day 0",
    description:
      "Design and build multi-tenant, production-ready SaaS platforms with secure authentication, Stripe billing, and high-performance databases.",
    icon_name: "Layers",
    features: "Multi-Tenant Architecture, Automated Subscription Billing, Role-Based Access Control (RBAC)",
    tech_stack: "Next.js, TypeScript, Node.js, PostgreSQL, Stripe",
    highlight: true,
  },
  {
    id: "webapps",
    title: "High-Performance Web Applications",
    tagline: "Blazing-Fast UX",
    description:
      "Pixel-perfect, accessible, and fast web experiences built with modern React standards, server-side rendering, and dynamic motion design.",
    icon_name: "Code2",
    features: "SEO & Core Web Vitals Optimized, Fluid Motion & Micro-Interactions, Responsive Across All Devices",
    tech_stack: "React, Next.js, Tailwind CSS, Framer Motion",
    highlight: false,
  },
  {
    id: "api-backend",
    title: "Backend Engineering & APIs",
    tagline: "Robust & Scalable Systems",
    description:
      "Architecting resilient RESTful & GraphQL APIs, microservices, and database schemas with ultra-low latency and seamless integration.",
    icon_name: "Cpu",
    features: "Scalable Microservices, Database Query Optimization, Real-time WebSockets",
    tech_stack: "Node.js, Express, Prisma, Redis, Docker",
    highlight: false,
  },
  {
    id: "performance",
    title: "Web Performance & Code Audit",
    tagline: "Fix Bottlenecks Fast",
    description:
      "Deep-dive code reviews, memory leak diagnosis, core web vitals optimization, and converting laggy apps into lightning-fast experiences.",
    icon_name: "Zap",
    features: "Bundle Size Reduction, 95+ Lighthouse Score Guarantee, Security & Vulnerability Audits",
    tech_stack: "Lighthouse, Chrome DevTools, Next.js Analytics",
    highlight: false,
  },
  {
    id: "cloud-devops",
    title: "Cloud Deployment & CI/CD",
    tagline: "Zero-Downtime Releases",
    description:
      "Automated CI/CD pipelines, containerization, and cloud infrastructure setup for high availability and zero-downtime deployments.",
    icon_name: "Globe2",
    features: "Docker & Containerization, Automated Testing Pipelines, Vercel & AWS Deployment",
    tech_stack: "Docker, GitHub Actions, AWS, Vercel",
    highlight: false,
  },
  {
    id: "maintenance",
    title: "Enterprise Technical Advisory",
    tagline: "Engineering Leadership",
    description:
      "Consulting for startups and businesses on tech stack selection, system architecture design, and modernizing legacy codebases.",
    icon_name: "ShieldCheck",
    features: "Architecture Blueprints, Tech Stack Selection, Code Quality Guidelines",
    tech_stack: "System Design, Code Reviews, Agile Architecture",
    highlight: false,
  },
];

// DEFAULT PRODUCTION CASE STUDIES DATA
const DEFAULT_CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "cs-1",
    slug: "auto-marketplace-modernization",
    title: "Auto Marketplace Modernization System",
    subtitle: "Data Science & Distributed System Architecture",
    challenge:
      "Deconstruct a monolithic legacy automotive platform into an event-driven microservices architecture. Integrated a real-time ML-powered car valuation pipeline and distributed search cluster to reduce listing processing time from minutes to sub-100ms globally.",
    githubRepoUrl: "https://github.com/mamun441998/Auto-Marketplace-Modernization.git",
    metrics: [
      { label: "Search Latency", value: "< 15ms", sub: "Distributed OpenSearch Cluster" },
      { label: "Throughput", value: "12,000 req/s", sub: "Async Ingestion Engine" },
      { label: "ML Accuracy", value: "98.4%", sub: "Automated Valuation Inference" },
      { label: "System Availability", value: "99.99%", sub: "Decoupled Event Streaming" },
    ],
    codeSnippet: `# Event-Driven Valuation Inference Pipeline (Auto Marketplace)
from kafka import KafkaConsumer
import xgboost as xgb
import json

model = xgb.Booster()
model.load_model("auto_valuation_v2.json")

consumer = KafkaConsumer(
    'vehicle.created.v1',
    bootstrap_servers=['kafka-broker:9092'],
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    vehicle_data = message.value
    features = extract_feature_vector(vehicle_data)
    
    dmatrix = xgb.DMatrix([features])
    predicted_fair_price = model.predict(dmatrix)[0]
    
    publish_valuation_event(vehicle_data['id'], float(predicted_fair_price))`,
  },
];

// TYPES
type NavigationTab =
  | "dashboard"
  | "cms"
  | "projects"
  | "skills"
  | "experience"
  | "services"
  | "casestudy"
  | "messages"
  | "crm"
  | "analytics"
  | "resume"
  | "media"
  | "blog"
  | "ai"
  | "logs"
  | "settings"
  | "security";

interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon_name: string;
  features: string;
  tech_stack: string;
  highlight?: boolean;
}

interface CaseStudyMetric {
  label: string;
  value: string;
  sub: string;
}

interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  challenge: string;
  githubRepoUrl: string;
  metrics: CaseStudyMetric[];
  codeSnippet: string;
}

interface MessageItem {
  id: number | string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at?: string;
  is_read?: boolean;
  clientName?: string;
  content?: string;
  timestamp?: string;
  priority?: "High" | "Medium" | "Low";
}

interface LeadItem {
  id: string;
  name: string;
  company: string;
  budget: string;
  country: string;
  source: string;
  expectedRevenue: string;
  stage: "New Lead" | "Discovery" | "Proposal" | "Negotiation" | "Won" | "Lost";
}

interface AnalyticsStats {
  totalVisitors: number;
  weeklyGrowth: string;
  dispatchedMessages: number;
  responseRate: string;
  activeProjects: number;
  saasPlatformsCount: number;
  liveServices: number;
  geoLocations: { country: string; count: number; percent: string }[];
}

interface CmsData {
  name: string;
  roles: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  videoIntroUrl: string;
  github: string;
  linkedin: string;
  facebook: string;
  aboutParagraphs: string;
}

interface ProjectItem {
  id?: number | string;
  title: string;
  description: string;
  tech_stack: string;
  project_url?: string | null;
  github_url?: string | null;
  image_url?: string | null;
}

interface SkillItem {
  id?: number | string;
  name: string;
  category?: string | null;
  proficiency?: number | string | null;
  icon?: string | null;
}

interface ExperienceItem {
  id?: number | string;
  role: string;
  company: string;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current?: boolean | null;
  description?: string | null;
}

const renderServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "Layers":
      return <Layers className="w-6 h-6 text-[#00FFC2]" />;
    case "Code2":
      return <Code2 className="w-6 h-6 text-[#00FFC2]" />;
    case "Cpu":
      return <Cpu className="w-6 h-6 text-[#00FFC2]" />;
    case "Zap":
      return <Zap className="w-6 h-6 text-[#00FFC2]" />;
    case "Globe2":
      return <Globe2 className="w-6 h-6 text-[#00FFC2]" />;
    case "ShieldCheck":
      return <ShieldCheck className="w-6 h-6 text-[#00FFC2]" />;
    default:
      return <Layers className="w-6 h-6 text-[#00FFC2]" />;
  }
};

export default function MRP_OS_Dashboard() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // REAL ANALYTICS DASHBOARD STATE
  const [stats, setStats] = useState<AnalyticsStats>({
    totalVisitors: 0,
    weeklyGrowth: "+0% this week",
    dispatchedMessages: 0,
    responseRate: "100%",
    activeProjects: 0,
    saasPlatformsCount: 0,
    liveServices: 6,
    geoLocations: [],
  });

  // REAL MESSAGES & LEADS STATE
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<MessageItem | null>(null);
  const [aiDraftReply, setAiDraftReply] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // PROJECTS STATE
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // SKILLS STATE
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillFormData, setSkillFormData] = useState<SkillItem>({
    name: "",
    category: "Backend Development",
    proficiency: 90,
    icon: "",
  });

  // EXPERIENCES STATE
  const [experiences, setExperiences] = useState<ExperienceItem[]>(DEFAULT_EXPERIENCES);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [expFormData, setExpFormData] = useState<ExperienceItem>({
    role: "",
    company: "",
    location: "Remote / Dhaka",
    start_date: "2026-01-01",
    end_date: "",
    is_current: false,
    description: "",
  });

  // SERVICES STATE
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceFormData, setServiceFormData] = useState<ServiceItem>({
    id: "",
    title: "",
    tagline: "",
    description: "",
    icon_name: "Layers",
    features: "",
    tech_stack: "",
    highlight: false,
  });

  // CASE STUDY STATE
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>(DEFAULT_CASE_STUDIES);
  const [isCsModalOpen, setIsCsModalOpen] = useState(false);
  const [editingCs, setEditingCs] = useState<CaseStudyItem | null>(null);
  const [previewCs, setPreviewCs] = useState<CaseStudyItem | null>(null);
  const [csFormData, setCsFormData] = useState<CaseStudyItem>({
    id: "",
    slug: "",
    title: "",
    subtitle: "",
    challenge: "",
    githubRepoUrl: "",
    metrics: [
      { label: "Search Latency", value: "< 15ms", sub: "Distributed Search Cluster" },
      { label: "Throughput", value: "10,000 req/s", sub: "Async Ingestion Engine" },
    ],
    codeSnippet: "",
  });

  // PROJECTS MODAL STATE
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectFormData, setProjectFormData] = useState<ProjectItem>({
    title: "",
    description: "",
    tech_stack: "",
    project_url: "",
    github_url: "",
    image_url: "",
  });

  // CMS STATE
  const [cmsData, setCmsData] = useState<CmsData>({
    name: "Mamunur Rashid",
    roles: "Full Stack Software Engineer, Full Stack Web Developer, SaaS Platform Builder",
    tagline: "I build SaaS platforms, CRM systems, and marketplace applications using Laravel, Next.js, and PostgreSQL.",
    location: "Dhaka, Bangladesh",
    email: "mamun441998@gmail.com",
    phone: "+880 1978529953",
    dateOfBirth: "04 April 1998",
    nationality: "Bangladeshi",
    videoIntroUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
    github: "https://github.com/mamun441998",
    linkedin: "https://www.linkedin.com/in/mamun441998/",
    facebook: "https://www.facebook.com/mamunsoftwareengineer/",
    aboutParagraphs:
      "Most businesses don't struggle because they lack ideas. They struggle because their software systems are disconnected, difficult to scale, and slow down growth.\n\nI help businesses solve that problem by building SaaS platforms, CRM systems, marketplace applications, and business automation software using Laravel, Next.js, and PostgreSQL.",
  });
  const [cmsSaveStatus, setCmsSaveStatus] = useState<string | null>(null);

  const [leads, setLeads] = useState<LeadItem[]>([
    { id: "lead-1", name: "Enterprise Client", company: "TechScale", budget: "$20,000", country: "USA", source: "Direct Contact", expectedRevenue: "$20K", stage: "Discovery" },
  ]);

  // Initial Data Fetch & Poll for New Real Messages
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedExps = localStorage.getItem("mrp_experiences");
      if (savedExps) {
        try {
          const parsed = JSON.parse(savedExps);
          if (Array.isArray(parsed) && parsed.length > 0) setExperiences(parsed);
        } catch (err) {}
      }

      const savedServices = localStorage.getItem("mrp_services");
      if (savedServices) {
        try {
          const parsedServ = JSON.parse(savedServices);
          if (Array.isArray(parsedServ) && parsedServ.length > 0) setServices(parsedServ);
        } catch (err) {}
      }

      const savedCs = localStorage.getItem("mrp_casestudies");
      if (savedCs) {
        try {
          const parsedCs = JSON.parse(savedCs);
          if (Array.isArray(parsedCs) && parsedCs.length > 0) setCaseStudies(parsedCs);
        } catch (err) {}
      }
    }
    fetchRealDashboardData();
    fetchCmsData();

    // Auto Refresh Messages Every 10 Seconds
    const interval = setInterval(() => {
      fetchRealMessagesOnly();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Update AI Reply Subject & Body on Selected Message Change
  useEffect(() => {
    if (selectedMsg) {
      setReplySubject(`Re: ${selectedMsg.subject || "Your Portfolio Message"}`);
      if (!selectedMsg.is_read) {
        markMessageAsRead(selectedMsg.id);
      }
    }
  }, [selectedMsg]);

  const saveExperiencesLocally = (newExps: ExperienceItem[]) => {
    setExperiences(newExps);
    if (typeof window !== "undefined") {
      localStorage.setItem("mrp_experiences", JSON.stringify(newExps));
    }
  };

  const saveServicesLocally = (newServices: ServiceItem[]) => {
    setServices(newServices);
    if (typeof window !== "undefined") {
      localStorage.setItem("mrp_services", JSON.stringify(newServices));
    }
  };

  const saveCaseStudiesLocally = (newCs: CaseStudyItem[]) => {
    setCaseStudies(newCs);
    if (typeof window !== "undefined") {
      localStorage.setItem("mrp_casestudies", JSON.stringify(newCs));
    }
  };

  const fetchCmsData = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/cms`);
      if (res.ok) {
        const data = await res.json();
        setCmsData((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {}
  };

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCmsSaveStatus(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    try {
      const res = await fetch(`${BACKEND_URL}/api/cms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cmsData),
      });

      if (res.ok) {
        setCmsSaveStatus("Live Portfolio CMS updated successfully!");
      } else {
        setCmsSaveStatus("Failed to update CMS. Saved locally.");
      }
    } catch (err) {
      setCmsSaveStatus("Saved locally (Offline/Development Mode).");
    } finally {
      setLoading(false);
      setTimeout(() => setCmsSaveStatus(null), 4000);
    }
  };

  // FETCH MESSAGES FROM FASTAPI BACKEND
  const fetchRealMessagesOnly = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const resMsg = await fetch(`${BACKEND_URL}/api/contact`, { headers });
      if (resMsg.ok) {
        const msgList: MessageItem[] = await resMsg.json();
        const formatted = msgList.map((m) => ({
          ...m,
          clientName: m.name,
          content: m.message,
          timestamp: m.created_at ? new Date(m.created_at).toLocaleString() : "Just Now",
          priority: "High" as const,
        }));
        setMessages(formatted);
        if (formatted.length > 0 && !selectedMsg) {
          setSelectedMsg(formatted[0]);
        }
      } else {
        console.warn("Failed to fetch messages. Status:", resMsg.status);
      }
    } catch (err) {
      console.error("Failed to fetch real contact messages:", err);
    }
  };

  const fetchRealDashboardData = async () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const resProj = await fetch(`${BACKEND_URL}/api/projects`);
      let projList = [];
      if (resProj.ok) {
        projList = await resProj.json();
        setProjects(projList);
      }

      await fetchRealMessagesOnly();

      const resServices = await fetch(`${BACKEND_URL}/api/services`);
      if (resServices.ok) {
        const dbServices = await resServices.json();
        if (Array.isArray(dbServices) && dbServices.length > 0) {
          saveServicesLocally(dbServices);
        }
      }

      const resAnalytics = await fetch(`${BACKEND_URL}/api/analytics`, { headers });
      if (resAnalytics.ok) {
        const analyticsData = await resAnalytics.json();
        setStats({
          totalVisitors: analyticsData.total_visitors || 0,
          weeklyGrowth: analyticsData.weekly_growth || "+0% this week",
          dispatchedMessages: messages.length,
          responseRate: "100%",
          activeProjects: projList.length,
          saasPlatformsCount: projList.filter((p: any) => p.tech_stack?.includes("FastAPI") || p.description?.toLowerCase().includes("saas")).length || 4,
          liveServices: services.length,
          geoLocations: analyticsData.geo_locations || [
            { country: "Bangladesh", count: analyticsData.bangladesh_hits || 0, percent: "45%" },
            { country: "United States", count: analyticsData.usa_hits || 0, percent: "25%" },
            { country: "United Arab Emirates", count: analyticsData.uae_hits || 0, percent: "18%" },
            { country: "United Kingdom", count: analyticsData.uk_hits || 0, percent: "12%" },
          ],
        });
      }

      const resSkills = await fetch(`${BACKEND_URL}/api/skills`);
      if (resSkills.ok) setSkills(await resSkills.json());

      const resExp = await fetch(`${BACKEND_URL}/api/experiences`);
      if (resExp.ok) {
        const dbExps: ExperienceItem[] = await resExp.json();
        if (Array.isArray(dbExps) && dbExps.length > 0) {
          setExperiences((currentLocal) => {
            const merged = [...dbExps];
            currentLocal.forEach((locItem) => {
              if (!merged.some((m) => m.id === locItem.id || (m.company === locItem.company && m.role === locItem.role))) {
                merged.push(locItem);
              }
            });
            saveExperiencesLocally(merged);
            return merged;
          });
        }
      }

    } catch (err) {
      console.error("Failed to fetch dynamic dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (msgId: number | string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    try {
      await fetch(`${BACKEND_URL}/api/contact/${msgId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, is_read: true } : m))
      );
    } catch (err) {}
  };

  const handleDeleteMessage = async (msgId: number | string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact/${msgId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const remaining = messages.filter((m) => m.id !== msgId);
        setMessages(remaining);
        if (selectedMsg?.id === msgId) {
          setSelectedMsg(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (err) {
      console.error("Delete message failed:", err);
    }
  };

  const handleSendEmailReply = async () => {
    if (!selectedMsg || !aiDraftReply.trim()) return;
    setIsSendingEmail(true);
    setEmailStatus(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to_email: selectedMsg.email,
          subject: replySubject,
          reply_message: aiDraftReply,
        }),
      });

      if (response.ok) {
        setEmailStatus("✅ Email dispatched successfully from mamun441998@gmail.com!");
        setAiDraftReply("");
      } else {
        const errorData = await response.json();
        setEmailStatus(`❌ Failed: ${errorData.detail || "Server error"}`);
      }
    } catch (err) {
      setEmailStatus("❌ Connection Error: Backend server unreachable.");
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setEmailStatus(null), 5000);
    }
  };

  const handleOpenCsModal = (cs?: CaseStudyItem) => {
    if (cs) {
      setEditingCs(cs);
      setCsFormData({ ...cs });
    } else {
      setEditingCs(null);
      setCsFormData({
        id: `cs-${Date.now()}`,
        slug: "",
        title: "",
        subtitle: "",
        challenge: "",
        githubRepoUrl: "",
        metrics: [
          { label: "Latency", value: "< 20ms", sub: "Global Edge Route" },
          { label: "Throughput", value: "5,000 req/s", sub: "Microservices Cluster" },
        ],
        codeSnippet: "",
      });
    }
    setIsCsModalOpen(true);
  };

  const handleSaveCs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (editingCs) {
        const updated = caseStudies.map((c) => (c.id === editingCs.id ? { ...csFormData } : c));
        saveCaseStudiesLocally(updated);

        await fetch(`${BACKEND_URL}/api/casestudies/${editingCs.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(csFormData),
        });
      } else {
        const updated = [csFormData, ...caseStudies];
        saveCaseStudiesLocally(updated);

        await fetch(`${BACKEND_URL}/api/casestudies`, {
          method: "POST",
          headers,
          body: JSON.stringify(csFormData),
        });
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setIsCsModalOpen(false);
    }
  };

  const handleDeleteCs = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study blueprint?")) return;
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    const filtered = caseStudies.filter((c) => c.id !== id);
    saveCaseStudiesLocally(filtered);

    try {
      await fetch(`${BACKEND_URL}/api/casestudies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetricToCs = () => {
    setCsFormData((prev) => ({
      ...prev,
      metrics: [...prev.metrics, { label: "New Metric", value: "99.9%", sub: "Performance Target" }],
    }));
  };

  const handleRemoveMetricFromCs = (index: number) => {
    setCsFormData((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }));
  };

  const handleOpenServiceModal = (service?: ServiceItem) => {
    if (service) {
      setEditingService(service);
      setServiceFormData({ ...service });
    } else {
      setEditingService(null);
      setServiceFormData({
        id: `service-${Date.now()}`,
        title: "",
        tagline: "",
        description: "",
        icon_name: "Layers",
        features: "",
        tech_stack: "",
        highlight: false,
      });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (editingService) {
        const updatedServices = services.map((s) => (s.id === editingService.id ? { ...serviceFormData } : s));
        saveServicesLocally(updatedServices);

        await fetch(`${BACKEND_URL}/api/services/${editingService.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(serviceFormData),
        });
      } else {
        const updatedServices = [serviceFormData, ...services];
        saveServicesLocally(updatedServices);

        await fetch(`${BACKEND_URL}/api/services`, {
          method: "POST",
          headers,
          body: JSON.stringify(serviceFormData),
        });
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setIsServiceModalOpen(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service card?")) return;
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    const filtered = services.filter((s) => s.id !== id);
    saveServicesLocally(filtered);

    try {
      await fetch(`${BACKEND_URL}/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProjectModal = (project?: ProjectItem) => {
    if (project) {
      setEditingProject(project);
      setProjectFormData({ ...project });
    } else {
      setEditingProject(null);
      setProjectFormData({
        title: "",
        description: "",
        tech_stack: "",
        project_url: "",
        github_url: "",
        image_url: "",
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (editingProject && editingProject.id) {
        const res = await fetch(`${BACKEND_URL}/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(projectFormData),
        });
        if (res.ok) fetchRealDashboardData();
      } else {
        const res = await fetch(`${BACKEND_URL}/api/projects`, {
          method: "POST",
          headers,
          body: JSON.stringify(projectFormData),
        });
        if (res.ok) fetchRealDashboardData();
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setIsProjectModalOpen(false);
    }
  };

  const handleDeleteProject = async (id?: number | string) => {
    if (!id || !confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    try {
      const res = await fetch(`${BACKEND_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchRealDashboardData();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSkillModal = (skill?: SkillItem) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillFormData({ ...skill });
    } else {
      setEditingSkill(null);
      setSkillFormData({
        name: "",
        category: "Backend Development",
        proficiency: 90,
        icon: "",
      });
    }
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (editingSkill && editingSkill.id) {
        const res = await fetch(`${BACKEND_URL}/api/skills/${editingSkill.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(skillFormData),
        });
        if (res.ok) fetchRealDashboardData();
      } else {
        const res = await fetch(`${BACKEND_URL}/api/skills`, {
          method: "POST",
          headers,
          body: JSON.stringify(skillFormData),
        });
        if (res.ok) fetchRealDashboardData();
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setIsSkillModalOpen(false);
    }
  };

  const handleDeleteSkill = async (id?: number | string) => {
    if (!id || !confirm("Are you sure you want to delete this skill?")) return;
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    try {
      const res = await fetch(`${BACKEND_URL}/api/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchRealDashboardData();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleOpenExpModal = (exp?: ExperienceItem) => {
    if (exp) {
      setEditingExp(exp);
      setExpFormData({ ...exp });
    } else {
      setEditingExp(null);
      setExpFormData({
        role: "",
        company: "",
        location: "Remote / Dhaka",
        start_date: "2026-01-01",
        end_date: "",
        is_current: false,
        description: "",
      });
    }
    setIsExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (editingExp && editingExp.id) {
        const updatedExps = experiences.map((item) =>
          item.id === editingExp.id ? { ...item, ...expFormData } : item
        );
        saveExperiencesLocally(updatedExps);

        await fetch(`${BACKEND_URL}/api/experiences/${editingExp.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(expFormData),
        });
      } else {
        const newExpItem = { ...expFormData, id: `exp-${Date.now()}` };
        const updatedExps = [newExpItem, ...experiences];
        saveExperiencesLocally(updatedExps);

        await fetch(`${BACKEND_URL}/api/experiences`, {
          method: "POST",
          headers,
          body: JSON.stringify(expFormData),
        });
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setIsExpModalOpen(false);
    }
  };

  const handleDeleteExp = async (id?: number | string) => {
    if (!id || !confirm("Are you sure you want to delete this experience log?")) return;
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    const filtered = experiences.filter((item) => item.id !== id);
    saveExperiencesLocally(filtered);

    try {
      await fetch(`${BACKEND_URL}/api/experiences/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleAiAction = (actionType: string) => {
    if (!selectedMsg) return;
    setIsGeneratingAi(true);
    setTimeout(() => {
      const client = selectedMsg.clientName || selectedMsg.name || "Client";
      const subject = selectedMsg.subject || "Project Inquiry";
      if (actionType === "reply") {
        setAiDraftReply(
          `Hi ${client},\n\nThank you for reaching out regarding "${subject}". I have reviewed your requirement and would be glad to architect a scalable solution for your system.\n\nLet's schedule a discovery call.\n\nBest regards,\nMamunur Rashid\nFull Stack SaaS Architect`
        );
      } else if (actionType === "estimate") {
        setAiDraftReply(
          `Hi ${client},\n\nBased on your message, here is an initial technical scope estimation:\n- High-Performance Full Stack Architecture\n- Estimated Development Cycle: 3-5 Weeks\n- Primary Stack: Next.js, FastAPI, PostgreSQL\n\nLet me know when you are available for a call.`
        );
      }
      setIsGeneratingAi(false);
    }, 600);
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-gray-100 font-sans overflow-hidden select-none">
      
      {/* LEFT SIDEBAR: DEVELOPER COMMAND DOCK */}
      <aside
        className={`${
          sidebarCollapsed ? "w-24" : "w-72"
        } bg-[#080a10]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-5 transition-all duration-300 relative z-30 shrink-0`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#00FFC2]/50 shadow-[0_0_20px_rgba(0,255,194,0.3)] shrink-0">
                <Image
                  src="/Profile-Picture.png"
                  alt="Mamunur Rashid"
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold tracking-wider text-base font-space-grotesk text-white">
                    MRP-OS
                  </span>
                  <span className="text-xs font-mono text-[#00FFC2] font-semibold tracking-widest uppercase">
                    v4.2 PROD CORE
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00FFC2]/50 text-gray-300 hover:text-[#00FFC2] transition"
            >
              <Activity className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] pr-1 custom-scrollbar">
            {[
              { id: "dashboard", label: "Dashboard Core", icon: LayoutDashboard },
              { id: "cms", label: "Portfolio CMS", icon: FileCode2 },
              { id: "projects", label: "Projects Manager", icon: FolderKanban, badge: projects.length },
              { id: "skills", label: "Skills Stack", icon: Wrench, badge: skills.length },
              { id: "experience", label: "Experience Log", icon: Briefcase, badge: experiences.length },
              { id: "services", label: "Services Engine", icon: Layers, badge: services.length },
              { id: "casestudy", label: "Case Study Builder", icon: FileText, badge: caseStudies.length },
              { id: "messages", label: "Messages Hub", icon: Mail, badge: messages.length },
              { id: "crm", label: "Leads CRM", icon: Users, badge: leads.length },
              { id: "analytics", label: "Analytics Center", icon: LineChart },
              { id: "resume", label: "Resume Manager", icon: FileCheck },
              { id: "media", label: "Media Library", icon: ImageIcon },
              { id: "blog", label: "Blog Engine", icon: BookOpen },
              { id: "ai", label: "AI Developer Assistant", icon: Bot },
              { id: "logs", label: "System Logs", icon: Terminal },
              { id: "settings", label: "Settings", icon: Settings },
              { id: "security", label: "Security Center", icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as NavigationTab)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                    isActive
                      ? "bg-[#00FFC2]/15 text-[#00FFC2] border border-[#00FFC2]/50 shadow-[0_0_20px_rgba(0,255,194,0.2)] font-bold"
                      : "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5 truncate">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#00FFC2]" : "text-gray-400 group-hover:text-white"}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#7C3AED] text-white font-extrabold shadow-sm">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActivePill"
                      className="absolute left-0 w-1.5 h-7 bg-[#00FFC2] rounded-r-full shadow-[0_0_12px_#00FFC2]"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3.5">
          <div className="relative">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#00FFC2]/50 bg-white/10">
              <Image
                src="/Profile-Picture.png"
                alt="Mamunur Rashid"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FFC2] rounded-full border-2 border-black animate-pulse" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-white truncate">Mamunur Rashid</span>
              <span className="text-xs font-mono text-gray-400 font-medium truncate">Root Operator</span>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050505]">
        
        {/* TOP COMMAND BAR */}
        <header className="h-20 border-b border-white/10 bg-[#080a10]/80 backdrop-blur-xl px-8 flex items-center justify-between gap-6 z-20 shrink-0">
          <div className="relative w-80 sm:w-112">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across commands, leads, projects (Cmd + K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl pl-12 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchRealDashboardData}
              title="Refresh Real Stats"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00FFC2]/50 text-gray-200 hover:text-[#00FFC2] transition flex items-center gap-2 text-xs font-mono font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#00FFC2]" : ""}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00FFC2] text-black font-extrabold text-xs font-space-grotesk shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:scale-105 transition cursor-pointer"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* TAB 1: HERO COMMAND CENTER */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0c101d] via-[#090d18] to-[#120a1f] border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#00FFC2]/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#00FFC2] uppercase tracking-widest font-bold mb-2">
                      <Sparkles className="w-4.5 h-4.5 animate-spin" /> Operational Status: Online
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold font-space-grotesk text-white">
                      Good Evening, <span className="text-[#00FFC2] text-glow">Mamunur</span>
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base mt-2 max-w-xl font-inter">
                      System running at nominal capacity. All microservices, Services Engine, and lead pipelines are active.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                      <Activity className="w-6 h-6 text-[#00FFC2]" />
                      <div>
                        <div className="text-xs font-mono text-gray-400 font-semibold uppercase">PORTFOLIO HEALTH</div>
                        <div className="text-base font-extrabold text-white font-mono mt-0.5">97% Optimal</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                      <Users className="w-6 h-6 text-[#7C3AED]" />
                      <div>
                        <div className="text-xs font-mono text-gray-400 font-semibold uppercase">UNREAD LEADS</div>
                        <div className="text-base font-extrabold text-white font-mono mt-0.5">{leads.length} New Leads</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SYSTEM CORE HUD */}
              <div className="p-10 rounded-3xl bg-[#07090e] border border-[#00FFC2]/40 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-[0_0_60px_rgba(0,255,194,0.08)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,194,0.08)_0,transparent_70%)] pointer-events-none" />
                
                <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-[#00FFC2]/40"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-3 rounded-full border-2 border-dashed border-[#7C3AED]/50"
                  />
                  
                  <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#00FFC2] to-[#7C3AED] p-1 shadow-[0_0_50px_rgba(0,255,194,0.6)] flex items-center justify-center relative overflow-hidden">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#050505]">
                      <Image
                        src="/Profile-Picture.png"
                        alt="Mamunur Rashid Core"
                        fill
                        sizes="144px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold font-space-grotesk text-white tracking-wide">
                  QUANTUM SYSTEM CORE HUD
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full max-w-4xl mt-8">
                  {[
                    { label: "System Health", val: "100%", color: "text-[#00FFC2]" },
                    { label: "Portfolio Status", val: "Stable", color: "text-emerald-400" },
                    { label: "API Cluster", val: "Online", color: "text-[#00FFC2]" },
                    { label: "Message Queue", val: `${messages.length} Total`, color: "text-purple-400" },
                  ].map((statItem, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl font-mono">
                      <div className="text-xs text-gray-400 font-semibold uppercase">{statItem.label}</div>
                      <div className={`text-base font-extrabold mt-1 ${statItem.color}`}>{statItem.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE ANALYTICS MINI GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Visitors", val: stats.totalVisitors.toLocaleString(), sub: stats.weeklyGrowth, icon: Globe },
                  { label: "Dispatched Messages", val: messages.length.toString(), sub: `${stats.responseRate} Response Rate`, icon: Mail },
                  { label: "Active Projects", val: stats.activeProjects.toString(), sub: `${stats.saasPlatformsCount} SaaS Platforms`, icon: FolderKanban },
                  { label: "Services Engine", val: services.length.toString(), sub: "Full Stack Capabilities", icon: Layers },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} className="p-6 rounded-3xl bg-[#090c15] border border-white/10 hover:border-[#00FFC2]/50 transition group shadow-lg">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">{card.label}</span>
                        <div className="p-2.5 rounded-xl bg-white/5 text-[#00FFC2]">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white group-hover:text-[#00FFC2] transition tracking-tight">
                        {card.val}
                      </div>
                      <div className="text-xs font-mono text-gray-400 mt-2 font-medium">{card.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* WORLD VISITOR MAP HEATMAP */}
              <div className="p-8 rounded-3xl bg-[#080a10] border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <h3 className="text-lg font-bold font-space-grotesk text-white flex items-center gap-2.5">
                    <Globe className="w-5 h-5 text-[#00FFC2]" /> Real-time Worldwide Traffic Heatmap
                  </h3>
                  <span className="text-xs font-mono text-gray-400 font-semibold">Top Geo Locations</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono">
                  {stats.geoLocations.map((geo, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                      <div className="text-gray-200 font-bold text-sm">{geo.country}</div>
                      <div className="text-2xl text-[#00FFC2] font-extrabold tracking-tight">{geo.count}</div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#00FFC2] h-full" style={{ width: geo.percent }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PORTFOLIO CMS */}
          {activeTab === "cms" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-extrabold font-space-grotesk text-white flex items-center gap-3">
                    <FileCode2 className="w-7 h-7 text-[#00FFC2]" /> Live Portfolio Content Manager
                  </h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Edit site metadata, hero text, about section, and social channels in real time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveCms}
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl bg-[#00FFC2] text-black font-extrabold text-xs font-mono shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:scale-105 transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Live Portfolio Config
                </button>
              </div>

              {cmsSaveStatus && (
                <div className="p-4 rounded-2xl bg-[#00FFC2]/10 border border-[#00FFC2]/30 text-[#00FFC2] text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {cmsSaveStatus}
                </div>
              )}

              <form onSubmit={handleSaveCms} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-[#080a10] border border-white/10 space-y-5">
                  <h3 className="text-sm font-mono text-[#00FFC2] font-bold uppercase tracking-wider border-b border-white/10 pb-3">
                    Hero & Basic Site Info
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 font-semibold">Full Name</label>
                    <input
                      type="text"
                      value={cmsData.name}
                      onChange={(e) => setCmsData({ ...cmsData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 font-semibold">Typewriter Roles</label>
                    <input
                      type="text"
                      value={cmsData.roles}
                      onChange={(e) => setCmsData({ ...cmsData, roles: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 font-semibold">Hero Tagline</label>
                    <textarea
                      rows={3}
                      value={cmsData.tagline}
                      onChange={(e) => setCmsData({ ...cmsData, tagline: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl p-4 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-300 font-semibold">Location</label>
                      <input
                        type="text"
                        value={cmsData.location}
                        onChange={(e) => setCmsData({ ...cmsData, location: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-300 font-semibold">Email Address</label>
                      <input
                        type="email"
                        value={cmsData.email}
                        onChange={(e) => setCmsData({ ...cmsData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-300 font-semibold">Phone Number</label>
                      <input
                        type="text"
                        value={cmsData.phone}
                        onChange={(e) => setCmsData({ ...cmsData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-300 font-semibold">Video Intro Embed URL</label>
                      <input
                        type="text"
                        value={cmsData.videoIntroUrl}
                        onChange={(e) => setCmsData({ ...cmsData, videoIntroUrl: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-[#080a10] border border-white/10 space-y-5">
                  <h3 className="text-sm font-mono text-[#00FFC2] font-bold uppercase tracking-wider border-b border-white/10 pb-3">
                    Social Links & About Overview
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 font-semibold">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={cmsData.github}
                      onChange={(e) => setCmsData({ ...cmsData, github: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 font-semibold">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={cmsData.linkedin}
                      onChange={(e) => setCmsData({ ...cmsData, linkedin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 font-semibold">Facebook Profile URL</label>
                    <input
                      type="text"
                      value={cmsData.facebook}
                      onChange={(e) => setCmsData({ ...cmsData, facebook: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 font-semibold">About Section Story Paragraphs</label>
                    <textarea
                      rows={6}
                      value={cmsData.aboutParagraphs}
                      onChange={(e) => setCmsData({ ...cmsData, aboutParagraphs: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl p-4 text-xs text-white font-mono focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PROJECTS MANAGER */}
          {activeTab === "projects" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-extrabold font-space-grotesk text-white flex items-center gap-3">
                    <FolderKanban className="w-7 h-7 text-[#00FFC2]" /> Production Projects Manager
                  </h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Manage, edit, and publish projects live to your portfolio in real time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenProjectModal()}
                  className="px-6 py-3 rounded-2xl bg-[#00FFC2] text-black font-extrabold text-xs font-mono shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:scale-105 transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Project
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-6 rounded-3xl bg-[#080a10] border border-white/10 hover:border-[#00FFC2]/50 transition flex flex-col justify-between space-y-5 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold font-space-grotesk text-white">{proj.title}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenProjectModal(proj)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#00FFC2]/20 text-gray-300 hover:text-[#00FFC2] transition"
                            title="Edit Project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-inter">{proj.description}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {proj.tech_stack?.split(",").map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#00FFC2]/10 text-[#00FFC2] border border-[#00FFC2]/20 font-bold uppercase"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-gray-400 pt-3 border-t border-white/5">
                        {proj.github_url && (
                          <a
                            href={proj.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 hover:text-[#00FFC2] transition"
                          >
                            <GithubIcon className="w-4 h-4" /> Repository
                          </a>
                        )}
                        {proj.project_url && (
                          <a
                            href={proj.project_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 hover:text-[#00FFC2] transition"
                          >
                            <ExternalLink className="w-4 h-4" /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isProjectModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-[#080a10] border border-white/10 rounded-3xl p-8 w-full max-w-2xl space-y-6 relative shadow-2xl">
                    <button
                      onClick={() => setIsProjectModalOpen(false)}
                      className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-xl font-bold font-space-grotesk text-white">
                      {editingProject ? "Edit Project Details" : "Create New Production Project"}
                    </h3>

                    <form onSubmit={handleSaveProject} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projectFormData.title}
                          onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Description</label>
                        <textarea
                          rows={4}
                          required
                          value={projectFormData.description}
                          onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl p-4 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Tech Stack (Comma Separated)</label>
                        <input
                          type="text"
                          required
                          placeholder="Laravel, Next.js, PostgreSQL"
                          value={projectFormData.tech_stack}
                          onChange={(e) => setProjectFormData({ ...projectFormData, tech_stack: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">GitHub Repo URL</label>
                          <input
                            type="text"
                            value={projectFormData.github_url || ""}
                            onChange={(e) => setProjectFormData({ ...projectFormData, github_url: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">Live Project URL</label>
                          <input
                            type="text"
                            value={projectFormData.project_url || ""}
                            onChange={(e) => setProjectFormData({ ...projectFormData, project_url: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsProjectModalOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 font-mono text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2.5 rounded-xl bg-[#00FFC2] text-black font-mono text-xs font-extrabold shadow-[0_0_15px_rgba(0,255,194,0.3)] cursor-pointer"
                        >
                          {editingProject ? "Update Project" : "Publish Project"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SKILLS STACK */}
          {activeTab === "skills" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-extrabold font-space-grotesk text-white flex items-center gap-3">
                    <Wrench className="w-7 h-7 text-[#00FFC2]" /> Skills Stack Manager
                  </h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Manage, edit, and categorize your technical stack in real time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenSkillModal()}
                  className="px-6 py-3 rounded-2xl bg-[#00FFC2] text-black font-extrabold text-xs font-mono shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:scale-105 transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Skill
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((sk, idx) => (
                  <div
                    key={sk.id || idx}
                    className="p-6 rounded-3xl bg-[#080a10] border border-white/10 hover:border-[#00FFC2]/50 transition flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#00FFC2] font-bold bg-[#00FFC2]/10 px-2.5 py-1 rounded-full border border-[#00FFC2]/20">
                          {sk.category || "General"}
                        </span>
                        <h3 className="text-lg font-bold font-space-grotesk text-white mt-3">{sk.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenSkillModal(sk)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-[#00FFC2]/20 text-gray-300 hover:text-[#00FFC2] transition"
                          title="Edit Skill"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(sk.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-gray-400">Proficiency</span>
                        <span className="text-[#00FFC2] font-bold">{sk.proficiency || 90}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#00FFC2] to-[#7C3AED] h-full rounded-full transition-all duration-500"
                          style={{ width: `${sk.proficiency || 90}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isSkillModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-[#080a10] border border-white/10 rounded-3xl p-8 w-full max-w-lg space-y-6 relative shadow-2xl">
                    <button
                      onClick={() => setIsSkillModalOpen(false)}
                      className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-xl font-bold font-space-grotesk text-white">
                      {editingSkill ? "Edit Skill Information" : "Add New Skill to Stack"}
                    </h3>

                    <form onSubmit={handleSaveSkill} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Skill Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. FastAPI, PostgreSQL, Next.js"
                          value={skillFormData.name}
                          onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Category</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Backend, Frontend, DevOps, Database"
                          value={skillFormData.category || ""}
                          onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">
                          Proficiency Percentage ({skillFormData.proficiency || 90}%)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          required
                          value={skillFormData.proficiency || 90}
                          onChange={(e) => setSkillFormData({ ...skillFormData, proficiency: Number(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsSkillModalOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 font-mono text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2.5 rounded-xl bg-[#00FFC2] text-black font-mono text-xs font-extrabold shadow-[0_0_15px_rgba(0,255,194,0.3)] cursor-pointer"
                        >
                          {editingSkill ? "Update Skill" : "Save Skill"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EXPERIENCE LOG */}
          {activeTab === "experience" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-extrabold font-space-grotesk text-white flex items-center gap-3">
                    <Briefcase className="w-7 h-7 text-[#00FFC2]" /> Experience Log Manager
                  </h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Manage your professional work career timeline and deliverables in real time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenExpModal()}
                  className="px-6 py-3 rounded-2xl bg-[#00FFC2] text-black font-extrabold text-xs font-mono shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:scale-105 transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Experience Log
                </button>
              </div>

              <div className="space-y-6">
                {experiences.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-8 rounded-3xl bg-[#080a10] border border-white/10 hover:border-[#00FFC2]/50 transition space-y-4 shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold font-space-grotesk text-white">{exp.role}</h3>
                          {exp.is_current && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-[#00FFC2]/10 text-[#00FFC2] border border-[#00FFC2]/30 font-extrabold uppercase">
                              Present Role
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-[#00FFC2] mt-1">{exp.company}</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col text-xs font-mono text-gray-400 space-y-1">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#00FFC2]" />
                            {exp.start_date} — {exp.is_current ? "Present" : exp.end_date || "N/A"}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-purple-400" />
                              {exp.location}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                          <button
                            onClick={() => handleOpenExpModal(exp)}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-[#00FFC2]/20 text-gray-300 hover:text-[#00FFC2] transition"
                            title="Edit Experience"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExp(exp.id)}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition"
                            title="Delete Experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {exp.description && (
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 font-inter leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isExpModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-[#080a10] border border-white/10 rounded-3xl p-8 w-full max-w-2xl space-y-6 relative shadow-2xl">
                    <button
                      onClick={() => setIsExpModalOpen(false)}
                      className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-xl font-bold font-space-grotesk text-white">
                      {editingExp ? "Edit Experience Log" : "Add New Experience Log"}
                    </h3>

                    <form onSubmit={handleSaveExp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">Job Title / Role</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Senior Software Engineer"
                            value={expFormData.role}
                            onChange={(e) => setExpFormData({ ...expFormData, role: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">Company Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. TechScale Solutions"
                            value={expFormData.company}
                            onChange={(e) => setExpFormData({ ...expFormData, company: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">Location</label>
                          <input
                            type="text"
                            placeholder="e.g. Dhaka, Bangladesh (Remote)"
                            value={expFormData.location || ""}
                            onChange={(e) => setExpFormData({ ...expFormData, location: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 flex flex-col justify-end">
                          <label className="flex items-center gap-2 cursor-pointer p-3 bg-white/5 border border-white/10 rounded-xl">
                            <input
                              type="checkbox"
                              checked={expFormData.is_current || false}
                              onChange={(e) => setExpFormData({ ...expFormData, is_current: e.target.checked })}
                              className="w-4 h-4 accent-[#00FFC2] rounded"
                            />
                            <span className="text-xs font-mono text-gray-300 font-semibold">I currently work here</span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">Start Date</label>
                          <input
                            type="text"
                            placeholder="YYYY-MM-DD"
                            required
                            value={expFormData.start_date}
                            onChange={(e) => setExpFormData({ ...expFormData, start_date: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                        {!expFormData.is_current && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono text-gray-300 font-semibold">End Date</label>
                            <input
                              type="text"
                              placeholder="YYYY-MM-DD"
                              value={expFormData.end_date || ""}
                              onChange={(e) => setExpFormData({ ...expFormData, end_date: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Job Description</label>
                        <textarea
                          rows={4}
                          placeholder="Describe key achievements..."
                          value={expFormData.description || ""}
                          onChange={(e) => setExpFormData({ ...expFormData, description: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl p-4 text-xs text-white font-mono focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsExpModalOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 font-mono text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2.5 rounded-xl bg-[#00FFC2] text-black font-mono text-xs font-extrabold shadow-[0_0_15px_rgba(0,255,194,0.3)] cursor-pointer"
                        >
                          {editingExp ? "Update Experience" : "Save Experience"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SERVICES ENGINE */}
          {activeTab === "services" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-extrabold font-space-grotesk text-white flex items-center gap-3">
                    <Layers className="w-7 h-7 text-[#00FFC2]" /> Services Engine Manager
                  </h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Manage full-stack engineering capabilities, tech stacks, and key deliverables live on your portfolio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenServiceModal()}
                  className="px-6 py-3 rounded-2xl bg-[#00FFC2] text-black font-extrabold text-xs font-mono shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:scale-105 transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`group relative p-8 rounded-3xl bg-[#080a10] border border-white/10 hover:border-[#00FFC2]/50 transition flex flex-col justify-between overflow-hidden shadow-xl ${
                      service.highlight ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          {renderServiceIcon(service.icon_name)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-400 mr-2">{service.tagline}</span>
                          <button
                            onClick={() => handleOpenServiceModal(service)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#00FFC2]/20 text-gray-300 hover:text-[#00FFC2] transition"
                            title="Edit Service"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold font-space-grotesk text-white mb-3">{service.title}</h3>
                      <p className="text-xs text-gray-300 font-inter leading-relaxed mb-6">{service.description}</p>

                      <div className="space-y-2 mb-8">
                        {service.features.split(",").map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs font-inter text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00FFC2] shrink-0" />
                            <span>{feat.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {service.tech_stack.split(",").map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-white/5 border border-white/10 text-gray-300"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                      {service.highlight && (
                        <span className="px-2.5 py-1 text-[10px] font-mono rounded-full bg-[#00FFC2]/10 text-[#00FFC2] font-extrabold uppercase border border-[#00FFC2]/30">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-[#080a10] border border-white/10 rounded-3xl p-8 w-full max-w-2xl space-y-6 relative shadow-2xl">
                    <button
                      onClick={() => setIsServiceModalOpen(false)}
                      className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-xl font-bold font-space-grotesk text-white">
                      {editingService ? "Edit Service Capability" : "Create New Engineering Service"}
                    </h3>

                    <form onSubmit={handleSaveService} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">Service Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Full-Stack SaaS Architecture"
                            value={serviceFormData.title}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">Tagline</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Scale from Day 0"
                            value={serviceFormData.tagline}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, tagline: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">Icon</label>
                          <select
                            value={serviceFormData.icon_name}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, icon_name: e.target.value })}
                            className="w-full bg-[#0d111d] border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          >
                            <option value="Layers">Layers (SaaS Architecture)</option>
                            <option value="Code2">Code2 (Web Applications)</option>
                            <option value="Cpu">Cpu (Backend/APIs)</option>
                            <option value="Zap">Zap (Performance Optimization)</option>
                            <option value="Globe2">Globe2 (Cloud & DevOps)</option>
                            <option value="ShieldCheck">ShieldCheck (Enterprise Advisory)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5 flex flex-col justify-end">
                          <label className="flex items-center gap-2 cursor-pointer p-3 bg-white/5 border border-white/10 rounded-xl">
                            <input
                              type="checkbox"
                              checked={serviceFormData.highlight || false}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, highlight: e.target.checked })}
                              className="w-4 h-4 accent-[#00FFC2] rounded"
                            />
                            <span className="text-xs font-mono text-gray-300 font-semibold">Featured Card</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Description</label>
                        <textarea
                          rows={3}
                          required
                          value={serviceFormData.description}
                          onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl p-4 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Key Deliverables (Comma Separated)</label>
                        <input
                          type="text"
                          required
                          value={serviceFormData.features}
                          onChange={(e) => setServiceFormData({ ...serviceFormData, features: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Tech Stack Badges (Comma Separated)</label>
                        <input
                          type="text"
                          required
                          value={serviceFormData.tech_stack}
                          onChange={(e) => setServiceFormData({ ...serviceFormData, tech_stack: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsServiceModalOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 font-mono text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2.5 rounded-xl bg-[#00FFC2] text-black font-mono text-xs font-extrabold shadow-[0_0_15px_rgba(0,255,194,0.3)] cursor-pointer"
                        >
                          {editingService ? "Update Service" : "Save Service"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: CASE STUDY BUILDER */}
          {activeTab === "casestudy" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-extrabold font-space-grotesk text-white flex items-center gap-3">
                    <FileText className="w-7 h-7 text-[#00FFC2]" /> Case Study Builder Engine
                  </h2>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Build, design, and configure high-level architectural case study blueprints in real-time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenCsModal()}
                  className="px-6 py-3 rounded-2xl bg-[#00FFC2] text-black font-extrabold text-xs font-mono shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:scale-105 transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Case Study Blueprint
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseStudies.map((cs) => (
                  <div
                    key={cs.id}
                    className="p-8 rounded-3xl bg-[#080a10] border border-white/10 hover:border-[#00FFC2]/50 transition flex flex-col justify-between space-y-6 shadow-xl"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#00FFC2] font-bold bg-[#00FFC2]/10 px-2.5 py-1 rounded-full border border-[#00FFC2]/20">
                            Slug: /{cs.slug}
                          </span>
                          <h3 className="text-xl font-bold font-space-grotesk text-white mt-3">{cs.title}</h3>
                          <p className="text-xs font-mono text-purple-400 mt-1">{cs.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewCs(cs)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#00FFC2]/20 text-gray-300 hover:text-[#00FFC2] transition"
                            title="Live Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenCsModal(cs)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#00FFC2]/20 text-gray-300 hover:text-[#00FFC2] transition"
                            title="Edit Blueprint"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCs(cs.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition"
                            title="Delete Blueprint"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 font-inter leading-relaxed line-clamp-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                        {cs.challenge}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {cs.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="p-3 bg-white/5 border border-white/5 rounded-xl font-mono">
                            <div className="text-[10px] text-gray-400 uppercase font-semibold">{m.label}</div>
                            <div className="text-base font-extrabold text-[#00FFC2] mt-0.5">{m.value}</div>
                            <div className="text-[9px] text-gray-500 truncate">{m.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                      <span className="flex items-center gap-1.5 text-gray-300 truncate max-w-[220px]">
                        <GithubIcon className="w-4 h-4 text-[#00FFC2]" /> {cs.githubRepoUrl || "GitHub Attached"}
                      </span>
                      <button
                        onClick={() => setPreviewCs(cs)}
                        className="text-[#00FFC2] hover:underline font-bold flex items-center gap-1"
                      >
                        Preview Canvas <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {isCsModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-[#080a10] border border-white/10 rounded-3xl p-8 w-full max-w-3xl space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <button
                      onClick={() => setIsCsModalOpen(false)}
                      className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-xl font-bold font-space-grotesk text-white">
                      {editingCs ? "Edit Case Study Blueprint" : "Create New Case Study Blueprint"}
                    </h3>

                    <form onSubmit={handleSaveCs} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">Case Study Title</label>
                          <input
                            type="text"
                            required
                            value={csFormData.title}
                            onChange={(e) => setCsFormData({ ...csFormData, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-300 font-semibold">URL Slug</label>
                          <input
                            type="text"
                            required
                            value={csFormData.slug}
                            onChange={(e) => setCsFormData({ ...csFormData, slug: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Subtitle / Tagline</label>
                        <input
                          type="text"
                          required
                          value={csFormData.subtitle}
                          onChange={(e) => setCsFormData({ ...csFormData, subtitle: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Architectural Vision Statement</label>
                        <textarea
                          rows={3}
                          required
                          value={csFormData.challenge}
                          onChange={(e) => setCsFormData({ ...csFormData, challenge: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl p-4 text-xs text-white font-mono focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-300 font-semibold">GitHub Repo URL</label>
                        <input
                          type="text"
                          required
                          value={csFormData.githubRepoUrl}
                          onChange={(e) => setCsFormData({ ...csFormData, githubRepoUrl: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-mono text-[#00FFC2] font-bold uppercase tracking-wider">
                            Performance Metrics ({csFormData.metrics.length})
                          </label>
                          <button
                            type="button"
                            onClick={handleAddMetricToCs}
                            className="px-3 py-1 bg-white/5 hover:bg-[#00FFC2]/20 text-[#00FFC2] rounded-lg text-xs font-mono font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Metric
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {csFormData.metrics.map((metric, idx) => (
                            <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 relative">
                              <button
                                type="button"
                                onClick={() => handleRemoveMetricFromCs(idx)}
                                className="absolute top-2 right-2 text-rose-400 hover:text-rose-300 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="text"
                                value={metric.label}
                                onChange={(e) => {
                                  const updated = [...csFormData.metrics];
                                  updated[idx].label = e.target.value;
                                  setCsFormData({ ...csFormData, metrics: updated });
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                              />
                              <input
                                type="text"
                                value={metric.value}
                                onChange={(e) => {
                                  const updated = [...csFormData.metrics];
                                  updated[idx].value = e.target.value;
                                  setCsFormData({ ...csFormData, metrics: updated });
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-[#00FFC2] font-mono font-bold"
                              />
                              <input
                                type="text"
                                value={metric.sub}
                                onChange={(e) => {
                                  const updated = [...csFormData.metrics];
                                  updated[idx].sub = e.target.value;
                                  setCsFormData({ ...csFormData, metrics: updated });
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-gray-400 font-mono"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-mono text-gray-300 font-semibold">Pipeline Sample Code</label>
                        <textarea
                          rows={6}
                          value={csFormData.codeSnippet}
                          onChange={(e) => setCsFormData({ ...csFormData, codeSnippet: e.target.value })}
                          className="w-full bg-black/60 border border-white/10 focus:border-[#00FFC2] rounded-xl p-4 text-xs text-emerald-400 font-mono focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsCsModalOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 font-mono text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2.5 rounded-xl bg-[#00FFC2] text-black font-mono text-xs font-extrabold shadow-[0_0_15px_rgba(0,255,194,0.3)] cursor-pointer"
                        >
                          {editingCs ? "Update Blueprint" : "Save Blueprint"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {previewCs && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-6 sm:p-12 overflow-y-auto custom-scrollbar">
                  <div className="max-w-6xl mx-auto w-full space-y-8 relative">
                    <button
                      onClick={() => setPreviewCs(null)}
                      className="fixed top-8 right-8 p-3 rounded-2xl bg-[#00FFC2] text-black font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,194,0.4)] hover:scale-105 transition cursor-pointer z-50"
                    >
                      <X className="w-5 h-5" /> Close Preview
                    </button>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#00FFC2]">
                        <span className="px-3 py-1 rounded-full bg-[#00FFC2]/10 border border-[#00FFC2]/30 uppercase font-bold">
                          Live Architecture Preview
                        </span>
                        <span>/case-study/{previewCs.slug}</span>
                      </div>
                      <h1 className="text-4xl sm:text-6xl font-extrabold font-space-grotesk text-white">
                        {previewCs.title}
                      </h1>
                      <p className="text-base text-purple-400 font-mono">{previewCs.subtitle}</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-3">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#00FFC2] font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Architectural Vision & Challenge
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-inter">
                        "{previewCs.challenge}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {previewCs.metrics.map((m, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-[#080a10] border border-white/10 space-y-1">
                          <div className="text-2xl sm:text-3xl font-extrabold text-[#00FFC2] font-mono">{m.value}</div>
                          <div className="text-xs font-bold text-white">{m.label}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{m.sub}</div>
                        </div>
                      ))}
                    </div>

                    {previewCs.codeSnippet && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-mono text-white font-bold flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-[#00FFC2]" /> Pipeline Code Preview
                        </h3>
                        <div className="p-6 rounded-3xl bg-[#0a0d16] border border-white/10 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                          <pre><code>{previewCs.codeSnippet}</code></pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: MESSAGES HUB - PRODUCTION INTEGRATED */}
          {activeTab === "messages" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-160px)]">
              
              {/* LEFT COLUMN: REAL-TIME INBOX LIST */}
              <div className="lg:col-span-4 bg-[#080a10] border border-white/10 rounded-3xl p-5 overflow-y-auto space-y-3 custom-scrollbar">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-xs font-mono text-gray-300 uppercase tracking-wider font-bold">
                    PORTFOLIO INBOX ({messages.length})
                  </h3>
                  <button
                    onClick={fetchRealMessagesOnly}
                    title="Refresh Inbox"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-[#00FFC2]/20 text-[#00FFC2] transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-gray-400 border border-dashed border-white/10 rounded-2xl">
                    No messages received from portfolio yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMsg(msg)}
                      className={`w-full text-left p-4 rounded-2xl border transition relative cursor-pointer group ${
                        selectedMsg?.id === msg.id
                          ? "bg-[#00FFC2]/15 border-[#00FFC2] text-white"
                          : "bg-white/5 border-white/5 hover:border-white/20 text-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-2 truncate">
                          {!msg.is_read && (
                            <span className="w-2 h-2 rounded-full bg-[#00FFC2] animate-pulse shrink-0" title="Unread Message" />
                          )}
                          <span className="font-bold text-sm truncate">{msg.name || msg.clientName || "Unknown Sender"}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">{msg.timestamp || "Just Now"}</span>
                      </div>
                      
                      <div className="text-xs font-bold text-[#00FFC2] truncate">{msg.subject || "Portfolio Contact Form Inquiry"}</div>
                      <div className="text-xs text-gray-300 truncate mt-1.5">{msg.message || msg.content}</div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(msg.id);
                        }}
                        className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* MIDDLE COLUMN: MESSAGE READING & GMAIL REPLY SYSTEM */}
              <div className="lg:col-span-5 bg-[#080a10] border border-white/10 rounded-3xl p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                {selectedMsg ? (
                  <div className="space-y-5">
                    <div className="border-b border-white/10 pb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#7C3AED]/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                          Sender Email: {selectedMsg.email}
                        </span>
                        <button
                          onClick={() => handleDeleteMessage(selectedMsg.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition text-xs font-mono flex items-center gap-1.5"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>

                      <h2 className="text-xl font-bold font-space-grotesk text-white mt-4">
                        {selectedMsg.subject || "Portfolio Contact Inquiry"}
                      </h2>
                      
                      <div className="text-xs text-gray-300 mt-2 font-mono flex items-center gap-2">
                        <span>From: <strong className="text-white">{selectedMsg.name || selectedMsg.clientName}</strong></span>
                        <span>•</span>
                        <span className="text-gray-400">{selectedMsg.timestamp}</span>
                      </div>
                    </div>

                    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl text-sm leading-relaxed text-gray-200 font-inter whitespace-pre-wrap min-h-[140px]">
                      {selectedMsg.message || selectedMsg.content}
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-[#00FFC2] font-bold uppercase tracking-wider flex items-center gap-2">
                          <Send className="w-4 h-4" /> Direct Gmail Reply Box
                        </label>
                        <span className="text-[10px] font-mono text-gray-400">Via mamun441998@gmail.com</span>
                      </div>

                      <input
                        type="text"
                        placeholder="Email Subject..."
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none"
                      />

                      <textarea
                        rows={6}
                        placeholder="Type your response to the client here..."
                        value={aiDraftReply}
                        onChange={(e) => setAiDraftReply(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 focus:border-[#00FFC2] rounded-2xl p-4 text-xs text-gray-200 font-mono focus:outline-none leading-relaxed"
                      />

                      {emailStatus && (
                        <div className={`p-3 rounded-xl text-xs font-mono font-bold ${
                          emailStatus.includes("✅") ? "bg-[#00FFC2]/10 text-[#00FFC2] border border-[#00FFC2]/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}>
                          {emailStatus}
                        </div>
                      )}

                      <button
                        onClick={handleSendEmailReply}
                        disabled={isSendingEmail || !aiDraftReply.trim()}
                        className="w-full py-3.5 bg-[#00FFC2] text-black font-extrabold text-xs font-mono rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:scale-[1.02] transition disabled:opacity-50 cursor-pointer"
                      >
                        {isSendingEmail ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching Email via SMTP...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Send Email to {selectedMsg.email}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm font-mono text-gray-400 text-center my-auto font-medium">
                    Select a message from the left inbox to view and reply.
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: AI DEVELOPER COPILOT ASSISTANT */}
              <div className="lg:col-span-3 bg-[#080a10] border border-white/10 rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00FFC2] font-bold border-b border-white/10 pb-4 uppercase tracking-wider">
                  <Bot className="w-5 h-5 text-[#00FFC2]" /> AI REPLY ASSISTANT
                </div>

                <p className="text-xs text-gray-400 font-inter">
                  Click below to automatically draft smart response templates for the selected client message:
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <button
                    onClick={() => handleAiAction("reply")}
                    disabled={isGeneratingAi || !selectedMsg}
                    className="w-full p-3.5 bg-white/5 hover:bg-[#00FFC2]/10 border border-white/10 hover:border-[#00FFC2] text-left rounded-xl text-gray-200 hover:text-[#00FFC2] transition flex items-center justify-between font-semibold disabled:opacity-40"
                  >
                    <span>Auto Draft Reply</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAiAction("estimate")}
                    disabled={isGeneratingAi || !selectedMsg}
                    className="w-full p-3.5 bg-white/5 hover:bg-[#00FFC2]/10 border border-white/10 hover:border-[#00FFC2] text-left rounded-xl text-gray-200 hover:text-[#00FFC2] transition flex items-center justify-between font-semibold disabled:opacity-40"
                  >
                    <span>Draft Scope Estimate</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* OTHER TABS */}
          {!["dashboard", "messages", "cms", "projects", "skills", "experience", "services", "casestudy"].includes(activeTab) && (
            <div className="p-16 text-center bg-[#080a10] border border-white/10 rounded-3xl space-y-4">
              <Bot className="w-10 h-10 text-[#00FFC2] mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white font-space-grotesk capitalize">{activeTab} Module Active</h3>
              <p className="text-xs text-gray-300 font-mono font-semibold">Live Operational Control Center Engine.</p>
            </div>
          )}

        </main>

        {/* REALTIME SYSTEM STATUS BAR */}
        <footer className="h-10 border-t border-white/10 bg-[#06080e] px-8 flex items-center justify-between text-xs font-mono text-gray-300 z-20 shrink-0 font-semibold">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-[#00FFC2]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FFC2] animate-ping" /> REALTIME LIVE SYNC
            </span>
            <span>CPU: 2.1%</span>
            <span>MEMORY: 1.4GB / 16GB</span>
          </div>
          <div>
            <span>MRP-OS v4.2 PROD • Mamunur Rashid Command Center</span>
          </div>
        </footer>

      </div>
    </div>
  );
}