import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Admin management components
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

const Admin = () => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/auth?next=/admin', { replace: true });
    } else if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-16 sm:py-20">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="analytics" className="space-y-3 sm:space-y-4">
          <div className="overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-max min-w-full h-auto flex-wrap sm:flex-nowrap gap-1 p-1 bg-muted/50">
              <TabsTrigger value="analytics" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5">Analytics</TabsTrigger>
              <TabsTrigger value="data" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5">Data</TabsTrigger>
              <TabsTrigger value="blog" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5">Blog</TabsTrigger>
              <TabsTrigger value="programs" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5">Programs</TabsTrigger>
              <TabsTrigger value="impact" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5">Impact</TabsTrigger>
              <TabsTrigger value="people" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5">People</TabsTrigger>
              <TabsTrigger value="content" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5">Content</TabsTrigger>
              <TabsTrigger value="system" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5">System</TabsTrigger>
            </TabsList>
          </div>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Data Tab - Donations, Members, Contacts, Newsletter */}
          <TabsContent value="data">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue="donations" className="space-y-4">
                  <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                    <TabsTrigger value="donations" className="text-xs sm:text-sm">Donations</TabsTrigger>
                    <TabsTrigger value="members" className="text-xs sm:text-sm">Members</TabsTrigger>
                    <TabsTrigger value="contacts" className="text-xs sm:text-sm">Contacts</TabsTrigger>
                    <TabsTrigger value="newsletter" className="text-xs sm:text-sm">Newsletter</TabsTrigger>
                  </TabsList>
                  <TabsContent value="donations">
                    <DonationsManagement />
                  </TabsContent>
                  <TabsContent value="members">
                    <MembersManagement />
                  </TabsContent>
                  <TabsContent value="contacts">
                    <ContactsManagement />
                  </TabsContent>
                  <TabsContent value="newsletter">
                    <NewsletterManagement />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue="all-programs" className="space-y-4">
                  <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                    <TabsTrigger value="all-programs" className="text-xs sm:text-sm">All Programs</TabsTrigger>
                    <TabsTrigger value="upcoming-programs" className="text-xs sm:text-sm">Upcoming</TabsTrigger>
                    <TabsTrigger value="registrations" className="text-xs sm:text-sm">Registrations</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all-programs">
                    <ProgramsManagement />
                  </TabsContent>
                  <TabsContent value="upcoming-programs">
                    <UpcomingProgramsManagement />
                  </TabsContent>
                  <TabsContent value="registrations">
                    <EventRegistrationsManagement />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue="stories" className="space-y-4">
                  <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                    <TabsTrigger value="stories" className="text-xs sm:text-sm">Stories</TabsTrigger>
                    <TabsTrigger value="stats" className="text-xs sm:text-sm">Stats</TabsTrigger>
                    <TabsTrigger value="achievements" className="text-xs sm:text-sm">Achievements</TabsTrigger>
                  </TabsList>
                  <TabsContent value="stories">
                    <ImpactStoriesManagement />
                  </TabsContent>
                  <TabsContent value="stats">
                    <ImpactStatsManagement />
                  </TabsContent>
                  <TabsContent value="achievements">
                    <AchievementsManagement />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* People Tab */}
          <TabsContent value="people">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue="team" className="space-y-4">
                  <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                    <TabsTrigger value="team" className="text-xs sm:text-sm">Team</TabsTrigger>
                    <TabsTrigger value="testimonials" className="text-xs sm:text-sm">Testimonials</TabsTrigger>
                  </TabsList>
                  <TabsContent value="team">
                    <TeamMembersManagement />
                  </TabsContent>
                  <TabsContent value="testimonials">
                    <TestimonialsManagement />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <SiteContentManagement />
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue="users" className="space-y-4">
                  <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                    <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
                    <TabsTrigger value="email" className="text-xs sm:text-sm">Email</TabsTrigger>
                    <TabsTrigger value="export" className="text-xs sm:text-sm">Export</TabsTrigger>
                    <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="users">
                    <UserRolesManagement isSuperAdmin={isSuperAdmin} />
                  </TabsContent>
                  <TabsContent value="email">
                    <EmailCampaignManagement />
                  </TabsContent>
                  <TabsContent value="export">
                    <ExportData />
                  </TabsContent>
                  <TabsContent value="activity">
                    <ActivityLogViewer />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
