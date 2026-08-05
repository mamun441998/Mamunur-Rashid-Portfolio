"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Trim whitespace to prevent typo errors
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // Ensure URL has no trailing slash
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const BACKEND_URL = rawUrl.replace(/\/$/, "");

    try {
      // 1. Try URL-encoded Form Data (Standard OAuth2 in FastAPI)
      const formData = new URLSearchParams();
      formData.append("username", cleanUsername);
      formData.append("password", cleanPassword);

      let res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      // 2. Fallback: If 422 or 400 (JSON payload expected), try sending JSON
      if (res.status === 422 || res.status === 400) {
        res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: cleanUsername,
            password: cleanPassword,
          }),
        });
      }

      // 3. Fallback: Try secondary route (/api/login) if 404
      if (res.status === 404) {
        res = await fetch(`${BACKEND_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail || data.message || "Invalid username or password"
        );
      }

      // Handle token storage safely
      const token = data.access_token || data.token;
      if (!token) {
        throw new Error("No access token received from server");
      }

      localStorage.setItem("admin_token", token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-white font-sans">
      <div className="w-full max-w-md p-8 bg-[#121212] border border-emerald-500/20 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold text-emerald-400 mb-6 text-center tracking-wide">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs font-mono break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg transition duration-200 disabled:opacity-50 text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}