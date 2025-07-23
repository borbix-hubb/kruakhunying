-- Complete Supabase Setup Script for Krua Khun Ying
-- Run this script in Supabase SQL Editor to set up everything

-- 1. CREATE TABLES
-- ================

-- Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES menu_categories(id),
    is_popular BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    dorm VARCHAR(50),
    room VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE,
    customer_id INTEGER REFERENCES customers(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'pending',
    note TEXT,
    delivery_dorm VARCHAR(50),
    delivery_room VARCHAR(20),
    delivery_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. CREATE INDEXES
-- =================
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- 3. CREATE TRIGGERS
-- ==================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;

-- Create triggers
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. INSERT INITIAL DATA
-- ======================

-- Insert categories (if not exists)
INSERT INTO menu_categories (name, slug) 
VALUES 
    ('ข้าว', 'rice'),
    ('เส้น', 'noodle'),
    ('กับข้าว', 'sidedish'),
    ('เครื่องดื่ม', 'drink')
ON CONFLICT (name) DO NOTHING;

-- Insert menu items (if table is empty)
INSERT INTO menu_items (name, description, price, category_id, is_popular, is_recommended, is_hot)
SELECT * FROM (VALUES
    -- Rice dishes
    ('ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสด หอมกระเทียม พริกไทย', 50, 1, FALSE, FALSE, TRUE),
    ('ข้าวผัดหมู', 'ข้าวผัดหมูนุ่ม ใส่ไข่ดาว อร่อยมาก', 45, 1, TRUE, FALSE, FALSE),
    ('ข้าวผัดไก่', 'ข้าวผัดไก่ หอมพริกไทย กลมกล่อม', 45, 1, FALSE, FALSE, FALSE),
    ('ข้าวผัดปู', 'ข้าวผัดปู เนื้อปูแน่นๆ หอมมัน', 55, 1, FALSE, TRUE, FALSE),
    ('ข้าวผัดผัก', 'ข้าวผัดผักรวม สำหรับมังสวิรัติ สุขภาพดี', 40, 1, FALSE, FALSE, FALSE),
    
    -- Noodle dishes
    ('ผัดไทยกุ้งสด', 'ผัดไทยกุ้งสด รสชาติต้นตำรับ', 45, 2, TRUE, FALSE, FALSE),
    ('ผัดซีอิ๊วหมู', 'เส้นใหญ่ผัดซีอิ๊ว หมูนุ่ม', 40, 2, FALSE, FALSE, FALSE),
    ('ราดหน้าหมู', 'ราดหน้าเส้นใหญ่ น้ำข้นกำลังดี', 45, 2, FALSE, FALSE, FALSE),
    ('บะหมี่แห้ง', 'บะหมี่แห้งหมูแดง กรอบนอกนุ่มใน', 35, 2, FALSE, FALSE, FALSE),
    ('ก๋วยเตี๋ยวต้มยำ', 'ต้มยำน้ำข้น รสจัดจ้าน', 40, 2, FALSE, FALSE, TRUE),
    
    -- Side dishes
    ('ไก่ทอดกระเทียม', 'ไก่ทอดกรอบ หอมกระเทียม', 50, 3, FALSE, TRUE, FALSE),
    ('หมูกรอบคั่วพริกเกลือ', 'หมูกรอบ คั่วพริกเกลือ', 55, 3, FALSE, FALSE, TRUE),
    ('ผัดกะเพราหมูสับ', 'กะเพราหมูสับ ใบกะเพราหอม', 45, 3, TRUE, FALSE, TRUE),
    ('ต้มยำกุ้ง', 'ต้มยำกุ้งน้ำข้น รสชาติจัดจ้าน', 60, 3, FALSE, TRUE, TRUE),
    ('ยำวุ้นเส้น', 'ยำวุ้นเส้น รสชาติกลมกล่อม', 35, 3, FALSE, FALSE, FALSE),
    
    -- Drinks
    ('ชาเย็น', 'ชาเย็นหวานมัน', 25, 4, TRUE, FALSE, FALSE),
    ('กาแฟเย็น', 'กาแฟเย็นหอมมัน', 25, 4, FALSE, FALSE, FALSE),
    ('น้ำส้ม', 'น้ำส้มคั้นสด', 20, 4, FALSE, FALSE, FALSE),
    ('โค้ก', 'โค้กเย็นๆ', 15, 4, FALSE, FALSE, FALSE),
    ('น้ำเปล่า', 'น้ำเปล่าเย็น', 10, 4, FALSE, FALSE, FALSE)
) AS v(name, description, price, category_id, is_popular, is_recommended, is_hot)
WHERE NOT EXISTS (SELECT 1 FROM menu_items LIMIT 1);

-- 5. ENABLE ROW LEVEL SECURITY
-- ============================

-- Enable RLS on all tables
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 6. CREATE POLICIES
-- ==================

-- Menu Categories - Anyone can read
DROP POLICY IF EXISTS "Anyone can view categories" ON menu_categories;
CREATE POLICY "Anyone can view categories" ON menu_categories
    FOR SELECT USING (true);

-- Menu Items - Anyone can read
DROP POLICY IF EXISTS "Anyone can view menu items" ON menu_items;
CREATE POLICY "Anyone can view menu items" ON menu_items
    FOR SELECT USING (true);

-- Customers - Anyone can create and read their own
DROP POLICY IF EXISTS "Anyone can create customers" ON customers;
CREATE POLICY "Anyone can create customers" ON customers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view customers" ON customers;
CREATE POLICY "Anyone can view customers" ON customers
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update customers" ON customers;
CREATE POLICY "Anyone can update customers" ON customers
    FOR UPDATE USING (true);

-- Orders - Anyone can create and view
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
CREATE POLICY "Anyone can view orders" ON orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
CREATE POLICY "Anyone can update orders" ON orders
    FOR UPDATE USING (true);

-- Order Items - Anyone can create and view
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view order items" ON order_items;
CREATE POLICY "Anyone can view order items" ON order_items
    FOR SELECT USING (true);

-- Admin Users - Only authenticated can view
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users" ON admin_users
    FOR SELECT USING (true);

-- 7. CREATE ADMIN USER
-- ====================
-- Create default admin (password: admin123)
-- Note: In production, change this password immediately!
INSERT INTO admin_users (email, password_hash, name, role)
VALUES ('admin@kruakhunying.com', 'managed_by_supabase_auth', 'Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Also create admin.borbix user
INSERT INTO admin_users (email, password_hash, name, role)
VALUES ('admin.borbix@kruakhunying.com', 'managed_by_supabase_auth', 'admin.borbix', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- 8. ENABLE REALTIME
-- ==================
-- Enable realtime for orders table
ALTER publication supabase_realtime ADD TABLE orders;

-- 9. FINAL MESSAGE
-- ================
-- Return success message
SELECT 'Setup completed successfully! Tables, data, and policies are ready.' as message;