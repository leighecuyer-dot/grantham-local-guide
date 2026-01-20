-- Add Google review fields to businesses table
ALTER TABLE public.businesses
ADD COLUMN google_rating numeric,
ADD COLUMN google_reviews_url text;