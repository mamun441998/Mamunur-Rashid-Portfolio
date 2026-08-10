"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Save, KeyRound, User, ShieldCheck } from "lucide-react";
import { api, changePasswordRequest } from "@/lib/api";
import { withDefaults } from "@/lib/defaults";
import type { SiteSetting } from "@/lib/types";
import {
  SectionHeader,
  Panel,
  Field,
  TextInput,
  PrimaryButton,
  StatusToast,
} from "./ui";

type Status = { type: "success" | "error"; message: string } | null;

export default function SettingsPanel() {
  const [data, setData] = useState<SiteSetting | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<Status>(null);

  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwStatus, setPwStatus] = useState<Status>(null);

  useEffect(() => {
    api.settings.get()
      .then((s) => setData(withDefaults(s)))
      .catch(() => setProfileStatus({ type: "error", message: "Failed to load profile." }));
  }, []);

  const set = (k: keyof SiteSetting, v: string) => setData((p) => (p ? { ...p, [k]: v } : p));

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSavingProfile(true);
    setProfileStatus(null);
    try {
      const { id, ...payload } = data;
      const updated = await api.settings.update(payload);
      setData(updated);
      setProfileStatus({ type: "success", message: "Profile updated." });
    } catch (err: any) {
      setProfileStatus({ type: "error", message: err?.message || "Failed to save." });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileStatus(null), 4000);
    }
  };

  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwStatus(null);
    if (next.length < 6) return setPwStatus({ type: "error", message: "New password must be at least 6 characters." });
    if (next !== confirm) return setPwStatus({ type: "error", message: "New passwords do not match." });
    setSavingPw(true);
    try {
      await changePasswordRequest(cur, next);
      setPwStatus({ type: "success", message: "Password updated ✓" });
      setCur(""); setNext(""); setConfirm("");
    } catch (err: any) {
      setPwStatus({ type: "error", message: err?.message || "Failed to change password." });
    } finally {
      setSavingPw(false);
      setTimeout(() => setPwStatus(null), 5000);
    }
  };

  return (
    <div>
      <SectionHeader title="Settings" subtitle="Your profile details and account security." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profile */}
        <form onSubmit={saveProfile}>
          <Panel className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <User className="w-4 h-4 text-[#00FFC2]" /> Profile
            </div>
            {data ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#00FFC2]/40 shrink-0 bg-white/5">
                    <Image
                      src={data.profile_image_url?.trim() || "/Profile-Picture.png"}
                      alt="Profile"
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <Field label="Profile Image URL (shown on the site)">
                      <TextInput value={data.profile_image_url || ""} onChange={(e) => set("profile_image_url", e.target.value)} placeholder="https://…/photo.jpg" />
                    </Field>
                  </div>
                </div>
                <Field label="Full Name"><TextInput value={data.full_name || ""} onChange={(e) => set("full_name", e.target.value)} /></Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone (shown in Contact)"><TextInput value={data.phone || ""} onChange={(e) => set("phone", e.target.value)} /></Field>
                  <Field label="Email (shown in Contact)"><TextInput value={data.email || ""} onChange={(e) => set("email", e.target.value)} /></Field>
                </div>
                {profileStatus && <StatusToast status={profileStatus} />}
                <div className="flex justify-end">
                  <PrimaryButton type="submit" disabled={savingProfile}>
                    <Save className="w-4 h-4" />{savingProfile ? "Saving…" : "Save Profile"}
                  </PrimaryButton>
                </div>
                <p className="text-[11px] text-gray-500">More content (hero, about, social links, stats) lives in <span className="text-gray-300">Portfolio CMS</span>.</p>
              </>
            ) : (
              <p className="text-sm text-gray-500 font-mono py-6 text-center">Loading…</p>
            )}
          </Panel>
        </form>

        {/* Security */}
        <form onSubmit={changePw}>
          <Panel className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-[#00FFC2]" /> Account Security
            </div>
            <Field label="Current Password"><TextInput type="password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" /></Field>
            <Field label="New Password"><TextInput type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" /></Field>
            <Field label="Confirm New Password"><TextInput type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" /></Field>
            {pwStatus && <StatusToast status={pwStatus} />}
            <div className="flex justify-end">
              <PrimaryButton type="submit" disabled={savingPw || !cur || !next}>
                <KeyRound className="w-4 h-4" />{savingPw ? "Updating…" : "Change Password"}
              </PrimaryButton>
            </div>
            <div className="pt-3 border-t border-white/10 text-[11px] text-gray-500">
              Forgot your password? Use <span className="text-gray-300">“Forgot password?”</span> on the login screen — a verification code is emailed to your address.
            </div>
          </Panel>
        </form>
      </div>
    </div>
  );
}
