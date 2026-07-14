import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolsTable } from "./tools-table";
import { listTools } from "@/lib/data/tools";

export default async function ToolsPage() {
  let tools = null;
  let loadError: string | null = null;

  try {
    tools = await listTools();
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load tools";
    // If the external API rejects with an auth error, send the user back to login.
    if (/no token|unauthorized|invalid token/i.test(msg)) {
      redirect("/login?next=/dashboard/tools");
    }
    loadError = msg;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Tools</h1>
          <p className="text-sm text-muted-foreground">Add, edit, and remove tools in the directory.</p>
        </div>
        <Link href="/dashboard/tools/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add AI Tool
          </Button>
        </Link>
      </div>

      {loadError && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{loadError}</p>
        </div>
      )}

      {tools && <ToolsTable initialTools={tools} />}
    </div>
  );
}
