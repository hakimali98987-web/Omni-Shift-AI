import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_api_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await apiRequest<{ stats: unknown }>("/stats", { token });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
