'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useListCategories,
  useListTools,
  type PricingType,
} from "@workspace/api-client-react";
import { ToolCard } from "@/components/tool-card";
import { CategoryIcon } from "@/lib/category-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ChevronLeft } from "lucide-react";

const PAGE_SIZE = 12;

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [pricing, setPricing] = useState<PricingType | undefined>(undefined);
  const [sort, setSort] = useState<"popular" | "newest" | "name">("popular");
  const [page, setPage] = useState(1);

  const { data: categories, isLoading: categoriesLoading } = useListCategories();
  const category = categories?.find((c) => c.slug === slug);

  const { data: toolsData, isLoading: toolsLoading } = useListTools({
    category: slug,
    pricing,
    sort,
    page,
    limit: PAGE_SIZE,
  });

  const totalPages = toolsData
    ? Math.max(1, Math.ceil(toolsData.total / toolsData.limit))
    : 1;

  if (!categoriesLoading && !category) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <Button asChild>
          <Link href="/">Back to directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Directory
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">
              {category?.name ?? "…"}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-4">
          {category && (
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CategoryIcon name={category.icon} className="w-7 h-7" />
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {category?.name ?? <Skeleton className="h-9 w-48" />}
            </h1>
            {category && (
              <p className="text-muted-foreground mt-1">
                {toolsData?.total ?? category.toolCount} tools
              </p>
            )}
          </div>
        </div>

        {category?.description && (
          <p className="text-muted-foreground max-w-2xl mb-10">
            {category.description}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 mb-8">
          <Select
            value={pricing ?? "all"}
            onValueChange={(v) => {
              setPricing(v === "all" ? undefined : (v as PricingType));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Pricing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All pricing</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Freemium">Freemium</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v as typeof sort);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Top rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {toolsLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          {toolsData?.items.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {toolsData && toolsData.items.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No tools in this category match your filters yet.
          </div>
        )}

        {toolsData && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
