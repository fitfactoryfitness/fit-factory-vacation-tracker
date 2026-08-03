import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { createTimeOffSchema, mapRow } from "@/lib/timeoff";

export async function GET() {
  const { data, error } = await supabaseServer()
    .from("time_off")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(mapRow));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createTimeOffSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { employeeId, startDate, endDate, note } = parsed.data;

  const { data, error } = await supabaseServer()
    .from("time_off")
    .insert({
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate,
      note: note || null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapRow(data), { status: 201 });
}
