"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "@/components/MessageBubble";
import SuggestedChips from "@/components/SuggestedChips";
import LoadingBall from "@/components/LoadingBall";
import ErrorState from "@/components/ErrorState";

export type Message = {
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
  handleSend: (question?: string) => void;
  handleRetry: () => void;
};

export default function ChatWindow({
  messages,
  isLoading,
  isStreaming,
  error,
  inputValue,
  onInputChange,
  handleSend,
  handleRetry,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {!hasMessages && !isLoading ? <SuggestedChips onSelect={handleSend} /> : null}

        {hasMessages
          ? messages.map((m, idx) => {
              const isLastMessage = idx === messages.length - 1;
              return (
                <MessageBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  timestamp={m.timestamp}
                  isStreaming={isStreaming && isLastMessage}
                />
              );
            })
          : null}

        {isLoading && !isStreaming ? <LoadingBall /> : null}

        {error !== null ? <ErrorState message={error} onRetry={handleRetry} /> : null}

        <div ref={messagesEndRef} />
      </div>

      <div className="mt-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2">
        <div className="flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Ask the Oracle..."
            className="max-h-36 min-h-11 flex-1 resize-none rounded-lg bg-transparent px-2 py-2 text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="rounded-full bg-[var(--team-color)] px-4 py-2 text-[12px] text-[#0D0F1A]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
