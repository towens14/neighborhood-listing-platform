
-- Neighborhood Listing Platform
-- Migration 004: Merchant Booking RLS
-- Requires migration 003.
-- Customer cancellation will require a separate
-- secured workflow in a future migration.

BEGIN;

-- Enable RLS on all merchant booking tables.
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Reset client privileges.
REVOKE ALL ON
  public.merchants,
  public.merchant_services,
  public.availability_slots,
  public.appointments
FROM anon, authenticated;

-- Grant only required table operations.
GRANT SELECT ON public.merchants
  TO anon, authenticated;
GRANT INSERT, UPDATE ON public.merchants
  TO authenticated;

GRANT SELECT ON public.merchant_services
  TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE
  ON public.merchant_services TO authenticated;

GRANT SELECT ON public.availability_slots
  TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE
  ON public.availability_slots TO authenticated;

GRANT SELECT, INSERT ON public.appointments
  TO authenticated;

-- MERCHANTS

-- Public business directory.
CREATE POLICY "Public view merchants"
ON public.merchants
FOR SELECT TO anon, authenticated
USING (true);

-- Merchant owns newly created business.
CREATE POLICY "Owners create merchants"
ON public.merchants
FOR INSERT TO authenticated
WITH CHECK (owner_id = (SELECT auth.uid()));

-- Only owner can update business.
CREATE POLICY "Owners update merchants"
ON public.merchants
FOR UPDATE TO authenticated
USING (owner_id = (SELECT auth.uid()))
WITH CHECK (owner_id = (SELECT auth.uid()));

-- MERCHANT SERVICES

-- Public sees published services.
-- Owners also see their unpublished services.
CREATE POLICY "Read published or owned services"
ON public.merchant_services
FOR SELECT TO anon, authenticated
USING (
  is_published = true
  OR EXISTS (
    SELECT 1 FROM public.merchants m
    WHERE m.id = merchant_id
    AND m.owner_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Owners create services"
ON public.merchant_services
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.merchants m
    WHERE m.id = merchant_id
    AND m.owner_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Owners update services"
ON public.merchant_services
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.merchants m
    WHERE m.id = merchant_id
    AND m.owner_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.merchants m
    WHERE m.id = merchant_id
    AND m.owner_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Owners delete services"
ON public.merchant_services
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.merchants m
    WHERE m.id = merchant_id
    AND m.owner_id = (SELECT auth.uid())
  )
);

-- AVAILABILITY SLOTS

-- Visitors see available future slots
-- for published services.
-- Merchant owners see their own slots.
CREATE POLICY "Read available or owned slots"
ON public.availability_slots
FOR SELECT TO anon, authenticated
USING (
  (
    is_available = true
    AND start_time > now()
    AND EXISTS (
      SELECT 1 FROM public.merchant_services s
      WHERE s.id = service_id
      AND s.is_published = true
    )
  )
  OR EXISTS (
    SELECT 1
    FROM public.merchant_services s
    JOIN public.merchants m
      ON m.id = s.merchant_id
    WHERE s.id = service_id
    AND m.owner_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Owners create slots"
ON public.availability_slots
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.merchant_services s
    JOIN public.merchants m
      ON m.id = s.merchant_id
    WHERE s.id = service_id
    AND m.owner_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Owners update slots"
ON public.availability_slots
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.merchant_services s
    JOIN public.merchants m
      ON m.id = s.merchant_id
    WHERE s.id = service_id
    AND m.owner_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.merchant_services s
    JOIN public.merchants m
      ON m.id = s.merchant_id
    WHERE s.id = service_id
    AND m.owner_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Owners delete slots"
ON public.availability_slots
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.merchant_services s
    JOIN public.merchants m
      ON m.id = s.merchant_id
    WHERE s.id = service_id
    AND m.owner_id = (SELECT auth.uid())
  )
);

-- APPOINTMENTS

-- Customers see their own appointments.
-- Merchants see appointments for their services.
CREATE POLICY "Participants view appointments"
ON public.appointments
FOR SELECT TO authenticated
USING (
  customer_id = (SELECT auth.uid())
  OR EXISTS (
    SELECT 1
    FROM public.merchant_services s
    JOIN public.merchants m
      ON m.id = s.merchant_id
    WHERE s.id = service_id
    AND m.owner_id = (SELECT auth.uid())
  )
);

-- Customers may request a pending booking
-- only for a published, available, future slot.
CREATE POLICY "Customers request appointments"
ON public.appointments
FOR INSERT TO authenticated
WITH CHECK (
  customer_id = (SELECT auth.uid())
  AND status = 'pending'
  AND EXISTS (
    SELECT 1
    FROM public.availability_slots a
    JOIN public.merchant_services s
      ON s.id = a.service_id
    JOIN public.merchants m
      ON m.id = s.merchant_id
    WHERE a.id = slot_id
    AND a.service_id = service_id
    AND a.is_available = true
    AND a.start_time > now()
    AND s.is_published = true
    AND m.owner_id <> (SELECT auth.uid())
  )
);

-- Appointment modifications are intentionally
-- not granted to clients. A trusted cancellation
-- and confirmation workflow must be implemented.

COMMIT;
