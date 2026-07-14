import "server-only";
import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";
import type { DashboardStats } from "@/lib/types";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_api_token")?.value;
  if (!token) throw new Error("No token — please log in again.");
  return token;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const token = await getToken();
  const data = await apiRequest<{ stats: DashboardStats }>("/stats", { token });
  return data.stats;
}
