import { Shield, ShieldCheck, PenSquare, CalendarRange, Megaphone, User, Users } from 'lucide-react';

export type AppRole =
  | 'super_admin'
  | 'admin'
  | 'content_editor'
  | 'program_manager'
  | 'communications_officer'
  | 'member'
  | 'user';

/** Every gated area of the admin console. */
export type Permission =
  | 'analytics'
  | 'donations'
  | 'members'
  | 'contacts'
  | 'newsletter'
  | 'blog'
  | 'site-content'
  | 'media'
  | 'programs'
  | 'upcoming'
  | 'registrations'
  | 'stories'
  | 'stats'
  | 'achievements'
  | 'team'
  | 'testimonials'
  | 'email-campaigns'
  | 'users'
  | 'activity'
  | 'export';

export const STAFF_ROLES: AppRole[] = [
  'super_admin',
  'admin',
  'content_editor',
  'program_manager',
  'communications_officer',
];

/** Roles that can be assigned from the admin console. */
export const ASSIGNABLE_ROLES: AppRole[] = [
  'super_admin',
  'admin',
  'content_editor',
  'program_manager',
  'communications_officer',
  'member',
];

export const ROLE_META: Record<
  AppRole,
  { label: string; description: string; icon: typeof Shield; badge: 'default' | 'secondary' | 'outline' }
> = {
  super_admin: {
    label: 'Super Admin',
    description:
      'Full control of the foundation console, including assigning and removing every role and reviewing the audit trail.',
    icon: ShieldCheck,
    badge: 'default',
  },
  admin: {
    label: 'Admin',
    description:
      'Full operational access to fundraising, community, programs, content, impact and communications. Cannot grant Super Admin.',
    icon: Shield,
    badge: 'secondary',
  },
  content_editor: {
    label: 'Content Editor',
    description:
      'Owns the foundation story: blog posts, site copy, media library, impact stories and stats, achievements, team profiles and testimonials.',
    icon: PenSquare,
    badge: 'outline',
  },
  program_manager: {
    label: 'Program Manager',
    description:
      'Runs the programmes: all programmes, upcoming and past events, event registrations, achievements and the media library.',
    icon: CalendarRange,
    badge: 'outline',
  },
  communications_officer: {
    label: 'Communications Officer',
    description:
      'Handles outreach: newsletter subscribers, email campaigns, contact enquiries, blog publishing and the media library.',
    icon: Megaphone,
    badge: 'outline',
  },
  member: {
    label: 'Member',
    description: 'A registered member of the foundation. No admin console access.',
    icon: Users,
    badge: 'outline',
  },
  user: {
    label: 'User',
    description: 'A standard signed-in website visitor. No admin console access.',
    icon: User,
    badge: 'outline',
  },
};

/** Which permissions each role holds. Admin/Super Admin hold everything. */
const ROLE_PERMISSIONS: Partial<Record<AppRole, Permission[]>> = {
  content_editor: [
    'blog',
    'site-content',
    'media',
    'stories',
    'stats',
    'achievements',
    'team',
    'testimonials',
  ],
  program_manager: ['programs', 'upcoming', 'registrations', 'achievements', 'media'],
  communications_officer: ['newsletter', 'email-campaigns', 'contacts', 'blog', 'media'],
};

export const ALL_PERMISSIONS: Permission[] = [
  'analytics',
  'donations',
  'members',
  'contacts',
  'newsletter',
  'blog',
  'site-content',
  'media',
  'programs',
  'upcoming',
  'registrations',
  'stories',
  'stats',
  'achievements',
  'team',
  'testimonials',
  'email-campaigns',
  'users',
  'activity',
  'export',
];

export function permissionsForRole(role: AppRole): Permission[] {
  if (role === 'admin' || role === 'super_admin') return ALL_PERMISSIONS;
  return ROLE_PERMISSIONS[role] ?? [];
}

export function roleHasPermission(role: AppRole, permission: Permission): boolean {
  return permissionsForRole(role).includes(permission);
}

export function hasPermission(roles: AppRole[], permission: Permission): boolean {
  return roles.some((r) => roleHasPermission(r, permission));
}

export function isStaffRole(role: AppRole): boolean {
  return STAFF_ROLES.includes(role);
}

export function formatRole(role: string): string {
  return ROLE_META[role as AppRole]?.label ?? role.replace(/_/g, ' ');
}
