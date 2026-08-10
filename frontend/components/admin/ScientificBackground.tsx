"use client";

/** Ambient animated "engineering telemetry" backdrop for the dashboard.
 *  Pure CSS transforms (GPU-friendly) — no canvas loop — so it stays smooth
 *  on mobile. Sits behind content, non-interactive, low opacity. */
export default function ScientificBackground() {
  const dots = Array.from({ length: 10 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <style>{`
        @keyframes mrp-grid-drift { from { background-position: 0 0, 0 0; } to { background-position: 40px 40px, 40px 40px; } }
        @keyframes mrp-float {
          0%   { transform: translateY(0) translateX(0); opacity: .18; }
          50%  { transform: translateY(-24px) translateX(10px); opacity: .5; }
          100% { transform: translateY(0) translateX(0); opacity: .18; }
        }
        @keyframes mrp-beam {
          0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
          40%  { opacity: .5; }
          100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
        }
        @keyframes mrp-scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: .35; }
          100% { transform: translateY(2000%); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mrp-anim { animation: none !important; }
        }
      `}</style>

      {/* drifting grid */}
      <div
        className="mrp-anim absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,194,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,194,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px, 40px 40px",
          animation: "mrp-grid-drift 6s linear infinite",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 85%)",
        }}
      />

      {/* floating nodes */}
      {dots.map((_, i) => (
        <span
          key={i}
          className="mrp-anim absolute rounded-full bg-[#00FFC2]"
          style={{
            width: 3,
            height: 3,
            left: `${(i * 97) % 100}%`,
            top: `${(i * 53) % 100}%`,
            boxShadow: "0 0 8px #00FFC2",
            animation: `mrp-float ${6 + (i % 5)}s ease-in-out ${i * 0.6}s infinite`,
          }}
        />
      ))}

      {/* diagonal data beams */}
      {[0, 1, 2].map((i) => (
        <span
          key={`b${i}`}
          className="mrp-anim absolute top-0 h-full"
          style={{
            left: `${20 + i * 28}%`,
            width: 140,
            background:
              "linear-gradient(90deg, transparent, rgba(0,255,194,0.10), transparent)",
            animation: `mrp-beam ${9 + i * 3}s linear ${i * 2.5}s infinite`,
          }}
        />
      ))}

      {/* horizontal scan sweep */}
      <span
        className="mrp-anim absolute left-0 w-full"
        style={{
          height: 2,
          top: 0,
          background: "linear-gradient(90deg, transparent, rgba(0,255,194,0.5), transparent)",
          animation: "mrp-scan 8s linear infinite",
        }}
      />
    </div>
  );
}
