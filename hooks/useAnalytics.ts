"use client";

import { useEffect, useState } from "react";

type Stats = {
  questionsAsked: number;
  quizCorrect: number;
  quizTotal: number;
  sessionStart: number;
};

const DEFAULT: Stats = {
  questionsAsked: 0,
  quizCorrect: 0,
  quizTotal: 0,
  sessionStart: Date.now(),
};

const STORAGE_KEY = "ipl_oracle_stats";

function readStats(): Stats {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stats) : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function writeStats(stats: Stats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function useAnalytics() {
  const [stats, setStats] = useState<Stats>(DEFAULT);

  useEffect(() => {
    const stored = readStats();
    if (!localStorage.getItem(STORAGE_KEY)) {
      writeStats(DEFAULT);
      setStats(DEFAULT);
    } else {
      setStats(stored);
    }
  }, []);

  function trackQuestion() {
    const current = readStats();
    const updated = {
      ...current,
      questionsAsked: current.questionsAsked + 1,
    };
    writeStats(updated);
    setStats(updated);
  }

  function trackQuizAnswer(correct: boolean) {
    const current = readStats();
    const updated = {
      ...current,
      quizTotal: current.quizTotal + 1,
      quizCorrect: correct
        ? current.quizCorrect + 1
        : current.quizCorrect,
    };
    writeStats(updated);
    setStats(updated);
  }

  function getStats() {
    const current = readStats();
    return {
      ...current,
      quizAccuracy:
        current.quizTotal === 0
          ? null
          : Math.round((current.quizCorrect / current.quizTotal) * 100),
      sessionMinutes: Math.floor(
        (Date.now() - current.sessionStart) / 60000
      ),
    };
  }

  return { trackQuestion, trackQuizAnswer, getStats, stats };
}