BEGIN;

-- Keep the existing profile rows and foreign key to auth.users.
ALTER TABLE public.profiles RENAME COLUMN user_id TO id;
ALTER TABLE public.profiles
  ADD COLUMN role text NOT NULL DEFAULT 'client'
    CHECK (role IN ('admin', 'merchant', 'provider', 'client')),
  ALTER COLUMN created_at SET DEFAULT now();

CREATE TABLE public.service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) >= 3),
  slug text NOT NULL UNIQUE CHECK (slug ~* '^[a-z0-9-]+$'),
  active_status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (char_length(title) >= 5),
  hourly_rate numeric(10, 2) NOT NULL CHECK (hourly_rate >= 0),
  duration_minutes integer NOT NULL CHECK (duration_minutes >= 15),
  coverage_radius_miles integer NOT NULL CHECK (coverage_radius_miles > 0),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending', 'approved', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.service_category_mappings (
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.service_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id, category_id)
);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  client_email text NOT NULL
    CHECK (client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  requested_date date NOT NULL,
  notes text NOT NULL CHECK (char_length(notes) >= 10),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX exam_services_provider_idx ON public.services(provider_id);
CREATE INDEX exam_mappings_category_idx ON public.service_category_mappings(category_id);
CREATE INDEX exam_bookings_service_idx ON public.bookings(service_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.profiles, public.service_categories, public.services,
  public.service_category_mappings, public.bookings FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
-- Keep self-service profile edits while reserving role changes for trusted execution.
GRANT INSERT (id, display_name), UPDATE (display_name) ON public.profiles TO authenticated;
GRANT SELECT ON public.service_categories, public.services,
  public.service_category_mappings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.service_categories, public.services,
  public.service_category_mappings TO authenticated;
GRANT INSERT (service_id, client_email, requested_date, notes)
  ON public.bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.profiles, public.service_categories, public.services,
  public.service_category_mappings, public.bookings TO service_role;

CREATE FUNCTION public.exam_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.exam_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.exam_is_admin() TO authenticated;

CREATE POLICY exam_admin_read_profiles ON public.profiles
  FOR SELECT TO authenticated USING ((SELECT public.exam_is_admin()));

CREATE POLICY exam_read_active_categories ON public.service_categories
  FOR SELECT TO anon, authenticated USING (active_status);
CREATE POLICY exam_admin_manage_categories ON public.service_categories
  FOR ALL TO authenticated USING ((SELECT public.exam_is_admin()))
  WITH CHECK ((SELECT public.exam_is_admin()));

CREATE POLICY exam_read_approved_services ON public.services
  FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY exam_provider_read_services ON public.services
  FOR SELECT TO authenticated USING (provider_id = (SELECT auth.uid()));
CREATE POLICY exam_provider_create_draft ON public.services
  FOR INSERT TO authenticated WITH CHECK (
    provider_id = (SELECT auth.uid()) AND status = 'draft'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role IN ('merchant', 'provider')
    )
  );
CREATE POLICY exam_provider_update_services ON public.services
  FOR UPDATE TO authenticated
  USING (provider_id = (SELECT auth.uid()) AND status IN ('draft', 'suspended'))
  WITH CHECK (provider_id = (SELECT auth.uid()) AND status IN ('draft', 'suspended'));
CREATE POLICY exam_provider_delete_services ON public.services
  FOR DELETE TO authenticated
  USING (provider_id = (SELECT auth.uid()) AND status IN ('draft', 'suspended'));
CREATE POLICY exam_admin_manage_services ON public.services
  FOR ALL TO authenticated USING ((SELECT public.exam_is_admin()))
  WITH CHECK ((SELECT public.exam_is_admin()));

CREATE POLICY exam_read_approved_mappings ON public.service_category_mappings
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.services s
      WHERE s.id = service_id AND s.status = 'approved')
  );
CREATE POLICY exam_admin_manage_mappings ON public.service_category_mappings
  FOR ALL TO authenticated USING ((SELECT public.exam_is_admin()))
  WITH CHECK ((SELECT public.exam_is_admin()));

CREATE POLICY exam_public_request_booking ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.services s
      WHERE s.id = service_id AND s.status = 'approved')
  );
CREATE POLICY exam_provider_read_bookings ON public.bookings
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.services s
      WHERE s.id = service_id AND s.provider_id = (SELECT auth.uid()))
  );
CREATE POLICY exam_admin_manage_bookings ON public.bookings
  FOR ALL TO authenticated USING ((SELECT public.exam_is_admin()))
  WITH CHECK ((SELECT public.exam_is_admin()));

COMMIT;
