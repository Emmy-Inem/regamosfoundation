import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Loader2,
  LayoutDashboard,
  HeartHandshake,
  Users,
  Mail,
  FileText,
  Calendar,
  Sparkles,
  UserCog,
  Settings,
  Plus,
  Minus,
  BarChart3,
  Newspaper,
  Trophy,
  Image as ImageIcon,
  Award,
  MessageSquare,
  Send,
  Download,
  ShieldCheck,
  ScrollText,
  ClipboardList,
  CalendarCheck,
  BookOpen,
} from 'lucide-react';

import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { DonationsManagement } from '@/components/admin/DonationsManagement';
import { MembersManagement } from '@/components/admin/MembersManagement';
import { ContactsManagement } from '@/components/admin/ContactsManagement';
import { NewsletterManagement } from '@/components/admin/NewsletterManagement';
import { BlogManagement } from '@/components/admin/BlogManagement';
import { ProgramsManagement } from '@/components/admin/ProgramsManagement';
import { ImpactStoriesManagement } from '@/components/admin/ImpactStoriesManagement';
import { ImpactStatsManagement } from '@/components/admin/ImpactStatsManagement';
import { SiteContentManagement } from '@/components/admin/SiteContentManagement';
import AchievementsManagement from '@/components/admin/AchievementsManagement';
import UpcomingProgramsManagement from '@/components/admin/UpcomingProgramsManagement';
import TeamMembersManagement from '@/components/admin/TeamMembersManagement';
import TestimonialsManagement from '@/components/admin/TestimonialsManagement';
import { EmailCampaignManagement } from '@/components/admin/EmailCampaignManagement';
import { ExportData } from '@/components/admin/ExportData';
import { EventRegistrationsManagement } from '@/components/admin/EventRegistrationsManagement';
import UserRolesManagement from '@/components/admin/UserRolesManagement';
import ActivityLogViewer from '@/components/admin/ActivityLogViewer';

type ViewKey =
  | 'analytics'
  | 'donations'
  | 'members'
  | 'contacts'
  | 'newsletter'
  | 'blog'
  | 'site-content'
  | 'programs'
  | 'upcoming'
  | 'registrations'
  | 'stories'
  | 'stats'
  | 'achievements'
  | 'team'
  | 'testimonials'
  | 'email-campaigns'
  | 'users'
  | 'activity'
  | 'export';

type Item = { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> };
type Group = { label: string; icon: React.ComponentType<{ className?: string }>; items: Item[] };

const GROUPS: Group[] = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    items: [{ key: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 }],
  },
  {
    label: 'Fundraising',
    icon: HeartHandshake,
    items: [{ key: 'donations', label: 'Donations', icon: HeartHandshake }],
  },
  {
    label: 'Community',
    icon: Users,
    items: [
      { key: 'members', label: 'Members', icon: Users },
      { key: 'contacts', label: 'Contact Messages', icon: MessageSquare },
      { key: 'newsletter', label: 'Newsletter Subscribers', icon: Mail },
    ],
  },
  {
    label: 'Programs & Events',
    icon: Calendar,
    items: [
      { key: 'programs', label: 'All Programs', icon: BookOpen },
      { key: 'upcoming', label: 'Upcoming / Past Events', icon: CalendarCheck },
      { key: 'registrations', label: 'Event Registrations', icon: ClipboardList },
    ],
  },
  {
    label: 'Content',
    icon: FileText,
    items: [
      { key: 'blog', label: 'Blog Posts', icon: Newspaper },
      { key: 'site-content', label: 'Site Content', icon: FileText },
    ],
  },
  {
    label: 'Impact',
    icon: Sparkles,
    items: [
      { key: 'stories', label: 'Impact Stories', icon: ImageIcon },
      { key: 'stats', label: 'Impact Stats', icon: BarChart3 },
      { key: 'achievements', label: 'Achievements', icon: Trophy },
    ],
  },
  {
    label: 'People',
    icon: UserCog,
    items: [
      { key: 'team', label: 'Team Members', icon: UserCog },
      { key: 'testimonials', label: 'Testimonials', icon: Award },
    ],
  },
  {
    label: 'Communications',
    icon: Send,
    items: [{ key: 'email-campaigns', label: 'Email Campaigns', icon: Send }],
  },
  {
    label: 'System',
    icon: Settings,
    items: [
      { key: 'users', label: 'Users & Roles', icon: ShieldCheck },
      { key: 'activity', label: 'Activity Log', icon: ScrollText },
      { key: 'export', label: 'Export Data', icon: Download },
    ],
  },
];

