import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppRole, Permission, hasPermission, isStaffRole } from '@/lib/permissions';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);

  const fetchUserRole = useCallback(async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (data && !error && data.length > 0) {
        const list = data.map((r) => r.role as AppRole);
        setRoles(list);
        // Primary role for display / legacy checks
        const superAdminRole = list.find((r) => r === 'super_admin');
        const adminRole = list.find((r) => r === 'admin');
        setUserRole(superAdminRole ? 'super_admin' : adminRole ? 'admin' : list[0]);
      } else {
        setRoles([]);
        setUserRole(null);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
      setRoles([]);
      setUserRole(null);
    }
  }, []);


  useEffect(() => {
    let mounted = true;

    // Check for existing session first
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        if (mounted) {
          setLoading(false);
          setRoleLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    // NOTE: Do NOT use await inside onAuthStateChange - it causes a deadlock!
    // See: https://supabase.com/docs/guides/troubleshooting/why-is-my-supabase-api-call-not-returning-PGzXw0
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when session changes - use setTimeout to avoid deadlock
        if (session?.user) {
          setRoleLoading(true);
          // Defer the async call to avoid blocking the Supabase client
          setTimeout(() => {
            fetchUserRole(session.user.id).finally(() => {
              if (mounted) setRoleLoading(false);
            });
          }, 0);
        } else {
          setUserRole(null);
          setRoleLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const isAdmin = roles.includes('admin') || roles.includes('super_admin');
  const isSuperAdmin = roles.includes('super_admin');
  const isStaff = roles.some(isStaffRole);
  const can = (permission: Permission) => hasPermission(roles, permission);

  return {
    user,
    session,
    loading: loading || roleLoading,
    userRole,
    roles,
    can,
    isStaff,
    signUp,
    signIn,
    signOut,
    isAdmin,
    isSuperAdmin,

  };
}
