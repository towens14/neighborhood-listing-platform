-- Neighborhood Listing Platform: initial properties schema and RLS
-- Supabase PostgreSQL migration. Apply to a fresh project only.
-- This records the SQL discussed and tested; it is not an export of the live database.
-- The project must configure authenticated users and trusted admin app_metadata separately.

CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
  bathrooms NUMERIC(3,1) NOT NULL CHECK (bathrooms >= 0),
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  listing_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view properties"
ON public.properties
FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Owners can insert properties"
ON public.properties
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update properties"
ON public.properties
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can delete properties"
ON public.properties
FOR DELETE TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- RLS restricts row access; table grants are a separate authorization layer.
-- The Supabase service_role bypasses RLS: never expose its key to clients.
