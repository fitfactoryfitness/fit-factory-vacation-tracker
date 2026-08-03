"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getEmployee } from "./employees";
import type { Employee } from "./types";

const STORAGE_KEY = "fitfactory-vacation-tracker:identity";

type IdentityContextValue = {
  employee: Employee | null;
  setIdentity: (employeeId: string) => void;
  clearIdentity: () => void;
};

const IdentityContext = createContext<IdentityContextValue | null>(null);

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    setEmployeeId(window.localStorage.getItem(STORAGE_KEY));
  }, []);

  const setIdentity = (id: string) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    setEmployeeId(id);
  };

  const clearIdentity = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setEmployeeId(null);
  };

  const employee = employeeId ? getEmployee(employeeId) ?? null : null;

  return (
    <IdentityContext.Provider value={{ employee, setIdentity, clearIdentity }}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider");
  return ctx;
}
