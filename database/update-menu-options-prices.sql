-- Update menu options to have clearer price differences
-- This script updates existing menu options with more realistic price adjustments

-- Clear existing menu options first
TRUNCATE TABLE menu_options RESTART IDENTITY CASCADE;

-- Insert menu options with proper price adjustments
-- For noodle dishes (ก๋วยเตี๋ยว, บะหมี่)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items 
WHERE name LIKE 'ก๋วยเตี๋ยว%' OR name LIKE 'บะหมี่%' OR name LIKE 'ราดหน้า%' OR name LIKE 'ผัดซีอิ๊ว%';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items 
WHERE name LIKE 'ก๋วยเตี๋ยว%' OR name LIKE 'บะหมี่%' OR name LIKE 'ราดหน้า%' OR name LIKE 'ผัดซีอิ๊ว%';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เนื้อ', 10 FROM menu_items 
WHERE name LIKE 'ก๋วยเตี๋ยว%' OR name LIKE 'บะหมี่%' OR name LIKE 'ราดหน้า%' OR name LIKE 'ผัดซีอิ๊ว%';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 15 FROM menu_items 
WHERE name LIKE 'ก๋วยเตี๋ยว%' OR name LIKE 'บะหมี่%' OR name LIKE 'ราดหน้า%' OR name LIKE 'ผัดซีอิ๊ว%';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'รวมมิตร', 20 FROM menu_items 
WHERE name LIKE 'ก๋วยเตี๋ยว%' OR name LIKE 'บะหมี่%' OR name LIKE 'ราดหน้า%' OR name LIKE 'ผัดซีอิ๊ว%';

-- For rice dishes (ข้าวผัด, ผัดกะเพรา)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ธรรมดา', 0 FROM menu_items 
WHERE name LIKE 'ข้าวผัด%' OR name LIKE 'ผัดกะเพรา%';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไข่ดาว', 10 FROM menu_items 
WHERE name LIKE 'ข้าวผัด%' OR name LIKE 'ผัดกะเพรา%';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไข่ดาว + พิเศษ', 20 FROM menu_items 
WHERE name LIKE 'ข้าวผัด%' OR name LIKE 'ผัดกะเพรา%';

-- For special rice dishes (ข้าวมันไก่, ข้าวหมูแดง, ข้าวหมูกรอบ)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ธรรมดา', 0 FROM menu_items 
WHERE name IN ('ข้าวมันไก่', 'ข้าวหมูแดง', 'ข้าวหมูกรอบ', 'ข้าวขาหมู');

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'พิเศษ', 10 FROM menu_items 
WHERE name IN ('ข้าวมันไก่', 'ข้าวหมูแดง', 'ข้าวหมูกรอบ', 'ข้าวขาหมู');

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'พิเศษมาก', 20 FROM menu_items 
WHERE name IN ('ข้าวมันไก่', 'ข้าวหมูแดง', 'ข้าวหมูกรอบ', 'ข้าวขาหมู');

-- For salad dishes (ยำ, ลาบ)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไม่เผ็ด', 0 FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'salads');

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เผ็ดน้อย', 0 FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'salads');

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เผ็ดกลาง', 0 FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'salads');

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เผ็ดมาก', 0 FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'salads');

-- For somtam (ส้มตำ)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไม่ใส่ปู', 0 FROM menu_items 
WHERE name = 'ส้มตำไทย';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ใส่ปูดอง', 10 FROM menu_items 
WHERE name = 'ส้มตำไทย';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ใส่กุ้งแห้ง', 5 FROM menu_items 
WHERE name = 'ส้มตำไทย';

-- Special combinations for specific dishes
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
VALUES 
((SELECT id FROM menu_items WHERE name = 'ผัดไทยกุ้งสด' LIMIT 1), 'กุ้งธรรมดา', 0),
((SELECT id FROM menu_items WHERE name = 'ผัดไทยกุ้งสด' LIMIT 1), 'กุ้งแม่น้ำ', 20),
((SELECT id FROM menu_items WHERE name = 'ผัดไทยกุ้งสด' LIMIT 1), 'กุ้งแม่น้ำใหญ่', 40);

-- Show summary
SELECT 
    mi.name as menu_item,
    mi.price as base_price,
    mo.option_name,
    mo.price_adjustment,
    (mi.price + mo.price_adjustment) as total_price
FROM menu_options mo
JOIN menu_items mi ON mo.menu_item_id = mi.id
ORDER BY mi.name, mo.price_adjustment;