import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/tool";
import { verifyAdminCredentials, createSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password" }, { status: 400 });
  }

  let valid: boolean;
  try {
    valid = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Admin auth is not configured" },
      { status: 500 },
    );
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await createSessionCookie({ email: parsed.data.email });
  return NextResponse.json({ ok: true });
}
