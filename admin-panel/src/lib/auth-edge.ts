import { jwtVerify } from "jose";

/**
 * Edge-safe session check for use inside `middleware.ts`, which runs in the
 * Edge runtime and cannot import `server-only` code that touches Node APIs
 * (bcrypt) the way `lib/auth.ts` does. This only verifies the JWT signature —
 * actual login/credential checks stay in `lib/auth.ts` (Node runtime).
 */
export async function hasValidSession(token: string | undefined, secret: string | undefined): Promise<boolean> {
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}
