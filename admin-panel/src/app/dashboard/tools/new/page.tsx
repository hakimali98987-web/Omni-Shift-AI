import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToolForm } from "../tool-form";
import { listCategories } from "@/lib/data/categories";

export default async function NewToolPage() {
  const categories = await listCategories().catch(() => []);

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/dashboard/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to tools
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add AI Tool</h1>
        <p className="text-sm text-muted-foreground">Create a new listing in the directory.</p>
      </div>
      <ToolForm categories={categories} />
    </div>
  );
}
