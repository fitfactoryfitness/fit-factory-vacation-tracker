import type { Employee, Team } from "./types";

export const TEAM_LABELS: Record<Team, string> = {
  frontdesk: "Front Desk",
  leads: "Leads",
  coaches: "Coaches",
};

export const TEAM_ORDER: Team[] = ["leads", "frontdesk", "coaches"];

// The team roster itself lives in the `employees` table (see
// supabase/migrations/0002_employees.sql) so it can be edited from the
// Team page without a redeploy — fetch it via useEmployees(). These
// helpers just operate on whatever list you hand them.

export function getEmployee(employees: Employee[], id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

export function employeesByTeam(employees: Employee[], team: Team): Employee[] {
  return employees.filter((e) => e.team === team);
}
