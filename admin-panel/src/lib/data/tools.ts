import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapToolRow, toolInputToRow, type ToolRow } from "@/lib/data/mapper";
import type { Tool, ToolInput } from "@/lib/types";

const TOOL_SELECT = "*, categories ( slug, name )";

export async function listTools(): Promise<Tool[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tools")
    .select(TOOL_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to list tools: ${error.message}`);
  return (data as unknown as ToolRow[]).map(mapToolRow);
}

export async function getToolById(id: string): Promise<Tool | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tools")
    .select(TOOL_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch tool: ${error.message}`);
  return data ? mapToolRow(data as unknown as ToolRow) : null;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  let query = supabase.from("tools").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`Failed to check slug: ${error.message}`);
  return Boolean(data);
}

export async function createTool(input: ToolInput): Promise<Tool> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tools")
    .insert(toolInputToRow(input))
    .select(TOOL_SELECT)
    .single();

  if (error) throw new Error(`Failed to create tool: ${error.message}`);
  return mapToolRow(data as unknown as ToolRow);
}

export async function updateTool(id: string, input: ToolInput): Promise<Tool | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tools")
    .update(toolInputToRow(input))
    .eq("id", id)
    .select(TOOL_SELECT)
    .maybeSingle();

  if (error) throw new Error(`Failed to update tool: ${error.message}`);
  return data ? mapToolRow(data as unknown as ToolRow) : null;
}

export async function deleteTool(id: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { error, count } = await supabase
    .from("tools")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw new Error(`Failed to delete tool: ${error.message}`);
  return (count ?? 0) > 0;
}
