"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin/dashboard");
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-emerald-400 flex items-center justify-center">
      <p className="animate-pulse">Loading Admin Panel...</p>
    </div>
  );
}