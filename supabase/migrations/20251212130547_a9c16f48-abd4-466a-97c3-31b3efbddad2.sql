-- Add new business categories to the enum
ALTER TYPE public.business_category ADD VALUE IF NOT EXISTS 'Hotels & Accommodation';
ALTER TYPE public.business_category ADD VALUE IF NOT EXISTS 'Health & Wellbeing';