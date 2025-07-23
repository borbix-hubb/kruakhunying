
-- Add address fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN room_number text,
ADD COLUMN building text,
ADD COLUMN address text;

-- Create menu management table for tracking menu changes (optional for audit)
CREATE TABLE public.menu_management_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES public.profiles(id),
  action text NOT NULL, -- 'create', 'update', 'delete', 'toggle_availability'
  menu_item_id uuid REFERENCES public.menu_items(id),
  old_values jsonb,
  new_values jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on menu management log
ALTER TABLE public.menu_management_log ENABLE ROW LEVEL SECURITY;

-- Create policy for menu management log (only admins can view)
CREATE POLICY "Admins can view menu management log" 
  ON public.menu_management_log 
  FOR SELECT 
  USING (is_admin(auth.uid()));

-- Create policy for menu management log (only admins can insert)
CREATE POLICY "Admins can insert menu management log" 
  ON public.menu_management_log 
  FOR INSERT 
  WITH CHECK (is_admin(auth.uid()));

-- Allow admins to manage menu items
CREATE POLICY "Admins can insert menu items" 
  ON public.menu_items 
  FOR INSERT 
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update menu items" 
  ON public.menu_items 
  FOR UPDATE 
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete menu items" 
  ON public.menu_items 
  FOR DELETE 
  USING (is_admin(auth.uid()));

-- Allow admins to manage menu categories
CREATE POLICY "Admins can insert menu categories" 
  ON public.menu_categories 
  FOR INSERT 
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update menu categories" 
  ON public.menu_categories 
  FOR UPDATE 
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete menu categories" 
  ON public.menu_categories 
  FOR DELETE 
  USING (is_admin(auth.uid()));
