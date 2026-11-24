-- Proposed second migration for neighborhood-listing-platform.
-- Review against the live database before applying. Depends on 001_create_properties_rls.sql.
-- Tables total: properties (existing), profiles, sponsors, property_sponsors, inquiries.
BEGIN;

CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (length(trim(display_name)) BETWEEN 1 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  website_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','approved','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.property_sponsors (
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (property_id, sponsor_id)
);

CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL CHECK (length(trim(message)) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX sponsors_owner_id_idx ON public.sponsors(owner_id);
CREATE INDEX property_sponsors_sponsor_id_idx ON public.property_sponsors(sponsor_id);
CREATE INDEX inquiries_sender_id_idx ON public.inquiries(sender_id);
CREATE INDEX inquiries_property_id_idx ON public.inquiries(property_id);
CREATE INDEX properties_user_id_idx ON public.properties(user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Explicit table privileges; policies still apply per row.
REVOKE ALL ON public.profiles, public.sponsors, public.property_sponsors, public.inquiries FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.sponsors, public.property_sponsors TO anon;
GRANT SELECT, INSERT, UPDATE ON public.sponsors TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.property_sponsors TO authenticated;
GRANT SELECT, INSERT ON public.inquiries TO authenticated;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Users create own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Public views approved sponsors only. Owners may also view their own drafts.
CREATE POLICY "Read approved or owned sponsors" ON public.sponsors
  FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR owner_id = (select auth.uid()));
CREATE POLICY "Owners create draft sponsors" ON public.sponsors
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = (select auth.uid()) AND status = 'draft');
CREATE POLICY "Owners edit draft sponsors" ON public.sponsors
  FOR UPDATE TO authenticated
  USING (owner_id = (select auth.uid()) AND status = 'draft')
  WITH CHECK (owner_id = (select auth.uid()) AND status = 'draft');
-- Pending/approved/rejected status changes require a separately reviewed, trusted server workflow.

-- Links are publicly visible only when the sponsor is approved.
CREATE POLICY "Read links to approved sponsors" ON public.property_sponsors
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.sponsors s
    WHERE s.id = sponsor_id AND s.status = 'approved'));
CREATE POLICY "Property owners link owned approved sponsors" ON public.property_sponsors
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = (select auth.uid()))
    AND EXISTS (SELECT 1 FROM public.sponsors s
      WHERE s.id = sponsor_id AND s.status = 'approved')
  );
CREATE POLICY "Property owners unlink approved sponsors" ON public.property_sponsors
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = (select auth.uid()))
  );

-- Inquiries are private to sender and listing owner.
CREATE POLICY "Participants read inquiries" ON public.inquiries
  FOR SELECT TO authenticated USING (
    sender_id = (select auth.uid()) OR EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = (select auth.uid())
    )
  );
CREATE POLICY "Users send inquiries" ON public.inquiries
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = (select auth.uid()) AND EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = property_id
      AND p.user_id <> (select auth.uid())
  ));

COMMIT;
