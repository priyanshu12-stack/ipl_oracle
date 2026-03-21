"use client";

import { motion } from "framer-motion";

const headlineLines = [
  { text: "WHO RUNS", color: "text-white" },
  { text: "THE IPL", color: "text-[var(--team-color)]" },
  { text: "UNIVERSE?", color: "text-white" },
];

export default function LandingPage() {
  return (
    <main className="dot-grid relative flex min-h-screen w-full items-center justify-center bg-[#0D0F1A] px-6 py-10 text-center">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          className="mb-8 rounded-full border border-white/10 px-4 py-1.5 text-xs text-white/50"
        >
          🏏 The Oracle is live • IPL 2008–2026
        </motion.div>

        <div className="leading-[0.9] tracking-wide">
          {headlineLines.map((line, index) => (
            <motion.h1
              key={line.text}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.15 }}
              className={`${line.color}`}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(64px, 10vw, 120px)",
              }}
            >
              {line.text}
            </motion.h1>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 max-w-[480px] text-[18px] text-[rgba(255,255,255,0.55)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Every six, every wicket, every controversy - the Oracle remembers.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.8 },
          y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] text-[rgba(255,255,255,0.3)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        ↓ Select your team
      </motion.div>
    </main>
  );
}