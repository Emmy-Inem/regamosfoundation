CREATE TABLE public.volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  areas_of_interest text,
  availability text,
  skills text,
  motivation text,
  status text NOT NULL DEFAULT 'new',
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.volunteer_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteer_applications TO authenticated;
GRANT ALL ON public.volunteer_applications TO service_role;

ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply to volunteer"
  ON public.volunteer_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view volunteer applications"
  ON public.volunteer_applications FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update volunteer applications"
  ON public.volunteer_applications FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete volunteer applications"
  ON public.volunteer_applications FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_volunteer_applications_updated_at
  BEFORE UPDATE ON public.volunteer_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.partnership_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text,
  partnership_type text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.partnership_enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partnership_enquiries TO authenticated;
GRANT ALL ON public.partnership_enquiries TO service_role;

ALTER TABLE public.partnership_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a partnership enquiry"
  ON public.partnership_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Comms managers can view partnership enquiries"
  ON public.partnership_enquiries FOR SELECT
  TO authenticated
  USING (can_manage(auth.uid(), 'communications'::text));

CREATE POLICY "Comms managers can update partnership enquiries"
  ON public.partnership_enquiries FOR UPDATE
  TO authenticated
  USING (can_manage(auth.uid(), 'communications'::text))
  WITH CHECK (can_manage(auth.uid(), 'communications'::text));

CREATE POLICY "Comms managers can delete partnership enquiries"
  ON public.partnership_enquiries FOR DELETE
  TO authenticated
  USING (can_manage(auth.uid(), 'communications'::text));

CREATE TRIGGER update_partnership_enquiries_updated_at
  BEFORE UPDATE ON public.partnership_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();