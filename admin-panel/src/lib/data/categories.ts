import "server-only";
import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";
import type { Category } from "@/lib/types";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_api_token")?.value;
  if (!token) throw new Error("No token — please log in again.");
  return token;
}

export async function listCategories(): Promise<Category[]> {
  const token = await getToken();
  const data = await apiRequest<{ categories: Category[] }>("/categories", { token });
  return data.categories;
}
