import { useState } from "react";
import { Link } from "wouter";
import { Tool } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Star } from "lucide-react";

// @replit: badge tones chosen to meet WCAG AA (>=4.5:1) for text-xs on both light and dark surfaces
const PRICING_STYLES: Record<string, string> = {
  Free: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Freemium: "bg-primary/15 text-primary border-primary/30",
  Paid: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
};

export function ToolCard({ tool }: { tool: Tool }) {
  const [logoError, setLogoError] = useState(false);

  return (
    // @replit: single primary interaction is the internal Link (wraps the whole card);
    // the external "Visit" button is a sibling, not nested inside an <a>, so focus/click
    // semantics never conflict and both targets are independently keyboard-reachable.
    <div className="group relative flex flex-col h-full bg-card rounded-2xl border border-border/60 overflow-hidden
        transition-transform duration-300 ease-out
        hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30
        focus-within:-translate-y-1.5 focus-within:shadow-xl focus-within:shadow-primary/10 focus-within:border-primary/30"
    >
      {/* Premium ambient glow + top accent line on hover/focus */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-500 origin-center pointer-events-none" />

      <Link
        href={`/tools/${tool.slug}`}
        className="flex flex-col flex-grow p-5 pb-4 relative z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/50 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
            {tool.logoUrl && !logoError ? (
              <img
                src={tool.logoUrl}
                alt={`${tool.name} logo`}
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-bold text-xl text-muted-foreground">{tool.name.charAt(0)}</span>
            )}
          </div>
          <Badge
            variant="outline"
            className={`font-medium text-xs rounded-full border ${PRICING_STYLES[tool.pricing] ?? "bg-secondary/50 text-secondary-foreground"}`}
          >
            {tool.pricing}
          </Badge>
        </div>

        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{tool.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </Link>

      <div className="relative z-10 px-5 pb-5 pt-4 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-3 min-w-0">
          <Badge
            variant="secondary"
            className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors truncate max-w-[9.5rem]"
          >
            {tool.categoryName}
          </Badge>
          {tool.rating > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              {tool.rating.toFixed(1)}
            </div>
          )}
          {tool.launchYear && (
            <span className="text-xs text-muted-foreground shrink-0">{tool.launchYear}</span>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="h-8 px-3 rounded-full text-xs font-medium gap-1 shrink-0"
          asChild
        >
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
            Visit
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
