import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { listTools, createTool, isSlugTaken } from "@/lib/data/tools";
import { toolInputSchema } from "@/lib/validations/tool";

// GET is intentionally public-readable-once-authenticated only (this is an
// admin surface, not the public directory API), matching the rest of the
// panel's session gating.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet. See .env.example." }, { status: 503 });
  }

  try {
    const tools = await listTools();
    return NextResponse.json({ tools });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST is also covered by middleware (writes require a valid session), this
// check is defense-in-depth in case the route is ever reached directly.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet. See .env.example." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = toolInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
  }

  try {
    if (await isSlugTaken(parsed.data.slug)) {
      return NextResponse.json({ error: "That slug is already in use" }, { status: 409 });
    }
    const tool = await createTool(parsed.data);
    return NextResponse.json({ tool }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
