"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Cpu,
  Globe,
  ExternalLink,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowLeft,
  Workflow,
  Search,
  Binary,
  Gauge,
  GitBranch,
  Zap,
  ShieldCheck,
  Server,
  Cloud,
  Lock,
  Flame,
  UserCheck,
  Bug,
  Terminal,
  RefreshCw,
  Radio,
  RadioReceiver,
  Crosshair,
} from "lucide-react";
import Link from "next/link";

// ----------------------------------------------------------------------
// TYPES & DATA STRUCTURES
// ----------------------------------------------------------------------
interface NodeDetail {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tech: string;
  whyChosen: string;
  howItWorks: string;
  metrics: string;
}

const SYSTEM_NODES: NodeDetail[] = [
  {
    id: "ingress",
    name: "API Gateway & Edge Router",
    category: "Traffic Ingress",
    icon: Globe,
    tech: "Next.js 15 Edge Router + Envoy Gateway",
    whyChosen: "Zero-latency SSL termination, dynamic request throttling, and localized dynamic routing across global edge clusters.",
    howItWorks: "Routes incoming marketplace traffic, applies Rate Limiting, and authenticates client sessions before dispatching payload to microservices.",
    metrics: "Sub-5ms Latency",
  },
  {
    id: "ingestion",
    name: "Real-time Vehicle Ingestion API",
    category: "Core Microservice",
    icon: Cpu,
    tech: "FastAPI Async Core + gRPC Internal Bus",
    whyChosen: "High-concurrency async processing capable of handling thousands of vehicle listing updates and IoT telemetry events simultaneously.",
    howItWorks: "Validates incoming automotive telemetry, structured specs, image metadata, and publishes events to Apache Kafka.",
    metrics: "12,000 req/sec",
  },
  {
    id: "eventbus",
    name: "Distributed Event Stream",
    category: "Event Streaming",
    icon: Workflow,
    tech: "Apache Kafka + Schema Registry",
    whyChosen: "Decouples inventory ingestion from downstream analytics, ML valuation engines, and search indexing pipelines.",
    howItWorks: "Distributes vehicle events across partitioned topics (e.g., `listing.created`, `price.updated`) with strict event ordering guarantees.",
    metrics: "Zero Event Loss",
  },
  {
    id: "mlengine",
    name: "AI Car Valuation & ML Engine",
    category: "Data Science & AI",
    icon: Binary,
    tech: "PyTorch + XGBoost + MLflow Service",
    whyChosen: "Automated real-time vehicle price prediction based on historical market trends, mileage, condition, and regional demand dynamics.",
    howItWorks: "Consumes ingestion events from Kafka, runs inference against pre-trained ML models, and broadcasts predicted fair market values.",
    metrics: "98.4% Valuation Accuracy",
  },
  {
    id: "searchengine",
    name: "High-Performance Search Cluster",
    category: "Search & Retrieval",
    icon: Search,
    tech: "OpenSearch / Elasticsearch Cluster",
    whyChosen: "Millisecond-level multi-attribute faceted filtering across millions of vehicle inventory records.",
    howItWorks: "In-memory distributed inverted index updated in near real-time via Kafka consumers for instant buyer query responses.",
    metrics: "< 15ms Query Speed",
  },
  {
    id: "database",
    name: "Polyglot Persistence Layer",
    category: "Data Storage",
    icon: Database,
    tech: "PostgreSQL (Transactions) + Redis (Cache)",
    whyChosen: "ACID compliance for order bookings alongside sub-millisecond Redis read caching for active hot listing specs.",
    howItWorks: "PostgreSQL handles transactional state while Redis serves as a read-aside cache layer invalidating on price updates.",
    metrics: "99.99% Availability",
  },
];

// Custom Type-Safe GitHub SVG Icon
const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

