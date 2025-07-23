-- ลบเมนู SIP IT ทั้งหมด
-- ลบเมนูที่มี (SIP IT) ในชื่อ
DELETE FROM menu_items WHERE name LIKE '%(SIP IT)%';

-- ลบเมนูที่มี SIP IT ในคำอธิบาย
DELETE FROM menu_items WHERE description LIKE '%SIP IT%';

-- ลบเมนูที่มี emoji หน้าชื่อและอยู่ในหมวดเครื่องดื่ม (เมนู SIP IT ที่ใช้ emoji แยกประเภท)
DELETE FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE name = '🥤 เครื่องดื่ม')
AND (
    name LIKE '☕%' OR  -- กาแฟ
    name LIKE '🥛%' OR  -- ไม่มีกาแฟ/นม
    name LIKE '🍵%' OR  -- ชา
    name LIKE '🧊%' OR  -- โซดา
    name LIKE '🍓%'     -- สมูทตี้
);

-- ลบหมวดหมู่ SIP IT (ถ้ามี)
DELETE FROM menu_categories WHERE name IN (
    '☕ กาแฟ (SIP IT)',
    '🥤 ไม่มีกาแฟ (SIP IT)', 
    '🍵 ชา (SIP IT)',
    '🧊 โซดา (SIP IT)',
    '🍓 สมูทตี้ (SIP IT)',
    '🔥 ยอดนิยม (SIP IT)',
    '☕ กาแฟ',
    '🥤 ไม่มีกาแฟ',
    '🍵 ชา',
    '🧊 โซดา',
    '🍓 สมูทตี้'
);

-- แสดงจำนวนรายการที่ถูกลบ
DO $$
BEGIN
    RAISE NOTICE 'ลบเมนู SIP IT เรียบร้อยแล้ว';
END $$;