-- Row Level Security (RLS) Setup
-- Run this after creating tables

-- Enable RLS on all tables
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Public can read categories" ON menu_categories;
DROP POLICY IF EXISTS "Public can read available menu items" ON menu_items;
DROP POLICY IF EXISTS "Admins can manage menu items" ON menu_items;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create customers" ON customers;
DROP POLICY IF EXISTS "Admins can view customers" ON customers;

-- Public can read menu
CREATE POLICY "Public can read categories" ON menu_categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read available menu items" ON menu_items
    FOR SELECT USING (is_available = true);

-- Authenticated admins can manage menu
CREATE POLICY "Admins can manage menu items" ON menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );

-- Anyone can create customers and orders
CREATE POLICY "Anyone can create customers" ON customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- Admins can view customers
CREATE POLICY "Admins can view customers" ON customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );

-- Only admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );

-- Admins can update orders
CREATE POLICY "Admins can update orders" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );

-- Admin users policies
CREATE POLICY "Admins can view admin users" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );