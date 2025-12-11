-- Allow admins to manage user roles (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add SELECT policy for newsletter subscribers (admin only)
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add UPDATE/DELETE policies for newsletter subscribers (admin only)
CREATE POLICY "Admins can manage subscribers" ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));