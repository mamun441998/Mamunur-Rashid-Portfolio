"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Home,
  User,
  Wrench,
  Layers,
  FolderKanban,
  Briefcase,
  Mail,
  FileText,
  ShieldCheck,
  CornerDownLeft,
} from "lucide-react";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: any;
  run: () => void;
}

/** ⌘K / Ctrl+K command palette to jump around the site. Additive overlay —
 *  does not alter any existing section. Hidden inside the admin area. */
export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = (hash: string) => {
    setOpen(false);
    if (pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${hash}`);
    }
  };

  const commands: Command[] = useMemo(
    () => [
      { id: "home", label: "Home", hint: "Hero", icon: Home, run: () => go("home") },
      { id: "about", label: "About", hint: "Who I am", icon: User, run: () => go("about") },
      { id: "skills", label: "Skills", hint: "Tech stack", icon: Wrench, run: () => go("skills") },
      { id: "services", label: "Services", hint: "What I build", icon: Layers, run: () => go("services") },
      { id: "projects", label: "Projects", hint: "Featured work", icon: FolderKanban, run: () => go("projects") },
      { id: "experience", label: "Experience", hint: "Career timeline", icon: Briefcase, run: () => go("experience") },
      { id: "contact", label: "Contact", hint: "Get in touch", icon: Mail, run: () => go("contact") },
      { id: "resume", label: "Resume", hint: "View / download", icon: FileText, run: () => { setOpen(false); router.push("/resume"); } },
      { id: "admin", label: "Admin", hint: "Control center", icon: ShieldCheck, run: () => { setOpen(false); router.push("/admin"); } },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Never render inside the admin overlay.
  if (pathname?.startsWith("/admin")) return null;

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh] px-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: -8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -8 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onListKey}
            className="w-full max-w-xl rounded-2xl border border-[var(--color-border,rgba(255,255,255,0.1))] bg-[#0b0d13] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
              <Search className="w-4 h-4 text-[#00ffc2]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none font-inter"
              />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto py-2 custom-scrollbar">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs font-mono text-gray-500">No matches.</p>
              ) : (
                filtered.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onMouseEnter={() => setActive(i)}
                      onClick={c.run}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${
                        i === active ? "bg-[#00ffc2]/10" : "hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${i === active ? "text-[#00ffc2]" : "text-gray-400"}`} />
                      <span className="text-sm text-white flex-1">{c.label}</span>
                      <span className="text-[11px] font-mono text-gray-500">{c.hint}</span>
                      {i === active && <CornerDownLeft className="w-3.5 h-3.5 text-[#00ffc2]" />}
                    </button>
                  );
                })
              )}
            </div>
            <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>MRP-OS Quick Nav</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">⌘</kbd><kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">K</kbd></span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
