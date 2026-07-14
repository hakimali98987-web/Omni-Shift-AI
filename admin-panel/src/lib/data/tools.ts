import "server-only";
import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";
import type { Tool, ToolInput } from "@/lib/types";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_api_token")?.value;
  if (!token) {
    throw new Error("No token — please log in again.");
  }
  return token;
}

export async function listTools(): Promise<Tool[]> {
  const token = await getToken();
  const data = await apiRequest<{ tools: Tool[] }>("/tools", { token });
  return data.tools;
}

export async function getToolById(id: string): Promise<Tool | null> {
  const token = await getToken();
  try {
    const data = await apiRequest<{ tool: Tool }>(`/tools/${id}`, { token });
    return data.tool ?? null;
  } catch {
    return null;
  }
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const token = await getToken();
  try {
    const params = new URLSearchParams({ slug });
    if (excludeId) params.set("excludeId", excludeId);
    const data = await apiRequest<{ taken: boolean }>(`/tools/slug-check?${params.toString()}`, { token });
    return data.taken ?? false;
  } catch {
    return false;
  }
}

export async function createTool(input: ToolInput): Promise<Tool> {
  const token = await getToken();
  const data = await apiRequest<{ tool: Tool }>("/tools", {
    method: "POST",
    body: input,
    token,
  });
  return data.tool;
}

export async function updateTool(id: string, input: ToolInput): Promise<Tool | null> {
  const token = await getToken();
  const data = await apiRequest<{ tool: Tool }>(`/tools/${id}`, {
    method: "PATCH",
    body: input,
    token,
  });
  return data.tool ?? null;
}

export async function deleteTool(id: string): Promise<boolean> {
  const token = await getToken();
  await apiRequest<{ ok: boolean }>(`/tools/${id}`, {
    method: "DELETE",
    token,
  });
  return true;
}
