import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string().trim().min(1).max(60),
  team: z.enum(["leads", "frontdesk", "coaches"]),
});

export function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "person"
  );
}

/** Appends -2, -3, ... until the slug doesn't collide with an existing id. */
export function uniqueSlug(base: string, existingIds: Set<string>): string {
  if (!existingIds.has(base)) return base;
  let n = 2;
  while (existingIds.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
