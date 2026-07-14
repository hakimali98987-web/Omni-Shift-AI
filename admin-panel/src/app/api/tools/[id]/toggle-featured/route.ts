import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";

interface Params {
  params: Promise<{ id: string }>;
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_api_token")?.value;
}

export async function PATCH(_request: Request, { params }: Params) {
  const token = await getToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const data = await apiRequest<{ tool: unknown }>(`/tools/${id}/toggle-featured`, {
      method: "PATCH",
      token,
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
