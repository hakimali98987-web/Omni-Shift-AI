import { ToolCard } from '@/components/tool-card';
import { useBookmarks } from '@/hooks/use-local-collection';
import { useSavedTools } from '@/hooks/use-saved-tools';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark } from 'lucide-react';
import { Link } from 'wouter';

export default function Bookmarks() {
  const { ids } = useBookmarks();
  // Pages through the tools list until every saved slug resolves, so
  // bookmarks outside the first 100 tools still show up as the directory grows.
  const { tools: bookmarkedTools, isLoading, error } = useSavedTools(ids);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2 inline-flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5" />
          Read later
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your Bookmarks</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Tools you've bookmarked to check out later, saved locally in this browser.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-60 rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-24 text-muted-foreground">
          <Bookmark className="w-10 h-10 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg mb-1">Couldn't load your bookmarks</p>
          <p className="text-sm">Please refresh the page to try again.</p>
        </div>
      )}

      {!isLoading && !error && bookmarkedTools.length === 0 && (
        <div className="text-center py-24 text-muted-foreground">
          <Bookmark className="w-10 h-10 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg mb-1">No bookmarks yet</p>
          <p className="text-sm mb-6">
            Open a tool's page and tap "Bookmark" to save it here for later.
          </p>
          <Link
            to="/"
            className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
          >
            Browse all tools
          </Link>
        </div>
      )}

      {!isLoading && !error && bookmarkedTools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {bookmarkedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
