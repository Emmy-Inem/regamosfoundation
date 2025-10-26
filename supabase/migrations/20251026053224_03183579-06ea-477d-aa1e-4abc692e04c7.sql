-- Ensure only one admin exists in the system
-- Create partial unique index to enforce single admin
CREATE UNIQUE INDEX IF NOT EXISTS one_admin_only 
ON public.user_roles ((role)) 
WHERE role = 'admin';

-- Clean up any duplicate admin roles, keeping only the intended admin
DELETE FROM public.user_roles 
WHERE role = 'admin' 
AND user_id <> '332b28cf-34f8-420f-90ed-6d66baf33498';

-- Ensure the trigger for new user signup exists
-- This trigger creates a profile and assigns default 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END;
$$;