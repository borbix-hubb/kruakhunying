-- Add Sipit drink shop category and menu items
-- This script adds the new category "ร้านน้ำ Sipit" and all its menu items

-- 1. Insert new category
INSERT INTO menu_categories (name, slug) 
VALUES ('ร้านน้ำ Sipit', 'sipit-drinks')
ON CONFLICT (slug) DO NOTHING;

-- 2. Get the category ID
DO $$
DECLARE
    cat_id INTEGER;
BEGIN
    SELECT id INTO cat_id FROM menu_categories WHERE slug = 'sipit-drinks';
    
    -- 3. Insert Coffee menu items
    INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
    ('อเมริกาโน่', 'กาแฟอเมริกาโน่', 35, cat_id, true),
    ('อเมริกาโน่น้ำผึ้ง', 'อเมริกาโน่ผสมน้ำผึ้ง', 40, cat_id, true),
    ('อเมริกาโน่น้ำผึ้งมะนาว', 'อเมริกาโน่ผสมน้ำผึ้งและมะนาว', 45, cat_id, true),
    ('อเมริกาโน่น้ำส้ม', 'อเมริกาโน่ผสมน้ำส้ม', 40, cat_id, true),
    ('อเมริกาโน่มิ้นท์', 'อเมริกาโน่รสมิ้นท์', 45, cat_id, true),
    ('อเมริกาโน่มะพร้าว', 'อเมริกาโน่ผสมมะพร้าว', 35, cat_id, true),
    ('คาปูชิโน่', 'คาปูชิโน่หอมนุ่ม', 40, cat_id, true),
    ('เอสเพรสโซ่', 'เอสเพรสโซ่เข้มข้น', 40, cat_id, true),
    ('ลาเต้', 'ลาเต้นุ่มละมุน', 40, cat_id, true),
    ('มอคค่า', 'มอคค่าหอมหวาน', 40, cat_id, true),
    ('คาราเมลมัคคิอาโต้', 'มัคคิอาโต้คาราเมล', 45, cat_id, true),
    ('คาราเมลลาเต้', 'ลาเต้คาราเมล', 45, cat_id, true),
    ('วานิลลาลาเต้', 'ลาเต้วานิลลา', 45, cat_id, true),
    ('ชอตตี้ไวท์มอลต์', 'ไวท์มอลต์เย็น/ปั่น', 50, cat_id, true),
    ('คอฟฟี่มิ้นท์', 'กาแฟรสมิ้นท์', 45, cat_id, true);
    
    -- 4. Insert Non-Coffee menu items
    INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
    ('โอวัลติน', 'โอวัลตินหอมอร่อย', 35, cat_id, true),
    ('โอวัลตินภูเขาไฟ', 'โอวัลตินภูเขาไฟ เย็น/ปั่น', 50, cat_id, true),
    ('ไวท์มอลต์', 'ไวท์มอลต์หอมนุ่ม', 40, cat_id, true),
    ('โกโก้', 'โกโก้หอมข้น', 35, cat_id, true),
    ('โกโก้คาราเมล', 'โกโก้คาราเมล เย็น/ปั่น', 50, cat_id, true),
    ('นมชมพู', 'นมชมพู เย็น/ปั่น', 45, cat_id, true),
    ('นมสด', 'นมสด เย็น/ปั่น', 45, cat_id, true),
    ('นมสดคาราเมล', 'นมสดคาราเมล เย็น/ปั่น', 45, cat_id, true),
    ('โอริโอ้นมสด', 'นมสดโอริโอ้ ปั่น', 55, cat_id, true),
    ('ป๊อกป๊อกนมสด', 'นมสดป๊อกป๊อก เย็น/ปั่น', 45, cat_id, true);
    
    -- 5. Insert Tea menu items
    INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
    ('ชาดำ', 'ชาดำ เย็น', 30, cat_id, true),
    ('ชาดำน้ำผึ้ง', 'ชาดำน้ำผึ้ง เย็น', 40, cat_id, true),
    ('ชามะนาว', 'ชามะนาว เย็น', 40, cat_id, true),
    ('ชาไทย', 'ชาไทย เย็น/ปั่น', 40, cat_id, true),
    ('ชาเขียว', 'ชาเขียว เย็น/ปั่น', 40, cat_id, true),
    ('ชานมไต้หวัน', 'ชานมไต้หวัน เย็น/ปั่น', 40, cat_id, true),
    ('ชาไทยทูโทน', 'ชาไทยทูโทน เย็น', 45, cat_id, true),
    ('ชาเขียวทูโทน', 'ชาเขียวทูโทน เย็น', 45, cat_id, true),
    ('ชากุหลาบน้ำผึ้ง', 'ชากุหลาบน้ำผึ้ง เย็น', 45, cat_id, true),
    ('ชากุหลาบน้ำผึ้งมะนาว', 'ชากุหลาบน้ำผึ้งมะนาว เย็น', 45, cat_id, true);
    
    -- 6. Insert Soda menu items
    INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
    ('แดงโซดา', 'น้ำแดงโซดา เย็น', 30, cat_id, true),
    ('เขียวโซดา', 'น้ำเขียวโซดา เย็น', 30, cat_id, true),
    ('แดงมะนาวโซดา', 'แดงมะนาวโซดา เย็น', 35, cat_id, true),
    ('เขียวมะนาวโซดา', 'เขียวมะนาวโซดา เย็น', 35, cat_id, true),
    ('มะนาวโซดา', 'มะนาวโซดา เย็น', 40, cat_id, true),
    ('ยูซุโซดา', 'ยูซุโซดา เย็น', 50, cat_id, true),
    ('น้ำผึ้งยูซุโซดา', 'น้ำผึ้งยูซุโซดา เย็น', 50, cat_id, true),
    ('น้ำผึ้งมะนาวโซดา', 'น้ำผึ้งมะนาวโซดา เย็น', 50, cat_id, true),
    ('ลิ้นจี่โซดา', 'ลิ้นจี่โซดา เย็น', 40, cat_id, true),
    ('ส้มโซดา', 'ส้มโซดา เย็น', 40, cat_id, true),
    ('สตรอว์เบอร์รี่โซดา', 'สตรอว์เบอร์รี่โซดา เย็น/ปั่น', 30, cat_id, true),
    ('บลูฮาวายโซดา', 'บลูฮาวายโซดา เย็น/ปั่น', 30, cat_id, true),
    ('องุ่นโซดา', 'องุ่นโซดา เย็น/ปั่น', 30, cat_id, true),
    ('แอปเปิ้ลโซดา', 'แอปเปิ้ลโซดา เย็น/ปั่น', 30, cat_id, true),
    ('Sipit ทรงพลัง', 'M150 + โซดา เย็น', 30, cat_id, true);
    
    -- 7. Insert Smoothie menu items
    INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
    ('สตรอว์เบอร์รี่โยเกิร์ต', 'สมูทตี้สตรอว์เบอร์รี่โยเกิร์ต', 55, cat_id, true),
    ('มิกซ์เบอร์รี่โยเกิร์ต', 'สมูทตี้มิกซ์เบอร์รี่โยเกิร์ต', 55, cat_id, true),
    ('มะม่วงโยเกิร์ต', 'สมูทตี้มะม่วงโยเกิร์ต', 55, cat_id, true),
    ('สตรอว์เบอร์รี่สมูทตี้', 'สมูทตี้สตรอว์เบอร์รี่', 45, cat_id, true),
    ('มิกซ์เบอร์รี่สมูทตี้', 'สมูทตี้มิกซ์เบอร์รี่', 45, cat_id, true),
    ('มะม่วงสมูทตี้', 'สมูทตี้มะม่วง', 45, cat_id, true),
    ('ลิ้นจี่สมูทตี้', 'สมูทตี้ลิ้นจี่', 45, cat_id, true),
    ('ส้มสมูทตี้', 'สมูทตี้ส้ม', 45, cat_id, true);
    
