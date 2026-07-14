import "server-only";
import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";
import type { DashboardStats } from "@/lib/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_api_token")?.value;
  const data = await apiRequest<{ stats: DashboardStats }>("/stats", { token });
  return data.stats;
}
