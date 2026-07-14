import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  useGetTool,
  useListTools,
  getListToolsQueryKey,
} from "@workspace/api-client-react";
import { ToolCard } from "@/components/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFavorites, useBookmarks } from "@/hooks/use-local-collection";
import {
  ChevronRight,
  ExternalLink,
  Star,
  ArrowLeft,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Bookmark,
  ImageIcon,
  HelpCircle,
} from "lucide-react";

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: tool, isLoading, isError } = useGetTool(slug ?? "");
  const [logoError, setLogoError] = useState(false);
  const { has: isFavorited, toggle: toggleFavorite } = useFavorites();
  const { has: isBookmarked, toggle: toggleBookmark } = useBookmarks();

  const relatedParams = { category: tool?.categorySlug, limit: 7 };
  const { data: relatedData } = useListTools(relatedParams, {
    query: { queryKey: getListToolsQueryKey(relatedParams), enabled: !!tool },
  });

  const relatedTools = relatedData?.items.filter((t) => t.slug !== slug).slice(0, 6);

  const faqs = tool
    ? [
        {
          question: `Is ${tool.name} free to use?`,
          answer:
            tool.pricing === "Free"
              ? `Yes — ${tool.name} is free to use.`
              : tool.pricing === "Freemium"
                ? `${tool.name} offers a free tier with paid plans available for more advanced usage.`
                : `${tool.name} is a paid tool. Check its website for current pricing details.`,
        },
        {
          question: `What category is ${tool.name} in?`,
          answer: `${tool.name} is listed under ${tool.categoryName} on Omni Shift AI.`,
        },
        {
          question: `Does ${tool.name} offer a free trial?`,
          answer:
            tool.pricing === "Paid"
              ? `Many paid tools offer a trial period — check ${tool.name}'s official website for the latest offer.`
              : `${tool.name} has a free tier you can use before considering any paid upgrade.`,
        },
        {
          question: `How do I get started with ${tool.name}?`,
          answer: `Click "Open Website" above to visit ${tool.name}'s official site and create an account to get started.`,
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-40 w-full rounded-xl mb-8" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !tool) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the tool you're looking for.
        </p>
        <Button asChild>
          <Link to="/">Back to directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Directory
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{tool.categoryName}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to directory
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-10">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border/50 shrink-0">
            {tool.logoUrl && !logoError ? (
              <img
                src={tool.logoUrl}
                alt={`${tool.name} logo`}
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-bold text-3xl text-muted-foreground">
                {tool.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {tool.name}
              </h1>
              <Badge
                variant={tool.pricing === "Free" ? "secondary" : "outline"}
                className="font-medium rounded-full"
              >
                {tool.pricing}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              {tool.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to={`/categories/${tool.categorySlug}`}>
                <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  {tool.categoryName}
                </Badge>
              </Link>
              {tool.rating > 0 && (
                <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  {tool.rating.toFixed(1)}
                </div>
              )}
              {tool.launchYear && (
                <span className="text-sm text-muted-foreground">Launched {tool.launchYear}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-4"
              onClick={() => toggleFavorite(tool.slug)}
              aria-pressed={isFavorited(tool.slug)}
              aria-label={isFavorited(tool.slug) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited(tool.slug) ? "fill-rose-500 text-rose-500" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-4"
              onClick={() => toggleBookmark(tool.slug)}
              aria-pressed={isBookmarked(tool.slug)}
              aria-label={isBookmarked(tool.slug) ? "Remove bookmark" : "Bookmark this tool"}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked(tool.slug) ? "fill-violet-600 text-violet-600" : ""}`}
              />
            </Button>
            <Button size="lg" className="rounded-full px-6" asChild>
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                Open Website
                <ExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            </Button>
          </div>
        </div>

        {tool.longDescription && (
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
            <h2 className="text-xl font-semibold mb-3">About {tool.name}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {tool.longDescription}
            </p>
          </div>
        )}

        {(tool.keyFeatures ?? []).length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(tool.keyFeatures ?? []).map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-card px-4 py-3"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {((tool.pros ?? []).length > 0 || (tool.cons ?? []).length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {(tool.pros ?? []).length > 0 && (
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold mb-4 text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                  <ThumbsUp className="w-4 h-4" />
                  Pros
                </h2>
                <ul className="space-y-2.5">
                  {(tool.pros ?? []).map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(tool.cons ?? []).length > 0 && (
              <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold mb-4 text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                  <ThumbsDown className="w-4 h-4" />
                  Cons
                </h2>
                <ul className="space-y-2.5">
                  {(tool.cons ?? []).map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="text-rose-600 dark:text-rose-400 mt-0.5">−</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {(tool.tags ?? []).length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {(tool.tags ?? []).map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Screenshots placeholder — no screenshot assets are available in the
            data model yet, so this reserves the layout slot for future images. */}
        <div className="mb-12">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
            Screenshots
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="aspect-video rounded-xl border border-dashed border-border/70 bg-muted/40 flex flex-col items-center justify-center text-muted-foreground"
              >
                <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
                <span className="text-xs">Screenshot coming soon</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="rounded-xl border border-border/50 bg-card px-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium px-2">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-2 text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {(relatedTools ?? []).length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Related AI Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(relatedTools ?? []).map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
