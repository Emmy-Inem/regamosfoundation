import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Json } from '@/integrations/supabase/types';

type ActionType = 'create' | 'update' | 'delete' | 'role_added' | 'role_removed' | 'created' | 'updated' | 'deleted' | 'status_changed';
type EntityType = 'blog_post' | 'program' | 'impact_story' | 'impact_stat' | 'achievement' | 
  'upcoming_program' | 'team_member' | 'testimonial' | 'site_content' | 'user_role' | 
  'donation' | 'member' | 'contact' | 'newsletter';

interface LogActivityParams {
  actionType: ActionType;
  entityType: EntityType;
  entityId?: string;
  entityName?: string;
  details?: Json;
}

interface NotifyUserParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Json;
}

export function useActivityLog() {
  const { user } = useAuth();

  const logActivity = async ({
    actionType,
    entityType,
    entityId,
    entityName,
    details = {}
  }: LogActivityParams) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('admin_activity_logs')
        .insert([{
          user_id: user.id,
          user_email: user.email,
          action_type: actionType,
          entity_type: entityType,
          entity_id: entityId,
          entity_name: entityName,
          details
        }]);

      if (error) {
        console.error('Failed to log activity:', error);
      }
    } catch (err) {
      console.error('Activity logging error:', err);
    }
  };

  const notifyUser = async ({
    userId,
    type,
    title,
    message,
    metadata = null,
  }: NotifyUserParams) => {
    try {
      const { error } = await supabase.from("notifications").insert([{
        user_id: userId,
        type,
        title,
        message,
        metadata,
      }]);

      if (error) {
        console.error("Failed to create notification:", error);
      }
    } catch (err) {
      console.error("Error creating notification:", err);
    }
  };

  return { logActivity, notifyUser };
}
