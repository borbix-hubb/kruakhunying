-- แก้ไข Foreign Key Relationships
-- รันใน Supabase SQL Editor

-- 1. ลบ constraint เก่าที่อาจผิด (ถ้ามี)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_menu_item_id_fkey;
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_id_fkey;

-- 2. เพิ่ม Foreign Key Constraints ใหม่
ALTER TABLE orders 
ADD CONSTRAINT orders_customer_id_fkey 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE order_items 
ADD CONSTRAINT order_items_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items 
ADD CONSTRAINT order_items_menu_item_id_fkey 
FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT;

ALTER TABLE menu_items 
ADD CONSTRAINT menu_items_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE SET NULL;

-- 3. สร้างข้อมูลทดสอบ
-- เพิ่ม Customer ทดสอบ
INSERT INTO customers (name, phone, dorm, room) VALUES 
('ลูกค้าทดสอบ 1', '0812345678', 'หอ A', '101'),
('ลูกค้าทดสอบ 2', '0823456789', 'หอ B', '202')
ON CONFLICT (phone) DO NOTHING;

-- เพิ่ม Order ทดสอบ
INSERT INTO orders (order_number, customer_id, total_amount, status, payment_method, delivery_dorm, delivery_room, note) 
SELECT 
    'TEST001',
    c.id,
    95.00,
    'pending',
    'cash',
    'หอ A',
    '101',
    'Order ทดสอบระบบ'
FROM customers c 
WHERE c.phone = '0812345678'
ON CONFLICT (order_number) DO NOTHING;

-- เพิ่ม Order Items ทดสอบ
INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal)
SELECT 
    o.id,
    m.id,
    1,
    m.price,
    m.price
FROM orders o, menu_items m
WHERE o.order_number = 'TEST001' 
AND m.name IN ('ข้าวผัดกุ้ง', 'ชาเย็น')
ON CONFLICT DO NOTHING;

-- 4. รีเฟรช Schema Cache
NOTIFY pgrst, 'reload schema';