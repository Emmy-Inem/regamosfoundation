import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
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

export function NewsletterManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: newsletters, isLoading } = useQuery({
    queryKey: ['admin-newsletters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      if (error) throw error;
      return data;
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
        <CardTitle>Newsletter Subscriptions</CardTitle>
        <CardDescription>View all newsletter subscribers</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
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

        {/* Desktop View */}
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

        {(!newsletters || newsletters.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            No newsletter subscriptions yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default NewsletterManagement;
