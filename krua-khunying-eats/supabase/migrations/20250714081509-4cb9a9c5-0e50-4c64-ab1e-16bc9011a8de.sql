
-- อัปเดต delivery_method ให้รองรับ room_delivery
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_delivery_method_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_delivery_method_check 
CHECK (delivery_method IN ('pickup', 'room_delivery', 'dine_in'));

-- อัปเดต payment_method ให้รองรับการชำระเงินแบบใหม่
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_payment_method_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_payment_method_check 
CHECK (payment_method IN ('cash', 'transfer', 'promptpay'));

-- อัปเดต status ให้รองรับสถานะใหม่
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'));

-- เปิดใช้งาน realtime สำหรับตาราง orders
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.orders;

-- เปิดใช้งาน realtime สำหรับตาราง order_items
ALTER TABLE public.order_items REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.order_items;

-- สร้างฟังก์ชันสำหรับตรวจสอบสิทธิ์แอดมิน
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- สร้าง RLS policy สำหรับแอดมิน
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND public.is_admin(auth.uid())
    )
  );

-- สร้าง policy สำหรับแอดมินเพื่อดูข้อมูล profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));
