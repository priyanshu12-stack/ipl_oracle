"use client";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-center">
      <p
        className="text-[13px] text-red-200"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-full border border-red-200/30 px-4 py-1.5 text-[12px] text-red-100 hover:bg-red-400/10"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Retry
      </button>
    </div>
  );
}
