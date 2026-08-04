import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useActivityLog } from '@/hooks/useActivityLog';
import { Shield, Trash2, UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import {
  AppRole,
  ASSIGNABLE_ROLES,
  ROLE_META,
  STAFF_ROLES,
  permissionsForRole,
} from '@/lib/permissions';

interface UserWithRole {
  user_id: string;
  email: string;
  full_name: string | null;
  roles: AppRole[];
}

interface UserRolesManagementProps {
  isSuperAdmin: boolean;
  isAdmin?: boolean;
}

const PERMISSION_LABELS: Record<string, string> = {
  analytics: 'Analytics',
  donations: 'Donations',
  members: 'Members',
  contacts: 'Contact messages',
  newsletter: 'Newsletter',
  blog: 'Blog posts',
  'site-content': 'Site content',
  media: 'Media library',
  programs: 'Programs',
  upcoming: 'Events',
  registrations: 'Event registrations',
  stories: 'Impact stories',
  stats: 'Impact stats',
  achievements: 'Achievements',
  team: 'Team members',
  testimonials: 'Testimonials',
  'email-campaigns': 'Email campaigns',
  users: 'Users & roles',
  activity: 'Activity log',
  export: 'Data export',
};

const UserRolesManagement = ({ isSuperAdmin, isAdmin = false }: UserRolesManagementProps) => {
  const { toast } = useToast();
  const { logActivity, notifyUser } = useActivityLog();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('content_editor');
  const [search, setSearch] = useState('');

  // Super admins can grant every role; admins can grant everything except super_admin.
  const canManageRoles = isSuperAdmin || isAdmin;
  const grantableRoles = ASSIGNABLE_ROLES.filter((r) => (isSuperAdmin ? true : r !== 'super_admin'));

  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name');
      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      if (rolesError) throw rolesError;

      const mapped: UserWithRole[] = (profiles || []).map((profile) => ({
        user_id: profile.id,
        email: profile.email || 'No email',
        full_name: profile.full_name,
        roles: (roles || []).filter((r) => r.user_id === profile.id).map((r) => r.role as AppRole),
      }));
      return mapped;
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role, userName }: { userId: string; role: AppRole; userName: string }) => {
      const { error } = await supabase.from('user_roles').insert({ user_id: userId, role });
      if (error) throw error;
      return { userId, role, userName };
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activity-logs'] });

      await logActivity({
        actionType: 'role_added',
        entityType: 'user_role',
        entityId: data.userId,
        entityName: `${data.userName} - ${data.role}`,
        details: { role: data.role },
      });

      await notifyUser({
        userId: data.userId,
        type: 'role_added',
        title: 'Role Assigned',
        message: `You have been assigned the "${ROLE_META[data.role].label}" role. You now have additional permissions.`,
        metadata: { role: data.role },
      });

      toast({ title: 'Role Added', description: 'User role has been added successfully.' });
      setSelectedUserId('');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role, userName }: { userId: string; role: AppRole; userName: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      if (error) throw error;
      return { userId, role, userName };
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activity-logs'] });

      await logActivity({
        actionType: 'role_removed',
        entityType: 'user_role',
        entityId: data.userId,
        entityName: `${data.userName} - ${data.role}`,
        details: { role: data.role },
      });

      await notifyUser({
        userId: data.userId,
        type: 'role_removed',
        title: 'Role Removed',
        message: `Your "${ROLE_META[data.role].label}" role has been removed. Some permissions may no longer be available.`,
        metadata: { role: data.role },
      });

      toast({ title: 'Role Removed', description: 'User role has been removed successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const filteredUsers = (usersWithRoles || []).filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (u.full_name || '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const staffCount = (usersWithRoles || []).filter((u) => u.roles.some((r) => STAFF_ROLES.includes(r))).length;

  const selectedUser = (usersWithRoles || []).find((u) => u.user_id === selectedUserId);
  const alreadyHasRole = selectedUser?.roles.includes(selectedRole) ?? false;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">User Roles Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Assign a role */}
      {canManageRoles && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              Assign a Role
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Give a team member the access they need. A person can hold more than one role — permissions add up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="flex-1 text-sm">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {(usersWithRoles || []).map((user) => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                <SelectTrigger className="w-full sm:w-56 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {grantableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_META[role].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  if (!selectedUserId) return;
                  addRoleMutation.mutate({
                    userId: selectedUserId,
                    role: selectedRole,
                    userName: selectedUser?.full_name || selectedUser?.email || 'Unknown',
                  });
                }}
                disabled={!selectedUserId || alreadyHasRole || addRoleMutation.isPending}
                className="w-full sm:w-auto text-sm"
              >
                {alreadyHasRole ? 'Already assigned' : 'Assign Role'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{ROLE_META[selectedRole].description}</p>
          </CardContent>
        </Card>
      )}

      {/* Users list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            Users &amp; Roles
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {usersWithRoles?.length || 0} registered users · {staffCount} with staff access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="pl-9 text-sm"
            />
          </div>
          <div className="space-y-3">
            {filteredUsers.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">No users match your search.</p>
            )}
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{user.full_name || 'No name'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {user.roles.length === 0 ? (
                    <Badge variant="outline" className="text-xs">
                      No roles
                    </Badge>
                  ) : (
                    user.roles.map((role) => {
                      const meta = ROLE_META[role] ?? ROLE_META.user;
                      const RoleIcon = meta.icon;
                      const canRemove = canManageRoles && (isSuperAdmin || role !== 'super_admin');
                      return (
                        <div key={role} className="flex items-center gap-1">
                          <Badge variant={meta.badge} className="text-xs flex items-center gap-1">
                            <RoleIcon className="h-3 w-3" />
                            {meta.label}
                          </Badge>
                          {canRemove && (
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
                                    Are you sure you want to remove the {meta.label} role from{' '}
                                    {user.full_name || user.email}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                  <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      removeRoleMutation.mutate({
                                        userId: user.user_id,
                                        role,
                                        userName: user.full_name || user.email,
                                      })
                                    }
                                    className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">What each role can do</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Access is enforced both in this console and directly in the database, so a role can never do more than
            what is listed here.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {ASSIGNABLE_ROLES.map((role) => {
            const meta = ROLE_META[role];
            const RoleIcon = meta.icon;
            const perms = permissionsForRole(role);
            return (
              <div key={role} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <RoleIcon className="h-4 w-4 text-primary" />
                  <p className="font-medium text-sm">{meta.label}</p>
                </div>
                <p className="text-xs text-muted-foreground">{meta.description}</p>
                <div className="flex flex-wrap gap-1">
                  {perms.length === 0 ? (
                    <Badge variant="outline" className="text-[10px]">
                      Website access only
                    </Badge>
                  ) : (
                    perms.map((p) => (
                      <Badge key={p} variant="outline" className="text-[10px]">
                        {PERMISSION_LABELS[p] ?? p}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRolesManagement;
