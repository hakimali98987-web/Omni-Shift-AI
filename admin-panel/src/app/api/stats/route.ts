import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/data/stats";
import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet. See .env.example." }, { status: 503 });
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
