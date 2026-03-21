"use client";

type QuickActionBarProps = {
  onAction: (prompt: string) => void;
};

const ACTIONS = [
  { icon: "🔍", label: "Run Kings", prompt: "Who are the all-time top 5 IPL run scorers with full stats?" },
  { icon: "⚡", label: "Best Finishes", prompt: "What are the most dramatic last-over IPL finishes in history?" },
  { icon: "🏆", label: "IPL Winners", prompt: "List every IPL champion season by season from 2008 to 2024." },
  { icon: "🎯", label: "Top Bowlers", prompt: "Who are the top 5 wicket-takers in IPL history with stats?" },
  { icon: "🔥", label: "Current Form", prompt: "Which IPL teams and players are in the best form right now?" },
];

export default function QuickActionBar({ onAction }: QuickActionBarProps) {
  return (
    <div
      className="relative w-full px-4 py-2"
      style={{ backgroundColor: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)" }}
    >
      {/* MOBILE FIX: webkit scroll + no wrap */}
      <div
        className="mx-auto flex w-full max-w-[760px] gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          flexWrap: "nowrap",
        } as React.CSSProperties}
      >
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => onAction(action.prompt)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-[14px] py-[6px] transition-all duration-150 ease-in-out hover:border-[var(--team-color)]"
          >
            <span className="text-[14px] leading-none">{action.icon}</span>
            <span
              className="text-[12px] text-[var(--text-secondary)] transition-colors duration-150 ease-in-out hover:text-[var(--team-color)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* MOBILE FIX: fade overlay only on desktop */}
      <div className="pointer-events-none absolute right-4 top-2 hidden h-[36px] w-10 bg-gradient-to-r from-transparent to-[var(--bg-surface)] sm:block" />
    </div>
  );
}