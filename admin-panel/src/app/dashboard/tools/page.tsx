import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolsTable } from "./tools-table";
import { listTools } from "@/lib/data/tools";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function ToolsPage() {
  const configured = isSupabaseConfigured();
  const tools = configured ? await listTools().catch(() => null) : null;

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

      {!configured && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">
            Connect Supabase (see <code>.env.example</code>) to load and manage tools.
          </p>
        </div>
      )}

      {configured && tools === null && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load tools from Supabase. Check your credentials and that the schema has been applied.
        </div>
      )}

      {tools && <ToolsTable initialTools={tools} />}
    </div>
  );
}
