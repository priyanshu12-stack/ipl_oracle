"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ChatWindow, { type Message } from "@/components/ChatWindow";
import SessionStats from "@/components/SessionStats";
import QuizCard from "@/components/QuizCard";
import PlayerComparison from "@/components/PlayerComparison";
import { useAnalytics } from "@/hooks/useAnalytics";

type Mode = "chat" | "quiz" | "compare";

type Quiz = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type PlayerStats = {
  name: string;
  runs: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  wickets?: number;
  economy?: number;
};

type CompareResult = {
  player1: PlayerStats;
  player2: PlayerStats;
  verdict: string;
};

export default function ChatPage() {
  const router = useRouter();
  const { trackQuestion, trackQuizAnswer } = useAnalytics();

  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<Mode>("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  const fetchQuiz = useCallback(async () => {
    setQuizLoading(true);
    setQuiz(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty: "medium" }),
      });
      if (!res.ok) throw new Error("Quiz fetch failed");
      const data = await res.json();
      setQuiz(data);
    } catch (err) {
      console.error("Quiz error:", err);
    } finally {
      setQuizLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === "quiz" && !quiz && !quizLoading) {
      void fetchQuiz();
    }
  }, [mode, quiz, quizLoading, fetchQuiz]);

  function handleQuizAnswer(correct: boolean) {
    trackQuizAnswer(correct);
    setQuizScore((prev) => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
  }

  function handleQuizNext() {
    void fetchQuiz();
  }

  const handleCompare = async (player1: string, player2: string) => {
    setCompareLoading(true);
    setCompareResult(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Compare ${player1} vs ${player2} in IPL cricket. Return ONLY valid JSON, no markdown, no explanation. Use this exact format with real stats: { "player1": { "name": "${player1}", "runs": 0, "average": 0.0, "strikeRate": 0.0, "fifties": 0, "hundreds": 0, "wickets": 0, "economy": 0.0 }, "player2": { "name": "${player2}", "runs": 0, "average": 0.0, "strikeRate": 0.0, "fifties": 0, "hundreds": 0, "wickets": 0, "economy": 0.0 }, "verdict": "Oracle says: ..." }. Fill in the actual IPL career statistics for both players. If a player has no wickets, set wickets to 0. If no economy, set economy to 0.`,
          history: [],
          mode: "compare",
        }),
      });
      if (!response.ok || !response.body) throw new Error("Compare failed");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }
      const cleaned = fullText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      const parsed: CompareResult = JSON.parse(jsonMatch[0]);
      setCompareResult(parsed);
    } catch (err) {
      console.error("Compare error:", err);
    } finally {
      setCompareLoading(false);
    }
  };

  const handleSend = async (question?: string) => {
    if (isLoading) return;
    const content = (question ?? inputValue).trim();
    if (!content) return;
    trackQuestion();
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const assistantMessageId = crypto.randomUUID();
    const conversationHistory = messages.map((m) => ({ role: m.role, content: m.content }));
    setError(null);
    setIsLoading(true);
    setIsStreaming(false);
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputValue("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: conversationHistory }),
      });
      if (!response.ok || !response.body) {
        const apiError = await response.text();
        throw new Error(apiError || "Oracle signal lost. Rain delay in effect.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let hasReceivedFirstChunk = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!hasReceivedFirstChunk) { hasReceivedFirstChunk = true; setIsStreaming(true); }
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        setMessages((prev) =>
          prev.map((m) => m.id === assistantMessageId ? { ...m, content: `${m.content}${chunk}` } : m)
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Oracle signal lost. Rain delay in effect.";
      setError(errorMessage);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
    } finally {
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  const handleRetry = () => { setError(null); setIsLoading(false); setIsStreaming(false); };

  useEffect(() => {
    const teamColor = localStorage.getItem("ipl_primaryColor") || "#F5C842";
    document.documentElement.style.setProperty("--team-color", teamColor);
  }, []);

  const tabs = useMemo(
    () => [
      { id: "chat", label: "🏏 Chat", emoji: "🏏" },
      { id: "quiz", label: "🎯 Quiz", emoji: "🎯" },
      { id: "compare", label: "⚖️ Compare", emoji: "⚖️" },
    ] as const,
    []
  );

  return (
    <div className="dot-grid flex h-screen flex-col overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="fixed top-0 z-20 flex h-14 w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 px-4 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <span className="text-[20px]">🏏</span>
          {/* MOBILE FIX: smaller font on mobile */}
          <span
            className="text-[18px] leading-none sm:text-[22px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            IPL ORACLE
          </span>
        </button>

        <div className="relative flex h-full items-end gap-3 sm:gap-5">
          {tabs.map((tab) => {
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id)}
                className="relative h-full pb-3 text-[13px]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: isActive ? "var(--team-color)" : "var(--text-secondary)",
                }}
              >
                {/* MOBILE FIX: emoji only on mobile, full label on desktop */}
                <span className="sm:hidden">{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--team-color)]"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <SessionStats />
      </header>

      <main className="mt-14 flex-1 overflow-y-auto p-4">
        {mode === "chat" && (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            isStreaming={isStreaming}
            error={error}
            inputValue={inputValue}
            onInputChange={setInputValue}
            handleSend={handleSend}
            handleRetry={handleRetry}
          />
        )}
        {mode === "quiz" && (
          <QuizCard
            quiz={quiz}
            onNext={handleQuizNext}
            onAnswer={handleQuizAnswer}
            score={quizScore}
            isLoading={quizLoading}
          />
        )}
        {mode === "compare" && (
          <PlayerComparison
            onCompare={handleCompare}
            result={compareResult}
            isLoading={compareLoading}
          />
        )}
      </main>
    </div>
  );
}