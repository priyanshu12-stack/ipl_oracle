"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import TeamSelector from "@/components/TeamSelector";

const headlineLines = [
  { text: "WHO RUNS", color: "text-white" },
  { text: "THE IPL", color: "text-[var(--team-color)]" },
  { text: "UNIVERSE?", color: "text-white" },
];

const TEAM_COLORS: Record<string, string> = {
  csk: "#FFFF00",
  mi: "#004BA0",
  rcb: "#EC1C24",
  kkr: "#3A225D",
  srh: "#FF822A",
  rr: "#EA1A85",
  pbks: "#DCDFDE",
  dc: "#0078BC",
  gt: "#1C2C5B",
  lsg: "#00AEEF",
};

export default function LandingPage() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const selectedColor = selectedTeam ? TEAM_COLORS[selectedTeam] : "#FFFF00";

  const handleEnterOracle = () => {
    if (!selectedTeam) return;
    localStorage.setItem("ipl_selectedTeam", selectedTeam);
    localStorage.setItem("ipl_primaryColor", selectedColor);
    router.push("/chat");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="dot-grid min-h-screen w-full bg-[#0D0F1A]"
      style={{ "--team-color": selectedColor } as React.CSSProperties}
    >
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center text-center">
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-6">
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
                    fontSize: "clamp(48px, 12vw, 96px)",
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
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[14px] text-white/55"
            style={{ fontFamily: "var(--font-body)" }}
          >
            ↓ Select your team
          </motion.div>
        </section>

        <section className="flex w-full flex-col items-center px-6 pb-8 pt-14">
          <p
            className="mb-6 text-center text-[28px] font-bold tracking-[0.14em] text-gray-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CHOOSE YOUR TEAM
          </p>

          <div className="w-full max-w-[980px] px-6">
            <TeamSelector
              selectedTeam={selectedTeam}
              onSelect={(teamId) => setSelectedTeam(teamId)}
            />
          </div>

          {/* MOBILE FIX: full width on mobile, fixed 280px on desktop */}
          <motion.button
            type="button"
            onClick={handleEnterOracle}
            disabled={!selectedTeam}
            className="mt-8 h-[52px] w-full rounded-full sm:w-[280px]"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            animate={
              selectedTeam
                ? {
                    boxShadow: [
                      "0 0 0 0 rgba(255, 255, 255, 0.35)",
                      "0 0 0 8px rgba(255, 255, 255, 0)",
                    ],
                  }
                : { boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
            }
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              letterSpacing: "2px",
              backgroundColor: selectedTeam ? "var(--team-color)" : "#1E2140",
              color: selectedTeam ? "#0D0F1A" : "rgba(255,255,255,0.3)",
              cursor: selectedTeam ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
            }}
          >
            Enter the Oracle →
          </motion.button>
        </section>

        <p className="py-6 text-center text-xs text-white/35">
          Built with Gemini API · Next.js · Deployed on Vercel
        </p>
      </main>
    </motion.div>
  );
}