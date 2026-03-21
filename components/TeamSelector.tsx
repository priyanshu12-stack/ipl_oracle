"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type TeamSelectorProps = {
  onSelect: (teamId: string) => void;
  selectedTeam: string | null;
};

const TEAMS = [
  {
    id: "csk",
    name: "Chennai Super Kings",
    short: "CSK",
    primary: "#FFFF00",
    secondary: "#0081E9",
    emoji: "🦁",
  },
  {
    id: "mi",
    name: "Mumbai Indians",
    short: "MI",
    primary: "#004BA0",
    secondary: "#D1AB3E",
    emoji: "🌊",
  },
  {
    id: "rcb",
    name: "Royal Challengers",
    short: "RCB",
    primary: "#EC1C24",
    secondary: "#000000",
    emoji: "🔥",
  },
  {
    id: "kkr",
    name: "Kolkata Knight Riders",
    short: "KKR",
    primary: "#3A225D",
    secondary: "#B3A123",
    emoji: "⚔️",
  },
  {
    id: "srh",
    name: "Sunrisers Hyderabad",
    short: "SRH",
    primary: "#FF822A",
    secondary: "#000000",
    emoji: "☀️",
  },
  {
    id: "rr",
    name: "Rajasthan Royals",
    short: "RR",
    primary: "#EA1A85",
    secondary: "#254AA5",
    emoji: "👑",
  },
  {
    id: "pbks",
    name: "Punjab Kings",
    short: "PBKS",
    primary: "#DCDFDE",
    secondary: "#AA4545",
    emoji: "🦅",
  },
  {
    id: "dc",
    name: "Delhi Capitals",
    short: "DC",
    primary: "#0078BC",
    secondary: "#EF1C25",
    emoji: "⚡",
  },
  {
    id: "gt",
    name: "Gujarat Titans",
    short: "GT",
    primary: "#1C2C5B",
    secondary: "#A28A5E",
    emoji: "🛡️",
  },
  {
    id: "lsg",
    name: "Lucknow Super Giants",
    short: "LSG",
    primary: "#00AEEF",
    secondary: "#F58220",
    emoji: "💙",
  },
] as const;

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = Number.parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getLogoCandidates(team: (typeof TEAMS)[number]) {
  const explicitLogos: Record<string, string[]> = {
    csk: ["/csk.jpg"],
    mi: ["/mi.jpg"],
    rcb: ["/rcb.jpg"],
    kkr: ["/kkr.jpg"],
    srh: ["/srh.jpg"],
    rr: ["/rr.jpg"],
    pbks: ["/pk.jpg"],
    dc: ["/dc.jpg"],
    gt: ["/Gt.jpg"],
    lsg: ["/LSg.jpg"],
  };
  if (explicitLogos[team.id]) return explicitLogos[team.id];

  const slug = team.name.toLowerCase().replace(/\s+/g, "-");
  const short = team.short.toLowerCase();
  const id = team.id.toLowerCase();

  return [
    `/${id}.png`,
    `/${id}.jpg`,
    `/${short}.png`,
    `/${short}.jpg`,
    `/${slug}.png`,
    `/${slug}.jpg`,
    `/team-${id}.png`,
    `/team-${id}.jpg`,
    `/team-${slug}.png`,
    `/team-${slug}.jpg`,
  ];
}

export default function TeamSelector({
  onSelect,
  selectedTeam,
}: TeamSelectorProps) {
  const hasSelection = selectedTeam !== null;
  const [logoStepByTeam, setLogoStepByTeam] = useState<Record<string, number>>(
    {},
  );
  const logoCandidatesByTeam = useMemo(
    () =>
      Object.fromEntries(TEAMS.map((team) => [team.id, getLogoCandidates(team)])),
    [],
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
    >
      {TEAMS.map((team) => {
        const isSelected = selectedTeam === team.id;
        const isDimmed = hasSelection && !isSelected;
        const logoStep = logoStepByTeam[team.id] ?? 0;
        const logoCandidates = logoCandidatesByTeam[team.id];
        const logoSrc = logoCandidates?.[logoStep] ?? null;

        return (
          <motion.button
            key={team.id}
            type="button"
            variants={cardVariants}
            whileHover={
              isSelected
                ? undefined
                : {
                    scale: 1.03,
                    backgroundColor: hexToRgba(team.primary, 0.25),
                    borderColor: hexToRgba(team.primary, 0.6),
                  }
            }
            onClick={() => onSelect(team.id)}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative flex h-[140px] w-full min-w-0 flex-col items-center justify-center rounded-[12px] text-center"
            style={{
              backgroundColor: isSelected
                ? hexToRgba(team.primary, 0.3)
                : hexToRgba(team.primary, 0.15),
              borderColor: isSelected
                ? team.primary
                : hexToRgba(team.primary, 0.3),
              borderWidth: isSelected ? "2px" : "1px",
              borderStyle: "solid",
              opacity: isDimmed ? 0.45 : 1,
              transform: isSelected ? "scale(1.05)" : "scale(1)",
            }}
          >
            {isSelected ? (
              <span
                className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-semibold text-black"
                style={{ backgroundColor: team.primary }}
              >
                ✓
              </span>
            ) : null}

            {logoSrc ? (
              <span className="mb-1 overflow-hidden rounded-full border border-white/20">
                <img
                  src={logoSrc}
                  alt={`${team.name} logo`}
                  className="h-[34px] w-[34px] object-cover"
                  onError={() =>
                    setLogoStepByTeam((prev) => ({
                      ...prev,
                      [team.id]: logoStep + 1,
                    }))
                  }
                />
              </span>
            ) : (
              <span className="mb-1 text-[32px] leading-none">{team.emoji}</span>
            )}
            <span
              className="text-[28px] leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {team.short}
            </span>
            <span
              className="mt-1 text-[11px] text-white/55"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {team.name}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
