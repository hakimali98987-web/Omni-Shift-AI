import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { DashboardStats } from "@/lib/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabaseAdminClient();

  const [totalToolsRes, totalCategoriesRes, featuredToolsRes, trendingToolsRes] = await Promise.all([
    supabase.from("tools").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("featured", true),
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("trending", true),
  ]);

  for (const res of [totalToolsRes, totalCategoriesRes, featuredToolsRes, trendingToolsRes]) {
    if (res.error) throw new Error(`Failed to load dashboard stats: ${res.error.message}`);
  }

  return {
    totalTools: totalToolsRes.count ?? 0,
    totalCategories: totalCategoriesRes.count ?? 0,
    featuredTools: featuredToolsRes.count ?? 0,
    trendingTools: trendingToolsRes.count ?? 0,
  };
}
