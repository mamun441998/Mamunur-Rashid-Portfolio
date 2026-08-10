"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "@/lib/api";
import { withDefaults } from "@/lib/defaults";
import type { SiteSetting } from "@/lib/types";
import {
  SectionHeader,
  Panel,
  Field,
  TextInput,
  TextArea,
  PrimaryButton,
  StatusToast,
} from "./ui";

type Status = { type: "success" | "error"; message: string } | null;

const TEXT_FIELDS: { key: keyof SiteSetting; label: string; placeholder?: string }[] = [
  { key: "full_name", label: "Full Name" },
  { key: "role_title", label: "Role Title" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "profile_image_url", label: "Profile Image URL" },
  { key: "resume_url", label: "Resume URL" },
  { key: "github_url", label: "GitHub URL" },
  { key: "linkedin_url", label: "LinkedIn URL" },
  { key: "twitter_url", label: "Twitter URL" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "calendly_url", label: "Meeting / Booking URL (Google Calendar appointment link)" },
];

const STAT_FIELDS: { key: keyof SiteSetting; label: string }[] = [
  { key: "years_experience", label: "Years Experience" },
  { key: "projects_completed", label: "Projects Completed" },
  { key: "happy_clients", label: "Happy Clients" },
  { key: "satisfaction", label: "Satisfaction" },
];

export default function PortfolioCMS() {
  const [data, setData] = useState<SiteSetting | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    api.settings.get()
      .then((s) => setData(withDefaults(s)))
      .catch(() => setStatus({ type: "error", message: "Failed to load settings." }));
  }, []);

  const set = (key: keyof SiteSetting, value: string) =>
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setStatus(null);
    try {
      const { id, ...payload } = data;
      const updated = await api.settings.update(payload);
      setData(updated);
      setStatus({ type: "success", message: "Portfolio CMS updated successfully." });
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Failed to update settings." });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  if (!data) {
    return (
      <div>
        <SectionHeader title="Portfolio CMS" subtitle="Global content that powers the public site." />
        <Panel><p className="text-sm text-gray-500 font-mono py-6 text-center">Loading settings…</p></Panel>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      <SectionHeader
        title="Portfolio CMS"
        subtitle="Global content that powers the public site."
        action={
          <PrimaryButton type="submit" disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save Changes"}
          </PrimaryButton>
        }
      />

      {status && <div className="mb-4"><StatusToast status={status} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Identity & Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEXT_FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <TextInput
                  value={(data[f.key] as string) || ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                />
              </Field>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Hero & About</h3>
            <Field label="Hero Tagline">
              <TextArea
                rows={3}
                value={data.hero_tagline || ""}
                onChange={(e) => set("hero_tagline", e.target.value)}
              />
            </Field>
            <Field label="About Text (blank line separates paragraphs)">
              <TextArea
                rows={7}
                value={data.about_text || ""}
                onChange={(e) => set("about_text", e.target.value)}
              />
            </Field>
          </Panel>

          <Panel className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Stat Counters</h3>
            <div className="grid grid-cols-2 gap-4">
              {STAT_FIELDS.map((f) => (
                <Field key={f.key} label={f.label}>
                  <TextInput
                    value={(data[f.key] as string) || ""}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </Field>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </form>
  );
}
