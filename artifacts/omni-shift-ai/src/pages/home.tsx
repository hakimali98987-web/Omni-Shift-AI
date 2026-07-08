import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  useListCategories,
  useListTools,
  useListFeaturedTools,
  useGetDirectoryStats,
  type PricingType,
} from "@workspace/api-client-react";
import { SEO } from "@/components/seo";
import { ToolCard } from "@/components/tool-card";
import { CategoryIcon } from "@/lib/category-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

export default function Home() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [pricing, setPricing] = useState<PricingType | undefined>(undefined);
  const [sort, setSort] = useState<"popular" | "newest" | "name">("popular");
  const [page, setPage] = useState(1);

  const { data: categories, isLoading: categoriesLoading } = useListCategories();
  const { data: featured, isLoading: featuredLoading } = useListFeaturedTools();
  const { data: stats } = useGetDirectoryStats();

  const { data: toolsData, isLoading: toolsLoading } = useListTools({
    search: search || undefined,
    category,
    pricing,
    sort,
    page,
    limit: PAGE_SIZE,
  });

  const totalPages = useMemo(() => {
    if (!toolsData) return 1;
    return Math.max(1, Math.ceil(toolsData.total / toolsData.limit));
  }, [toolsData]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function selectCategory(slug: string | undefined) {
    setCategory(slug);
    setPage(1);
  }

  return (
    <div>
      <SEO
        title="Discover the Best AI Tools"
        description="Omni Shift AI is a modern directory of AI tools — browse, search, and compare thousands of AI apps by category and pricing."
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div
          className="absolute -top-24 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-40"
          aria-hidden
        />
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-28 text-center">
          <Badge
            variant="secondary"
            className="mb-6 rounded-full px-4 py-1.5 text-sm font-medium gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {stats ? `${stats.totalTools}+ AI tools indexed` : "The AI tools directory"}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Find the perfect{" "}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              AI tool
            </span>{" "}
            for any task
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Browse a fast, curated directory of AI apps for writing, image and
            video generation, coding, productivity, and more.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search ChatGPT, Midjourney, video editors…"
                className="h-12 pl-10 rounded-full text-base"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 rounded-full px-6">
              Search
            </Button>
          </form>

          {stats && (
            <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-4">
              <Stat label="AI Tools" value={stats.totalTools} />
              <Stat label="Categories" value={stats.totalCategories} />
              <Stat label="Free Tools" value={stats.freeTools} />
              <Stat label="Freemium" value={stats.freemiumTools} />
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Browse by category
            </h2>
            <p className="text-muted-foreground">
              Explore tools grouped by what you're trying to get done.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesLoading &&
            Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          {categories?.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => selectCategory(cat.slug)}
              className={`group flex flex-col items-center justify-center gap-2 rounded-xl border p-5 text-center transition-all hover:shadow-md hover:-translate-y-0.5 ${
                category === cat.slug
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-card hover:border-border"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <CategoryIcon name={cat.icon} className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium leading-tight">
                {cat.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {cat.toolCount} tools
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      {(featuredLoading || (featured && featured.length > 0)) && (
        <section className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Featured tools
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-xl" />
              ))}
            {featured?.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* All tools */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {category
                ? categories?.find((c) => c.slug === category)?.name ??
                  "All tools"
                : "All tools"}
            </h2>
            <p className="text-muted-foreground">
              {toolsData ? `${toolsData.total} tools found` : "Loading…"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {category && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectCategory(undefined)}
              >
                Clear category
              </Button>
            )}
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
            No tools match your filters yet. Try a different search or
            category.
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
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Building an AI tool?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Get discovered by thousands of people looking for tools like
            yours.
          </p>
          <Button size="lg" className="rounded-full px-8">
            Submit your tool
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold tracking-tight">
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
