import { NextResponse, type NextRequest } from "next/server";

const API_TOKEN_COOKIE = "admin_api_token";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(API_TOKEN_COOKIE)?.value;
  const authed = Boolean(token);

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
