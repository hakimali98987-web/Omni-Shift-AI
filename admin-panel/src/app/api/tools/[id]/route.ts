import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getToolById, updateTool, deleteTool, isSlugTaken } from "@/lib/data/tools";
import { toolInputSchema } from "@/lib/validations/tool";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet. See .env.example." }, { status: 503 });
  }

  const { id } = await params;
  try {
    const tool = await getToolById(id);
    if (!tool) return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    return NextResponse.json({ tool });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet. See .env.example." }, { status: 503 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = toolInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
  }

  try {
    if (await isSlugTaken(parsed.data.slug, id)) {
      return NextResponse.json({ error: "That slug is already in use" }, { status: 409 });
    }
    const tool = await updateTool(id, parsed.data);
    if (!tool) return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    return NextResponse.json({ tool });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet. See .env.example." }, { status: 503 });
  }

  const { id } = await params;
  try {
    const deleted = await deleteTool(id);
    if (!deleted) return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
