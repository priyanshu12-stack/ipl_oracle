"use client";

import { motion } from "framer-motion";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
};

export default function MessageBubble({
  role,
  content,
  timestamp,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="ml-auto w-full max-w-[75%]"
      >
        <div
          className="px-4 py-3 text-[14px] text-[var(--text-primary)]"
          style={{
            fontFamily: "var(--font-body)",
            backgroundColor: "var(--team-color-dim)",
            border: "1px solid color-mix(in srgb, var(--team-color) 40%, transparent)",
            borderRadius: "16px 16px 4px 16px",
          }}
        >
          {content}
        </div>
        <div className="mt-1 text-right text-[11px] text-[var(--text-secondary)]">
          {timestamp}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full max-w-[82%]"
    >
      <div className="flex items-start gap-2.5">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[var(--bg-surface)] text-[11px] leading-none text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
        >
          ORC
        </div>
        <div className="min-w-0">
          <div
            className="px-4 py-[14px] text-[14px] leading-[1.7] text-[var(--text-primary)]"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "4px 16px 16px 16px",
            }}
          >
            {content}
            {isStreaming ? <span className="typing-cursor" /> : null}
          </div>
          <div className="mt-1 text-left text-[11px] text-[var(--text-secondary)]">
            {timestamp}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
