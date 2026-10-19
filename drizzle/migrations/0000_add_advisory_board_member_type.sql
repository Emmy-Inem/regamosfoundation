ALTER TABLE public.team_members
ADD COLUMN member_type text NOT NULL DEFAULT 'team';

CREATE INDEX team_members_member_type_display_order_idx
ON public.team_members (member_type, display_order);