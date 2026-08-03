import type { Employee, Team } from "./types";

// The team roster. To add, rename, or remove someone, edit this list and
// redeploy — there's no separate "manage employees" screen on purpose,
// since this changes rarely and a fixed list keeps the rest of the app
// (and the database) simple.
export const EMPLOYEES: Employee[] = [
  { id: "lucas", name: "Lucas", team: "leads" },
  { id: "stephanie", name: "Stephanie", team: "leads" },

  { id: "harley", name: "Harley", team: "frontdesk" },
  { id: "kateryna", name: "Kateryna", team: "frontdesk" },
  { id: "alexa", name: "Alexa", team: "frontdesk" },

  { id: "stefan", name: "Stefan", team: "coaches" },
  { id: "mikey", name: "Mikey", team: "coaches" },
  { id: "amanda", name: "Amanda", team: "coaches" },
  { id: "charlotte", name: "Charlotte", team: "coaches" },
  { id: "adrian", name: "Adrian", team: "coaches" },
  { id: "patrick", name: "Patrick", team: "coaches" },
  { id: "kat", name: "Kat", team: "coaches" },
  { id: "jenny", name: "Jenny", team: "coaches" },
];

export const EMPLOYEE_IDS = EMPLOYEES.map((e) => e.id);

export const TEAM_LABELS: Record<Team, string> = {
  frontdesk: "Front Desk",
  leads: "Leads",
  coaches: "Coaches",
};

export const TEAM_ORDER: Team[] = ["leads", "frontdesk", "coaches"];

const byId = new Map(EMPLOYEES.map((e) => [e.id, e]));

export function getEmployee(id: string): Employee | undefined {
  return byId.get(id);
}

export function employeesByTeam(team: Team): Employee[] {
  return EMPLOYEES.filter((e) => e.team === team);
}
