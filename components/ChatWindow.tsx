"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "@/components/MessageBubble";
import SuggestedChips from "@/components/SuggestedChips";
import LoadingBall from "@/components/LoadingBall";
import ErrorState from "@/components/ErrorState";
import InputBar from "@/components/InputBar";
import QuickActionBar from "@/components/QuickActionBar";

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
      <div className="flex-1 space-y-4 overflow-y-auto pb-36">
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

      <div className="fixed bottom-0 left-0 z-30 w-full"
  style={{ backgroundColor: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)" }}>
  <QuickActionBar onAction={handleSend} />
  <InputBar
    value={inputValue}
    onChange={onInputChange}
    onSend={() => handleSend()}
    isLoading={isLoading}
  />
</div>
    </div>
  );
}
