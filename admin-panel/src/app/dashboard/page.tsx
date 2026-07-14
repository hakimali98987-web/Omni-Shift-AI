import { Wrench, FolderKanban, Star, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { getDashboardStats } from "@/lib/data/stats";

export default async function DashboardPage() {
  const stats = await getDashboardStats().catch(() => null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of the Omni Shift AI directory.</p>
      </div>

      {!stats && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load stats. Check that the API server is reachable and NEXT_PUBLIC_API_URL is set correctly.
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
