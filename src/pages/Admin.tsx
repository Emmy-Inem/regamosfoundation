import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
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
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  FolderOpen,
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
import MediaLibrary from '@/components/admin/MediaLibrary';
import SiteImagesManagement from '@/components/admin/SiteImagesManagement';

type ViewKey =
  | 'analytics'
  | 'donations'
  | 'members'
  | 'contacts'
  | 'newsletter'
  | 'blog'
  | 'site-content'
  | 'site-images'
  | 'media'
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
      { key: 'site-images', label: 'Site Images', icon: ImageIcon },
      { key: 'media', label: 'Media Library', icon: FolderOpen },
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
  'site-images': 'Site Images',
  media: 'Media Library',
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

const SidebarToggle = () => {
  const { open, toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      className="h-8 w-8"
    >
      {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
    </Button>
  );
};

const Admin = () => {
  const { user, loading, isAdmin, isSuperAdmin, isStaff, can, signOut } = useAuth();
  const navigate = useNavigate();

  const visibleGroups = GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => can(i.key)) }))
    .filter((g) => g.items.length > 0);

  const firstAllowed = visibleGroups[0]?.items[0]?.key;
  const [view, setView] = useState<ViewKey | undefined>(undefined);
  const activeView = view && can(view) ? view : firstAllowed;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(GROUPS.map((g) => [g.label, true])),
  );

  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/auth?next=/admin', { replace: true });
    else if (!isStaff) navigate('/', { replace: true });
  }, [loading, user, isStaff, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !isStaff) return null;

  const renderView = () => {
    if (!activeView) {
      return (
        <div className="rounded-lg border bg-background p-8 text-center">
          <ShieldCheck className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium">No sections available</p>
          <p className="text-sm text-muted-foreground">Your role does not grant access to any admin section yet.</p>
        </div>
      );
    }
    switch (activeView) {
      case 'analytics': return <AnalyticsDashboard />;
      case 'donations': return <DonationsManagement />;
      case 'members': return <MembersManagement />;
      case 'contacts': return <ContactsManagement />;
      case 'newsletter': return <NewsletterManagement />;
      case 'blog': return <BlogManagement />;
      case 'site-content': return <SiteContentManagement />;
      case 'site-images': return <SiteImagesManagement />;
      case 'media': return <MediaLibrary />;
      case 'programs': return <ProgramsManagement />;
      case 'upcoming': return <UpcomingProgramsManagement />;
      case 'registrations': return <EventRegistrationsManagement />;
      case 'stories': return <ImpactStoriesManagement />;
      case 'stats': return <ImpactStatsManagement />;
      case 'achievements': return <AchievementsManagement />;
      case 'team': return <TeamMembersManagement />;
      case 'testimonials': return <TestimonialsManagement />;
      case 'email-campaigns': return <EmailCampaignManagement />;
      case 'users': return <UserRolesManagement isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} />;
      case 'activity': return <ActivityLogViewer />;
      case 'export': return <ExportData />;
    }
  };


  return (
    <>
    <SEOHead
      title="Admin Console"
      description="Private administration console for Regamos Foundation staff."
      url="https://www.regamosfoundation.com.ng/admin"
      noIndex
    />
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="border-b border-sidebar-border p-3">
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <img src={logo} alt="Regamos" className="h-8 w-8 rounded" />
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Regamos</p>
                <p className="text-sm font-semibold text-sidebar-foreground leading-tight">Admin Console</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {visibleGroups.map((group) => {
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
                      <CollapsibleTrigger className="flex w-full items-center justify-between hover:text-sidebar-foreground text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                        <span className="flex items-center gap-2">
                          <GroupIcon className="h-3.5 w-3.5" />
                          {group.label}
                        </span>
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent forceMount className="group-data-[collapsible=icon]:!block data-[state=closed]:hidden">
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <SidebarMenuItem key={item.key}>
                                <SidebarMenuButton
                                  onClick={() => setView(item.key)}
                                  isActive={activeView === item.key}
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
          <SidebarFooter className="border-t border-sidebar-border p-2 gap-1">
            <SidebarMenuButton onClick={() => navigate('/')} tooltip="Return to Website">
              <Home className="h-4 w-4" />
              <span>Return to Website</span>
            </SidebarMenuButton>
            <SidebarMenuButton onClick={() => signOut().then(() => navigate('/'))} tooltip="Sign out">
              <ArrowLeft className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 min-w-0 flex flex-col bg-muted/20">
          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b flex items-center gap-3 px-3 sm:px-4 py-2.5">
            <SidebarToggle />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground leading-none mb-0.5">Admin Dashboard</p>
              <h1 className="text-base sm:text-lg font-semibold leading-tight truncate">{activeView ? TITLES[activeView] : 'Admin'}</h1>
            </div>
          </header>
          <div className="flex-1 p-3 sm:p-6">{renderView()}</div>
        </main>
      </div>
    </SidebarProvider>
    </>
  );
};

export default Admin;
