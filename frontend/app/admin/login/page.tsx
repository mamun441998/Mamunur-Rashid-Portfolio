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

    // Local-e standard FASTAPI port 8000 target korbe
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await res.json();
      localStorage.setItem("admin_token", data.access_token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md p-8 bg-[#121212] border border-emerald-500/20 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold text-emerald-400 mb-6 text-center">Admin Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}