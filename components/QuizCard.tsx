"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingBall from "@/components/LoadingBall";

type Quiz = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type QuizCardProps = {
  quiz: Quiz | null;
  onNext: () => void;
  onAnswer: (correct: boolean) => void;
  score: { correct: number; total: number };
  isLoading: boolean;
};

export default function QuizCard({ quiz, onNext, onAnswer, score, isLoading }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(index: number) {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
    onAnswer(index === quiz?.correct);
  }

  function handleNext() {
    setSelected(null);
    setRevealed(false);
    onNext();
  }

  const streakDots = Array.from({ length: Math.min(score.total, 5) });

  return (
    <div className="mx-auto w-full px-4 py-6 sm:px-6" style={{ maxWidth: "640px" }}>

      {/* SCORE BAR */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div
          className="flex items-center gap-3 px-4 py-2"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "999px",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--text-primary)",
          }}
        >
          <span>
            <span style={{ color: "var(--team-color)", fontWeight: 600 }}>{score.correct}</span>
            {" / "}{score.total} correct
          </span>
          {score.total > 0 && (
            <div className="flex gap-1">
              {streakDots.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    backgroundColor: i < score.correct ? "#22c55e" : "#ef4444",
                    display: "inline-block",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading || !quiz ? (
        <div className="flex justify-center py-12"><LoadingBall /></div>
      ) : (
        <>
          {/* QUESTION CARD */}
          <div
            className="mb-6"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <p className="mb-3" style={{ fontFamily: "var(--font-display)", fontSize: "12px", color: "var(--team-color)", letterSpacing: "2px" }}>
              QUESTION {score.total + 1}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "18px", fontWeight: 500, lineHeight: 1.6, color: "white" }}>
              {quiz.question}
            </p>
          </div>

          {/* OPTIONS GRID — MOBILE FIX: 1 col on mobile, 2 col on desktop */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quiz.options.map((option, index) => {
              const isSelected = selected === index;
              const isCorrect = index === quiz.correct;
              let bg = "var(--bg-card)";
              let border = "1px solid var(--border-subtle)";
              let textColor = "var(--text-primary)";
              let opacity = 1;
              let pointerEvents: "auto" | "none" = "auto";
              let showIcon: "correct" | "wrong" | null = null;
              if (revealed) {
                pointerEvents = "none";
                if (isCorrect) { bg = "#15432A"; border = "1px solid #22c55e"; textColor = "#22c55e"; showIcon = "correct"; }
                else if (isSelected) { bg = "#431515"; border = "1px solid #ef4444"; textColor = "#ef4444"; showIcon = "wrong"; }
                else { opacity = 0.4; }
              }
              return (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(index)}
                  animate={revealed && isCorrect ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative text-left"
                  style={{
                    background: bg, border, borderRadius: "12px", padding: "16px",
                    minHeight: "60px",
                    color: textColor, fontFamily: "var(--font-body)", fontSize: "14px",
                    cursor: revealed ? "default" : "pointer", opacity, pointerEvents,
                    transition: "all 0.2s ease", textAlign: "center",
                  }}
                  onMouseEnter={(e) => { if (revealed) return; e.currentTarget.style.borderColor = "var(--team-color)"; e.currentTarget.style.filter = "brightness(1.15)"; }}
                  onMouseLeave={(e) => { if (revealed) return; e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.filter = "brightness(1)"; }}
                >
                  {showIcon && <span className="absolute right-3 top-3 text-[13px]">{showIcon === "correct" ? "✓" : "✗"}</span>}
                  {option}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="mt-4"
                style={{ background: "var(--bg-card)", borderLeft: "3px solid var(--team-color)", borderRadius: "0 8px 8px 0", padding: "14px 16px" }}
              >
                <p className="mb-1" style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--team-color)" }}>Oracle says:</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{quiz.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {revealed && (
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                type="button" onClick={handleNext} className="mt-4 w-full"
                style={{
                  height: "48px", background: "var(--team-color)", color: "#0D0F1A",
                  fontFamily: "var(--font-display)", fontSize: "18px", letterSpacing: "2px",
                  borderRadius: "999px", border: "none", cursor: "pointer", transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "scale(1.01)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                NEXT QUESTION →
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}