-- Script สำหรับสร้าง menu_with_options view ใน Supabase
-- รันใน SQL Editor หลังจากรัน fix-orders-table.sql แล้ว

-- 1. สร้าง View สำหรับแสดงเมนูพร้อม options
CREATE OR REPLACE VIEW menu_with_options AS
SELECT 
    mi.id,
    mi.name,
    mi.description,
    mi.price as base_price,
    mi.category_id,
    mc.name as category_name,
    mc.slug as category_slug,
    mi.is_available,
    mi.is_popular,
    mi.is_recommended,
    mi.is_hot,
    mo.id as option_id,
    mo.name as option_name,
    mo.price_adjustment,
    CASE 
        WHEN mo.price_adjustment IS NOT NULL 
        THEN mi.price + mo.price_adjustment 
        ELSE mi.price 
    END as final_price
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id
LEFT JOIN menu_options mo ON mi.id = mo.menu_item_id
WHERE mi.is_available = true
ORDER BY mc.id, mi.id, mo.id;

-- 2. Grant permissions
GRANT SELECT ON menu_with_options TO anon;
GRANT SELECT ON menu_with_options TO authenticated;

-- 3. ถ้าไม่มีตาราง menu_options ให้สร้างก่อน
CREATE TABLE IF NOT EXISTS menu_options (
    id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. เพิ่ม sample options (ถ้าต้องการ)
-- INSERT INTO menu_options (menu_item_id, name, price_adjustment) VALUES
-- (1, 'พิเศษ', 10),
-- (1, 'จัมโบ้', 20),
-- (2, 'พิเศษ', 10),
-- (3, 'พิเศษ', 10);

-- 5. ทดสอบ view
SELECT * FROM menu_with_options LIMIT 10;

-- 6. Alternative: ถ้าไม่ต้องการใช้ options สามารถสร้าง simple view
CREATE OR REPLACE VIEW menu_simple AS
SELECT 
    mi.id,
    mi.name,
    mi.description,
    mi.price,
    mi.category_id,
    mc.name as category_name,
    mc.slug as category_slug,
    mi.is_available,
    mi.is_popular,
    mi.is_recommended,
    mi.is_hot
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id
WHERE mi.is_available = true
ORDER BY mc.id, mi.id;

-- Grant permissions for simple view
GRANT SELECT ON menu_simple TO anon;
GRANT SELECT ON menu_simple TO authenticated;

-- 7. ตรวจสอบว่ามีข้อมูลเมนูหรือไม่
SELECT COUNT(*) as menu_count FROM menu_items;
SELECT COUNT(*) as category_count FROM menu_categories;

-- 8. ถ้าไม่มีข้อมูลเมนู ให้เพิ่ม sample data
-- ตรวจสอบก่อนว่ามี categories หรือยัง
INSERT INTO menu_categories (name, slug) 
SELECT * FROM (VALUES
    ('ข้าว', 'rice'),
    ('เส้น', 'noodle'),
    ('กับข้าว', 'sidedish'),
    ('ยำ', 'salad'),
    ('ย่าง/ทอด', 'grill'),
    ('ต้ม', 'soup'),
    ('ของหวาน', 'dessert'),
    ('เครื่องดื่ม', 'drinks')
) AS v(name, slug)
WHERE NOT EXISTS (SELECT 1 FROM menu_categories WHERE slug = v.slug);

-- เพิ่ม sample menu items
INSERT INTO menu_items (name, description, price, category_id, is_available, is_popular, is_recommended) 
SELECT * FROM (VALUES
    ('ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสด หอมกระเทียม', 60, 1, true, true, false),
    ('ข้าวผัดหมู', 'ข้าวผัดหมูนุ่ม ใส่ไข่', 50, 1, true, false, false),
    ('ข้าวผัดไก่', 'ข้าวผัดไก่ หอมพริกไทย', 50, 1, true, false, true),
    ('ผัดไทยกุ้งสด', 'ผัดไทยกุ้งสด รสชาติต้นตำรับ', 55, 2, true, true, false),
    ('ผัดซีอิ๊วหมู', 'เส้นใหญ่ผัดซีอิ๊ว หมูนุ่ม', 45, 2, true, false, false),
    ('ต้มยำกุ้ง', 'ต้มยำกุ้งน้ำข้น รสจัดจ้าน', 80, 6, true, false, true),
    ('ส้มตำไทย', 'ส้มตำไทย รสชาติกลมกล่อม', 40, 4, true, true, false),
    ('ไก่ทอด', 'ไก่ทอดกรอบ หอมกระเทียม', 50, 5, true, false, false),
    ('น้ำส้ม', 'น้ำส้มคั้นสด', 25, 8, true, false, false),
    ('ชาเขียว', 'ชาเขียวเย็น', 30, 8, true, false, false)
) AS v(name, description, price, category_id, is_available, is_popular, is_recommended)
WHERE NOT EXISTS (SELECT 1 FROM menu_items LIMIT 1);

-- 9. Enable RLS for menu tables
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_options ENABLE ROW LEVEL SECURITY;

-- Create policies for read access
CREATE POLICY "Anyone can view menu items" ON menu_items
FOR SELECT USING (true);

CREATE POLICY "Anyone can view categories" ON menu_categories
FOR SELECT USING (true);

CREATE POLICY "Anyone can view options" ON menu_options
FOR SELECT USING (true);

-- 10. Final check
SELECT 'Categories:', COUNT(*) FROM menu_categories
UNION ALL
SELECT 'Menu Items:', COUNT(*) FROM menu_items
UNION ALL
SELECT 'Available Items:', COUNT(*) FROM menu_items WHERE is_available = true;