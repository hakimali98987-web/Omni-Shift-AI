import { NextResponse } from "next/server";
import { listCategories } from "@/lib/data/categories";
import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet. See .env.example." }, { status: 503 });
  }

  try {
    const categories = await listCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
