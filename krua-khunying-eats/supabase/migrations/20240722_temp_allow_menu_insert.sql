-- Temporarily allow all authenticated users to manage menu items
-- This is for testing purposes

-- Drop existing policies
DROP POLICY IF EXISTS "Admin users can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Admin users can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Admin users can delete menu items" ON menu_items;

-- Create new policies that allow any authenticated user
CREATE POLICY "Authenticated users can insert menu items" ON menu_items
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update menu items" ON menu_items
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete menu items" ON menu_items
  FOR DELETE
  USING (auth.role() = 'authenticated');