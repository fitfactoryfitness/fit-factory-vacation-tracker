export type Team = "frontdesk" | "leads" | "coaches";

export type Employee = {
  id: string;
  name: string;
  team: Team;
};

export type TimeOff = {
  id: string;
  employeeId: string;
  startDate: string; // ISO date, e.g. "2026-08-10"
  endDate: string; // ISO date, inclusive
  note: string | null;
  createdAt: string;
};
