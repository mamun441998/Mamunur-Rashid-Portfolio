"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import Sidebar, { AdminTab, NavBadges } from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import DashboardCore from "@/components/admin/DashboardCore";
import PortfolioCMS from "@/components/admin/PortfolioCMS";
import ProjectsManager from "@/components/admin/ProjectsManager";
import SkillsStack from "@/components/admin/SkillsStack";
import ExperienceLog from "@/components/admin/ExperienceLog";
import ServicesEngine from "@/components/admin/ServicesEngine";
import CaseStudyBuilder from "@/components/admin/CaseStudyBuilder";
import BlogManager from "@/components/admin/BlogManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import ClientsManager from "@/components/admin/ClientsManager";
import LeadsCRM from "@/components/admin/LeadsCRM";
import MeetingsPanel from "@/components/admin/MeetingsPanel";
import AnalyticsCenter from "@/components/admin/AnalyticsCenter";
import SettingsPanel from "@/components/admin/SettingsPanel";
import { ConfirmProvider } from "@/components/admin/ConfirmDialog";

const POLL_MS = 15000; // re-fetch live data every 15s while the tab is visible
const TAB_KEY = "mrp_admin_tab";
const VALID_TABS: AdminTab[] = [
  "dashboard", "cms", "projects", "skills", "experience",
  "services", "casestudy", "blog", "testimonials", "clients", "crm", "meetings", "analytics", "settings",
];

export default function AdminDashboard() {
  const { ready, authenticated, logout } = useAuth();
  const [tab, setTabState] = useState<AdminTab>("dashboard");

  // Restore the last-open tab so a browser refresh stays on the same panel.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TAB_KEY) as AdminTab | null;
      if (saved && VALID_TABS.includes(saved)) setTabState(saved);
    } catch { /* ignore */ }
  }, []);

  const setTab = (t: AdminTab) => {
    setTabState(t);
    try { localStorage.setItem(TAB_KEY, t); } catch { /* ignore */ }
  };
  // When a notification deep-links to a specific client, open its Manage view.
  const [focusClientId, setFocusClientId] = useState<number | null>(null);
  const [focusNonce, setFocusNonce] = useState(0);
  const handleNavigate = (t: AdminTab, entityId?: number) => {
    setTab(t);
    if (t === "clients" && entityId) {
      setFocusClientId(entityId);
      setFocusNonce((n) => n + 1);
    }
  };
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false); // mobile slide-in sidebar
  const [badges, setBadges] = useState<NavBadges>({});
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  // Real-time state: `tick` bumps each poll and is passed to live modules so
  // they re-fetch without remounting (selection/scroll are preserved).
  const [tick, setTick] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [live, setLive] = useState(true);
  const inFlight = useRef(false);

  const loadBadges = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setRefreshing(true);
    try {
      const [projects, skills, experience, services, casestudy, blog, testimonials, clients, unread, meetings] = await Promise.all([
        api.projects.list().then((r) => r.length).catch(() => 0),
        api.skills.list().then((r) => r.length).catch(() => 0),
        api.experiences.list().then((r) => r.length).catch(() => 0),
        api.services.list().then((r) => r.length).catch(() => 0),
        api.caseStudies.list().then((r) => r.length).catch(() => 0),
        api.blogs.listAll().then((r) => r.length).catch(() => 0),
        api.testimonials.list().then((r) => r.length).catch(() => 0),
        api.clients.list().then((r) => r.length).catch(() => 0),
        api.contact.stats().then((s) => s.unread).catch(() => 0),
        api.meetings.list().then((r) =>
          r.meetings.filter((m) => m.status !== "canceled" && (m.state || "pending") === "pending").length
        ).catch(() => 0),
      ]);
      // The "Messages & Leads" badge shows the UNREAD count, not the total.
      setBadges({ projects, skills, experience, services, casestudy, blog, testimonials, clients, crm: unread, meetings });
      setLastUpdated(new Date());
    } finally {
      setRefreshing(false);
      inFlight.current = false;
    }
  }, []);

  // Initial load once authenticated.
  useEffect(() => {
    if (authenticated) loadBadges();
  }, [authenticated, loadBadges]);

  // Poll while the tab is visible; pause when hidden to save requests / Render wake-ups.
  useEffect(() => {
    if (!authenticated) return;
    const syncVisibility = () => setLive(document.visibilityState === "visible");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    const id = setInterval(() => {
      if (document.visibilityState === "visible") setTick((t) => t + 1);
    }, POLL_MS);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [authenticated]);

  // Each poll tick refreshes sidebar badges + counts.
  useEffect(() => {
    if (authenticated && tick > 0) loadBadges();
  }, [tick, authenticated, loadBadges]);

  const handleRefresh = () => {
    loadBadges();
    setTick((t) => t + 1); // nudge live modules to re-fetch immediately
    setRefreshKey((k) => k + 1);
  };

  if (!ready || !authenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#050505] text-[#00FFC2]">
        <p className="animate-pulse font-mono text-sm">Authenticating…</p>
      </div>
    );
  }

  const counts = {
    projects: badges.projects ?? 0,
    services: badges.services ?? 0,
    meetings: badges.meetings ?? 0,
  };

  return (
    <ConfirmProvider>
    <div className="flex h-[100dvh] w-screen bg-[#050505] text-gray-100 font-sans overflow-hidden">
      <Sidebar
        active={tab}
        onSelect={setTab}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        badges={badges}
        mobileOpen={mobileNav}
        onMobileClose={() => setMobileNav(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onRefresh={handleRefresh}
          onLogout={logout}
          onNavigate={handleNavigate}
          onMenuClick={() => setMobileNav(true)}
          notifSignal={tick}
          refreshing={refreshing}
          live={live}
          lastUpdated={lastUpdated}
        />

        <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 pb-28 sm:p-6 sm:pb-10">
          {/* refreshKey remounts only on manual refresh; tick keeps modules live in place */}
          <div key={`${tab}-${refreshKey}`}>
            {tab === "dashboard" && <DashboardCore counts={counts} refreshSignal={tick} />}
            {tab === "cms" && <PortfolioCMS />}
            {tab === "projects" && <ProjectsManager onChanged={loadBadges} />}
            {tab === "skills" && <SkillsStack onChanged={loadBadges} />}
            {tab === "experience" && <ExperienceLog onChanged={loadBadges} />}
            {tab === "services" && <ServicesEngine onChanged={loadBadges} />}
            {tab === "casestudy" && <CaseStudyBuilder onChanged={loadBadges} />}
            {tab === "blog" && <BlogManager onChanged={loadBadges} />}
            {tab === "testimonials" && <TestimonialsManager onChanged={loadBadges} />}
            {tab === "clients" && <ClientsManager onChanged={loadBadges} focusClientId={focusClientId} focusNonce={focusNonce} />}
            {tab === "crm" && <LeadsCRM onChanged={loadBadges} refreshSignal={tick} />}
            {tab === "meetings" && <MeetingsPanel onChanged={loadBadges} refreshSignal={tick} />}
            {tab === "analytics" && <AnalyticsCenter refreshSignal={tick} />}
            {tab === "settings" && <SettingsPanel />}
          </div>
        </main>
      </div>
    </div>
    </ConfirmProvider>
  );
}
