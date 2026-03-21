"use client";

import { motion } from "framer-motion";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center px-6 py-12 text-center"
    >
      {/* Rain icon */}
      <span style={{ fontSize: "64px", lineHeight: 1 }}>🌧️</span>

      {/* Animated rain dots */}
      <div className="mt-3 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
            style={{ fontSize: "10px", color: "var(--text-secondary)" }}
          >
            ●
          </motion.span>
        ))}
      </div>

      {/* Headline */}
      <h2
        className="mt-4"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "42px",
          color: "white",
          lineHeight: 1,
        }}
      >
        Rain Delay!
      </h2>

      {/* Subtext */}
      <p
        className="mt-3"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          color: "var(--text-secondary)",
          maxWidth: "300px",
          lineHeight: 1.6,
        }}
      >
        The Oracle lost signal. The pitch is being covered.
      </p>

      {/* Extra quip */}
      <p
        className="mt-2"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          color: "var(--text-secondary)",
          opacity: 0.5,
        }}
      >
        ☔ The match resumes shortly.
      </p>

      {/* Technical error */}
      {message && (
        <span
          className="mt-2"
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            color: "var(--text-secondary)",
            opacity: 0.5,
          }}
        >
          (Error: {message})
        </span>
      )}

      {/* Retry button */}
      <button
        type="button"
        onClick={onRetry}
        className="mt-6"
        style={{
          height: "44px",
          padding: "0 24px",
          background: "transparent",
          border: "1px solid var(--team-color)",
          color: "var(--team-color)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          borderRadius: "999px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--team-color)";
          e.currentTarget.style.color = "#0D0F1A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--team-color)";
        }}
        aria-label="Retry"
      >
        Try Again ↺
      </button>
    </motion.div>
  );
}