// ----------------------------------------------------------------------
// ULTRA-SMOOTH SCI-FI HIGH-LEVEL SYSTEM ARCHITECTURE
// ----------------------------------------------------------------------
const TechnicalInfrastructureDiagram = () => {
  const [activeTab, setActiveTab] = useState<"architecture" | "logs">("architecture");
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM_INIT] Quantum Core Active | Grid Synchronized",
    "[CYBER_GATE] Packet Encrypted via Quantum AES-256",
    "[KAFKA_STREAM] Event Stream Active (Topic: vehicle.telemetry.v1)",
    "[ML_INFERENCE] Neural Model XGBoost v2.4 Loaded in Memory",
    "[OPENSEARCH] Index Query Resolved in 0.003ms",
    "[DEFENSE_SHIELD] Firewall Intercepted Malicious Ingress Attempt from 185.220.101.5",
  ]);

  const triggerSimulatedThreat = () => {
    const timestamp = new Date().toISOString().split("T")[1].slice(0, 8);
    setLogs((prev) => [
      `[${timestamp}] [CRITICAL WARNING] DDoS Vector Blocked by Quantum Shield Firewall!`,
      ...prev.slice(0, 5),
    ]);
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-lg space-y-6 relative overflow-hidden transition-colors duration-200">
      
      {/* PERFECTED SCI-FI CORNER BRACKETS */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[var(--color-accent)] rounded-tl-md pointer-events-none opacity-80" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[var(--color-accent)] rounded-tr-md pointer-events-none opacity-80" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[var(--color-accent)] rounded-bl-md pointer-events-none opacity-80" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[var(--color-accent)] rounded-br-md pointer-events-none opacity-80" />

      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-accent)] uppercase tracking-widest font-semibold">
            <Radio className="w-3.5 h-3.5 text-[var(--color-accent)] animate-pulse" /> Cybernetic Neural Core Architecture
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mt-0.5 tracking-wide font-space-grotesk">
            Quantum Mesh & Firewall Shield HUD
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
              activeTab === "architecture"
                ? "bg-[var(--color-accent)] text-black font-extrabold shadow-sm"
                : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
            }`}
          >
            HUD Matrix
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
              activeTab === "logs"
                ? "bg-[var(--color-accent)] text-black font-extrabold shadow-sm"
                : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
            }`}
          >
            Telemetry Log
          </button>
        </div>
      </div>

      {activeTab === "architecture" ? (
        /* ULTRA-SMOOTH CANVAS FIELD (DARK HUB LOOK PRESERVED IN DARK, ADAPTIVE IN LIGHT) */
        <div className="relative w-full min-h-[460px] bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] p-6 sm:p-8 flex items-center justify-center overflow-hidden transition-colors duration-200">
          
          {/* Hardware-Accelerated Laser Scan Line */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "top" }}
            className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40 z-0 pointer-events-none"
          />

          {/* ISOMETRIC MATRIX GRID NODES */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
            
            {/* LEFT SIDE: CYBER INGRESS */}
            <div className="space-y-4 flex flex-col items-center md:items-start">
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center gap-3 w-full max-w-[240px] shadow-sm"
              >
                <div className="p-2.5 bg-[var(--color-accent-dim)] rounded-xl text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                  <Cloud className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Cloud Mesh Edge</h4>
                  <span className="text-[10px] text-[var(--color-accent)] font-mono">Global Ingress Routing</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center gap-3 w-full max-w-[240px] shadow-sm"
              >
                <div className="p-2.5 bg-[var(--color-accent-dim)] rounded-xl text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Zero-Trust IAM</h4>
                  <span className="text-[10px] text-[var(--color-accent)] font-mono">Token Authentication</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center gap-3 w-full max-w-[240px] shadow-sm"
              >
                <div className="p-2.5 bg-[var(--color-accent-dim)] rounded-xl text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Client Session</h4>
                  <span className="text-[10px] text-[var(--color-text-secondary)] font-mono">TLS Encrypted Link</span>
                </div>
              </motion.div>

            </div>

            {/* CENTER CORE: HOLOGRAPHIC QUANTUM REACTOR CORE */}
            <div className="flex justify-center items-center my-4 md:my-0 relative">
              
              {/* Rotating Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform" }}
                className="absolute w-72 h-72 border border-[var(--color-accent)]/30 rounded-full border-dashed pointer-events-none"
              />

              {/* Smooth Floating Reactor Card */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ willChange: "transform" }}
                className="relative group cursor-pointer z-10"
              >
                <div className="absolute inset-0 bg-[var(--color-accent)]/10 blur-xl rounded-3xl" />
                
                <div className="relative w-64 h-72 bg-[var(--color-surface-elevated)] border-2 border-[var(--color-accent)] rounded-3xl p-5 shadow-lg backdrop-blur-2xl flex flex-col justify-between items-center text-center">
                  
                  {/* Reactor Header */}
                  <div className="w-full flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--color-accent)] font-bold uppercase tracking-widest">
                      <Crosshair className="w-3.5 h-3.5 text-[var(--color-accent)]" /> QUANTUM CORE
                    </span>
                    <Lock className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>

                  {/* Core Indicator */}
                  <div className="my-auto space-y-3 w-full">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-md">
                        <Server className="w-7 h-7 text-black" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {[1, 2].map((node) => (
                        <div key={node} className="bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-xl flex items-center justify-between text-[11px] font-mono">
                          <span className="text-[var(--color-text-secondary)]">Neural Node_0{node}</span>
                          <span className="text-[var(--color-accent)] font-bold">ONLINE</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Footer */}
                  <div className="w-full pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
                    <span>LOAD: <span className="text-[var(--color-accent)] font-bold">12.4%</span></span>
                    <span>TEMP: <span className="text-[var(--color-text-primary)] font-bold">32°C</span></span>
                  </div>

                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: KAFKA STREAM & FIREWALL */}
            <div className="space-y-4 flex flex-col items-center md:items-end">
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center gap-3 w-full max-w-[240px] justify-between shadow-sm"
              >
                <div>
                  <h4 className="text-xs font-mono font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Kafka Event Stream</h4>
                  <span className="text-[10px] text-[var(--color-text-secondary)] font-mono">Pub/Sub Message Bus</span>
                </div>
                <div className="p-2.5 bg-[var(--color-accent-dim)] rounded-xl text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                  <RadioReceiver className="w-5 h-5" />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center gap-3 w-full max-w-[240px] justify-between shadow-sm"
              >
                <div>
                  <h4 className="text-xs font-mono font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Database Layer</h4>
                  <span className="text-[10px] text-[var(--color-text-secondary)] font-mono">Postgres & Redis Cache</span>
                </div>
                <div className="p-2.5 bg-[var(--color-accent-dim)] rounded-xl text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                  <Database className="w-5 h-5" />
                </div>
              </motion.div>

              {/* CYBER FIREWALL NODE */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[var(--color-surface)] border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 w-full max-w-[240px] justify-between relative shadow-sm"
              >
                <div>
                  <h4 className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" /> Cyber Firewall
                  </h4>
                  <span className="text-[10px] text-red-500/80 font-mono">Target Threat Neutralized</span>
                </div>

                <div className="relative">
                  <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                    <Bug className="w-5 h-5" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    ✕
                  </span>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      ) : (
        /* LIVE SECURITY LOG STREAM TERMINAL */
        <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-5 font-mono text-xs space-y-3 min-h-[460px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-3 text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-2 text-[var(--color-accent)] font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4" /> Cybernetic Defense Audit Console
              </span>
              <button
                onClick={triggerSimulatedThreat}
                className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer text-[11px] font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Execute Attack Test Payload
              </button>
            </div>

            <div className="space-y-2">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg leading-relaxed ${
                    log.includes("CRITICAL WARNING") || log.includes("DEFENSE_SHIELD")
                      ? "bg-red-500/10 border border-red-500/30 text-red-500 font-bold"
                      : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-mono">
            <span>Core Status: ONLINE (100% Integrity)</span>
            <span className="text-[var(--color-accent)] font-semibold">Autonomous Defense Active</span>
          </div>
        </div>
      )}

    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN PAGE COMPONENT
// ----------------------------------------------------------------------
export default function ProjectCaseStudyPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "auto-marketplace-modernization";

  const [selectedNode, setSelectedNode] = useState<NodeDetail>(SYSTEM_NODES[0]);
  const [copied, setCopied] = useState(false);

  // GitHub Repo Link
  const GITHUB_REPO_URL = "https://github.com/mamun441998/Auto-Marketplace-Modernization.git";

  const sampleMLPipelineCode = `
# Event-Driven Valuation Inference Pipeline (Auto Marketplace)
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
    features = extract_feature_vector(vehicle_data) # [mileage, year, brand_score, condition]
    
    # Real-Time Price Inference
    dmatrix = xgb.DMatrix([features])
    predicted_fair_price = model.predict(dmatrix)[0]
    
    # Broadcast to Redis Event Stream for Webhook Notification
    publish_valuation_event(vehicle_data['id'], float(predicted_fair_price))
  `.trim();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans selection:bg-[var(--color-accent)] selection:text-black pt-24 pb-20 px-6 sm:px-10 lg:px-16 relative overflow-hidden select-none transition-colors duration-200">
      
      {/* Dynamic Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, var(--color-accent-dim), transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors group uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-secondary)]">
            <GitBranch className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Repo: <span className="text-[var(--color-text-primary)] font-semibold">Auto-Marketplace-Modernization</span></span>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="space-y-6 border-b border-[var(--color-border)] pb-12">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--color-accent)]">
            <span className="px-3 py-1 rounded-full bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/30 flex items-center gap-1.5 font-semibold">
              <Activity className="w-3.5 h-3.5" /> Data Science & Distributed System Architecture
            </span>
            <span className="text-[var(--color-text-muted)]">•</span>
            <span className="text-[var(--color-text-secondary)]">Event-Driven Modernization</span>
            <span className="text-[var(--color-text-muted)]">•</span>
            <span className="text-[var(--color-text-secondary)]">Cloud-Native Scale</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] leading-tight font-space-grotesk">
            Auto Marketplace <br className="hidden md:block" />
            <span className="text-[var(--color-accent)]">
              Modernization System
            </span>
          </h1>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] mb-2 flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4" /> Architectural Challenge & Vision
            </h3>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed font-inter">
              &quot;Deconstruct a monolithic legacy automotive platform into an event-driven microservices architecture. Integrated a real-time ML-powered car valuation pipeline and distributed search cluster to reduce listing processing time from minutes to sub-100ms globally.&quot;
            </p>
          </div>

          {/* Key Engineering Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {[
              { label: "Search Latency", value: "< 15ms", sub: "Distributed OpenSearch Cluster" },
              { label: "Throughput", value: "12,000 req/s", sub: "Async Ingestion Engine" },
              { label: "ML Accuracy", value: "98.4%", sub: "Automated Valuation Inference" },
              { label: "System Availability", value: "99.99%", sub: "Decoupled Event Streaming" },
            ].map((metric, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl relative overflow-hidden group hover:border-[var(--color-accent)] transition-all backdrop-blur-md shadow-sm">
                <div className="text-xl md:text-3xl font-extrabold text-[var(--color-accent)] font-mono">{metric.value}</div>
                <div className="text-xs font-semibold text-[var(--color-text-primary)] mt-1">{metric.label}</div>
                <div className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">{metric.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 🌟 SCI-FI CODE-DRIVEN SYSTEM ARCHITECTURE DIAGRAM */}
        <section className="space-y-6">
          <TechnicalInfrastructureDiagram />
        </section>

        {/* REAL TECHNICAL ARCHITECTURE FLOW DIAGRAM */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest font-semibold">
              <Workflow className="w-4 h-4" /> System Topology & Data Flow
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mt-1">
              Data Science & Architecture Flow Visualizer
            </h2>
            <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-1">
              Select any operational node in the distributed flow diagram to analyze technical architecture, ML logic, and performance metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive System Canvas */}
            <div className="lg:col-span-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 relative overflow-hidden backdrop-blur-md shadow-sm">
              
              <div className="mb-4 flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)] border-b border-[var(--color-border)] pb-3">
                <span className="flex items-center gap-1.5 text-[var(--color-accent)] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" /> Live Event Pipeline Streaming
                </span>
                <span>Click Node for Specs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {SYSTEM_NODES.map((node) => {
                  const Icon = node.icon;
                  const isSelected = selectedNode.id === node.id;

                  return (
                    <motion.button
                      key={node.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-2xl text-left border transition-all relative flex flex-col justify-between h-36 cursor-pointer ${
                        isSelected
                          ? "bg-[var(--color-accent-dim)] border-[var(--color-accent)] shadow-sm"
                          : "bg-[var(--color-surface-elevated)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50 text-[var(--color-text-secondary)]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                          isSelected ? "bg-[var(--color-accent)] text-black font-bold" : "bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
                        }`}>
                          {node.category}
                        </span>
                        <Icon className={isSelected ? "text-[var(--color-accent)] w-5 h-5" : "text-[var(--color-text-muted)] w-5 h-5"} />
                      </div>

                      <div>
                        <div className={`text-sm font-bold ${isSelected ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}>
                          {node.name}
                        </div>
                        <div className="text-[11px] font-mono text-[var(--color-text-muted)] truncate mt-0.5">
                          {node.tech}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-[var(--color-border)] text-[var(--color-text-muted)]">
                        <span>Metric:</span>
                        <span className="text-[var(--color-accent)] font-bold">{node.metrics}</span>
                      </div>

                      {isSelected && (
                        <motion.span
                          layoutId="activeGlowNode"
                          className="absolute inset-0 rounded-2xl border-2 border-[var(--color-accent)] pointer-events-none"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Architectural Sidebar Panel */}
            <div className="lg:col-span-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 min-h-[420px] flex flex-col justify-between backdrop-blur-md shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
                    <div className="p-3 rounded-2xl bg-[var(--color-accent-dim)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                      <selectedNode.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--color-text-primary)]">{selectedNode.name}</h3>
                      <p className="text-xs font-mono text-[var(--color-accent)]">{selectedNode.tech}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-1 flex items-center gap-1.5 font-semibold">
                      <Gauge className="w-3.5 h-3.5 text-[var(--color-accent)]" /> Technology Rationale
                    </h4>
                    <p className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed font-inter">
                      {selectedNode.whyChosen}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-1 flex items-center gap-1.5 font-semibold">
                      <Binary className="w-3.5 h-3.5 text-[var(--color-accent)]" /> Technical Data Flow Logic
                    </h4>
                    <p className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed font-inter">
                      {selectedNode.howItWorks}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
                <span>Selected Subsystem: #{selectedNode.id}</span>
                <span className="text-[var(--color-accent)] flex items-center gap-1">Validated <CheckCircle2 className="w-3.5 h-3.5" /></span>
              </div>
            </div>

          </div>
        </section>

        {/* DATA SCIENCE & ENGINEERING TRADE-OFFS */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Zap className="text-[var(--color-accent)] w-6 h-6" /> Engineering & ML Trade-off Decisions
            </h2>
            <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-1">
              Architectural compromises balancing model accuracy, inference speed, and data pipeline throughput.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 space-y-4 hover:border-[var(--color-accent)]/50 transition-all backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--color-accent)] bg-[var(--color-accent-dim)] px-2.5 py-1 rounded-lg">
                  Trade-off #1: ML Inference Pipeline
                </span>
                <span className="text-xs text-[var(--color-text-muted)] font-mono">Real-time Kafka vs Batch ETL</span>
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Why Stream-based Inference over Batch Processing?
              </h3>
              <p className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed font-inter">
                Traditional batch valuation updates caused pricing lag for seller listings. Streaming Kafka events directly into XGBoost inference models reduced valuation updates to under 100 milliseconds upon submission.
              </p>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 space-y-4 hover:border-[var(--color-accent)]/50 transition-all backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--color-accent)] bg-[var(--color-accent-dim)] px-2.5 py-1 rounded-lg">
                  Trade-off #2: Search Architecture
                </span>
                <span className="text-xs text-[var(--color-text-muted)] font-mono">OpenSearch vs Relational SQL</span>
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Why Dedicated Search Cluster over SQL Filtering?
              </h3>
              <p className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed font-inter">
                Complex SQL `JOIN` operations across mileage, location, price, and specs degraded under high traffic. Offloading search indexing to OpenSearch delivered sub-15ms responses across multi-facet queries.
              </p>
            </div>
          </div>
        </section>

        {/* CODE & PIPELINE HIGHLIGHTS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Code2 className="text-[var(--color-accent)] w-6 h-6" /> Real-time Inference Pipeline Snippet
            </h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(sampleMLPipelineCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs font-mono bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              {copied ? "Copied Snippet!" : "Copy Snippet"}
            </button>
          </div>

          <div className="bg-[#0d1117] border border-[var(--color-border)] rounded-3xl p-5 overflow-x-auto font-mono text-xs md:text-sm text-emerald-400 leading-relaxed shadow-lg">
            <pre><code>{sampleMLPipelineCode}</code></pre>
          </div>
        </section>

        {/* LIVE DEMO & GITHUB REPO LINKS */}
        <section className="border-t border-[var(--color-border)] pt-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Explore full modernized codebase</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Inspect repository microservices, deployment scripts, and architecture docs.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-accent)] text-[var(--color-text-primary)] font-mono text-xs hover:bg-[var(--color-accent)] hover:text-black transition-all shadow-md font-bold uppercase tracking-wider"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}