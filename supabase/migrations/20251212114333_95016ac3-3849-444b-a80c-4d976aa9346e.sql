-- Add unique constraint on email to prevent duplicate subscriptions
ALTER TABLE public.newsletter_subscribers 
ADD CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email);