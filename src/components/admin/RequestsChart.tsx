import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

const chartConfig: ChartConfig = {
  requests: {
    label: "Demandes",
    color: "hsl(var(--primary))",
  },
};

interface ChartDataPoint {
  date: string;
  displayDate: string;
  requests: number;
}

export function RequestsChart() {
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["sample-requests-chart"],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 29);
      
      const { data, error } = await supabase
        .from("sample_requests")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString());
      
      if (error) throw error;
      return data || [];
    },
  });

  const { chartData, total } = useMemo(() => {
    // Generate all days of the last 30 days
    const days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    // Group requests by date
    const groupedByDate: Record<string, number> = {};
    requestsData?.forEach((item) => {
      const dateKey = format(new Date(item.created_at), "yyyy-MM-dd");
      groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + 1;
    });

    // Map with actual data
    const chartData: ChartDataPoint[] = days.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      return {
        date: dateKey,
        displayDate: format(day, "dd MMM", { locale: fr }),
        requests: groupedByDate[dateKey] || 0,
      };
    });

    const total = requestsData?.length || 0;

    return { chartData, total };
  }, [requestsData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Évolution des demandes
            </CardTitle>
            <CardDescription>Ces 30 derniers jours</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{total}</p>
            <p className="text-xs text-muted-foreground">demandes</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#fillRequests)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