END $$;

-- 8. Add menu options for temperature variations
-- Get all Sipit items that have temperature options
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment)
SELECT id, 'ร้อน', 0 
FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'sipit-drinks')
AND (name LIKE '%อเมริกาโน่%' OR name LIKE '%คาปูชิโน่%' OR name LIKE '%เอสเพรสโซ่%' 
     OR name LIKE '%ลาเต้%' OR name LIKE '%มอคค่า%' OR name LIKE '%คอฟฟี่มิ้นท์%'
     OR name LIKE '%โอวัลติน' OR name LIKE '%ไวท์มอลต์' OR name LIKE '%โกโก้')
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment)
SELECT id, 'เย็น', 5 
FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'sipit-drinks')
AND (name LIKE '%อเมริกาโน่%' OR name LIKE '%คาปูชิโน่%' OR name LIKE '%เอสเพรสโซ่%' 
     OR name LIKE '%ลาเต้%' OR name LIKE '%มอคค่า%' OR name LIKE '%คอฟฟี่มิ้นท์%'
     OR name LIKE '%โอวัลติน' OR name LIKE '%ไวท์มอลต์' OR name LIKE '%โกโก้')
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment)
SELECT id, 'ปั่น', 10 
FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'sipit-drinks')
AND (name LIKE '%อเมริกาโน่' OR name LIKE '%คาปูชิโน่%' OR name LIKE '%เอสเพรสโซ่%' 
     OR name LIKE '%ลาเต้%' OR name LIKE '%มอคค่า%' OR name LIKE '%คอฟฟี่มิ้นท์%')
ON CONFLICT DO NOTHING;

-- Special temperature options for some items
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment)
SELECT id, 'เย็น', 0 
FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'sipit-drinks')
AND (name IN ('ชอตตี้ไวท์มอลต์', 'โอวัลตินภูเขาไฟ', 'โกโก้คาราเมล', 'นมชมพู', 'นมสด', 'นมสดคาราเมล', 'ป๊อกป๊อกนมสด'))
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment)
SELECT id, 'ปั่น', 5 
FROM menu_items 
WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'sipit-drinks')
AND (name IN ('ชอตตี้ไวท์มอลต์', 'โอวัลตินภูเขาไฟ', 'โกโก้คาราเมล'))
ON CONFLICT DO NOTHING;

-- Show summary
SELECT 
    (SELECT COUNT(*) FROM menu_items WHERE category_id = (SELECT id FROM menu_categories WHERE slug = 'sipit-drinks')) as sipit_items,
    (SELECT COUNT(*) FROM menu_options mo 
     JOIN menu_items mi ON mo.menu_item_id = mi.id 
     WHERE mi.category_id = (SELECT id FROM menu_categories WHERE slug = 'sipit-drinks')) as sipit_options;