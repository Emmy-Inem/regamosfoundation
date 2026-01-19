import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldCheck, User, Trash2, UserPlus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type AppRole = 'super_admin' | 'admin' | 'member' | 'user';

interface UserWithRole {
  user_id: string;
  email: string;
  full_name: string | null;
  roles: AppRole[];
}

interface UserRolesManagementProps {
  isSuperAdmin: boolean;
}

const UserRolesManagement = ({ isSuperAdmin }: UserRolesManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('admin');

  // Fetch all profiles with their roles
  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name');

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Map profiles to include their roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
        user_id: profile.id,
        email: profile.email || 'No email',
        full_name: profile.full_name,
        roles: (roles || [])
          .filter(r => r.user_id === profile.id)
          .map(r => r.role as AppRole)
      }));

      return usersWithRoles;
    }
  });

  // Add role mutation
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({
        title: 'Role Added',
        description: 'User role has been added successfully.',
      });
      setSelectedUserId('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({
        title: 'Role Removed',
        description: 'User role has been removed successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheck className="h-3 w-3" />;
      case 'admin':
        return <Shield className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'super_admin':
        return 'default';
      case 'admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Users without admin or super_admin role
  const nonAdminUsers = usersWithRoles?.filter(
    user => !user.roles.includes('admin') && !user.roles.includes('super_admin')
  ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">User Roles Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add Admin Section - Only for Super Admins */}
      {isSuperAdmin && nonAdminUsers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              Add Admin Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="flex-1 text-sm">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {nonAdminUsers.map(user => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                <SelectTrigger className="w-full sm:w-32 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  if (selectedUserId) {
                    addRoleMutation.mutate({ userId: selectedUserId, role: selectedRole });
                  }
                }}
                disabled={!selectedUserId || addRoleMutation.isPending}
                className="w-full sm:w-auto text-sm"
              >
                Add Role
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Users with Roles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            Users & Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usersWithRoles?.map(user => (
              <div
                key={user.user_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {user.full_name || 'No name'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {user.roles.length === 0 ? (
                    <Badge variant="outline" className="text-xs">No roles</Badge>
                  ) : (
                    user.roles.map(role => (
                      <div key={role} className="flex items-center gap-1">
                        <Badge variant={getRoleBadgeVariant(role)} className="text-xs flex items-center gap-1">
                          {getRoleIcon(role)}
                          {role.replace('_', ' ')}
                        </Badge>
                        {/* Only super_admin can remove roles, and cannot remove super_admin role */}
                        {isSuperAdmin && role !== 'super_admin' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-base">Remove Role</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm">
                                  Are you sure you want to remove the {role} role from {user.full_name || user.email}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeRoleMutation.mutate({ userId: user.user_id, role })}
                                  className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRolesManagement;
