"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/** Shared admin design primitives — keeps every module visually consistent
 *  with the MRP-OS aesthetic (accent #00FFC2, dark panels, mono labels). */

export const ACCENT = "#00FFC2";

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold font-space-grotesk text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1 font-inter">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#080a10]/90 border border-white/10 rounded-2xl p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00FFC2] text-black text-sm font-semibold font-space-grotesk hover:shadow-[0_0_20px_rgba(0,255,194,0.35)] transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:border-[#00FFC2]/50 hover:text-[#00FFC2] transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-[#111111] border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition placeholder:text-gray-600 font-inter";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} resize-none ${props.className || ""}`}
    />
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${
              wide ? "max-w-3xl" : "max-w-lg"
            } max-h-[88vh] overflow-y-auto custom-scrollbar bg-[#0b0d13] border border-white/10 rounded-2xl p-6 shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold font-space-grotesk text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-16 text-gray-500 font-mono text-sm border border-dashed border-white/10 rounded-2xl">
      {label}
    </div>
  );
}

export function StatusToast({
  status,
}: {
  status: { type: "success" | "error"; message: string } | null;
}) {
  if (!status) return null;
  return (
    <div
      className={`p-3.5 rounded-xl text-xs font-mono ${
        status.type === "success"
          ? "bg-[#00FFC2]/10 text-[#00FFC2] border border-[#00FFC2]/30"
          : "bg-red-500/10 text-red-400 border border-red-500/30"
      }`}
    >
      {status.message}
    </div>
  );
}
