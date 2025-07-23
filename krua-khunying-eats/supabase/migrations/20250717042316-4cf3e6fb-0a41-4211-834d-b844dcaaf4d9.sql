-- Add subcategories for coffee section
-- First get the coffee category ID
INSERT INTO subcategories (name, name_en, category_id, sort_order, is_active)
SELECT 'ทั้งหมด', 'All', id, 1, true FROM menu_categories WHERE name = 'กาแฟ'
UNION ALL
SELECT 'ร้อน', 'Hot', id, 2, true FROM menu_categories WHERE name = 'กาแฟ'
UNION ALL
SELECT 'เย็น', 'Cold', id, 3, true FROM menu_categories WHERE name = 'กาแฟ'
UNION ALL
SELECT 'ปั่น', 'Blended', id, 4, true FROM menu_categories WHERE name = 'กาแฟ';