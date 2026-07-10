import { Link } from 'wouter';
import { useListCategories } from '@workspace/api-client-react';
import { CategoryIcon } from '@/lib/category-icons';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutGrid } from 'lucide-react';

export default function Categories() {
  const { data: categories, isLoading } = useListCategories();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2 inline-flex items-center gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5" />
          Browse
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          All Categories
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Explore AI tools grouped by category — writing, coding, image
          generation, productivity, marketing, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading &&
          Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        {categories?.map((category) => (
          <Link
            key={category.slug}
            to={`/categories/${category.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-violet-500/50 hover:bg-muted/40"
          >
            <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CategoryIcon name={category.icon} className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {category.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {category.toolCount} tools
              </p>
            </div>
          </Link>
        ))}
      </div>

      {categories && categories.length === 0 && (
        <div className="text-center py-24 text-muted-foreground">
          No categories yet.
        </div>
      )}
    </div>
  );
}
