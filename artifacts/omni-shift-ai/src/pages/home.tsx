import { useEffect, useMemo, useState } from "react";
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
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";

const PAGE_SIZE = 12;

const CATEGORY_GRADIENTS = [
  "from-violet-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-purple-500 to-violet-500",
  "from-sky-500 to-blue-500",
  "from-green-500 to-emerald-500",
  "from-red-500 to-orange-500",
  "from-fuchsia-500 to-pink-500",
  "from-indigo-500 to-blue-500",
  "from-teal-500 to-cyan-500",
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [pricing, setPricing] = useState<PricingType | undefined>(undefined);
  const [sort, setSort] = useState<"popular" | "newest" | "name">("popular");
  const [page, setPage] = useState(1);

  // Debounce the raw input so results update instantly while typing
  // without firing a request on every keystroke.
  const isDebouncing = searchInput !== search;
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 250);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { data: categories, isLoading: categoriesLoading } = useListCategories();
  const { data: featured, isLoading: featuredLoading } = useListFeaturedTools();
  const { data: stats } = useGetDirectoryStats();

  const { data: toolsData, isLoading: toolsLoading, isFetching: toolsFetching } = useListTools({
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
    // Results already update live as the user types (debounced above);
    // submitting just applies immediately, e.g. on Enter.
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function selectCategory(slug: string | undefined) {
    setCategory(slug);
    setPage(1);
    if (slug) {
      document
        .getElementById("tools-grid")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div>
      <SEO
        title="Discover the Best AI Tools"
        description="Omni Shift AI is a modern directory of AI tools — browse, search, and compare thousands of AI apps by category and pricing."
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-50/80 via-white to-white dark:from-violet-950/30 dark:via-background dark:to-background" />
        <div
          className="absolute -top-40 left-1/2 -z-10 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-400/20 to-indigo-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute top-20 -left-32 -z-10 h-[400px] w-[400px] rounded-full bg-pink-400/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute top-10 -right-32 -z-10 h-[350px] w-[350px] rounded-full bg-blue-400/10 blur-3xl"
          aria-hidden
        />

        <div className="container mx-auto px-4 md:px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 px-4 py-1.5 text-sm font-medium text-violet-700 dark:text-violet-300 mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {stats
              ? `${stats.totalTools}+ AI tools and counting`
              : "The AI tools directory"}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-balance">
            Discover the Best{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              AI Tools
            </span>
            <br />
            in One Place
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            Explore thousands of AI tools for writing, coding, image generation,
            video creation, productivity, marketing and more.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="relative flex items-center shadow-xl shadow-violet-100/50 dark:shadow-violet-950/30 rounded-2xl overflow-hidden border border-border/60 bg-background">
              <Search className="absolute left-5 h-5 w-5 text-muted-foreground pointer-events-none shrink-0" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by tool name, category, or tag…"
                className="flex-1 h-14 pl-14 pr-4 text-base border-0 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/60"
              />
              {(isDebouncing || toolsFetching) && searchInput && (
                <span
                  className="absolute right-[6.5rem] h-4 w-4 shrink-0 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin"
                  role="status"
                  aria-label="Searching"
                />
              )}
              <div className="pr-2 shrink-0">
                <Button
                  type="submit"
                  size="lg"
                  className="h-10 rounded-xl px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 font-semibold"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Quick filters */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Writing", "Coding", "Image Generation", "Video", "Productivity", "Marketing"].map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchInput(tag);
                      setSearch(tag);
                      setPage(1);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-border/60 bg-background/80 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </form>

          {/* Stats row */}
          {stats && (
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mt-4">
              <StatBadge label="AI Tools" value={stats.totalTools} icon={<TrendingUp className="w-3.5 h-3.5" />} />
              <StatBadge label="Categories" value={stats.totalCategories} icon={<Sparkles className="w-3.5 h-3.5" />} />
              <StatBadge label="Free Tools" value={stats.freeTools} icon={<Star className="w-3.5 h-3.5" />} />
              <StatBadge label="Freemium" value={stats.freemiumTools} icon={<Star className="w-3.5 h-3.5" />} />
            </div>
          )}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">
              Browse by category
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Find tools for every use case
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Explore curated categories and discover the right AI tools for
              your workflow.
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categoriesLoading &&
            Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          {categories?.map((cat, i) => {
            const gradient = CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length];
            const active = category === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() =>
                  selectCategory(active ? undefined : cat.slug)
                }
                className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-5 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  active
                    ? "border-violet-500/50 bg-violet-50 dark:bg-violet-950/40 shadow-md shadow-violet-100 dark:shadow-violet-900/20"
                    : "border-border/50 bg-card hover:border-border hover:shadow-black/5"
                }`}
              >
                {/* Icon bubble */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}
                >
                  <CategoryIcon name={cat.icon} className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold leading-tight line-clamp-2">
                  {cat.name}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                >
                  {cat.toolCount} tools
                </Badge>

                {active && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Featured ── */}
      {(featuredLoading || (featured && featured.length > 0)) && (
        <section className="bg-muted/30 border-y border-border/40 py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">
                  Editor's picks
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Featured tools
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-60 rounded-2xl" />
                ))}
              {featured?.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All tools grid ── */}
      <section
        id="tools-grid"
        className="container mx-auto px-4 md:px-6 py-16 md:py-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">
              {category
                ? categories?.find((c) => c.slug === category)?.name ?? "Tools"
                : "All tools"}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {category
                ? categories?.find((c) => c.slug === category)?.name ?? "All tools"
                : "Browse all AI tools"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {toolsData ? `${toolsData.total} tools found` : "Loading…"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {category && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectCategory(undefined)}
                className="rounded-full"
              >
                Clear filter ✕
              </Button>
            )}
            <Select
              value={pricing ?? "all"}
              onValueChange={(v) => {
                setPricing(v === "all" ? undefined : (v as PricingType));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] rounded-full">
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
              <SelectTrigger className="w-[150px] rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most popular</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {toolsLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-60 rounded-2xl" />
            ))}
          {toolsData?.items.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {toolsData && toolsData.items.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-lg mb-1">No tools found</p>
            <p className="text-sm">Try a different tool name, category, or tag.</p>
          </div>
        )}

        {toolsData && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-14">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="mx-4 md:mx-auto md:container mb-16 md:mb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-8 py-16 md:py-20 text-center text-white shadow-2xl shadow-violet-200 dark:shadow-violet-900/30">
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4 relative">
            Building an AI tool?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-base md:text-lg relative">
            Get discovered by thousands of people looking for tools just like
            yours. Submit your tool and reach your audience today.
          </p>
          <Button
            size="lg"
            className="rounded-full px-10 bg-white text-violet-700 hover:bg-white/90 font-bold shadow-lg relative"
          >
            Submit your tool
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function StatBadge({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-center">
      <div className="flex items-center gap-1.5 bg-muted/60 border border-border/50 rounded-full px-4 py-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="font-bold text-foreground">{value.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
