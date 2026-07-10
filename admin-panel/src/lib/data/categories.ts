import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export async function listCategories(): Promise<Category[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");

  if (error) throw new Error(`Failed to list categories: ${error.message}`);
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    icon: row.icon,
    description: row.description,
  }));
}
