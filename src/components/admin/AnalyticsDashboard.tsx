import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, TrendingUp, Users, Mail, Heart, DollarSign, FileText, Eye,
  MessageSquare, CalendarCheck, UserCheck, Repeat, Award, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { format, subDays, eachDayOfInterval, parseISO, differenceInDays } from "date-fns";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

const useTable = (name: string, orderCol: string) =>
  useQuery({
    queryKey: [`analytics-${name}`],
    queryFn: async () => {
      const { data, error } = await supabase.from(name as any).select("*").order(orderCol, { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  accent?: string;
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, accent }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
      <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${accent ?? "text-muted-foreground"}`} />
    </CardHeader>
    <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
      <div className="text-lg sm:text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</p>}
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] sm:text-xs mt-1 ${trend.value >= 0 ? "text-emerald-600" : "text-red-600"}`}>
          {trend.value >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(trend.value)}% {trend.label}
        </div>
      )}
    </CardContent>
  </Card>
);

const chartTooltipStyle = {
  backgroundColor: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

export const AnalyticsDashboard = () => {
  const donationsQ = useTable("donations", "created_at");
  const membersQ = useTable("members", "joined_at");
  const newslettersQ = useTable("newsletter_subscriptions", "subscribed_at");
  const postsQ = useTable("blog_posts", "created_at");
  const contactsQ = useTable("contact_submissions", "created_at");
  const registrationsQ = useTable("event_registrations", "created_at");
  const programsQ = useTable("upcoming_programs", "created_at");

  const isLoading = [donationsQ, membersQ, newslettersQ, postsQ, contactsQ, registrationsQ, programsQ]
    .some((q) => q.isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const donations = donationsQ.data ?? [];
  const members = membersQ.data ?? [];
  const newsletters = newslettersQ.data ?? [];
  const posts = postsQ.data ?? [];
  const contacts = contactsQ.data ?? [];
  const registrations = registrationsQ.data ?? [];
  const programs = programsQ.data ?? [];

  // === DONATION METRICS ===
  const completed = donations.filter((d) => d.payment_status === "completed");
  const totalRaised = completed.reduce((s, d) => s + Number(d.amount), 0);
  const avgDonation = completed.length ? totalRaised / completed.length : 0;
  const recurringCount = donations.filter((d) => d.frequency && d.frequency !== "one-time").length;
  const uniqueDonors = new Set(donations.map((d) => d.email)).size;

  // period comparison (last 30 vs prior 30)
  const now = new Date();
  const in30 = (d: string) => differenceInDays(now, parseISO(d)) <= 30;
  const in60 = (d: string) => {
    const days = differenceInDays(now, parseISO(d));
    return days > 30 && days <= 60;
  };
  const raised30 = completed.filter((d) => in30(d.created_at)).reduce((s, d) => s + Number(d.amount), 0);
  const raised60 = completed.filter((d) => in60(d.created_at)).reduce((s, d) => s + Number(d.amount), 0);
  const raisedTrend = raised60 > 0 ? Math.round(((raised30 - raised60) / raised60) * 100) : 0;

  const members30 = members.filter((m) => in30(m.joined_at)).length;
  const members60 = members.filter((m) => in60(m.joined_at)).length;
  const memberTrend = members60 > 0 ? Math.round(((members30 - members60) / members60) * 100) : 0;

  // Daily donations & registrations, last 30 days
  const last30 = eachDayOfInterval({ start: subDays(now, 29), end: now });
  const timeSeries = last30.map((date) => {
    const key = format(date, "yyyy-MM-dd");
    const dayDon = completed.filter((d) => format(parseISO(d.created_at), "yyyy-MM-dd") === key);
    const dayReg = registrations.filter((r) => format(parseISO(r.created_at), "yyyy-MM-dd") === key);
    const daySub = newsletters.filter((n) => format(parseISO(n.subscribed_at), "yyyy-MM-dd") === key);
    return {
      date: format(date, "MMM dd"),
      amount: dayDon.reduce((s, d) => s + Number(d.amount), 0),
      donations: dayDon.length,
      registrations: dayReg.length,
      subscribers: daySub.length,
    };
  });

  // Donation status
  const statusBreakdown = [
    { name: "Completed", value: completed.length, color: COLORS[2] },
    { name: "Pending", value: donations.filter((d) => d.payment_status === "pending").length, color: COLORS[3] },
    { name: "Failed", value: donations.filter((d) => d.payment_status === "failed").length, color: COLORS[5] },
  ].filter((s) => s.value > 0);

  // Payment method breakdown
  const paymentMethods = donations.reduce((acc: Record<string, number>, d) => {
    const k = d.payment_method || "unknown";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const paymentMethodData = Object.entries(paymentMethods).map(([name, value], i) => ({
    name, value, color: COLORS[i % COLORS.length],
  }));

  // Top donors
  const donorTotals: Record<string, { name: string; total: number; count: number }> = {};
  completed.forEach((d) => {
    if (!donorTotals[d.email]) donorTotals[d.email] = { name: d.donor_name, total: 0, count: 0 };
    donorTotals[d.email].total += Number(d.amount);
    donorTotals[d.email].count += 1;
  });
  const topDonors = Object.values(donorTotals).sort((a, b) => b.total - a.total).slice(0, 5);

  // === MEMBER METRICS ===
  const approvedMembers = members.filter((m) => m.status === "approved").length;
  const pendingMembers = members.filter((m) => m.status === "pending").length;

  const membershipTypes = members.reduce((acc: Record<string, number>, m) => {
    acc[m.membership_type] = (acc[m.membership_type] || 0) + 1;
    return acc;
  }, {});
  const membershipData = Object.entries(membershipTypes).map(([name, value], i) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), value, color: COLORS[i % COLORS.length],
  }));

  // Cumulative member growth (last 30 days)
  const cumulativeMembers = last30.map((date) => {
    const count = members.filter((m) => parseISO(m.joined_at) <= date).length;
    return { date: format(date, "MMM dd"), members: count };
  });

  // === CONTENT METRICS ===
  const totalViews = posts.reduce((s, p) => s + (p.view_count || 0), 0);
  const publishedPosts = posts.filter((p) => p.published_at).length;
  const topPosts = [...posts]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5)
    .map((p) => ({ title: p.title.length > 30 ? p.title.slice(0, 30) + "…" : p.title, views: p.view_count || 0 }));

  const postsByCategory = posts.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(postsByCategory).map(([name, value], i) => ({
    name, value, color: COLORS[i % COLORS.length],
  }));

  // === EVENT METRICS ===
  const activePrograms = programs.filter((p) => p.status === "upcoming" || p.status === "ongoing").length;
  const registrationsPerProgram: Record<string, number> = {};
  registrations.forEach((r) => {
    registrationsPerProgram[r.program_id] = (registrationsPerProgram[r.program_id] || 0) + 1;
  });
  const eventRegData = programs
    .map((p) => ({
      name: p.title.length > 20 ? p.title.slice(0, 20) + "…" : p.title,
      registrations: registrationsPerProgram[p.id] || 0,
    }))
    .filter((e) => e.registrations > 0)
    .sort((a, b) => b.registrations - a.registrations)
    .slice(0, 6);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HERO METRICS */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Raised"
          value={`₦${totalRaised.toLocaleString()}`}
          subtitle={`${completed.length} completed payments`}
          icon={DollarSign}
          trend={raised60 > 0 ? { value: raisedTrend, label: "vs prev 30d" } : undefined}
          accent="text-emerald-600"
        />
        <StatCard
          title="Unique Donors"
          value={uniqueDonors}
          subtitle={`Avg ₦${Math.round(avgDonation).toLocaleString()}/gift`}
          icon={Heart}
          accent="text-rose-500"
        />
        <StatCard
          title="Members"
          value={members.length}
          subtitle={`${approvedMembers} approved · ${pendingMembers} pending`}
          icon={Users}
          trend={members60 > 0 ? { value: memberTrend, label: "vs prev 30d" } : undefined}
          accent="text-blue-500"
        />
        <StatCard
          title="Subscribers"
          value={newsletters.length}
          subtitle="Newsletter list"
          icon={Mail}
          accent="text-violet-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Blog Posts" value={publishedPosts} subtitle={`${totalViews.toLocaleString()} total views`} icon={FileText} accent="text-amber-500" />
        <StatCard title="Event Signups" value={registrations.length} subtitle={`${activePrograms} active programs`} icon={CalendarCheck} accent="text-cyan-500" />
        <StatCard title="Contact Messages" value={contacts.length} subtitle="Total submissions" icon={MessageSquare} accent="text-primary" />
        <StatCard title="Recurring Gifts" value={recurringCount} subtitle="Monthly / quarterly / annual" icon={Repeat} accent="text-accent" />
      </div>

      {/* TABS */}
      <Tabs defaultValue="fundraising" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="fundraising">Fundraising</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        {/* FUNDRAISING */}
        <TabsContent value="fundraising" className="space-y-4 sm:space-y-6 mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Donations · Last 30 Days</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Daily raised amount and gift count</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="h-[240px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries}>
                    <defs>
                      <linearGradient id="gAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(v) => `₦${v / 1000}k`} width={45} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`₦${v.toLocaleString()}`, "Amount"]} />
                    <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="url(#gAmount)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-sm sm:text-base">Payment Status</CardTitle>
                <CardDescription className="text-xs sm:text-sm">All-time breakdown</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                        {statusBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-sm sm:text-base">Payment Methods</CardTitle>
                <CardDescription className="text-xs sm:text-sm">How donors are paying</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentMethodData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={80} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2"><Award className="h-4 w-4 text-accent" /> Top Donors</CardTitle>
              <CardDescription className="text-xs sm:text-sm">By lifetime contribution</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              {topDonors.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No completed donations yet.</p>
              ) : (
                <ol className="space-y-2">
                  {topDonors.map((d, i) => (
                    <li key={i} className="flex items-center justify-between p-2 sm:p-3 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Badge variant="secondary" className="shrink-0">#{i + 1}</Badge>
                        <span className="font-medium text-sm truncate">{d.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{d.count} gift{d.count > 1 ? "s" : ""}</span>
                      </div>
                      <span className="font-semibold text-sm sm:text-base text-primary shrink-0">₦{d.total.toLocaleString()}</span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMMUNITY */}
        <TabsContent value="community" className="space-y-4 sm:space-y-6 mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Member Growth</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Cumulative membership over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="h-[240px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cumulativeMembers}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={30} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Line type="monotone" dataKey="members" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-sm sm:text-base">Membership Types</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Distribution</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={membershipData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {membershipData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-sm sm:text-base">Newsletter Signups · 30d</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Daily new subscribers</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={25} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="subscribers" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2"><UserCheck className="h-4 w-4" /> Member Approval Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600">{approvedMembers}</div>
                  <div className="text-xs text-muted-foreground">Approved</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <div className="text-xl sm:text-2xl font-bold text-amber-600">{pendingMembers}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="text-xl sm:text-2xl font-bold">{members.length - approvedMembers - pendingMembers}</div>
                  <div className="text-xs text-muted-foreground">Other</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENT */}
        <TabsContent value="content" className="space-y-4 sm:space-y-6 mt-4">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2"><Eye className="h-4 w-4" /> Top Blog Posts</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Most viewed</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topPosts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <YAxis type="category" dataKey="title" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={110} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-sm sm:text-base">Posts by Category</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Content mix</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                        {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard title="Total Posts" value={posts.length} subtitle={`${publishedPosts} published`} icon={FileText} />
            <StatCard title="Total Views" value={totalViews.toLocaleString()} subtitle="Lifetime" icon={Eye} />
            <StatCard
              title="Avg Views / Post"
              value={publishedPosts ? Math.round(totalViews / publishedPosts).toLocaleString() : 0}
              subtitle="Engagement"
              icon={TrendingUp}
            />
          </div>
        </TabsContent>

        {/* EVENTS */}
        <TabsContent value="events" className="space-y-4 sm:space-y-6 mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Registrations · Last 30 Days</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Daily event signups</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="h-[240px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries}>
                    <defs>
                      <linearGradient id="gReg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={25} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area type="monotone" dataKey="registrations" stroke="hsl(var(--accent))" fill="url(#gReg)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Registrations per Program</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Most popular events</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              {eventRegData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No event registrations yet.</p>
              ) : (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eventRegData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={130} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="registrations" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
