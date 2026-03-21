"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FirstVisitTooltipProps = {
  isUserTyping?: boolean;
};

const VISITED_KEY = "ipl_oracle_visited";

export default function FirstVisitTooltip({
  isUserTyping = false,
}: FirstVisitTooltipProps) {
  const [visible, setVisible] = useState(false);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(VISITED_KEY, "1");
  };

  useEffect(() => {
    const hasVisited = localStorage.getItem(VISITED_KEY);
    if (!hasVisited) {
      setVisible(true);
      const timer = window.setTimeout(() => dismiss(), 5000);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (isUserTyping && visible) {
      dismiss();
    }
  }, [isUserTyping, visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-20 left-1/2 z-30 w-fit max-w-[340px] -translate-x-1/2 rounded-[12px] border px-4 py-3"
          style={{
            background: "var(--bg-card)",
            borderColor: "color-mix(in srgb, var(--team-color) 50%, transparent)",
          }}
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-2 top-2 text-[14px] text-[var(--text-secondary)]"
            aria-label="Dismiss tip"
          >
            ×
          </button>

          <p
            className="pr-5 text-[13px] text-[var(--text-secondary)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            💡 Tip: Try asking &apos;Best IPL matches ever&apos; or click a Quick
            Action above
          </p>

          <span
            className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid var(--bg-card)",
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
