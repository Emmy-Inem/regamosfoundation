-- Update RLS policies to restrict admin data access to admin users only

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view donations" ON public.donations;
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.members;
DROP POLICY IF EXISTS "Authenticated users can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can view subscriptions" ON public.newsletter_subscriptions;

-- Create admin-only policies for viewing sensitive data
CREATE POLICY "Only admins can view donations"
ON public.donations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can view members"
ON public.members
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can view newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for updating and deleting data
CREATE POLICY "Admins can update donation status"
ON public.donations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update member status"
ON public.members
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete donations"
ON public.donations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete members"
ON public.members
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete newsletter subscriptions"
ON public.newsletter_subscriptions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));