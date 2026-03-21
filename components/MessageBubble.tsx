"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
};

function formatMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const boldParsed = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );

    if (/^\s*[\*\-]\s+/.test(line)) {
      const cleaned = line.replace(/^\s*[\*\-]\s+/, "");
      const boldInBullet = cleaned.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      );
      result.push(
        <div key={i} className="flex gap-2 py-0.5">
          <span
            className="shrink-0 rounded-full"
            style={{
              backgroundColor: "var(--team-color)",
              width: "6px",
              height: "6px",
              marginTop: "7px",
              flexShrink: 0,
            }}
          />
          <span>{boldInBullet}</span>
        </div>
      );
    } else if (line.trim() === "") {
      result.push(<div key={i} className="h-2" />);
    } else {
      result.push(<div key={i}>{boldParsed}</div>);
    }
  });

  return result;
}

export default function MessageBubble({
  role,
  content,
  timestamp,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[var(--bg-surface)] text-[11px] leading-none text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
        >
          ORC
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="px-4 py-[14px] text-[14px] leading-[1.7] text-[var(--text-primary)]"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "4px 16px 16px 16px",
            }}
          >
            {formatMarkdown(content)}
            {isStreaming ? <span className="typing-cursor" /> : null}
          </div>

          {/* Copy button row */}
          <div
            className="mt-1 flex items-center gap-2"
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}
          >
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-full px-[10px] py-[4px]"
              style={{
                border: "1px solid var(--border-subtle)",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: copied ? "#22c55e" : "var(--text-secondary)",
                transition: "all 0.15s ease",
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Copy response"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="mt-1 text-left text-[11px] text-[var(--text-secondary)]">
            {timestamp}
          </div>
        </div>
      </div>
    </motion.div>
  );
}