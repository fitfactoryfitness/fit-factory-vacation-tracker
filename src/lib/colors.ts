import type { Team } from "./types";

// Tailwind can't resolve dynamically-built class names (e.g. `bg-team-${team}`)
// at build time since it statically scans for class strings, so each team's
// full set of classes is spelled out here instead.
export const TEAM_STYLES: Record<
  Team,
  { dot: string; text: string; bg: string; border: string; bar: string }
> = {
  frontdesk: {
    dot: "bg-team-frontdesk",
    text: "text-team-frontdesk",
    bg: "bg-team-frontdesk/10",
    border: "border-team-frontdesk/30",
    bar: "bg-team-frontdesk/80",
  },
  leads: {
    dot: "bg-team-leads",
    text: "text-team-leads",
    bg: "bg-team-leads/10",
    border: "border-team-leads/30",
    bar: "bg-team-leads/80",
  },
  coaches: {
    dot: "bg-team-coaches",
    text: "text-team-coaches",
    bg: "bg-team-coaches/10",
    border: "border-team-coaches/30",
    bar: "bg-team-coaches/80",
  },
};

export function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}
