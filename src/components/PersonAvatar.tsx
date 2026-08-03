import { TEAM_STYLES, initials } from "@/lib/colors";
import type { Employee } from "@/lib/types";
import clsx from "clsx";

export function PersonAvatar({
  employee,
  size = "md",
}: {
  employee: Employee;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
  }[size];

  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-1 ring-inset",
        sizeClasses,
        TEAM_STYLES[employee.team].bg,
        TEAM_STYLES[employee.team].border
      )}
    >
      <span className={TEAM_STYLES[employee.team].text}>{initials(employee.name)}</span>
    </div>
  );
}
