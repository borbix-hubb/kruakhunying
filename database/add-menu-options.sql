-- Script สำหรับเพิ่มตัวเลือกเนื้อสัตว์ในเมนูอาหาร
-- รันใน Supabase SQL Editor

-- 1. สร้างตาราง menu_options ถ้ายังไม่มี
CREATE TABLE IF NOT EXISTS menu_options (
    id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. ลบ options เก่า (ถ้ามี)
DELETE FROM menu_options;

-- 3. เพิ่มตัวเลือกเนื้อสัตว์สำหรับเมนูข้าวผัด
-- ข้าวผัดทุกชนิด (สมมติว่า id 1-5 เป็นข้าวผัด)
DO $$
DECLARE
    menu_id INTEGER;
    base_price DECIMAL;
BEGIN
    -- Loop through rice dishes
    FOR menu_id IN 
        SELECT id FROM menu_items 
        WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'rice')
        AND (name LIKE '%ผัด%' OR name LIKE '%กะเพรา%')
    LOOP
        -- Get base price
        SELECT price INTO base_price FROM menu_items WHERE id = menu_id;
        
        -- Add meat options
        INSERT INTO menu_options (menu_item_id, name, price_adjustment) VALUES
        (menu_id, 'หมู', 0),
        (menu_id, 'ไก่', 0),
        (menu_id, 'เนื้อวัว', 5),
        (menu_id, 'กุ้ง', 10),
        (menu_id, 'ทะเลรวม', 20),
        (menu_id, 'ปลาหมึก', 15);
    END LOOP;
    
    -- Loop through noodle dishes
    FOR menu_id IN 
        SELECT id FROM menu_items 
        WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'noodle')
    LOOP
        -- Add meat options for noodles
        INSERT INTO menu_options (menu_item_id, name, price_adjustment) VALUES
        (menu_id, 'หมู', 0),
        (menu_id, 'ไก่', 0),
        (menu_id, 'เนื้อวัว', 5),
        (menu_id, 'กุ้ง', 10),
        (menu_id, 'ทะเลรวม', 20);
    END LOOP;
END $$;

-- 4. เพิ่มตัวเลือกพิเศษสำหรับบางเมนู
-- ตัวอย่าง: ถ้ามีเมนูต้มยำ
INSERT INTO menu_options (menu_item_id, name, price_adjustment)
SELECT id, option_name, price_adj
FROM menu_items 
CROSS JOIN (VALUES 
    ('กุ้ง', 10),
    ('ทะเลรวม', 20),
    ('ปลากระพง', 0),
    ('ไก่', -10)
) AS options(option_name, price_adj)
WHERE name LIKE '%ต้มยำ%';

-- 5. อัพเดท view menu_with_options (ถ้ามี)
DROP VIEW IF EXISTS menu_with_options CASCADE;

CREATE VIEW menu_with_options AS
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
    mi.price + COALESCE(mo.price_adjustment, 0) as final_price
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id
LEFT JOIN menu_options mo ON mi.id = mo.menu_item_id AND mo.is_available = true
WHERE mi.is_available = true
ORDER BY mc.id, mi.id, mo.id;

-- Grant permissions
GRANT SELECT ON menu_with_options TO anon;
GRANT SELECT ON menu_with_options TO authenticated;

-- 6. ตรวจสอบผลลัพธ์
SELECT 
    mi.name as menu_name,
    mo.name as option_name,
    mi.price as base_price,
    mo.price_adjustment,
    mi.price + mo.price_adjustment as final_price
FROM menu_items mi
JOIN menu_options mo ON mi.id = mo.menu_item_id
ORDER BY mi.id, mo.price_adjustment;

-- 7. ตัวอย่างการ query เมนูพร้อม options
SELECT 
    name,
    COUNT(*) as option_count,
    STRING_AGG(option_name || ' (฿' || final_price || ')', ', ') as all_options
FROM (
    SELECT 
        mi.name,
        mo.name as option_name,
        mi.price + mo.price_adjustment as final_price
    FROM menu_items mi
    JOIN menu_options mo ON mi.id = mo.menu_item_id
    ORDER BY mi.id, mo.price_adjustment
) sub
GROUP BY name
LIMIT 5;