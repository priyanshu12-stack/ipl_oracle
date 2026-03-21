"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingBall() {
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLabel(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center py-8">
      <motion.div
        animate={{ x: [0, 120, 0], y: [0, -28, 0] }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-11 w-11 rounded-full bg-[#C0392B]"
      >
        <div
          className="absolute h-[2px] w-[60%] bg-white/70"
          style={{
            borderRadius: "0 0 50% 50%",
            top: "35%",
            left: "20%",
            transform: "rotate(10deg)",
          }}
        />
        <div
          className="absolute h-[2px] w-[60%] bg-white/70"
          style={{
            borderRadius: "0 0 50% 50%",
            top: "55%",
            left: "20%",
            transform: "rotate(-10deg)",
          }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showLabel ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="mt-4 text-center text-[13px] italic text-[var(--text-secondary)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        The Oracle is checking the Duckworth-Lewis tables...
      </motion.p>
    </div>
  );
}
