-- Script สำหรับแก้ไขตาราง orders ใน Supabase
-- รันใน SQL Editor ของ Supabase Dashboard

-- 1. เพิ่ม LINE user ID column (ถ้ายังไม่มี)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS line_user_id VARCHAR(255);

-- 2. เพิ่ม delivery columns (ถ้ายังไม่มี)
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_dorm VARCHAR(100),
ADD COLUMN IF NOT EXISTS delivery_room VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_note TEXT;

-- 3. สร้าง index สำหรับ performance
CREATE INDEX IF NOT EXISTS idx_orders_line_user_id ON orders(line_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 4. Enable RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 5. สร้าง policies สำหรับ anonymous users
-- Allow insert for all users
CREATE POLICY "Enable insert for all users" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON orders
FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON orders
FOR UPDATE USING (true);

-- Policies for customers table
CREATE POLICY "Enable insert for all users" ON customers
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON customers
FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON customers
FOR UPDATE USING (true);

-- Policies for order_items table
CREATE POLICY "Enable insert for all users" ON order_items
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON order_items
FOR SELECT USING (true);

-- 6. ตรวจสอบโครงสร้างตาราง
SELECT 
    column_name, 
    data_type,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 7. ทดสอบ query ที่ใช้ใน LIFF
-- ตัวอย่างการ query orders พร้อม customer info
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.total_amount,
    o.line_user_id,
    o.created_at,
    c.name as customer_name,
    c.phone as customer_phone,
    json_agg(
        json_build_object(
            'name', mi.name,
            'quantity', oi.quantity,
            'price', oi.price
        )
    ) as items
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
WHERE o.line_user_id IS NOT NULL
GROUP BY o.id, c.name, c.phone
ORDER BY o.created_at DESC
LIMIT 10;

-- 8. Function สำหรับสร้าง order (optional - ถ้าต้องการใช้)
CREATE OR REPLACE FUNCTION create_order_with_customer(
    p_name TEXT,
    p_phone TEXT,
    p_dorm TEXT,
    p_room TEXT,
    p_total DECIMAL,
    p_items JSONB,
    p_line_user_id TEXT DEFAULT NULL,
    p_note TEXT DEFAULT NULL,
    p_payment_method TEXT DEFAULT 'cash',
    p_delivery_method TEXT DEFAULT 'delivery'
) RETURNS JSON AS $$
DECLARE
    v_customer_id INTEGER;
    v_order_id INTEGER;
    v_order_number TEXT;
BEGIN
    -- Get or create customer
    SELECT id INTO v_customer_id 
    FROM customers 
    WHERE phone = p_phone;
    
    IF v_customer_id IS NULL THEN
        INSERT INTO customers (name, phone, dorm, room)
        VALUES (p_name, p_phone, p_dorm, p_room)
        RETURNING id INTO v_customer_id;
    ELSE
        -- Update existing customer info
        UPDATE customers 
        SET name = p_name, dorm = p_dorm, room = p_room
        WHERE id = v_customer_id;
    END IF;
    
    -- Generate order number
    v_order_number := 'ORD' || LPAD(nextval('orders_id_seq')::TEXT, 6, '0');
    
    -- Create order
    INSERT INTO orders (
        order_number, 
        customer_id, 
        total_amount, 
        status, 
        line_user_id, 
        delivery_dorm, 
        delivery_room,
        note,
        payment_method,
        delivery_method
    ) VALUES (
        v_order_number,
        v_customer_id, 
        p_total, 
        'pending', 
        p_line_user_id, 
        p_dorm, 
        p_room,
        p_note,
        p_payment_method,
        p_delivery_method
    ) RETURNING id INTO v_order_id;
    
    -- Create order items
    INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal)
    SELECT 
        v_order_id,
        (item->>'id')::INTEGER,
        (item->>'quantity')::INTEGER,
        (item->>'price')::DECIMAL,
        ((item->>'quantity')::INTEGER * (item->>'price')::DECIMAL)
    FROM jsonb_array_elements(p_items) AS item;
    
    -- Return order info
    RETURN json_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- 9. Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;