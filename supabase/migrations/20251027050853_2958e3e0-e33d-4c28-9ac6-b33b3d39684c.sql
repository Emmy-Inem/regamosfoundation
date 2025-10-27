-- Fix members table constraints to match application code

-- Drop existing constraints
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_membership_type_check;
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_status_check;

-- Add updated constraints
ALTER TABLE public.members ADD CONSTRAINT members_membership_type_check 
  CHECK (membership_type IN ('widow', 'youth'));

ALTER TABLE public.members ADD CONSTRAINT members_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected'));