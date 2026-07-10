import { useListTools } from '@workspace/api-client-react';
import { ToolCard } from '@/components/tool-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

export default function NewTools() {
  const { data, isLoading } = useListTools({ sort: 'newest', limit: 24, page: 1 });

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Fresh arrivals
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">New AI Tools</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          The latest AI tools added to the directory, sorted by launch date.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-60 rounded-2xl" />
          ))}
        {data?.items.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
      </div>

      {data && data.items.length === 0 && (
        <div className="text-center py-24 text-muted-foreground">
          <p className="font-medium text-lg mb-1">No new tools yet</p>
          <p className="text-sm">Check back soon for the latest additions.</p>
        </div>
      )}
    </div>
  );
}
