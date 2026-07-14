import { useEffect, useState } from 'react';
import { listTools, type Tool } from '@workspace/api-client-react';

/**
 * Resolves a set of saved tool slugs (favorites/bookmarks) to full Tool
 * records by paging through the tools list until every slug is found or
 * there are no more pages. The list endpoint caps `limit` at 100, so a
 * directory with more than 100 tools needs more than one request to
 * guarantee saved items outside the first page still resolve.
 */
export function useSavedTools(ids: string[]) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const idsKey = [...ids].sort().join(',');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (ids.length === 0) {
        if (!cancelled) {
          setTools([]);
          setError(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      const found: Tool[] = [];
      const remaining = new Set(ids);
      let page = 1;
      const limit = 100;

      try {
        while (remaining.size > 0) {
          const result = await listTools({ page, limit, sort: 'name' });
          for (const tool of (result.items ?? [])) {
            if (remaining.has(tool.slug)) {
              found.push(tool);
              remaining.delete(tool.slug);
            }
          }
          const fetchedSoFar = page * limit;
          if (fetchedSoFar >= result.total || (result.items ?? []).length === 0) break;
          page += 1;
        }
        if (!cancelled) {
          setTools(found);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load saved tools'));
          setTools(found);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return { tools, isLoading, error };
}
