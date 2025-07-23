-- Step 3: เปิดใช้งาน Row Level Security
-- รันหลังจากเพิ่มข้อมูลแล้ว

-- Enable RLS on all tables
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
-- Menu Categories - ทุกคนอ่านได้
CREATE POLICY "Anyone can view categories" ON menu_categories
    FOR SELECT USING (true);

-- Menu Items - ทุกคนอ่านได้
CREATE POLICY "Anyone can view menu items" ON menu_items
    FOR SELECT USING (true);

-- Customers - ทุกคนสร้างและอ่านได้
CREATE POLICY "Anyone can create customers" ON customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view customers" ON customers
    FOR SELECT USING (true);

CREATE POLICY "Anyone can update customers" ON customers
    FOR UPDATE USING (true);

-- Orders - ทุกคนสร้างและอ่านได้
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Anyone can update orders" ON orders
    FOR UPDATE USING (true);

-- Order Items - ทุกคนสร้างและอ่านได้
CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view order items" ON order_items
    FOR SELECT USING (true);

-- Admin Users - ทุกคนอ่านได้ (ชั่วคราว)
CREATE POLICY "Anyone can view admin users" ON admin_users
    FOR SELECT USING (true);

-- Enable realtime for orders
ALTER publication supabase_realtime ADD TABLE orders;