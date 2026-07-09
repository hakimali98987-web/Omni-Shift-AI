import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[72vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/40">
        <Zap className="w-8 h-8 text-white fill-white" />
      </div>
      <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">
        404 — Not Found
      </p>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
        Page not found
      </h1>
      <p className="text-muted-foreground max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button
        asChild
        className="rounded-full px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
      >
        <Link href="/">Back to directory</Link>
      </Button>
    </div>
  );
}
