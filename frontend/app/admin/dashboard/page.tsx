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
import LeadsCRM from "@/components/admin/LeadsCRM";
import MeetingsPanel from "@/components/admin/MeetingsPanel";
import AnalyticsCenter from "@/components/admin/AnalyticsCenter";

const POLL_MS = 15000; // re-fetch live data every 15s while the tab is visible
const TAB_KEY = "mrp_admin_tab";
const VALID_TABS: AdminTab[] = [
  "dashboard", "cms", "projects", "skills", "experience",
  "services", "casestudy", "crm", "meetings", "analytics",
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
  const [collapsed, setCollapsed] = useState(false);
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
      const [projects, skills, experience, services, casestudy, unread, meetings] = await Promise.all([
        api.projects.list().then((r) => r.length).catch(() => 0),
        api.skills.list().then((r) => r.length).catch(() => 0),
        api.experiences.list().then((r) => r.length).catch(() => 0),
        api.services.list().then((r) => r.length).catch(() => 0),
        api.caseStudies.list().then((r) => r.length).catch(() => 0),
        api.contact.stats().then((s) => s.unread).catch(() => 0),
        api.meetings.list().then((r) => r.meetings.length).catch(() => 0),
      ]);
      // The "Messages & Leads" badge shows the UNREAD count, not the total.
      setBadges({ projects, skills, experience, services, casestudy, crm: unread, meetings });
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
    <div className="flex h-screen w-screen bg-[#050505] text-gray-100 font-sans overflow-hidden">
      <Sidebar
        active={tab}
        onSelect={setTab}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        badges={badges}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onRefresh={handleRefresh}
          onLogout={logout}
          refreshing={refreshing}
          live={live}
          lastUpdated={lastUpdated}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* refreshKey remounts only on manual refresh; tick keeps modules live in place */}
          <div key={`${tab}-${refreshKey}`}>
            {tab === "dashboard" && <DashboardCore counts={counts} refreshSignal={tick} />}
            {tab === "cms" && <PortfolioCMS />}
            {tab === "projects" && <ProjectsManager onChanged={loadBadges} />}
            {tab === "skills" && <SkillsStack onChanged={loadBadges} />}
            {tab === "experience" && <ExperienceLog onChanged={loadBadges} />}
            {tab === "services" && <ServicesEngine onChanged={loadBadges} />}
            {tab === "casestudy" && <CaseStudyBuilder onChanged={loadBadges} />}
            {tab === "crm" && <LeadsCRM onChanged={loadBadges} refreshSignal={tick} />}
            {tab === "meetings" && <MeetingsPanel onChanged={loadBadges} refreshSignal={tick} />}
            {tab === "analytics" && <AnalyticsCenter refreshSignal={tick} />}
          </div>
        </main>
      </div>
    </div>
  );
}
