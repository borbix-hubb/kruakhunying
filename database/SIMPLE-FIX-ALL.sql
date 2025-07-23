-- =========================================
-- Script แก้ไขทุกอย่างให้ใช้งานได้ (ฉบับง่าย)
-- Copy ทั้งหมดนี้ไปรันใน Supabase SQL Editor
-- =========================================

-- 1. แก้ตาราง orders (เพิ่ม column ที่ขาด)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS line_user_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(50) DEFAULT 'delivery',
ADD COLUMN IF NOT EXISTS delivery_dorm VARCHAR(100),
ADD COLUMN IF NOT EXISTS delivery_room VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_note TEXT;

-- 2. ปิด RLS ทั้งหมดให้ใช้งานได้ง่ายๆ
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories DISABLE ROW LEVEL SECURITY;

-- 3. ให้ทุกคนเข้าถึงได้
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. เพิ่มหมวดหมู่อาหาร
INSERT INTO menu_categories (name, slug) VALUES
('ข้าว', 'rice'),
('เส้น', 'noodle'),
('กับข้าว', 'sidedish'),
('เครื่องดื่ม', 'drinks')
ON CONFLICT DO NOTHING;

-- 5. เพิ่มเมนูอาหาร
INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
('ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสด', 60, 1, true),
('ข้าวผัดหมู', 'ข้าวผัดหมู', 50, 1, true),
('ผัดไทย', 'ผัดไทยกุ้งสด', 55, 2, true),
('ผัดซีอิ๊ว', 'ผัดซีอิ๊วหมู', 45, 2, true),
('ผัดกะเพรา', 'ผัดกะเพราหมู', 50, 3, true),
('ต้มยำกุ้ง', 'ต้มยำกุ้ง', 80, 3, true),
('น้ำส้ม', 'น้ำส้มคั้นสด', 25, 4, true),
('ชาเย็น', 'ชาเย็น', 30, 4, true)
ON CONFLICT DO NOTHING;

-- 6. สร้าง View แบบง่ายที่สุด
DROP VIEW IF EXISTS menu_with_options CASCADE;
CREATE VIEW menu_with_options AS
SELECT 
    mi.id,
    mi.name,
    mi.description,
    mi.price as base_price,
    mi.price as final_price,
    mi.category_id,
    mc.name as category_name,
    mc.slug as category_slug,
    mi.is_available,
    mi.is_popular,
    mi.is_recommended,
    mi.is_hot,
    null as option_id,
    'ปกติ' as option_name,
    0 as price_adjustment
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id
WHERE mi.is_available = true;

-- 7. ให้ทุกคนเข้าถึง view ได้
GRANT SELECT ON menu_with_options TO anon;

-- 8. แสดงผลลัพธ์
SELECT 'เมนูทั้งหมด:' as info, COUNT(*) as count FROM menu_items WHERE is_available = true
UNION ALL
SELECT 'หมวดหมู่:' as info, COUNT(*) as count FROM menu_categories;

-- เสร็จแล้ว! ✅