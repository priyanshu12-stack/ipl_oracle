"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingBall from "@/components/LoadingBall";

type PlayerStats = {
  name: string;
  runs: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  wickets?: number;
  economy?: number;
};

type CompareResult = {
  player1: PlayerStats;
  player2: PlayerStats;
  verdict: string;
};

type PlayerComparisonProps = {
  onCompare: (player1: string, player2: string) => void;
  result: CompareResult | null;
  isLoading: boolean;
};

type StatRow = {
  label: string;
  key: keyof PlayerStats;
  lowerIsBetter?: boolean;
};

const STAT_ROWS: StatRow[] = [
  { label: "RUNS", key: "runs" },
  { label: "AVERAGE", key: "average" },
  { label: "STRIKE RATE", key: "strikeRate" },
  { label: "FIFTIES", key: "fifties" },
  { label: "HUNDREDS", key: "hundreds" },
  { label: "WICKETS", key: "wickets" },
  { label: "ECONOMY", key: "economy", lowerIsBetter: true },
];

export default function PlayerComparison({
  onCompare,
  result,
  isLoading,
}: PlayerComparisonProps) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  const isDisabled = p1.trim() === "" || p2.trim() === "";

  function getWinner(
    val1: number | undefined,
    val2: number | undefined,
    lowerIsBetter = false
  ): "p1" | "p2" | "tie" {
    if (val1 === undefined || val2 === undefined) return "tie";
    if (val1 === val2) return "tie";
    if (lowerIsBetter) return val1 < val2 ? "p1" : "p2";
    return val1 > val2 ? "p1" : "p2";
  }

  function StatValue({
    value,
    isWinner,
  }: {
    value: number | undefined;
    isWinner: boolean;
  }) {
    if (value === undefined || value === 0) return null;
    return (
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "22px",
          color: isWinner ? "#22c55e" : "var(--text-secondary)",
          background: isWinner ? "rgba(34,197,94,0.1)" : "transparent",
          padding: isWinner ? "4px 12px" : "4px 0",
          borderRadius: isWinner ? "6px" : "0",
          fontWeight: isWinner ? "bold" : "normal",
        }}
      >
        {typeof value === "number" && !Number.isInteger(value)
          ? value.toFixed(2)
          : value}
      </span>
    );
  }

  return (
    <div
      className="mx-auto w-full px-6 py-6"
      style={{ maxWidth: "720px" }}
    >
      {/* INPUT SECTION */}
      <div className="relative mb-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Player 1 */}
          <input
            type="text"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            placeholder="Player 1 name..."
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              padding: "12px 14px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: "white",
              outline: "none",
              width: "100%",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--team-color)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
          />

          {/* Player 2 */}
          <input
            type="text"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            placeholder="Player 2 name..."
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              padding: "12px 14px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: "white",
              outline: "none",
              width: "100%",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--team-color)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
          />
        </div>

        {/* VS Badge */}
        <div
          className="absolute left-1/2 top-1/2 flex items-center justify-center"
          style={{
            transform: "translate(-50%, -50%)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "var(--team-color)",
            color: "#0D0F1A",
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          VS
        </div>
      </div>

      {/* COMPARE BUTTON */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onCompare(p1.trim(), p2.trim())}
        className="mb-6 w-full"
        style={{
          height: "48px",
          background: isDisabled ? "var(--bg-card)" : "var(--team-color)",
          color: isDisabled ? "var(--text-secondary)" : "#0D0F1A",
          fontFamily: "var(--font-display)",
          fontSize: "18px",
          letterSpacing: "2px",
          borderRadius: "999px",
          border: isDisabled
            ? "1px solid var(--border-subtle)"
            : "1px solid transparent",
          cursor: isDisabled ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (isDisabled) return;
          e.currentTarget.style.filter = "brightness(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = "brightness(1)";
        }}
      >
        COMPARE NOW
      </button>

      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingBall />
        </div>
      )}

      {/* RESULTS */}
      <AnimatePresence>
        {!isLoading && result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
          >
            {/* Player name headers */}
            <div
              className="mb-2 grid text-center"
              style={{ gridTemplateColumns: "1fr auto 1fr" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  color: "var(--text-primary)",
                }}
              >
                {result.player1.name}
              </span>
              <span
                style={{
                  width: "60px",
                  fontFamily: "var(--font-display)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  textAlign: "center",
                }}
              >
                VS
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  color: "var(--text-primary)",
                  textAlign: "right",
                }}
              >
                {result.player2.name}
              </span>
            </div>

            {/* STAT ROWS */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "16px",
              }}
            >
              {STAT_ROWS.filter((row) => {
                const v1 = result.player1[row.key] as number | undefined;
                const v2 = result.player2[row.key] as number | undefined;
                return v1 !== undefined && v1 !== 0 && v2 !== undefined && v2 !== 0;
              }).map((row, i, arr) => {
                const val1 = result.player1[row.key] as number | undefined;
                const val2 = result.player2[row.key] as number | undefined;
                const winner = getWinner(val1, val2, row.lowerIsBetter);

                return (
                  <div
                    key={row.key}
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: "1fr auto 1fr",
                      padding: "14px 16px",
                      borderBottom:
                        i < arr.length - 1
                          ? "1px solid var(--border-subtle)"
                          : "none",
                    }}
                  >
                    {/* Player 1 value */}
                    <div className="flex justify-start">
                      <StatValue
                        value={val1}
                        isWinner={winner === "p1"}
                      />
                    </div>

                    {/* Stat label */}
                    <div
                      style={{
                        width: "100px",
                        textAlign: "center",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {row.label}
                    </div>

                    {/* Player 2 value */}
                    <div className="flex justify-end">
                      <StatValue
                        value={val2}
                        isWinner={winner === "p2"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ORACLE VERDICT */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, var(--bg-card), var(--bg-surface))",
                border:
                  "1px solid color-mix(in srgb, var(--team-color) 40%, transparent)",
                borderRadius: "12px",
                padding: "20px",
                borderLeft: "3px solid var(--team-color)",
              }}
            >
              <p
                className="mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                  color: "var(--team-color)",
                  letterSpacing: "3px",
                }}
              >
                ORACLE VERDICT
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--text-primary)",
                }}
              >
                {result.verdict}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}