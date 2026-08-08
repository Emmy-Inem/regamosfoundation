import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
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

const STATUSES = ['new', 'reviewing', 'approved', 'declined'] as const;

const statusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  if (status === 'approved') return 'default';
  if (status === 'declined') return 'destructive';
  if (status === 'reviewing') return 'secondary';
  return 'outline';
};

export function VolunteerApplicationsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-volunteer-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('volunteer_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateApplication = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, string> }) => {
      const { error } = await supabase.from('volunteer_applications').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteer-applications'] });
      toast({ title: 'Application updated' });
    },
    onError: (error: Error) =>
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' }),
  });

  const deleteApplication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('volunteer_applications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteer-applications'] });
      toast({ title: 'Application deleted' });
    },
    onError: (error: Error) =>
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volunteer Applications</CardTitle>
        <CardDescription>
          Review people who applied to volunteer, track their status and keep internal notes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications?.map((app) => (
          <Card key={app.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">{app.full_name}</CardTitle>
                    <Badge variant={statusVariant(app.status)} className="capitalize">
                      {app.status}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1 space-y-0.5">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {app.email}
                    </span>
                    {app.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> {app.phone}
                      </span>
                    )}
                    <span className="block">Applied {new Date(app.created_at).toLocaleDateString()}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={app.status}
                    onValueChange={(status) => updateApplication.mutate({ id: app.id, values: { status } })}
                  >
                    <SelectTrigger className="w-[140px] capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="Delete application">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete volunteer application</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes {app.full_name}'s application. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteApplication.mutate(app.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {app.areas_of_interest && (
                <p>
                  <span className="font-medium">Areas of interest: </span>
                  {app.areas_of_interest}
                </p>
              )}
              {app.availability && (
                <p>
                  <span className="font-medium">Availability: </span>
                  {app.availability}
                </p>
              )}
              {app.skills && (
                <p className="whitespace-pre-wrap">
                  <span className="font-medium">Skills: </span>
                  {app.skills}
                </p>
              )}
              {app.motivation && (
                <p className="whitespace-pre-wrap">
                  <span className="font-medium">Motivation: </span>
                  {app.motivation}
                </p>
              )}
              <div className="space-y-2 pt-2 border-t">
                <label className="text-xs font-medium text-muted-foreground" htmlFor={`notes-${app.id}`}>
                  Internal notes
                </label>
                <Textarea
                  id={`notes-${app.id}`}
                  rows={2}
                  placeholder="Notes only staff can see..."
                  value={notes[app.id] ?? app.internal_notes ?? ''}
                  onChange={(e) => setNotes({ ...notes, [app.id]: e.target.value })}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateApplication.mutate({
                      id: app.id,
                      values: { internal_notes: notes[app.id] ?? app.internal_notes ?? '' },
                    })
                  }
                >
                  Save notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!applications || applications.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">No volunteer applications yet.</div>
        )}
      </CardContent>
    </Card>
  );
}

export default VolunteerApplicationsManagement;
