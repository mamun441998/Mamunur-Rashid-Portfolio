"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, DollarSign, Rocket, Calculator, ArrowRight, Sparkles } from "lucide-react";

const WEEKS_PER_MONTH = 4.33;

// Automatable share of the manual work → the realistic slice software removes.
const LEVELS = [
  { key: "some", label: "Some of it", factor: 0.4 },
  { key: "a-lot", label: "A lot of it", factor: 0.65 },
  { key: "most", label: "Most of it", factor: 0.85 },
] as const;

function useCountUp(target: number, duration = 550) {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(from + (target - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return val;
}

const money = (n: number) =>
  "$" + Math.round(n).toLocaleString("en-US");
const int = (n: number) => Math.round(n).toLocaleString("en-US");

function Slider({ label, value, min, max, step = 1, onChange, suffix }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--color-text-secondary)] font-inter">{label}</span>
        <span className="text-sm font-bold text-[var(--color-accent)] font-mono tabular-nums">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mrp-range w-full"
        style={{ background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-border) ${pct}%)` }}
      />
    </div>
  );
}

function Stat({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${highlight
      ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/40"
      : "bg-[var(--color-surface)] border-[var(--color-border)]"}`}>
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
        <span className="text-[var(--color-accent)]">{icon}</span>{label}
      </div>
      <div className={`font-bold font-space-grotesk tabular-nums ${highlight ? "text-2xl md:text-3xl text-[var(--color-accent)]" : "text-xl md:text-2xl text-[var(--color-text-primary)]"}`}>
        {value}
      </div>
    </div>
  );
}

export default function ValueCalculator() {
  const [people, setPeople] = useState(4);
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(20);
  const [level, setLevel] = useState<typeof LEVELS[number]["key"]>("a-lot");

  const factor = LEVELS.find((l) => l.key === level)!.factor;
  const monthlyManualHours = people * hours * WEEKS_PER_MONTH;
  const hoursSaved = monthlyManualHours * factor;
  const monthlySavings = hoursSaved * rate;
  const annualSavings = monthlySavings * 12;
  // Transparent build-investment heuristic (mid-point ~5 months of savings, bounded).
  const buildMid = Math.min(30000, Math.max(1800, monthlySavings * 5));
  const buildLow = buildMid * 0.8;
  const buildHigh = buildMid * 1.2;
  const paybackMonths = monthlySavings > 0 ? buildMid / monthlySavings : 0;
  const roi = buildMid > 0 ? ((annualSavings - buildMid) / buildMid) * 100 : 0;

  const aHours = useCountUp(hoursSaved);
  const aMonthly = useCountUp(monthlySavings);
  const aAnnual = useCountUp(annualSavings);
  const aRoi = useCountUp(roi);
  const aPayback = useCountUp(paybackMonths);

  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="value"
      data-theme="dark"
      className="relative w-full py-24 px-6 sm:px-10 lg:px-16 bg-[var(--color-background)] text-[var(--color-text-primary)] overflow-hidden select-none"
    >
      <div className="absolute top-1/3 -right-20 w-[420px] h-[420px] bg-[var(--color-accent)]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-mono mb-4"
          >
            <Calculator className="w-3.5 h-3.5" /> VALUE_ESTIMATOR.EXE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-space-grotesk"
          >
            What Could Custom Software <span className="text-[var(--color-accent)] text-glow">Save You?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[var(--color-text-secondary)] mt-3 max-w-2xl mx-auto text-sm md:text-base font-inter"
          >
            Manual, repetitive work quietly drains your team every month. Move the sliders to see the time and money the right system could reclaim for your business.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 space-y-7"
          >
            <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent)] font-semibold">Your situation</h3>
            <Slider label="People doing repetitive manual work" value={people} min={1} max={50} onChange={setPeople} />
            <Slider label="Hours per week each spends on it" value={hours} min={1} max={40} onChange={setHours} suffix=" hrs" />
            <Slider label="Average hourly cost (USD)" value={rate} min={5} max={100} onChange={setRate} suffix="/hr" />
            <div>
              <span className="block text-sm text-[var(--color-text-secondary)] font-inter mb-2">How automatable is this work?</span>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.key} type="button" onClick={() => setLevel(l.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      level === l.key
                        ? "bg-[var(--color-accent)] text-black border-[var(--color-accent)]"
                        : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] font-mono leading-relaxed pt-1">
              Ballpark estimate for planning only — every real project gets a precise, tailored quote.
            </p>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-background)] border border-[var(--color-border)] p-6 sm:p-8 flex flex-col"
          >
            <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent)] font-semibold mb-5">Your potential return</h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <Stat icon={<Clock className="w-3.5 h-3.5" />} label="Hours reclaimed / mo" value={`${int(aHours)} hrs`} />
              <Stat icon={<DollarSign className="w-3.5 h-3.5" />} label="Saved / month" value={money(aMonthly)} />
            </div>

            <div className="mb-3">
              <Stat icon={<TrendingUp className="w-4 h-4" />} label="Saved per year" value={money(aAnnual)} highlight />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <Stat icon={<Rocket className="w-3.5 h-3.5" />} label="Est. investment" value={`${money(buildLow)}–${money(buildHigh)}`} />
              <Stat icon={<Sparkles className="w-3.5 h-3.5" />} label="Pays for itself in" value={`${aPayback < 0.5 ? "<1" : Math.round(aPayback)} mo`} />
            </div>

            <div className="rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 p-5 text-center mb-6">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Estimated first-year ROI</div>
              <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-accent)] font-space-grotesk tabular-nums">
                {roi >= 0 ? "+" : ""}{int(aRoi)}%
              </div>
            </div>

            <button
              onClick={scrollToContact}
              className="mt-auto group inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[var(--color-accent)] text-black font-semibold font-space-grotesk text-sm transition-transform hover:scale-[1.02]"
            >
              Get my tailored proposal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
