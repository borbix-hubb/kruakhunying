-- สร้างหมวดหมู่เครื่องดื่ม
INSERT INTO menu_categories (id, name, name_en, icon, sort_order, is_active) 
VALUES ('00000000-0000-0000-0000-000000000001', '🥤 เครื่องดื่ม', 'Beverages', '🥤', 100, true)
ON CONFLICT (id) DO NOTHING;

-- ย้ายรายการเมนูจากหมวดหมู่เก่าไปยังหมวดหมู่เครื่องดื่มใหม่
UPDATE menu_items 
SET category_id = '00000000-0000-0000-0000-000000000001'
WHERE category_id IN (
  'fec26326-3d01-420f-a11f-b7e4d52e2a4a', -- กาแฟ
  '15930484-23ae-45a5-8aff-1434b374941c', -- ไม่มีกาแฟ
  '178b44bf-425d-4301-b5f8-4f1d2a741b85', -- ชา
  '7842292a-8caf-45dd-8b41-4ec19ec75742', -- โซดา
  '863bd598-1d60-464e-ad22-5d3155609d45'  -- สมูทตี้
);

-- ย้ายรายการเมนูที่ไม่มี category_id ไปยังหมวดหมู่เครื่องดื่ม
UPDATE menu_items 
SET category_id = '00000000-0000-0000-0000-000000000001'
WHERE category_id IS NULL;

-- ลบหมวดหมู่เก่าที่ไม่ใช้แล้ว
DELETE FROM menu_categories 
WHERE id IN (
  'fec26326-3d01-420f-a11f-b7e4d52e2a4a', -- กาแฟ
  '15930484-23ae-45a5-8aff-1434b374941c', -- ไม่มีกาแฟ
  '178b44bf-425d-4301-b5f8-4f1d2a741b85', -- ชา
  '7842292a-8caf-45dd-8b41-4ec19ec75742', -- โซดา
  '863bd598-1d60-464e-ad22-5d3155609d45'  -- สมูทตี้
);

-- ลบรายการเมนูที่ซ้ำกัน โดยเก็บรายการที่มี ID เก่าที่สุด
WITH duplicates AS (
  SELECT 
    name,
    MIN(created_at) as first_created,
    array_agg(id ORDER BY created_at) as all_ids
  FROM menu_items
  WHERE category_id = '00000000-0000-0000-0000-000000000001'
  GROUP BY name
  HAVING COUNT(*) > 1
)
DELETE FROM menu_items 
WHERE id IN (
  SELECT unnest(all_ids[2:]) 
  FROM duplicates
);