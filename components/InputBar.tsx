"use client";

import { useEffect, useRef } from "react";
import { Send } from "lucide-react";

type InputBarProps = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isLoading: boolean;
};

export default function InputBar({
  value,
  onChange,
  onSend,
  isLoading,
}: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isDisabled = isLoading || value.trim() === "";

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "44px";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  return (
    <div className="w-full bg-transparent">
      <div className="mx-auto flex w-full max-w-[760px] items-end gap-3 px-4 py-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!isDisabled) onSend();
            }
          }}
          disabled={isLoading}
          placeholder="Ask the Oracle anything IPL..."
          className="min-h-[44px] max-h-[120px] flex-1 resize-none rounded-[var(--radius-input)] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-[14px] py-[10px] text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] disabled:opacity-70"
          style={{
            fontFamily: "var(--font-body)",
            transition: "all 0.15s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor =
              "color-mix(in srgb, var(--team-color) 60%, transparent)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
          }}
        />

        <button
          type="button"
          disabled={isDisabled}
          onClick={onSend}
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            transition: "all 0.15s ease",
            backgroundColor: isDisabled ? "var(--bg-card)" : "var(--team-color)",
            color: isDisabled ? "var(--text-secondary)" : "#0D0F1A",
            border: isDisabled ? "1px solid var(--border-subtle)" : "1px solid transparent",
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (isDisabled) return;
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.filter = "brightness(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.filter = "brightness(1)";
          }}
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--text-secondary)] border-t-transparent" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
