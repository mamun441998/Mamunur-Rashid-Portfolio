"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

type ConfirmFn = (opts?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn>(async () => false);

/** Promise-based confirm dialog, rendered centered on screen. */
export function useConfirm(): ConfirmFn {
  return useContext(ConfirmContext);
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<{ fn: (v: boolean) => void }>({ fn: () => {} });

  const confirm = useCallback<ConfirmFn>((o = {}) => {
    setOpts(o);
    setOpen(true);
    return new Promise<boolean>((resolve) => setResolver({ fn: resolve }));
  }, []);

  const close = (value: boolean) => {
    setOpen(false);
    resolver.fn(value);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => close(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ type: "spring", damping: 24, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0b0d13] border border-white/10 rounded-2xl p-6 shadow-2xl text-center"
            >
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold font-space-grotesk text-white">
                {opts.title || "Are you sure?"}
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                {opts.message || "This action cannot be undone."}
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => close(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition"
                >
                  {opts.cancelLabel || "Cancel"}
                </button>
                <button
                  onClick={() => close(true)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                    opts.danger === false
                      ? "bg-[#00FFC2] text-black hover:shadow-[0_0_20px_rgba(0,255,194,0.35)]"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {opts.confirmLabel || "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
