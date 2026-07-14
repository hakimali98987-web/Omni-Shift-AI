import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import type { AdminSession } from "@/lib/types";

/** Decode the email claim from a JWT without signature verification (display only). */
function decodeTokenEmail(token: string): string {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return payload.email ?? payload.sub ?? "Admin";
  } catch {
    return "Admin";
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_api_token")?.value;
  if (!token) redirect("/login");

  const session: AdminSession = { email: decodeTokenEmail(token) };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar session={session} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
