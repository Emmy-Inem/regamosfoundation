import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, Users, Mail, Heart, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b", "#8b5cf6"];

export const AnalyticsDashboard = () => {
  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ["analytics-donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["analytics-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("joined_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: newsletters, isLoading: newslettersLoading } = useQuery({
    queryKey: ["analytics-newsletters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .order("subscribed_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const isLoading = donationsLoading || membersLoading || newslettersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Calculate summary stats
  const totalDonations = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
  const completedDonations = donations?.filter((d) => d.payment_status === "completed") || [];
  const totalCompletedAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalMembers = members?.length || 0;
  const totalSubscribers = newsletters?.length || 0;
  const approvedMembers = members?.filter((m) => m.status === "approved").length || 0;

  // Process donation data for charts (last 30 days)
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const donationsByDay = last30Days.map((date) => {
    const dayDonations = donations?.filter((d) => {
      const donationDate = parseISO(d.created_at);
      return format(donationDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    }) || [];
    
    return {
      date: format(date, "MMM dd"),
      amount: dayDonations.reduce((sum, d) => sum + d.amount, 0),
      count: dayDonations.length,
    };
  });

  // Member growth data
  const membersByMonth: Record<string, number> = {};
  members?.forEach((m) => {
    const month = format(parseISO(m.joined_at), "MMM yyyy");
    membersByMonth[month] = (membersByMonth[month] || 0) + 1;
  });
  
  const memberGrowthData = Object.entries(membersByMonth)
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  // Donation status breakdown
  const statusBreakdown = [
    { name: "Completed", value: completedDonations.length, color: COLORS[0] },
    { name: "Pending", value: donations?.filter((d) => d.payment_status === "pending").length || 0, color: COLORS[1] },
    { name: "Failed", value: donations?.filter((d) => d.payment_status === "failed").length || 0, color: COLORS[3] },
  ].filter((s) => s.value > 0);

  // Membership type breakdown
  const membershipTypes = members?.reduce((acc: Record<string, number>, m) => {
    acc[m.membership_type] = (acc[m.membership_type] || 0) + 1;
    return acc;
  }, {}) || {};

  const membershipData = Object.entries(membershipTypes).map(([type, count], i) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {donations?.length || 0} total transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Donations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalCompletedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {completedDonations.length} successful payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {approvedMembers} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              Active email list
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Donations Over Time */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Donations Over Last 30 Days</CardTitle>
            <CardDescription>Daily donation amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationsByDay}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₦${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, "Amount"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Member Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
            <CardDescription>New members by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Status</CardTitle>
            <CardDescription>Payment status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {statusBreakdown.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
