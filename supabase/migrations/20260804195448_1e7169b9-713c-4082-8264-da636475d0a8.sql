CREATE OR REPLACE FUNCTION public.can_manage(_user_id uuid, _area text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND (
        ur.role IN ('admin','super_admin')
        OR (ur.role = 'content_editor' AND _area IN ('blog','content','impact','people','achievements','media'))
        OR (ur.role = 'program_manager' AND _area IN ('programs','achievements','media'))
        OR (ur.role = 'communications_officer' AND _area IN ('blog','communications','media'))
      )
  )
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role IN ('admin','super_admin','content_editor','program_manager','communications_officer')
  )
$$;

DO $$
DECLARE
  t text;
  p record;
BEGIN
  FOREACH t IN ARRAY ARRAY['blog_posts','site_content','impact_stories','impact_stats','achievements','testimonials','team_members','programs','upcoming_programs','event_registrations','newsletter_subscriptions','contact_submissions']
  LOOP
    FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, t);
    END LOOP;
  END LOOP;
END $$;

-- Publicly readable content tables
CREATE POLICY "Public can view blog posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Blog managers can write" ON public.blog_posts FOR ALL TO authenticated USING (public.can_manage(auth.uid(),'blog')) WITH CHECK (public.can_manage(auth.uid(),'blog'));

CREATE POLICY "Public can view site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Content managers can write site content" ON public.site_content FOR ALL TO authenticated USING (public.can_manage(auth.uid(),'content')) WITH CHECK (public.can_manage(auth.uid(),'content'));

CREATE POLICY "Public can view impact stories" ON public.impact_stories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Impact managers can write stories" ON public.impact_stories FOR ALL TO authenticated USING (public.can_manage(auth.uid(),'impact')) WITH CHECK (public.can_manage(auth.uid(),'impact'));

CREATE POLICY "Public can view impact stats" ON public.impact_stats FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Impact managers can write stats" ON public.impact_stats FOR ALL TO authenticated USING (public.can_manage(auth.uid(),'impact')) WITH CHECK (public.can_manage(auth.uid(),'impact'));

CREATE POLICY "Public can view achievements" ON public.achievements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Achievement managers can write" ON public.achievements FOR ALL TO authenticated USING (public.can_manage(auth.uid(),'achievements')) WITH CHECK (public.can_manage(auth.uid(),'achievements'));

CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "People managers can write testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.can_manage(auth.uid(),'people')) WITH CHECK (public.can_manage(auth.uid(),'people'));

CREATE POLICY "Public can view team members" ON public.team_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "People managers can write team" ON public.team_members FOR ALL TO authenticated USING (public.can_manage(auth.uid(),'people')) WITH CHECK (public.can_manage(auth.uid(),'people'));

CREATE POLICY "Public can view programs" ON public.programs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Program managers can write programs" ON public.programs FOR ALL TO authenticated USING (public.can_manage(auth.uid(),'programs')) WITH CHECK (public.can_manage(auth.uid(),'programs'));

CREATE POLICY "Public can view upcoming programs" ON public.upcoming_programs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Program managers can write events" ON public.upcoming_programs FOR ALL TO authenticated USING (public.can_manage(auth.uid(),'programs')) WITH CHECK (public.can_manage(auth.uid(),'programs'));

-- Private tables with public submission
CREATE POLICY "Anyone can register for events" ON public.event_registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Program managers can view registrations" ON public.event_registrations FOR SELECT TO authenticated USING (public.can_manage(auth.uid(),'programs'));
CREATE POLICY "Program managers can delete registrations" ON public.event_registrations FOR DELETE TO authenticated USING (public.can_manage(auth.uid(),'programs'));

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Comms managers can view subscribers" ON public.newsletter_subscriptions FOR SELECT TO authenticated USING (public.can_manage(auth.uid(),'communications'));
CREATE POLICY "Comms managers can delete subscribers" ON public.newsletter_subscriptions FOR DELETE TO authenticated USING (public.can_manage(auth.uid(),'communications'));

CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Comms managers can view contacts" ON public.contact_submissions FOR SELECT TO authenticated USING (public.can_manage(auth.uid(),'communications'));
CREATE POLICY "Comms managers can delete contacts" ON public.contact_submissions FOR DELETE TO authenticated USING (public.can_manage(auth.uid(),'communications'));

-- Activity log: any staff member's actions are recorded; only admins read
DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.admin_activity_logs;
CREATE POLICY "Staff can insert activity logs" ON public.admin_activity_logs FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));