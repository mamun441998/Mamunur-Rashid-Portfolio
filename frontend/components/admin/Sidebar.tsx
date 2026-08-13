"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";
import {
  LayoutDashboard,
  FileCode2,
  FolderKanban,
  Wrench,
  Briefcase,
  Layers,
  FileText,
  Newspaper,
  Quote,
  Users,
  Mail,
  CalendarClock,
  LineChart,
  Settings,
  Activity,
  X,
} from "lucide-react";

export type AdminTab =
  | "dashboard"
  | "cms"
  | "projects"
  | "skills"
  | "experience"
  | "services"
  | "casestudy"
  | "blog"
  | "testimonials"
  | "clients"
  | "crm"
  | "meetings"
  | "analytics"
  | "settings";

export interface NavBadges {
  projects?: number;
  skills?: number;
  experience?: number;
  services?: number;
  casestudy?: number;
  blog?: number;
  testimonials?: number;
  clients?: number;
  crm?: number;
  meetings?: number;
}

const NAV: { id: AdminTab; label: string; icon: any; badgeKey?: keyof NavBadges }[] = [
  { id: "dashboard", label: "Dashboard Core", icon: LayoutDashboard },
  { id: "cms", label: "Portfolio CMS", icon: FileCode2 },
  { id: "projects", label: "Projects Manager", icon: FolderKanban, badgeKey: "projects" },
  { id: "skills", label: "Skills Stack", icon: Wrench, badgeKey: "skills" },
  { id: "experience", label: "Experience Log", icon: Briefcase, badgeKey: "experience" },
  { id: "services", label: "Services Engine", icon: Layers, badgeKey: "services" },
  { id: "casestudy", label: "Case Study Builder", icon: FileText, badgeKey: "casestudy" },
  { id: "blog", label: "Blog Studio", icon: Newspaper, badgeKey: "blog" },
  { id: "testimonials", label: "Testimonials", icon: Quote, badgeKey: "testimonials" },
  { id: "clients", label: "Client Portal", icon: Users, badgeKey: "clients" },
  { id: "crm", label: "Messages & Leads", icon: Mail, badgeKey: "crm" },
  { id: "meetings", label: "Meetings Panel", icon: CalendarClock, badgeKey: "meetings" },
  { id: "analytics", label: "Analytics Center", icon: LineChart },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  active,
  onSelect,
  collapsed,
  onToggle,
  badges,
  mobileOpen = false,
  onMobileClose,
}: {
  active: AdminTab;
  onSelect: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggle: () => void;
  badges: NavBadges;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const { data: settings } = useSettings();
  const avatar = settings?.profile_image_url?.trim() || "/Profile-Picture.png";
  // On mobile the nav is a slide-in drawer; selecting a tab closes it.
  const select = (tab: AdminTab) => { onSelect(tab); onMobileClose?.(); };
  return (
    <>
    {/* Mobile backdrop */}
    {mobileOpen && (
      <div
        onClick={onMobileClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        aria-hidden
      />
    )}
    <aside
      className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-30 shrink-0 w-72 ${
        collapsed ? "lg:w-24" : "lg:w-72"
      } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 bg-[#080a10]/95 lg:bg-[#080a10]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-5 transition-transform duration-300 ease-out`}
    >
      <div className="min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#00FFC2]/50 shadow-[0_0_20px_rgba(0,255,194,0.3)] shrink-0">
              <Image
                src={avatar}
                alt="Mamunur Rashid"
                fill
                sizes="48px"
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div className={`flex flex-col ${collapsed ? "lg:hidden" : ""}`}>
              <span className="font-extrabold tracking-wider text-base font-space-grotesk text-white">
                MRP-OS
              </span>
              <span className="text-xs font-mono text-[#00FFC2] font-semibold tracking-widest uppercase">
                v5.0 PROD CORE
              </span>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="hidden lg:inline-flex p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00FFC2]/50 text-gray-300 hover:text-[#00FFC2] transition"
            title="Collapse sidebar"
          >
            <Activity className="w-5 h-5" />
          </button>
          <button
            onClick={onMobileClose}
            className="lg:hidden inline-flex p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00FFC2]/50 text-gray-300 hover:text-[#00FFC2] transition"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const badge = item.badgeKey ? badges[item.badgeKey] : undefined;
            return (
              <button
                key={item.id}
                onClick={() => select(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                  isActive
                    ? "bg-[#00FFC2]/15 text-[#00FFC2] border border-[#00FFC2]/50 shadow-[0_0_20px_rgba(0,255,194,0.2)] font-bold"
                    : "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3.5 truncate">
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? "text-[#00FFC2]" : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
                </div>
                {badge !== undefined && badge > 0 && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#7C3AED] text-white font-extrabold shadow-sm ${collapsed ? "lg:hidden" : ""}`}>
                    {badge}
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

      <div className={`pt-4 mt-4 border-t border-white/10 text-[10px] font-mono text-gray-500 ${collapsed ? "lg:hidden" : ""}`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FFC2] animate-pulse" />
          SYSTEM ONLINE
        </div>
      </div>
    </aside>
    </>
  );
}
