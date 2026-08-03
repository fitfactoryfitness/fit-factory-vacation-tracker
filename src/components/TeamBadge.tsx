import { TEAM_STYLES } from "@/lib/colors";
import { TEAM_LABELS } from "@/lib/employees";
import type { Team } from "@/lib/types";
import clsx from "clsx";

export function TeamBadge({ team }: { team: Team }) {
  const s = TEAM_STYLES[team];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        s.bg,
        s.border,
        s.text
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", s.dot)} />
      {TEAM_LABELS[team]}
    </span>
  );
}
