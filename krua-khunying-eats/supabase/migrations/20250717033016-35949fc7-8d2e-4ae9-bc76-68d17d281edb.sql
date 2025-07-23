-- Clear existing data
DELETE FROM menu_items;
DELETE FROM subcategories;
DELETE FROM menu_categories;

-- Insert main food categories
INSERT INTO menu_categories (id, name, name_en, sort_order, icon) VALUES
(gen_random_uuid(), 'อาหารจานเดียวแนะนำ', 'Recommended Single Dishes', 1, '🍛'),
(gen_random_uuid(), 'อาหารจานเดียว', 'Single Dishes', 2, '🍚'),
(gen_random_uuid(), 'อาหารประเภทเส้น', 'Noodle Dishes', 3, '🍜'),
(gen_random_uuid(), 'ประเภทกับข้าว', 'Side Dishes with Rice', 4, '🥢'),
(gen_random_uuid(), 'ประเภทยำ', 'Spicy Salads', 5, '🌶️'),
(gen_random_uuid(), 'ประเภาน้ำตก', 'Nam Tok', 6, '🍲'),
(gen_random_uuid(), 'ประเภทตำ', 'Som Tam', 7, '🥗'),
(gen_random_uuid(), 'เมนูทานเล่น', 'Snacks', 8, '🍟'),
(gen_random_uuid(), 'เมนูเพิ่มเติม', 'Additional Menu', 9, '🍳'),
(gen_random_uuid(), 'กาแฟ', 'Coffee', 10, '☕'),
(gen_random_uuid(), 'เครื่องดื่มไม่มีกาแฟ', 'Non-Coffee', 11, '🥤'),
(gen_random_uuid(), 'ชา', 'Tea', 12, '🍵'),
(gen_random_uuid(), 'โซดา', 'Soda', 13, '🧊'),
(gen_random_uuid(), 'สมู้ทตี้', 'Smoothie', 14, '🍓'),
(gen_random_uuid(), 'ของหวาน', 'Desserts', 15, '🧁');

-- Insert subcategories for drinks
INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'ร้อน',
  'Hot',
  mc.id,
  1
FROM menu_categories mc WHERE mc.name = 'กาแฟ';

INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'เย็น',
  'Cold',
  mc.id,
  2
FROM menu_categories mc WHERE mc.name = 'กาแฟ';

INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'ปั่น',
  'Blended',
  mc.id,
  3
FROM menu_categories mc WHERE mc.name = 'กาแฟ';

INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'ร้อน',
  'Hot',
  mc.id,
  1
FROM menu_categories mc WHERE mc.name = 'เครื่องดื่มไม่มีกาแฟ';

INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'เย็น',
  'Cold',
  mc.id,
  2
FROM menu_categories mc WHERE mc.name = 'เครื่องดื่มไม่มีกาแฟ';

INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'ปั่น',
  'Blended',
  mc.id,
  3
FROM menu_categories mc WHERE mc.name = 'เครื่องดื่มไม่มีกาแฟ';

INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'เย็น',
  'Cold',
  mc.id,
  1
FROM menu_categories mc WHERE mc.name = 'ชา';

INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'ปั่น',
  'Blended',
  mc.id,
  2
FROM menu_categories mc WHERE mc.name = 'ชา';

INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'เย็น',
  'Cold',
  mc.id,
  1
FROM menu_categories mc WHERE mc.name = 'โซดา';

INSERT INTO subcategories (id, name, name_en, category_id, sort_order) 
SELECT 
  gen_random_uuid(),
  'ปั่น',
  'Blended',
  mc.id,
  1
FROM menu_categories mc WHERE mc.name = 'สมู้ทตี้';

-- Insert recommended single dishes
INSERT INTO menu_items (name, name_en, price, category_id, is_popular) 
SELECT 
  'ข้าวกระเพราสูตรพริกแห้งโบราณ (หมูกรอบ/ทะเล)',
  'Ancient Chili Basil Rice (Crispy Pork/Seafood)',
  60,
  mc.id,
  true
FROM menu_categories mc WHERE mc.name = 'อาหารจานเดียวแนะนำ';

INSERT INTO menu_items (name, name_en, price, category_id, is_popular) 
SELECT 
  'ข้าวกระเพราสูตรพริกแห้งโบราณ (หมู/เนื้อ/ไก่)',
  'Ancient Chili Basil Rice (Pork/Beef/Chicken)',
  50,
  mc.id,
  true
FROM menu_categories mc WHERE mc.name = 'อาหารจานเดียวแนะนำ';

INSERT INTO menu_items (name, name_en, price, category_id, is_popular) 
SELECT 
  'ข้าวผัดโบราณ',
  'Ancient Fried Rice',
  50,
  mc.id,
  true
