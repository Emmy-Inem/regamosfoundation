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

const STATUSES = ['new', 'in_discussion', 'active', 'closed'] as const;

const statusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  if (status === 'active') return 'default';
  if (status === 'closed') return 'destructive';
  if (status === 'in_discussion') return 'secondary';
  return 'outline';
};

export function PartnershipEnquiriesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const { data: enquiries, isLoading } = useQuery({
    queryKey: ['admin-partnership-enquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partnership_enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateEnquiry = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, string> }) => {
      const { error } = await supabase.from('partnership_enquiries').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partnership-enquiries'] });
      toast({ title: 'Enquiry updated' });
    },
    onError: (error: Error) =>
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' }),
  });

  const deleteEnquiry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('partnership_enquiries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partnership-enquiries'] });
      toast({ title: 'Enquiry deleted' });
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
        <CardTitle>Partnership Enquiries</CardTitle>
        <CardDescription>
          Organisations that want to partner with the foundation, with status tracking and internal notes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enquiries?.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">{item.organization_name}</CardTitle>
                    <Badge variant={statusVariant(item.status)} className="capitalize">
                      {item.status.replace(/_/g, ' ')}
                    </Badge>
                    {item.partnership_type && <Badge variant="outline">{item.partnership_type}</Badge>}
                  </div>
                  <CardDescription className="mt-1 space-y-0.5">
                    <span className="block">Contact: {item.contact_person}</span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {item.email}
                    </span>
                    {item.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> {item.phone}
                      </span>
                    )}
                    <span className="block">Received {new Date(item.created_at).toLocaleDateString()}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={item.status}
                    onValueChange={(status) => updateEnquiry.mutate({ id: item.id, values: { status } })}
                  >
                    <SelectTrigger className="w-[150px] capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="Delete enquiry">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete partnership enquiry</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the enquiry from {item.organization_name}. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteEnquiry.mutate(item.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="whitespace-pre-wrap">{item.message}</p>
              <div className="space-y-2 pt-2 border-t">
                <label className="text-xs font-medium text-muted-foreground" htmlFor={`pnotes-${item.id}`}>
                  Internal notes
                </label>
                <Textarea
                  id={`pnotes-${item.id}`}
                  rows={2}
                  placeholder="Notes only staff can see..."
                  value={notes[item.id] ?? item.internal_notes ?? ''}
                  onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateEnquiry.mutate({
                      id: item.id,
                      values: { internal_notes: notes[item.id] ?? item.internal_notes ?? '' },
                    })
                  }
                >
                  Save notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!enquiries || enquiries.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">No partnership enquiries yet.</div>
        )}
      </CardContent>
    </Card>
  );
}

export default PartnershipEnquiriesManagement;
