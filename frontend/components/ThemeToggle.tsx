"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="flex items-center gap-1 p-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-colors duration-200 cursor-pointer ${
          currentTheme === "light"
            ? "bg-[var(--color-accent)] text-black font-semibold"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        }`}
        title="Light Mode"
        aria-label="Switch to Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-colors duration-200 cursor-pointer ${
          currentTheme === "dark"
            ? "bg-[var(--color-accent)] text-black font-semibold"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        }`}
        title="Dark Mode"
        aria-label="Switch to Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}