import { z } from "zod";
import { EMPLOYEE_IDS } from "./employees";
import type { TimeOff } from "./types";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const createTimeOffSchema = z
  .object({
    employeeId: z.enum(EMPLOYEE_IDS as [string, ...string[]]),
    startDate: isoDate,
    endDate: isoDate,
    note: z.string().trim().max(280).optional().nullable(),
  })
  .refine((v) => v.endDate >= v.startDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  });

export const updateTimeOffSchema = z
  .object({
    startDate: isoDate,
    endDate: isoDate,
    note: z.string().trim().max(280).optional().nullable(),
  })
  .refine((v) => v.endDate >= v.startDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  });

// DB row -> API/UI shape (snake_case -> camelCase).
export function mapRow(row: {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  note: string | null;
  created_at: string;
}): TimeOff {
  return {
    id: row.id,
    employeeId: row.employee_id,
    startDate: row.start_date,
    endDate: row.end_date,
    note: row.note,
    createdAt: row.created_at,
  };
}
