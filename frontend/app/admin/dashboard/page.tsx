"use client";

import { useCallback, useEffect, useState } from "react";
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

export default function AdminDashboard() {
  const { ready, authenticated, logout } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [badges, setBadges] = useState<NavBadges>({});
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadBadges = useCallback(async () => {
    setRefreshing(true);
    try {
      const [projects, skills, experience, services, casestudy, unread, meetings] = await Promise.all([
        api.projects.list().then((r) => r.length).catch(() => 0),
        api.skills.list().then((r) => r.length).catch(() => 0),
        api.experiences.list().then((r) => r.length).catch(() => 0),
        api.services.list().then((r) => r.length).catch(() => 0),
        api.caseStudies.list().then((r) => r.length).catch(() => 0),
        api.contact.stats().then((s) => s.unread).catch(() => 0),
        api.meetings.list().then((r) => r.length).catch(() => 0),
      ]);
      // The "Messages & Leads" badge shows the UNREAD count, not the total.
      setBadges({ projects, skills, experience, services, casestudy, crm: unread, meetings });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadBadges();
  }, [authenticated, loadBadges]);

  const handleRefresh = () => {
    loadBadges();
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
        <Topbar onRefresh={handleRefresh} onLogout={logout} refreshing={refreshing} />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div key={`${tab}-${refreshKey}`}>
            {tab === "dashboard" && <DashboardCore counts={counts} />}
            {tab === "cms" && <PortfolioCMS />}
            {tab === "projects" && <ProjectsManager onChanged={loadBadges} />}
            {tab === "skills" && <SkillsStack onChanged={loadBadges} />}
            {tab === "experience" && <ExperienceLog onChanged={loadBadges} />}
            {tab === "services" && <ServicesEngine onChanged={loadBadges} />}
            {tab === "casestudy" && <CaseStudyBuilder onChanged={loadBadges} />}
            {tab === "crm" && <LeadsCRM onChanged={loadBadges} />}
            {tab === "meetings" && <MeetingsPanel onChanged={loadBadges} />}
            {tab === "analytics" && <AnalyticsCenter />}
          </div>
        </main>
      </div>
    </div>
  );
}
