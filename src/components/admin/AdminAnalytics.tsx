import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, Building2, Star } from "lucide-react";
import type { Business, Category } from "@/types/business";

interface AdminAnalyticsProps {
  businesses: Business[];
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#6366f1",
];

const AdminAnalytics = ({ businesses }: AdminAnalyticsProps) => {
  const stats = useMemo(() => {
    const totalViews = businesses.reduce((sum, b) => sum + (b.views || 0), 0);
    const featuredCount = businesses.filter((b) => b.featured).length;
    const avgRating =
      businesses.filter((b) => b.googleRating || b.tripadvisorRating).length > 0
        ? businesses.reduce((sum, b) => {
            const rating = b.googleRating || b.tripadvisorRating || 0;
            return sum + rating;
          }, 0) / businesses.filter((b) => b.googleRating || b.tripadvisorRating).length
        : 0;

    return { totalViews, featuredCount, avgRating };
  }, [businesses]);

  const topBusinesses = useMemo(() => {
    return [...businesses]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((b) => ({
        name: b.name.length > 20 ? b.name.substring(0, 20) + "…" : b.name,
        views: b.views || 0,
      }));
  }, [businesses]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    businesses.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [businesses]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Businesses</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{businesses.length}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Total Views</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-sm text-muted-foreground">Featured</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.featuredCount}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Avg Rating</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "–"}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Businesses */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Top Businesses by Views</h3>
          <div className="h-64">
            {topBusinesses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBusinesses} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Category Distribution</h3>
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
