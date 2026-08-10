"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest, forgotPasswordRequest, resetPasswordRequest } from "@/lib/api";
import { setToken } from "@/lib/auth";

type Mode = "login" | "forgot" | "reset";

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const inputCls =
    "w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await loginRequest(username.trim(), password.trim());
      if (!data.access_token) throw new Error("No access token received from server");
      setToken(data.access_token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend server");
    } finally { setLoading(false); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setInfo("");
    try {
      await forgotPasswordRequest(username.trim() || undefined);
      setInfo("A verification code was emailed to the site owner. Enter it below with your new password.");
      setMode("reset");
    } catch (err: any) {
      setError(err.message || "Could not send the reset code.");
    } finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setInfo("");
    try {
      await resetPasswordRequest(code.trim(), newPassword);
      setInfo("Password reset ✓ You can now log in with your new password.");
      setPassword(""); setCode(""); setNewPassword("");
      setMode("login");
    } catch (err: any) {
      setError(err.message || "Reset failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-white font-sans">
      <div className="w-full max-w-md p-8 bg-[#121212] border border-emerald-500/20 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold text-emerald-400 mb-6 text-center tracking-wide">
          {mode === "login" ? "Admin Login" : mode === "forgot" ? "Reset Password" : "Enter Reset Code"}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs font-mono break-words">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-400 text-xs font-mono break-words">
            {info}
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. admin" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg transition duration-200 disabled:opacity-50 text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {loading ? "Signing in..." : "Login"}
            </button>
            <button type="button" onClick={() => { setMode("forgot"); setError(""); setInfo(""); }} className="w-full text-xs text-gray-400 hover:text-emerald-400 transition">
              Forgot password?
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-xs text-gray-400">A 6-digit verification code will be emailed to the site owner’s address.</p>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className={inputCls} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg transition duration-200 disabled:opacity-50 text-sm">
              {loading ? "Sending..." : "Send Code"}
            </button>
            <button type="button" onClick={() => { setMode("login"); setError(""); setInfo(""); }} className="w-full text-xs text-gray-400 hover:text-emerald-400 transition">
              Back to login
            </button>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Verification Code</label>
              <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg transition duration-200 disabled:opacity-50 text-sm">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button type="button" onClick={() => { setMode("login"); setError(""); setInfo(""); }} className="w-full text-xs text-gray-400 hover:text-emerald-400 transition">
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
