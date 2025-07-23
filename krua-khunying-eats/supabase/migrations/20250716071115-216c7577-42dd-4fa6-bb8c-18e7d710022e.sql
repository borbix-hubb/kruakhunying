-- Update RLS policies for orders table to allow guest orders

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Create new policies that allow guest orders
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own orders or admins can view all" 
ON public.orders 
FOR SELECT 
USING (
  user_id IS NULL OR 
  auth.uid() = user_id OR 
  is_admin(auth.uid())
);

CREATE POLICY "Users can update their own orders or admins can update all" 
ON public.orders 
FOR UPDATE 
USING (
  user_id IS NULL OR 
  auth.uid() = user_id OR 
  is_admin(auth.uid())
);

-- Update order_items policies to match
DROP POLICY IF EXISTS "Users can create their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;

CREATE POLICY "Anyone can create order items for valid orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id
  )
);

CREATE POLICY "Users can view order items for their orders or admins can view all" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id IS NULL OR 
      orders.user_id = auth.uid() OR 
      is_admin(auth.uid())
    )
  )
);