-- Add opening hours (JSON) and verified status columns to businesses
ALTER TABLE public.businesses
ADD COLUMN opening_hours jsonb DEFAULT NULL,
ADD COLUMN verified boolean DEFAULT false NOT NULL;