-- Drop the single admin constraint to allow multiple admins
DROP INDEX IF EXISTS one_admin_only;

-- Update inememmanuel@gmail.com (332b28cf-34f8-420f-90ed-6d66baf33498) to super_admin
UPDATE public.user_roles 
SET role = 'super_admin' 
WHERE user_id = '332b28cf-34f8-420f-90ed-6d66baf33498' AND role = 'admin';

-- Add admin role for letisciaonuselogu@gmail.com (f622b07e-a026-4a39-9e37-11f63a8949d3)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('f622b07e-a026-4a39-9e37-11f63a8949d3', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update has_role function to handle super_admin as having all admin privileges
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND (role = _role OR (role = 'super_admin' AND _role = 'admin'))
  )
$$;