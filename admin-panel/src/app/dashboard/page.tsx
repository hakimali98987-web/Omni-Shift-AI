import { Wrench, FolderKanban, Star, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { getDashboardStats } from "@/lib/data/stats";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const configured = isSupabaseConfigured();
  const stats = configured
    ? await getDashboardStats().catch(() => null)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of the Omni Shift AI directory.</p>
      </div>

      {!configured && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Supabase isn&apos;t connected yet</p>
            <p className="mt-1">
              Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
              <code>.env</code>, then run <code>supabase/schema.sql</code> against your project to enable live data
              and tool management.
            </p>
          </div>
        </div>
      )}

      {configured && !stats && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load stats from Supabase. Check your credentials and that the schema has been applied.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total AI Tools" value={stats?.totalTools ?? 0} icon={Wrench} />
        <StatCard label="Categories" value={stats?.totalCategories ?? 0} icon={FolderKanban} />
        <StatCard label="Featured Tools" value={stats?.featuredTools ?? 0} icon={Star} />
        <StatCard label="Trending Tools" value={stats?.trendingTools ?? 0} icon={TrendingUp} />
      </div>
    </div>
  );
}
