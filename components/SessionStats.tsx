"use client";

import { useEffect, useRef, useState } from "react";
import { BarChart2 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function SessionStats() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { getStats } = useAnalytics();
  const stats = getStats();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="View session stats"
        className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 hover:bg-white/10"
      >
        <BarChart2 size={18} color="var(--text-secondary)" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 z-50"
          style={{
            width: "220px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "12px",
            padding: "16px",
            transformOrigin: "top right",
            animation: "statsIn 0.15s ease forwards",
          }}
        >
          <p
            className="mb-3 uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--text-secondary)",
            }}
          >
            This Session
          </p>

          {[
            {
              icon: "💬",
              label: "Balls bowled at the Oracle",
              value: stats.questionsAsked === 0 ? "—" : String(stats.questionsAsked),
            },
            {
              icon: "🎯",
              label: "Quiz accuracy",
              value: stats.quizAccuracy === null ? "—" : `${stats.quizAccuracy}%`,
            },
            {
              icon: "⏱️",
              label: "Time spent",
              value: `${stats.sessionMinutes} min`,
            },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2"
              style={{
                borderBottom:
                  i < arr.length - 1 ? "1px solid var(--border-subtle)" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {row.icon} {row.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  color: "var(--team-color)",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes statsIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}