FROM menu_categories mc WHERE mc.name = 'อาหารจานเดียวแนะนำ';

INSERT INTO menu_items (name, name_en, price, category_id, is_popular) 
SELECT 
  'ข้าวหมึกผัดไข่เค็ม',
  'Squid Rice with Salted Egg',
  60,
  mc.id,
  true
FROM menu_categories mc WHERE mc.name = 'อาหารจานเดียวแนะนำ';

-- Insert single dishes
INSERT INTO menu_items (name, name_en, price, category_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id
FROM (VALUES
  ('ข้าวหมูทอดกระเทียม', 'Garlic Fried Pork Rice', 50),
  ('ข้าวคอหมูย่าง', 'Grilled Pork Neck Rice', 60),
  ('ข้าวต้มรสไฟ (หมู)', 'Spicy Rice Porridge (Pork)', 50),
  ('ข้าวต้มรสไฟ (ทะเล)', 'Spicy Rice Porridge (Seafood)', 60),
  ('ข้าวผัดแหนม', 'Fermented Pork Fried Rice', 50),
  ('ข้าวผัดเขียวหวาน', 'Green Curry Fried Rice', 50),
  ('ข้าวผัดแดงเขียวหวาน', 'Red Green Curry Fried Rice', 50),
  ('ข้าวผัดปลาระเบิด', 'Explosive Fish Fried Rice', 50),
  ('ข้าวผัดอเมริกัน', 'American Fried Rice', 60)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc WHERE mc.name = 'อาหารจานเดียว';

-- Insert noodle dishes
INSERT INTO menu_items (name, name_en, price, category_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id
FROM (VALUES
  ('สุกี้น้ำ/แห้ง (หมู/เนื้อ/ไก่)', 'Suki Soup/Dry (Pork/Beef/Chicken)', 50),
  ('สุกี้น้ำ/แห้ง (ทะเล)', 'Suki Soup/Dry (Seafood)', 60),
  ('ราดหน้า (หมู/เนื้อ/ไก่)', 'Rad Na (Pork/Beef/Chicken)', 50),
  ('ราดหน้า (ทะเล)', 'Rad Na (Seafood)', 60),
  ('ผัดซีอิ๊ว (หมู/เนื้อ/ไก่)', 'Pad See Ew (Pork/Beef/Chicken)', 50),
  ('ผัดซีอิ๊ว (ทะเล)', 'Pad See Ew (Seafood)', 60),
  ('ผัดไทย', 'Pad Thai', 50),
  ('หอยทอด', 'Oyster Omelette', 60),
  ('ก๋วยเตี๋ยวคั่วไก่', 'Stir-fried Noodles with Chicken', 60),
  ('ก๋วยเตี๋ยวโบราณ', 'Ancient Noodles', 50)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc WHERE mc.name = 'อาหารประเภทเส้น';

-- Insert side dishes with rice
INSERT INTO menu_items (name, name_en, price, category_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id
FROM (VALUES
  ('ผัดพริกแกง (หมู/ไก่)', 'Stir-fried Curry Paste (Pork/Chicken)', 80),
  ('ผัดพริกแกง (กุ้ง/หมึก)', 'Stir-fried Curry Paste (Shrimp/Squid)', 80),
  ('ผัดน้ำมันหอย (หมู/ไก่)', 'Oyster Sauce Stir-fry (Pork/Chicken)', 80),
  ('ผัดน้ำมันหอย (กุ้ง/หมึก)', 'Oyster Sauce Stir-fry (Shrimp/Squid)', 80),
  ('ต้มผัดพริกเผา (หมู/ไก่)', 'Tom Pad Prik Pao (Pork/Chicken)', 80),
  ('ต้มผัดพริกเผา (กุ้ง/หมึก)', 'Tom Pad Prik Pao (Shrimp/Squid)', 80),
  ('เต้าหู้หมูสับผัดน้ำมันหอย', 'Tofu with Minced Pork in Oyster Sauce', 80),
  ('เต้าหู้ทรงเครื่อง', 'Mixed Tofu', 80),
  ('กะหล่ำปลีทอดน้ำปลา', 'Fried Cabbage with Fish Sauce', 80),
  ('หมึกผัดไข่เค็ม', 'Squid with Salted Egg', 80),
  ('หมูกรอบ/ไก่ป๊อปคั่วพริกเกลือ', 'Crispy Pork/Chicken Popcorn with Salt & Chili', 80),
  ('หมูสามชั้นทอดน้ำปลา', 'Fried Pork Belly with Fish Sauce', 80),
  ('ปีกไก่ทอดน้ำปลา', 'Fried Chicken Wings with Fish Sauce', 80),
  ('แกงจืดสาหร่ายเต้าหู้หมูสับ', 'Clear Soup with Seaweed, Tofu & Minced Pork', 80),
  ('ต้มยำน้ำข้น/ใส่เลิศ (หมู/เนื้อ/ไก่)', 'Tom Yam Thick/Clear Soup (Pork/Beef/Chicken)', 80),
  ('ต้มยำน้ำข้น/ใส่เลิศ (ทะเล)', 'Tom Yam Thick/Clear Soup (Seafood)', 100)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc WHERE mc.name = 'ประเภทกับข้าว';

-- Insert spicy salads
INSERT INTO menu_items (name, name_en, price, category_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id
FROM (VALUES
  ('ยำวุ้นเส้น', 'Glass Noodle Salad', 60),
  ('ยำมาม่า', 'Instant Noodle Salad', 50),
  ('ยำหมูยอ', 'Vietnamese Ham Salad', 60),
  ('คอหมูย่าง', 'Grilled Pork Neck', 70)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc WHERE mc.name = 'ประเภทยำ';

-- Insert nam tok dishes
INSERT INTO menu_items (name, name_en, price, category_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id
FROM (VALUES
  ('น้ำตกเนื้อ', 'Beef Nam Tok', 70),
  ('น้ำตกหมู', 'Pork Nam Tok', 60),
  ('น้ำตกคอหมูย่าง', 'Grilled Pork Neck Nam Tok', 70),
  ('ตับหวาน', 'Sweet Liver', 60),
  ('ลาบหมู', 'Pork Larb', 60),
  ('ลาบเนื้อ', 'Beef Larb', 70)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc WHERE mc.name = 'ประเภาน้ำตก';

-- Insert som tam dishes
INSERT INTO menu_items (name, name_en, price, category_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id
FROM (VALUES
  ('ตำปูปลาร้า', 'Crab Som Tam with Fermented Fish', 50),
  ('ตำถั่ว', 'Long Bean Som Tam', 45),
  ('ตำไทย', 'Thai Som Tam', 50),
  ('ตำซั่วโพดไข่เค็ม', 'Corn Som Tam with Salted Egg', 60),
  ('ตำกุ้งสด', 'Fresh Shrimp Som Tam', 70),
  ('ตำหมูยอ', 'Vietnamese Ham Som Tam', 60)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc WHERE mc.name = 'ประเภทตำ';

-- Insert snacks
INSERT INTO menu_items (name, name_en, price, category_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id
FROM (VALUES
  ('ปีกไก่ทอด', 'Fried Chicken Wings', 50),
  ('เอ็นข้อไก่', 'Chicken Cartilage', 70),
  ('นักเก็ต', 'Chicken Nuggets', 50),
  ('เฟรนช์ฟราย', 'French Fries', 50)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc WHERE mc.name = 'เมนูทานเล่น';

-- Insert additional menu items
INSERT INTO menu_items (name, name_en, price, category_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id
FROM (VALUES
  ('ไข่ดาว', 'Fried Egg', 10),
  ('ไข่ต้ม', 'Boiled Egg', 10),
  ('ไข่เจียว', 'Thai Omelette', 10)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc WHERE mc.name = 'เมนูเพิ่มเติม';

-- Insert desserts
INSERT INTO menu_items (name, name_en, price, category_id) 
SELECT 
  'วาฟเฟิล',
  'Waffle',
  45,
  mc.id
FROM menu_categories mc WHERE mc.name = 'ของหวาน';

-- Insert coffee items with subcategories
-- Hot coffee
INSERT INTO menu_items (name, name_en, price, category_id, subcategory_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id,
  sc.id
FROM (VALUES
  ('อเมริกาโน่', 'Americano', 35),
  ('อเมริกาโน่น้ำผึ้ง', 'Honey Americano', 40),
  ('อเมริกาโน่น้ำผึ้งมะนาว', 'Honey Lime Americano', 45),
  ('อเมริกาโน่น้ำส้ม', 'Orange Americano', 40),
  ('อเมริกาโน่มิ้นท์', 'Mint Americano', 45),
  ('อเมริกาโน่มะพร้าว', 'Coconut Americano', 35),
  ('คาปูชิโน่', 'Cappuccino', 40),
  ('เอสเพรสโซ่', 'Espresso', 40),
  ('ลาเต้', 'Latte', 40),
  ('มอคค่า', 'Mocha', 40),
  ('คาราเมลมัคคิอาโต้', 'Caramel Macchiato', 45),
  ('คาราเมลลาเต้', 'Caramel Latte', 45),
  ('วานิลลาลาเต้', 'Vanilla Latte', 45),
  ('คอฟฟี่มิ้นท์', 'Coffee Mint', 45)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc 
CROSS JOIN subcategories sc 
WHERE mc.name = 'กาแฟ' AND sc.name = 'ร้อน' AND sc.category_id = mc.id;

-- Cold coffee
INSERT INTO menu_items (name, name_en, price, category_id, subcategory_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id,
  sc.id
FROM (VALUES
  ('อเมริกาโน่', 'Americano', 40),
  ('อเมริกาโน่น้ำผึ้ง', 'Honey Americano', 45),
  ('อเมริกาโน่น้ำผึ้งมะนาว', 'Honey Lime Americano', 50),
  ('อเมริกาโน่น้ำส้ม', 'Orange Americano', 45),
  ('อเมริกาโน่มิ้นท์', 'Mint Americano', 50),
  ('อเมริกาโน่มะพร้าว', 'Coconut Americano', 40),
  ('คาปูชิโน่', 'Cappuccino', 45),
  ('เอสเพรสโซ่', 'Espresso', 45),
  ('ลาเต้', 'Latte', 45),
  ('มอคค่า', 'Mocha', 45),
  ('คาราเมลมัคคิอาโต้', 'Caramel Macchiato', 50),
  ('คาราเมลลาเต้', 'Caramel Latte', 50),
  ('วานิลลาลาเต้', 'Vanilla Latte', 50),
  ('ชอตตี้ไวท์มอลต์', 'Shorty White Malt', 50),
  ('คอฟฟี่มิ้นท์', 'Coffee Mint', 50)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc 
CROSS JOIN subcategories sc 
WHERE mc.name = 'กาแฟ' AND sc.name = 'เย็น' AND sc.category_id = mc.id;

-- Blended coffee
INSERT INTO menu_items (name, name_en, price, category_id, subcategory_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id,
  sc.id
FROM (VALUES
  ('อเมริกาโน่', 'Americano', 45),
  ('คาปูชิโน่', 'Cappuccino', 55),
  ('เอสเพรสโซ่', 'Espresso', 50),
  ('ลาเต้', 'Latte', 55),
  ('มอคค่า', 'Mocha', 55),
  ('คาราเมลมัคคิอาโต้', 'Caramel Macchiato', 55),
  ('คาราเมลลาเต้', 'Caramel Latte', 55),
  ('วานิลลาลาเต้', 'Vanilla Latte', 55),
  ('ชอตตี้ไวท์มอลต์', 'Shorty White Malt', 55),
  ('คอฟฟี่มิ้นท์', 'Coffee Mint', 55)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc 
CROSS JOIN subcategories sc 
WHERE mc.name = 'กาแฟ' AND sc.name = 'ปั่น' AND sc.category_id = mc.id;

-- Insert remaining drink items similarly...
-- Non-coffee hot drinks
INSERT INTO menu_items (name, name_en, price, category_id, subcategory_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id,
  sc.id
FROM (VALUES
  ('โอวัลติน', 'Ovaltine', 35),
  ('ไวท์มอลต์', 'White Malt', 40),
  ('โกโก้', 'Cocoa', 35)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc 
CROSS JOIN subcategories sc 
WHERE mc.name = 'เครื่องดื่มไม่มีกาแฟ' AND sc.name = 'ร้อน' AND sc.category_id = mc.id;

-- Insert soda drinks (cold only)
INSERT INTO menu_items (name, name_en, price, category_id, subcategory_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id,
  sc.id
FROM (VALUES
  ('แดงโซดา', 'Red Soda', 30),
  ('เขียวโซดา', 'Green Soda', 30),
  ('มะนาวโซดา', 'Lime Soda', 40),
  ('ยูซุโซดา', 'Yuzu Soda', 50),
  ('Sip it ทรงพลัง', 'Sip it Power Drink', 30)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc 
CROSS JOIN subcategories sc 
WHERE mc.name = 'โซดา' AND sc.name = 'เย็น' AND sc.category_id = mc.id;

-- Insert smoothies (blended only)
INSERT INTO menu_items (name, name_en, price, category_id, subcategory_id) 
SELECT 
  dishes.item_name,
  dishes.item_name_en,
  dishes.item_price,
  mc.id,
  sc.id
FROM (VALUES
  ('สตรอว์เบอร์รี่โยเกิร์ต', 'Strawberry Yogurt', 55),
  ('มิกซ์เบอร์รี่โยเกิร์ต', 'Mixed Berry Yogurt', 55),
  ('มะม่วงโยเกิร์ต', 'Mango Yogurt', 55),
  ('สตรอว์เบอร์รี่', 'Strawberry', 45),
  ('มิกซ์เบอร์รี่', 'Mixed Berry', 45),
  ('มะม่วง', 'Mango', 45),
  ('ลิ้นจี่', 'Lychee', 45),
  ('ส้ม', 'Orange', 45)
) AS dishes(item_name, item_name_en, item_price)
CROSS JOIN menu_categories mc 
CROSS JOIN subcategories sc 
WHERE mc.name = 'สมู้ทตี้' AND sc.name = 'ปั่น' AND sc.category_id = mc.id;