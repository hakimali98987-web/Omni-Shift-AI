import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ToolForm } from "../../tool-form";
import { getToolById } from "@/lib/data/tools";
import { listCategories } from "@/lib/data/categories";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) notFound();

  const { id } = await params;
  const [tool, categories] = await Promise.all([getToolById(id), listCategories()]);
  if (!tool) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/dashboard/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to tools
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit {tool.name}</h1>
        <p className="text-sm text-muted-foreground">Update this tool&apos;s details.</p>
      </div>
      <ToolForm categories={categories} tool={tool} />
    </div>
  );
}
