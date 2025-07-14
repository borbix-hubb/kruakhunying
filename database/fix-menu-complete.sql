-- Script สำหรับแก้ไขปัญหาเมนูไม่แสดง (ฉบับสมบูรณ์)
-- รันทั้งหมดใน SQL Editor ของ Supabase

-- 1. สร้างตาราง menu_options ก่อน (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS menu_options (
    id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. ตรวจสอบและเพิ่ม categories ถ้ายังไม่มี
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

-- 3. เพิ่ม sample menu items ถ้ายังไม่มี
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM menu_items LIMIT 1) THEN
        INSERT INTO menu_items (name, description, price, category_id, is_available, is_popular, is_recommended) VALUES
        ('ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสด หอมกระเทียม', 60, (SELECT id FROM menu_categories WHERE slug = 'rice'), true, true, false),
        ('ข้าวผัดหมู', 'ข้าวผัดหมูนุ่ม ใส่ไข่', 50, (SELECT id FROM menu_categories WHERE slug = 'rice'), true, false, false),
        ('ข้าวผัดไก่', 'ข้าวผัดไก่ หอมพริกไทย', 50, (SELECT id FROM menu_categories WHERE slug = 'rice'), true, false, true),
        ('ข้าวผัดปู', 'ข้าวผัดปู เนื้อปูแน่นๆ', 80, (SELECT id FROM menu_categories WHERE slug = 'rice'), true, false, true),
        ('ผัดไทยกุ้งสด', 'ผัดไทยกุ้งสด รสชาติต้นตำรับ', 55, (SELECT id FROM menu_categories WHERE slug = 'noodle'), true, true, false),
        ('ผัดซีอิ๊วหมู', 'เส้นใหญ่ผัดซีอิ๊ว หมูนุ่ม', 45, (SELECT id FROM menu_categories WHERE slug = 'noodle'), true, false, false),
        ('ราดหน้าหมู', 'ราดหน้าเส้นใหญ่ น้ำข้นกำลังดี', 50, (SELECT id FROM menu_categories WHERE slug = 'noodle'), true, false, false),
        ('ต้มยำกุ้ง', 'ต้มยำกุ้งน้ำข้น รสจัดจ้าน', 80, (SELECT id FROM menu_categories WHERE slug = 'soup'), true, false, true),
        ('ส้มตำไทย', 'ส้มตำไทย รสชาติกลมกล่อม', 40, (SELECT id FROM menu_categories WHERE slug = 'salad'), true, true, false),
        ('ส้มตำปู', 'ส้มตำใส่ปูดอง', 50, (SELECT id FROM menu_categories WHERE slug = 'salad'), true, false, false),
        ('ไก่ทอด', 'ไก่ทอดกรอบ หอมกระเทียม', 50, (SELECT id FROM menu_categories WHERE slug = 'grill'), true, false, false),
        ('หมูกรอบ', 'หมูกรอบคั่วพริกเกลือ', 60, (SELECT id FROM menu_categories WHERE slug = 'grill'), true, true, false),
        ('น้ำส้ม', 'น้ำส้มคั้นสด', 25, (SELECT id FROM menu_categories WHERE slug = 'drinks'), true, false, false),
        ('ชาเขียว', 'ชาเขียวเย็น', 30, (SELECT id FROM menu_categories WHERE slug = 'drinks'), true, false, false),
        ('โค้ก', 'โค้กเย็น', 20, (SELECT id FROM menu_categories WHERE slug = 'drinks'), true, false, false);
    END IF;
END $$;

-- 4. สร้าง View แบบง่าย (ไม่มี options)
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
    NULL::integer as option_id,
    'ปกติ'::varchar as option_name,
    0::decimal as price_adjustment,
    mi.price as final_price
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id
WHERE mi.is_available = true
ORDER BY mc.id, mi.id;

-- 5. Enable RLS และ Policies
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_options ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view menu items" ON menu_items;
DROP POLICY IF EXISTS "Anyone can view categories" ON menu_categories;
DROP POLICY IF EXISTS "Anyone can view options" ON menu_options;

-- Create new policies
CREATE POLICY "Anyone can view menu items" ON menu_items
FOR SELECT USING (true);

CREATE POLICY "Anyone can view categories" ON menu_categories
FOR SELECT USING (true);

CREATE POLICY "Anyone can view options" ON menu_options
FOR SELECT USING (true);

-- 6. Grant permissions
GRANT SELECT ON menu_with_options TO anon;
GRANT SELECT ON menu_with_options TO authenticated;
GRANT SELECT ON menu_items TO anon;
GRANT SELECT ON menu_categories TO anon;
GRANT SELECT ON menu_options TO anon;

-- 7. ตรวจสอบผลลัพธ์
DO $$
DECLARE
    cat_count INTEGER;
    item_count INTEGER;
    available_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO cat_count FROM menu_categories;
    SELECT COUNT(*) INTO item_count FROM menu_items;
    SELECT COUNT(*) INTO available_count FROM menu_items WHERE is_available = true;
    
    RAISE NOTICE 'Categories: %', cat_count;
    RAISE NOTICE 'Total Menu Items: %', item_count;
    RAISE NOTICE 'Available Items: %', available_count;
END $$;

-- 8. ทดสอบ view
SELECT 
    id,
    name,
    description,
    base_price,
    category_name,
    is_popular,
    is_recommended
FROM menu_with_options 
LIMIT 5;

-- 9. ทดสอบ query ที่ app ใช้
SELECT * FROM menu_with_options ORDER BY category_id, id LIMIT 10;