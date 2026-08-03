import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: ReactNode;
  accent?: "amber" | "blue" | "green" | "neutral";
  hint?: string;
}) {
  const accentClass = {
    amber: "text-brand-amber",
    blue: "text-status-blue",
    green: "text-status-green",
    neutral: "text-white",
  }[accent ?? "neutral"];

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-panel p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-3xl font-semibold ${accentClass}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
