"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { readJson } from "./http";
import type { Employee, Team } from "./types";

type EmployeesContextValue = {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addEmployee: (name: string, team: Team) => Promise<void>;
  removeEmployee: (id: string) => Promise<void>;
};

const EmployeesContext = createContext<EmployeesContextValue | null>(null);

export function EmployeesProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      setEmployees(await readJson(res));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEmployee = useCallback(
    async (name: string, team: Team) => {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, team }),
      });
      await readJson(res);
      await refresh();
    },
    [refresh]
  );

  const removeEmployee = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      await readJson(res);
      await refresh();
    },
    [refresh]
  );

  return (
    <EmployeesContext.Provider
      value={{ employees, loading, error, refresh, addEmployee, removeEmployee }}
    >
      {children}
    </EmployeesContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeesContext);
  if (!ctx) throw new Error("useEmployees must be used within EmployeesProvider");
  return ctx;
}
