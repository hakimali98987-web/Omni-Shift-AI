import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Newspaper } from 'lucide-react';

const POSTS = [
  {
    title: 'How to Choose the Right AI Writing Assistant in 2026',
    excerpt:
      'From tone control to team collaboration, here is what actually matters when picking an AI writing tool for your workflow.',
    category: 'Guides',
    date: 'June 18, 2026',
  },
  {
    title: 'The State of AI Image Generation: A 2026 Roundup',
    excerpt:
      'We compare the leading image generators on quality, speed, and pricing so you can pick the right one for your project.',
    category: 'Roundups',
    date: 'May 27, 2026',
  },
  {
    title: '5 AI Coding Assistants That Actually Save You Time',
    excerpt:
      'Autocomplete is table stakes now. These tools go further with full-repo context and agentic workflows.',
    category: 'Coding',
    date: 'May 4, 2026',
  },
  {
    title: 'Free vs. Freemium vs. Paid: Understanding AI Tool Pricing',
    excerpt:
      "A breakdown of common AI pricing models and how to know when it's worth upgrading.",
    category: 'Guides',
    date: 'April 12, 2026',
  },
];

export default function Blog() {
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2 inline-flex items-center gap-1.5">
          <Newspaper className="w-3.5 h-3.5" />
          Blog
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          News, guides &amp; roundups
        </h1>
        <p className="text-muted-foreground">
          Practical writing on AI tools, workflows, and what's worth trying next.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {POSTS.map((post) => (
          <article
            key={post.title}
            className="group flex flex-col rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className="rounded-full">
                {post.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{post.date}</span>
            </div>
            <h2 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
              {post.excerpt}
            </p>
            <button
              type="button"
              onClick={() =>
                toast({
                  title: 'Coming soon',
                  description: 'Full articles are on the way — check back soon.',
                })
              }
              className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Read more <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
