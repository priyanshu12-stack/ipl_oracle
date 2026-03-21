"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ChatWindow, { type Message } from "@/components/ChatWindow";
import SessionStats from "@/components/SessionStats";
import { useAnalytics } from "@/hooks/useAnalytics";

type Mode = "chat" | "quiz" | "compare";

function QuizCard() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border border-white/10 bg-[var(--bg-surface)]/50 p-5 text-[var(--text-secondary)]">
      Quiz mode shell
    </div>
  );
}

function PlayerComparison() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border border-white/10 bg-[var(--bg-surface)]/50 p-5 text-[var(--text-secondary)]">
      Compare mode shell
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<Mode>("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const { trackQuestion } = useAnalytics();

  const handleSend = async (question?: string) => {
    if (isLoading) return;

    const content = (question ?? inputValue).trim();
    if (!content) return;

    // Track every question sent
    trackQuestion();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const assistantMessageId = crypto.randomUUID();
    const conversationHistory = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

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
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInputValue("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: conversationHistory,
        }),
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
        if (!hasReceivedFirstChunk) {
          hasReceivedFirstChunk = true;
          setIsStreaming(true);
        }
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: `${m.content}${chunk}` }
              : m,
          ),
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Oracle signal lost. Rain delay in effect.";
      setError(errorMessage);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
    } finally {
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
  };

  useEffect(() => {
    const teamId = localStorage.getItem("ipl_selectedTeam") || "csk";
    const teamColor = localStorage.getItem("ipl_primaryColor") || "#F5C842";
    document.documentElement.style.setProperty("--team-color", teamColor);
    void teamId;
  }, []);

  const tabs = useMemo(
    () =>
      [
        { id: "chat", label: "🏏 Chat" },
        { id: "quiz", label: "🎯 Quiz" },
        { id: "compare", label: "⚖️ Compare" },
      ] as const,
    [],
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
          <span
            className="text-[22px] leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            IPL ORACLE
          </span>
        </button>

        <div className="relative flex h-full items-end gap-5">
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
                  color: isActive
                    ? "var(--team-color)"
                    : "var(--text-secondary)",
                }}
              >
                {tab.label}
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

        {/* SessionStats replaces the old showStats block */}
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
        {mode === "quiz" && <QuizCard />}
        {mode === "compare" && <PlayerComparison />}
      </main>
    </div>
  );
}