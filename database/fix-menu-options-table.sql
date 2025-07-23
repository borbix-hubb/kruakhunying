-- แก้ไขปัญหา policy ที่ซ้ำ
-- ลบ policies เก่าก่อน
DROP POLICY IF EXISTS "Allow public read menu_options" ON menu_options;
DROP POLICY IF EXISTS "Allow authenticated insert menu_options" ON menu_options;
DROP POLICY IF EXISTS "Allow authenticated update menu_options" ON menu_options;
DROP POLICY IF EXISTS "Allow authenticated delete menu_options" ON menu_options;

-- สร้าง policies ใหม่
CREATE POLICY "Allow public read menu_options" ON menu_options
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert menu_options" ON menu_options
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update menu_options" ON menu_options
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete menu_options" ON menu_options
    FOR DELETE USING (auth.role() = 'authenticated');

-- ตรวจสอบว่ามีข้อมูลหรือไม่
SELECT COUNT(*) as total_menu_items FROM menu_items;
SELECT COUNT(*) as total_menu_options FROM menu_options;

-- ดูข้อมูลตัวอย่าง
SELECT 
    mi.id,
    mi.name as menu_name,
    mi.price,
    mc.name as category_name
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id
ORDER BY mi.category_id, mi.id
LIMIT 10;