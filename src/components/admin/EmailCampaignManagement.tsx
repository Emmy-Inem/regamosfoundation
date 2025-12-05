import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Mail, Send, Users, Newspaper, Heart, UserCheck } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

type RecipientGroup = 'all' | 'newsletter' | 'members' | 'donors' | 'custom';

interface RecipientCount {
  newsletter: number;
  members: number;
  donors: number;
  all: number;
}

export const EmailCampaignManagement = () => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [recipientGroup, setRecipientGroup] = useState<RecipientGroup>('newsletter');
  const [customEmails, setCustomEmails] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Fetch recipient counts
  const { data: recipientCounts, isLoading: countsLoading } = useQuery({
    queryKey: ['email-recipient-counts'],
    queryFn: async (): Promise<RecipientCount> => {
      const [newsletterRes, membersRes, donorsRes] = await Promise.all([
        supabase.from('newsletter_subscriptions').select('email', { count: 'exact', head: true }),
        supabase.from('members').select('email', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('donations').select('email'),
      ]);

      const uniqueDonors = new Set(donorsRes.data?.map(d => d.email) || []).size;
      const allEmails = new Set([
        ...(newsletterRes.data?.map((n: any) => n.email) || []),
        ...(membersRes.data?.map((m: any) => m.email) || []),
        ...(donorsRes.data?.map((d: any) => d.email) || []),
      ]);

      return {
        newsletter: newsletterRes.count || 0,
        members: membersRes.count || 0,
        donors: uniqueDonors,
        all: allEmails.size,
      };
    },
  });

  const getRecipientCount = () => {
    if (!recipientCounts) return 0;
    if (recipientGroup === 'custom') {
      return customEmails.split(',').filter(e => e.trim()).length;
    }
    return recipientCounts[recipientGroup] || 0;
  };

  const handleSendEmail = async () => {
    if (!subject.trim()) {
      toast({ title: 'Please enter a subject', variant: 'destructive' });
      return;
    }
    if (!htmlContent.trim()) {
      toast({ title: 'Please enter email content', variant: 'destructive' });
      return;
    }
    if (recipientGroup === 'custom' && !customEmails.trim()) {
      toast({ title: 'Please enter recipient emails', variant: 'destructive' });
      return;
    }

    const recipientCount = getRecipientCount();
    if (recipientCount === 0) {
      toast({ title: 'No recipients found', variant: 'destructive' });
      return;
    }

    setIsSending(true);

    try {
      const payload: any = {
        subject,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1F8A55; margin: 0;">Regamos Foundation</h1>
              <p style="color: #E5B100; margin: 5px 0;">Transforming Lives Through Empowerment</p>
            </div>
            ${htmlContent}
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
              <p>Regamos Foundation</p>
              <p>Email: regamosfoundation@gmail.com | Phone: 08023300639</p>
              <p>
                <a href="https://regamosfoundation.lovable.app" style="color: #1F8A55;">Visit our website</a>
              </p>
            </div>
          </div>
        `,
        recipientGroup,
      };

      if (recipientGroup === 'custom') {
        payload.customEmails = customEmails.split(',').map(e => e.trim()).filter(e => e);
      }

      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: payload,
      });

      if (error) throw error;

      toast({
        title: 'Email Campaign Sent!',
        description: `Successfully sent to ${data.successCount} recipients${data.failCount > 0 ? `, ${data.failCount} failed` : ''}`,
      });

      // Reset form
      setSubject('');
      setHtmlContent('');
      setCustomEmails('');
    } catch (error: any) {
      console.error('Error sending bulk email:', error);
      toast({
        title: 'Failed to send emails',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const recipientOptions = [
    { value: 'newsletter', label: 'Newsletter Subscribers', icon: Newspaper, count: recipientCounts?.newsletter },
    { value: 'members', label: 'Approved Members', icon: UserCheck, count: recipientCounts?.members },
    { value: 'donors', label: 'Donors', icon: Heart, count: recipientCounts?.donors },
    { value: 'all', label: 'All Contacts', icon: Users, count: recipientCounts?.all },
    { value: 'custom', label: 'Custom List', icon: Mail, count: null },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Campaigns
        </CardTitle>
        <CardDescription>
          Send emails to your subscribers, members, donors, or custom lists
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recipient Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Newsletter</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {countsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : recipientCounts?.newsletter || 0}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Members</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {countsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : recipientCounts?.members || 0}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Donors</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {countsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : recipientCounts?.donors || 0}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">All Unique</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {countsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : recipientCounts?.all || 0}
            </p>
          </Card>
        </div>

        {/* Email Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient-group">Recipients</Label>
            <Select value={recipientGroup} onValueChange={(v) => setRecipientGroup(v as RecipientGroup)}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient group" />
              </SelectTrigger>
              <SelectContent>
                {recipientOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                      {option.count !== null && (
                        <Badge variant="secondary" className="ml-2">
                          {option.count}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {recipientGroup === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-emails">Email Addresses (comma-separated)</Label>
              <Textarea
                id="custom-emails"
                placeholder="email1@example.com, email2@example.com, ..."
                value={customEmails}
                onChange={(e) => setCustomEmails(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email Content</Label>
            <RichTextEditor
              value={htmlContent}
              onChange={setHtmlContent}
              placeholder="Compose your email message..."
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Will be sent to <Badge variant="outline">{getRecipientCount()}</Badge> recipient(s)
            </div>
            <Button
              onClick={handleSendEmail}
              disabled={isSending || getRecipientCount() === 0}
              className="gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Campaign
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailCampaignManagement;
