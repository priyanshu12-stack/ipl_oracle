"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";

type Mode = "chat" | "quiz" | "compare";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type ChatWindowProps = {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  inputValue: string;
  onInputChange: (value: string) => void;
};

function ChatWindow({
  messages,
  isLoading,
  isStreaming,
  error,
  inputValue,
  onInputChange,
}: ChatWindowProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div className="rounded-xl border border-white/10 bg-[var(--bg-surface)]/50 p-4 text-sm text-[var(--text-secondary)]">
        {messages.length === 0
          ? "No messages yet. Start a cricket conversation."
          : `${messages.length} messages in session.`}
      </div>
      {error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      <textarea
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Ask the Oracle anything about IPL..."
        className="min-h-28 w-full rounded-xl border border-white/10 bg-[var(--bg-card)] p-3 text-sm text-[var(--text-primary)] outline-none"
      />
      <div className="text-xs text-[var(--text-secondary)]">
        {isLoading ? "Loading..." : isStreaming ? "Streaming..." : "Idle"}
      </div>
    </div>
  );
}

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
  const [showStats, setShowStats] = useState(false);

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
                  color: isActive ? "var(--team-color)" : "var(--text-secondary)",
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

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStats((prev) => !prev)}
            className="rounded-md p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Session stats"
          >
            <BarChart2 size={18} />
          </button>
          {showStats ? (
            <div className="absolute right-0 top-11 w-48 rounded-lg border border-white/10 bg-[var(--bg-card)] p-3 text-xs text-[var(--text-secondary)]">
              SessionStats
              <div className="mt-1 text-[11px]">Live stats shell</div>
            </div>
          ) : null}
        </div>
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
          />
        )}
        {mode === "quiz" && <QuizCard />}
        {mode === "compare" && <PlayerComparison />}
      </main>
    </div>
  );
}
