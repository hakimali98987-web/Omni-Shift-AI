import { NextResponse, type NextRequest } from "next/server";
import { hasValidSession } from "@/lib/auth-edge";

const SESSION_COOKIE = "admin_session";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await hasValidSession(token, process.env.SESSION_SECRET);

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");
  const isWriteApi =
    pathname.startsWith("/api/tools") &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(request.method);

  if (isWriteApi && !authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDashboard && !authed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && authed) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/api/tools/:path*"],
};
