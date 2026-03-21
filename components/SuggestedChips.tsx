"use client";

import { motion } from "framer-motion";

type SuggestedChipsProps = {
  onSelect: (question: string) => void;
};

const QUESTIONS = [
  "Who has the most IPL runs all time? 🏏",
  "What are the best last-over finishes ever? ⚡",
  "List every IPL champion from 2008 to 2024 🏆",
  "Who are the top 5 wicket-takers in IPL history? 🎯",
  "Best batting partnerships in IPL finals? 🤝",
  "Most expensive IPL auction buys ever? 💰",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function SuggestedChips({ onSelect }: SuggestedChipsProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[28px]">
        🏏
      </div>

      <h2
        className="mt-4 text-[28px] text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        The Oracle is ready.
      </h2>

      <p
        className="mb-6 text-[13px] text-[var(--text-secondary)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Ask anything about IPL cricket, or start here:
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-wrap justify-center gap-3"
      >
        {QUESTIONS.map((question) => (
          <motion.button
            key={question}
            type="button"
            variants={chipVariants}
            onClick={() => onSelect(question)}
            className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-[18px] py-[10px] text-[13px] text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--team-color)] hover:text-[var(--team-color)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {question}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
