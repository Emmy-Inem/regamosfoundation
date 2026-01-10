import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Trash2, CheckCircle, XCircle, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ProgramsManagement } from '@/components/admin/ProgramsManagement';
import { ImpactStoriesManagement } from '@/components/admin/ImpactStoriesManagement';
import { ImpactStatsManagement } from '@/components/admin/ImpactStatsManagement';
import { SiteContentManagement } from '@/components/admin/SiteContentManagement';
import AchievementsManagement from '@/components/admin/AchievementsManagement';
import UpcomingProgramsManagement from '@/components/admin/UpcomingProgramsManagement';
import TeamMembersManagement from '@/components/admin/TeamMembersManagement';
import TestimonialsManagement from '@/components/admin/TestimonialsManagement';
import { EmailCampaignManagement } from '@/components/admin/EmailCampaignManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ExportData } from '@/components/admin/ExportData';
import { EventRegistrationsManagement } from '@/components/admin/EventRegistrationsManagement';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/auth?next=/admin', { replace: true });
    } else if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['admin-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('joined_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: newsletters, isLoading: newslettersLoading } = useQuery({
    queryKey: ['admin-newsletters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: blogPosts, isLoading: blogPostsLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Mutations for member status updates
  const updateMemberStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('members')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      toast({ title: 'Member status updated successfully' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error updating member status', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  // Delete mutations
  const deleteDonation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('donations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-donations'] });
      toast({ title: 'Donation deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error deleting donation', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      toast({ title: 'Member deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error deleting member', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast({ title: 'Contact submission deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error deleting contact', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  const deleteNewsletter = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('newsletter_subscriptions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-newsletters'] });
      toast({ title: 'Newsletter subscription deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error deleting subscription', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  const deleteBlogPost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Blog post deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error deleting blog post', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });

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
      <main className="flex-1 container mx-auto px-4 py-20">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="analytics" className="space-y-4">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto min-w-full justify-start">
              <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
              <TabsTrigger value="donations" className="text-xs md:text-sm">Donations</TabsTrigger>
              <TabsTrigger value="members" className="text-xs md:text-sm">Members</TabsTrigger>
              <TabsTrigger value="contacts" className="text-xs md:text-sm">Contact</TabsTrigger>
              <TabsTrigger value="newsletters" className="text-xs md:text-sm">Newsletter</TabsTrigger>
              <TabsTrigger value="blog" className="text-xs md:text-sm">Blog</TabsTrigger>
              <TabsTrigger value="programs" className="text-xs md:text-sm">Programs</TabsTrigger>
              <TabsTrigger value="stories" className="text-xs md:text-sm">Stories</TabsTrigger>
              <TabsTrigger value="stats" className="text-xs md:text-sm">Stats</TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs md:text-sm">Achievements</TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs md:text-sm">Upcoming</TabsTrigger>
              <TabsTrigger value="registrations" className="text-xs md:text-sm">Registrations</TabsTrigger>
              <TabsTrigger value="team" className="text-xs md:text-sm">Team</TabsTrigger>
              <TabsTrigger value="testimonials" className="text-xs md:text-sm">Testimonials</TabsTrigger>
              <TabsTrigger value="content" className="text-xs md:text-sm">Content</TabsTrigger>
              <TabsTrigger value="email" className="text-xs md:text-sm">Email</TabsTrigger>
              <TabsTrigger value="export" className="text-xs md:text-sm">Export</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Donations</CardTitle>
                <CardDescription>View all donation records</CardDescription>
              </CardHeader>
              <CardContent>
                {donationsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4 md:hidden">
                    {donations?.map((donation) => (
                      <Card key={donation.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{donation.donor_name}</p>
                              <p className="text-sm text-muted-foreground">{donation.email}</p>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Donation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this donation record? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteDonation.mutate(donation.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="default" className="font-semibold">₦{donation.amount}</Badge>
                            <Badge variant="outline">{donation.frequency}</Badge>
                            <Badge variant={donation.payment_status === 'completed' ? 'default' : 'secondary'}>
                              {donation.payment_status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                {donations && donations.length > 0 && (
                  <div className="overflow-x-auto hidden md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 text-sm">Name</th>
                          <th className="text-left p-2 text-sm">Email</th>
                          <th className="text-left p-2 text-sm">Amount</th>
                          <th className="text-left p-2 text-sm">Frequency</th>
                          <th className="text-left p-2 text-sm">Status</th>
                          <th className="text-left p-2 text-sm">Date</th>
                          <th className="text-left p-2 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations?.map((donation) => (
                          <tr key={donation.id} className="border-b hover:bg-accent/50">
                            <td className="p-2 text-sm">{donation.donor_name}</td>
                            <td className="p-2 text-sm">{donation.email}</td>
                            <td className="p-2 font-semibold text-sm">₦{donation.amount}</td>
                            <td className="p-2">
                              <Badge variant="outline">{donation.frequency}</Badge>
                            </td>
                            <td className="p-2">
                              <Badge variant={donation.payment_status === 'completed' ? 'default' : 'secondary'}>
                                {donation.payment_status}
                              </Badge>
                            </td>
                            <td className="p-2 text-sm">
                              {new Date(donation.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Donation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this donation record? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteDonation.mutate(donation.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>View all membership applications</CardDescription>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 md:hidden">
                      {members?.map((member) => (
                        <Card key={member.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold">{member.full_name}</p>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Member</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this member? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteMember.mutate(member.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge>{member.membership_type}</Badge>
                              <Badge variant={member.status === 'approved' ? 'default' : member.status === 'pending' ? 'secondary' : 'destructive'}>
                                {member.status}
                              </Badge>
                            </div>
                            {member.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateMemberStatus.mutate({ id: member.id, status: 'approved' })}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => updateMemberStatus.mutate({ id: member.id, status: 'rejected' })}
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {new Date(member.joined_at).toLocaleDateString()}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <div className="overflow-x-auto hidden md:block">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 text-sm">Name</th>
                            <th className="text-left p-2 text-sm">Email</th>
                            <th className="text-left p-2 text-sm">Type</th>
                            <th className="text-left p-2 text-sm">Status</th>
                            <th className="text-left p-2 text-sm">Date</th>
                            <th className="text-left p-2 text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members?.map((member) => (
                            <tr key={member.id} className="border-b hover:bg-accent/50">
                              <td className="p-2 text-sm">{member.full_name}</td>
                              <td className="p-2 text-sm">{member.email}</td>
                              <td className="p-2">
                                <Badge>{member.membership_type}</Badge>
                              </td>
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant={member.status === 'approved' ? 'default' : member.status === 'pending' ? 'secondary' : 'destructive'}>
                                    {member.status}
                                  </Badge>
                                  {member.status === 'pending' && (
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => updateMemberStatus.mutate({ id: member.id, status: 'approved' })}
                                      >
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => updateMemberStatus.mutate({ id: member.id, status: 'rejected' })}
                                      >
                                        <XCircle className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-2 text-sm">
                                {new Date(member.joined_at).toLocaleDateString()}
                              </td>
                              <td className="p-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Member</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this member? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteMember.mutate(member.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions</CardTitle>
                <CardDescription>View all contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {contactsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts?.map((contact) => (
                      <Card key={contact.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{contact.name}</CardTitle>
                              <CardDescription>
                                {contact.email} {contact.phone && `• ${contact.phone}`}
                                <br />
                                {new Date(contact.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Contact Submission</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this contact submission? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteContact.mutate(contact.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap">{contact.message}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletters">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscriptions</CardTitle>
                <CardDescription>View all newsletter subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                {newslettersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 md:hidden">
                      {newsletters?.map((sub) => (
                        <Card key={sub.id} className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-sm">{sub.email}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(sub.subscribed_at).toLocaleDateString()}
                              </p>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this newsletter subscription? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteNewsletter.mutate(sub.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <div className="overflow-x-auto hidden md:block">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 text-sm">Email</th>
                            <th className="text-left p-2 text-sm">Subscribed Date</th>
                            <th className="text-left p-2 text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newsletters?.map((sub) => (
                            <tr key={sub.id} className="border-b hover:bg-accent/50">
                              <td className="p-2 text-sm">{sub.email}</td>
                              <td className="p-2 text-sm">
                                {new Date(sub.subscribed_at).toLocaleDateString()}
                              </td>
                              <td className="p-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this newsletter subscription? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteNewsletter.mutate(sub.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Posts Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Blog Posts Management</CardTitle>
                    <CardDescription>View and manage published blog posts</CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate('/blog-editor')}
                    variant="default"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Blog Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {blogPostsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : !blogPosts || blogPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No blog posts yet.</p>
                    <Button onClick={() => navigate('/blog-editor')} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Blog Post
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogPosts.map((post: any) => (
                      <Card key={post.id} className="p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold text-base sm:text-lg">{post.title}</h3>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                              <span>By {post.author}</span>
                              <span>•</span>
                              <span>
                                {new Date(post.published_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 sm:flex-col">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/blog-editor/${post.id}`)}
                              className="flex-1 sm:flex-initial"
                            >
                              <Edit className="h-4 w-4 sm:mr-0" />
                              <span className="sm:hidden ml-2">Edit</span>
                            </Button>
                            <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="flex-1 sm:flex-initial">
                                <Trash2 className="h-4 w-4 sm:mr-0" />
                                <span className="sm:hidden ml-2">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBlogPost.mutate(post.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsManagement />
          </TabsContent>

          <TabsContent value="stories">
            <ImpactStoriesManagement />
          </TabsContent>

          <TabsContent value="stats">
            <ImpactStatsManagement />
          </TabsContent>

          <TabsContent value="content">
            <SiteContentManagement />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsManagement />
          </TabsContent>

          <TabsContent value="upcoming">
            <UpcomingProgramsManagement />
          </TabsContent>

          <TabsContent value="team">
            <TeamMembersManagement />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManagement />
          </TabsContent>

          <TabsContent value="email">
            <EmailCampaignManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
                      <p className="text-3xl font-bold text-primary">
                        ₦{donations?.reduce((sum, d) => sum + Number(d.amount), 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        From {donations?.length} donations
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Total Members</h3>
                      <p className="text-3xl font-bold text-accent">{members?.length}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {members?.filter(m => m.status === 'approved').length} approved
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Newsletter Subscribers</h3>
                      <p className="text-3xl font-bold text-primary">{newsletters?.length}</p>
                      <p className="text-sm text-muted-foreground mt-2">Active subscribers</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <EventRegistrationsManagement />
          </TabsContent>

          <TabsContent value="export">
            <ExportData />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
