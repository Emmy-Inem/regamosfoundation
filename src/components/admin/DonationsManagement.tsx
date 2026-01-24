import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export function DonationsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: donations, isLoading } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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
        <CardTitle>Donations</CardTitle>
        <CardDescription>View all donation records</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
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

        {/* Desktop View */}
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

        {(!donations || donations.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            No donations yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DonationsManagement;
