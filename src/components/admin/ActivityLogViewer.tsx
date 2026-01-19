import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Activity, Plus, Edit, Trash2, UserPlus, UserMinus, Filter } from 'lucide-react';

interface ActivityLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

const ActivityLogViewer = () => {
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-activity-logs', actionFilter, entityFilter],
    queryFn: async () => {
      let query = supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (actionFilter !== 'all') {
        query = query.eq('action_type', actionFilter);
      }
      if (entityFilter !== 'all') {
        query = query.eq('entity_type', entityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ActivityLog[];
    }
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="h-3 w-3" />;
      case 'update':
        return <Edit className="h-3 w-3" />;
      case 'delete':
        return <Trash2 className="h-3 w-3" />;
      case 'role_added':
        return <UserPlus className="h-3 w-3" />;
      case 'role_removed':
        return <UserMinus className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'update':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'delete':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'role_added':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'role_removed':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatEntityType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatActionType = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
            Activity Log
          </CardTitle>
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
            Activity Log
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[130px] text-xs sm:text-sm h-8">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="role_added">Role Added</SelectItem>
                  <SelectItem value="role_removed">Role Removed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[150px] text-xs sm:text-sm h-8">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="blog_post">Blog Posts</SelectItem>
                <SelectItem value="program">Programs</SelectItem>
                <SelectItem value="impact_story">Impact Stories</SelectItem>
                <SelectItem value="impact_stat">Impact Stats</SelectItem>
                <SelectItem value="achievement">Achievements</SelectItem>
                <SelectItem value="upcoming_program">Upcoming Programs</SelectItem>
                <SelectItem value="team_member">Team Members</SelectItem>
                <SelectItem value="testimonial">Testimonials</SelectItem>
                <SelectItem value="site_content">Site Content</SelectItem>
                <SelectItem value="user_role">User Roles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] sm:h-[500px]">
          {logs && logs.length > 0 ? (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Badge 
                      variant="outline" 
                      className={`${getActionColor(log.action_type)} flex items-center gap-1 text-[10px] sm:text-xs shrink-0`}
                    >
                      {getActionIcon(log.action_type)}
                      {formatActionType(log.action_type)}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">
                      {formatEntityType(log.entity_type)}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm truncate">
                      {log.entity_name || log.entity_id || 'Unknown'}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      by {log.user_email || 'Unknown user'}
                    </p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                    {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mb-2" />
              <p className="text-sm">No activity logs found</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityLogViewer;
