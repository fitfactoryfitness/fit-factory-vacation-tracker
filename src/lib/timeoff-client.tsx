"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { TimeOff } from "./types";

type NewTimeOff = {
  employeeId: string;
  startDate: string;
  endDate: string;
  note?: string | null;
};

type EditTimeOff = {
  startDate: string;
  endDate: string;
  note?: string | null;
};

type TimeOffContextValue = {
  entries: TimeOff[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addTimeOff: (input: NewTimeOff) => Promise<void>;
  updateTimeOff: (id: string, input: EditTimeOff) => Promise<void>;
  deleteTimeOff: (id: string) => Promise<void>;
};

const TimeOffContext = createContext<TimeOffContextValue | null>(null);

async function readJson(res: Response) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return body;
}

export function TimeOffProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<TimeOff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/time-off");
      const data = await readJson(res);
      setEntries(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load time off");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTimeOff = useCallback(
    async (input: NewTimeOff) => {
      const res = await fetch("/api/time-off", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      await readJson(res);
      await refresh();
    },
    [refresh]
  );

  const updateTimeOff = useCallback(
    async (id: string, input: EditTimeOff) => {
      const res = await fetch(`/api/time-off/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      await readJson(res);
      await refresh();
    },
    [refresh]
  );

  const deleteTimeOff = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/time-off/${id}`, { method: "DELETE" });
      await readJson(res);
      await refresh();
    },
    [refresh]
  );

  return (
    <TimeOffContext.Provider
      value={{ entries, loading, error, refresh, addTimeOff, updateTimeOff, deleteTimeOff }}
    >
      {children}
    </TimeOffContext.Provider>
  );
}

export function useTimeOff() {
  const ctx = useContext(TimeOffContext);
  if (!ctx) throw new Error("useTimeOff must be used within TimeOffProvider");
  return ctx;
}
