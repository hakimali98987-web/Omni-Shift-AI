import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Tool } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";

export function ToolCard({ tool }: { tool: Tool }) {
  const [, navigate] = useLocation();
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/tools/${tool.slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/tools/${tool.slug}`);
      }}
      className="group relative flex flex-col h-full bg-card rounded-xl border border-border/50 p-5 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/50">
          {tool.logoUrl && !logoError ? (
            <img
              src={tool.logoUrl}
              alt={`${tool.name} logo`}
              className="w-full h-full object-cover"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="font-bold text-lg text-muted-foreground">{tool.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={tool.pricing === "Free" ? "secondary" : "outline"} className="font-medium text-xs rounded-full">
            {tool.pricing}
          </Badge>
        </div>
      </div>

      <div className="relative z-10 flex-grow">
        <Link href={`/tools/${tool.slug}`} onClick={(e) => e.stopPropagation()}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{tool.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-4 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors">
            {tool.categoryName}
          </Badge>
          {tool.rating > 0 && (
            <div className="flex items-center text-xs font-medium text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current mr-1" />
              {tool.rating.toFixed(1)}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-2 text-primary"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