const TITLES: Record<ViewKey, string> = {
  analytics: 'Analytics Dashboard',
  donations: 'Donations',
  members: 'Members',
  contacts: 'Contact Messages',
  newsletter: 'Newsletter Subscribers',
  blog: 'Blog Posts',
  'site-content': 'Site Content',
  programs: 'All Programs',
  upcoming: 'Upcoming / Past Events',
  registrations: 'Event Registrations',
  stories: 'Impact Stories',
  stats: 'Impact Stats',
  achievements: 'Achievements',
  team: 'Team Members',
  testimonials: 'Testimonials',
  'email-campaigns': 'Email Campaigns',
  users: 'Users & Roles',
  activity: 'Activity Log',
  export: 'Export Data',
};

const Admin = () => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewKey>('analytics');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.label, true])),
  );

  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/auth?next=/admin', { replace: true });
    else if (!isAdmin) navigate('/', { replace: true });
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const renderView = () => {
    switch (view) {
      case 'analytics': return <AnalyticsDashboard />;
      case 'donations': return <DonationsManagement />;
      case 'members': return <MembersManagement />;
      case 'contacts': return <ContactsManagement />;
      case 'newsletter': return <NewsletterManagement />;
      case 'blog': return <BlogManagement />;
      case 'site-content': return <SiteContentManagement />;
      case 'programs': return <ProgramsManagement />;
      case 'upcoming': return <UpcomingProgramsManagement />;
      case 'registrations': return <EventRegistrationsManagement />;
      case 'stories': return <ImpactStoriesManagement />;
      case 'stats': return <ImpactStatsManagement />;
      case 'achievements': return <AchievementsManagement />;
      case 'team': return <TeamMembersManagement />;
      case 'testimonials': return <TestimonialsManagement />;
      case 'email-campaigns': return <EmailCampaignManagement />;
      case 'users': return <UserRolesManagement isSuperAdmin={isSuperAdmin} />;
      case 'activity': return <ActivityLogViewer />;
      case 'export': return <ExportData />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <SidebarProvider>
        <div className="flex flex-1 w-full pt-16">
          <Sidebar collapsible="icon" className="border-r">
            <SidebarContent>
              {GROUPS.map((group) => {
                const isOpen = openGroups[group.label] ?? true;
                const GroupIcon = group.icon;
                return (
                  <Collapsible
                    key={group.label}
                    open={isOpen}
                    onOpenChange={(o) => setOpenGroups((p) => ({ ...p, [group.label]: o }))}
                  >
                    <SidebarGroup>
                      <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="flex w-full items-center justify-between hover:text-foreground">
                          <span className="flex items-center gap-2">
                            <GroupIcon className="h-3.5 w-3.5" />
                            {group.label}
                          </span>
                          {isOpen ? (
                            <Minus className="h-3.5 w-3.5" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>
                      <CollapsibleContent>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            {group.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <SidebarMenuItem key={item.key}>
                                  <SidebarMenuButton
                                    onClick={() => setView(item.key)}
                                    isActive={view === item.key}
                                    tooltip={item.label}
                                  >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              );
                            })}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                );
              })}
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 min-w-0 bg-muted/20">
            <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b flex items-center gap-2 px-4 py-3">
              <SidebarTrigger />
              <div>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                <h1 className="text-lg sm:text-xl font-semibold leading-tight">{TITLES[view]}</h1>
              </div>
            </div>
            <div className="p-3 sm:p-6">{renderView()}</div>
          </main>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
};

export default Admin;
