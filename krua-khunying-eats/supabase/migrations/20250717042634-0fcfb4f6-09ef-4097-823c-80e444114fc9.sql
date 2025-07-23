-- Clean up duplicate subcategories for coffee
DELETE FROM subcategories 
WHERE category_id = (SELECT id FROM menu_categories WHERE name = 'กาแฟ')
AND created_at = '2025-07-17 04:23:00.431521+00';

-- Add some coffee menu items to make the category visible
INSERT INTO menu_items (name, name_en, description, price, category_id, is_available, is_popular)
SELECT 
  'กาแฟดำ' as name,
  'Black Coffee' as name_en,
  'กาแฟดำเข้มข้น' as description,
  35 as price,
  id as category_id,
  true as is_available,
  true as is_popular
FROM menu_categories WHERE name = 'กาแฟ'
UNION ALL
SELECT 
  'กาแฟโบราณ',
  'Traditional Coffee',
  'กาแฟโบราณหอมกรุ่น',
  30,
  id,
  true,
  false
FROM menu_categories WHERE name = 'กาแฟ'
UNION ALL
SELECT 
  'กาแฟเย็น',
  'Iced Coffee',
  'กาแฟเย็นสดชื่น',
  40,
  id,
  true,
  true
FROM menu_categories WHERE name = 'กาแฟ'
UNION ALL
SELECT 
  'กาแฟปั่น',
  'Blended Coffee',
  'กาแฟปั่นเข้มข้น',
  45,
  id,
  true,
  false
FROM menu_categories WHERE name = 'กาแฟ';