import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/tool";
import { apiRequest } from "@/lib/api-client";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password" }, { status: 400 });
  }

  try {
    const data = await apiRequest<{ token?: string; access_token?: string; ok?: boolean }>(
      "/auth/login",
      { method: "POST", body: parsed.data },
    );

    // The external API returns a JWT token — store it as a session cookie so
    // subsequent requests can forward it as a Bearer token.
    const token = data.token ?? data.access_token;
    if (!token) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_api_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 401 },
    );
  }
}
