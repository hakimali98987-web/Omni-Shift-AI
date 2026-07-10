import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { ToolForm } from "../tool-form";
import { listCategories } from "@/lib/data/categories";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function NewToolPage() {
  const configured = isSupabaseConfigured();
  const categories = configured ? await listCategories().catch(() => []) : [];

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/dashboard/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to tools
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add AI Tool</h1>
        <p className="text-sm text-muted-foreground">Create a new listing in the directory.</p>
      </div>

      {!configured ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">
            Connect Supabase (see <code>.env.example</code>) before adding tools.
          </p>
        </div>
      ) : (
        <ToolForm categories={categories} />
      )}
    </div>
  );
}
