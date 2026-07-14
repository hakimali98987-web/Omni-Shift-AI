import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_api_token")?.value;
  return NextResponse.json({ session: token ? { authenticated: true } : null });
}
