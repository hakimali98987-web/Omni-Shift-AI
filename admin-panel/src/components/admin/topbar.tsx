"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminSession } from "@/lib/types";

export function Topbar({ session }: { session: AdminSession }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{session.email}</span>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </header>
  );
}
