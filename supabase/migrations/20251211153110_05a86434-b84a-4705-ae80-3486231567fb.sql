-- Create enum for business categories
CREATE TYPE public.business_category AS ENUM (
  'Café',
  'Restaurant',
  'Barbers',
  'Beauty',
  'Retail',
  'Trades',
  'Kids Activities',
  'Services',
  'Gyms & Fitness',
  'Sport Clubs'
);

-- Create enum for business tags
CREATE TYPE public.business_tag AS ENUM (
  'Independent',
  'Family-run',
  'Local favourite',
  'Hidden gem',
  'Award-winning',
  'Eco-friendly'
);

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category business_category NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  town TEXT NOT NULL DEFAULT 'grantham',
  phone TEXT,
  website TEXT,
  instagram TEXT,
  email TEXT,
  image TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  tripadvisor_rating NUMERIC(2,1),
  tripadvisor_url TEXT,
  tags business_tag[] DEFAULT '{}',
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Public read access for all businesses
CREATE POLICY "Anyone can view businesses"
ON public.businesses
FOR SELECT
USING (true);

-- Create user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin policies for businesses
CREATE POLICY "Admins can insert businesses"
ON public.businesses
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update businesses"
ON public.businesses
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete businesses"
ON public.businesses
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for common queries
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_town ON public.businesses(town);
CREATE INDEX idx_businesses_featured ON public.businesses(featured);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);