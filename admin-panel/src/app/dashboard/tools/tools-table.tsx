"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Search, Star, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import type { Tool } from "@/lib/types";

export function ToolsTable({ initialTools }: { initialTools: Tool[] }) {
  const router = useRouter();
  const [tools, setTools] = useState(initialTools);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Tool | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tools;
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(term) ||
        tool.slug.toLowerCase().includes(term) ||
        (tool.categoryName ?? "").toLowerCase().includes(term),
    );
  }, [tools, search]);

  async function handleToggleFeatured(tool: Tool) {
    // Optimistic update
    setTools((prev) =>
      prev.map((t) => (t.id === tool.id ? { ...t, featured: !t.featured } : t)),
    );
    setTogglingIds((prev) => new Set(prev).add(tool.id));

    try {
      const res = await fetch(`/api/tools/${tool.id}/toggle-featured`, { method: "PATCH" });
      if (!res.ok) {
        // Roll back on failure
        setTools((prev) =>
          prev.map((t) => (t.id === tool.id ? { ...t, featured: tool.featured } : t)),
        );
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Failed to toggle featured status");
      }
    } catch {
      // Roll back on network error
      setTools((prev) =>
        prev.map((t) => (t.id === tool.id ? { ...t, featured: tool.featured } : t)),
      );
      setError("Network error — could not toggle featured status");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(tool.id);
        return next;
      });
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/tools/${pendingDelete.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to delete tool");
        return;
      }
      setTools((prev) => prev.filter((t) => t.id !== pendingDelete.id));
      setPendingDelete(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools…"
          className="pl-9"
        />
      </div>

      {error && !pendingDelete && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-4 font-medium underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-card-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Tool</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Pricing</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((tool) => (
              <tr key={tool.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary">
                      {tool.logoUrl ? (
                        <Image src={tool.logoUrl} alt="" width={32} height={32} className="h-full w-full object-cover" unoptimized />
                      ) : (
                        <span className="text-xs font-semibold text-muted-foreground">
                          {tool.name.slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">/{tool.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{tool.categoryName ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{tool.pricing}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Switch
                    id={`featured-${tool.id}`}
                    checked={tool.featured}
                    onChange={() => handleToggleFeatured(tool)}
                    aria-label={`Toggle featured for ${tool.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {tool.featured && (
                      <Badge variant="accent" className="gap-1">
                        <Star className="h-3 w-3" /> Featured
                      </Badge>
                    )}
                    {tool.trending && (
                      <Badge variant="success" className="gap-1">
                        <TrendingUp className="h-3 w-3" /> Trending
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <Link href={`/dashboard/tools/${tool.id}/edit`}>
                      <Button variant="ghost" size="icon" aria-label={`Edit ${tool.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${tool.name}`}
                      onClick={() => setPendingDelete(tool)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No tools found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Delete AI tool">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong className="text-foreground">{pendingDelete?.name}</strong>? This
          cannot be undone.
        </p>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
