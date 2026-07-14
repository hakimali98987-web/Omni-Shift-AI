import "server-only";
import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";
import type { Category } from "@/lib/types";

export async function listCategories(): Promise<Category[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_api_token")?.value;
  const data = await apiRequest<{ categories: Category[] }>("/categories", { token });
  return data.categories;
}
