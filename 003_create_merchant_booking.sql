
-- Neighborhood Listing Platform
-- Migration 003: Local Merchant Services & Appointment Booking
-- Apply after migrations 001 and 002.

BEGIN;

-- 1. Merchant profiles
CREATE TABLE public.merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  business_name TEXT NOT NULL
    CHECK (length(trim(business_name)) BETWEEN 2 AND 120),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Services offered by merchants
CREATE TABLE public.merchant_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL
    REFERENCES public.merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL
    CHECK (length(trim(name)) BETWEEN 2 AND 120),
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  duration_minutes INTEGER NOT NULL
    CHECK (duration_minutes BETWEEN 5 AND 480),
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (id, merchant_id)
);

-- 3. Available appointment slots
CREATE TABLE public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL
    REFERENCES public.merchant_services(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  CHECK (end_time > start_time),
  UNIQUE (id, service_id),
  UNIQUE (service_id, start_time)
);

-- 4. Customer appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  service_id UUID NOT NULL,
  slot_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (slot_id, service_id)
    REFERENCES public.availability_slots(id, service_id)
);

-- Prevent two active appointments for the same slot.
CREATE UNIQUE INDEX appointments_active_slot_idx
  ON public.appointments(slot_id)
  WHERE status IN ('pending', 'confirmed');

-- Supporting indexes
CREATE INDEX merchants_owner_idx
  ON public.merchants(owner_id);

CREATE INDEX merchant_services_merchant_idx
  ON public.merchant_services(merchant_id);

CREATE INDEX availability_service_start_idx
  ON public.availability_slots(service_id, start_time);

CREATE INDEX appointments_customer_idx
  ON public.appointments(customer_id);

-- Enable RLS. Policies will be added and tested
-- in Part 4 before client access is granted.
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- No client access until authorization is reviewed.
REVOKE ALL ON
  public.merchants,
  public.merchant_services,
  public.availability_slots,
  public.appointments
FROM anon, authenticated;

COMMIT;
