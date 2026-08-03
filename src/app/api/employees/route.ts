import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { createEmployeeSchema, slugify, uniqueSlug } from "@/lib/employee-schema";
import type { Employee } from "@/lib/types";

function mapRow(row: { id: string; name: string; team: string }): Employee {
  return { id: row.id, name: row.name, team: row.team as Employee["team"] };
}

export async function GET() {
  const { data, error } = await supabaseServer()
    .from("employees")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(mapRow));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createEmployeeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const db = supabaseServer();
  const { data: existing, error: listError } = await db.from("employees").select("id");
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const id = uniqueSlug(slugify(parsed.data.name), new Set(existing.map((e) => e.id)));

  const { data, error } = await db
    .from("employees")
    .insert({ id, name: parsed.data.name, team: parsed.data.team })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapRow(data), { status: 201 });
}
