-- Complete reset of menu data
-- This will delete ALL existing orders and menu items

-- Step 1: Delete all order-related data in correct order
DELETE FROM order_items;
DELETE FROM orders;

-- Step 2: Delete all menu items
DELETE FROM menu_items;

-- Step 3: Delete all categories
DELETE FROM categories;

-- Step 4: Reset sequences
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_items_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- Step 5: Insert new categories
INSERT INTO categories (id, name, icon, display_order) VALUES
(1, 'อาหารจานเดียวแนะนำ', '🍛', 1),
(2, 'อาหารจานเดียว', '🍚', 2),
(3, 'อาหารประเภทเส้น', '🍜', 3),
(4, 'ประเภทกับข้าว', '🍲', 4),
(5, 'ประเภทยำ', '🥗', 5),
(6, 'ประเภทน้ำตก', '🍛', 6),
(7, 'ประเภทตำ', '🥒', 7),
(8, 'เมนูทานเล่น', '🍟', 8),
(9, 'เมนูเพิ่มเติม', '➕', 9);

-- Step 6: Insert all new menu items

-- อาหารจานเดียวแนะนำ
INSERT INTO menu_items (name, price, category_id, available, emoji) VALUES
('ข้าวกระเพราสูตรพริกแห้งโบราณ (หมูกรอบ)', 50, 1, true, '🍛'),
('ข้าวกระเพราสูตรพริกแห้งโบราณ (ทะเล)', 60, 1, true, '🍛'),
('ข้าวกระเพราสูตรพริกแห้งโบราณ (หมู)', 50, 1, true, '🍛'),
('ข้าวกระเพราสูตรพริกแห้งโบราณ (เนื้อ)', 50, 1, true, '🍛'),
('ข้าวกระเพราสูตรพริกแห้งโบราณ (ไก่)', 50, 1, true, '🍛'),
('ข้าวผัดโบราณ', 50, 1, true, '🍛'),
('ข้าวหมึกผัดไข่เค็ม', 60, 1, true, '🍛');

-- อาหารจานเดียว
INSERT INTO menu_items (name, price, category_id, available, emoji) VALUES
('ข้าวกระเพราสูตรพริกแห้งโบราณ (หมูกรอบ)', 50, 2, true, '🍚'),
('ข้าวกระเพราสูตรพริกแห้งโบราณ (ทะเล)', 60, 2, true, '🍚'),
('ข้าวกระเพราสูตรพริกแห้งโบราณ (หมู)', 50, 2, true, '🍚'),
('ข้าวกระเพราสูตรพริกแห้งโบราณ (เนื้อ)', 50, 2, true, '🍚'),
('ข้าวกระเพราสูตรพริกแห้งโบราณ (ไก่)', 50, 2, true, '🍚'),
('ข้าวหมูทอดกระเทียม', 50, 2, true, '🍚'),
('ข้าวคอหมูย่าง', 60, 2, true, '🍚'),
('ข้าวต้มรสไฟ', 50, 2, true, '🍚'),
('ข้าวต้มรสไฟ (ทะเล)', 60, 2, true, '🍚'),
('ข้าวผัดโบราณ', 50, 2, true, '🍚'),
('ข้าวผัดแหนม', 50, 2, true, '🍚'),
('ข้าวผัดเขียวหวาน', 50, 2, true, '🍚'),
('ข้าวผัดพริกแกงปลาระเบิด', 50, 2, true, '🍚'),
('ข้าวผัดอเมริกัน', 60, 2, true, '🍚');

-- อาหารประเภทเส้น
INSERT INTO menu_items (name, price, category_id, available, emoji) VALUES
('สุกี้น้ำ (หมู)', 50, 3, true, '🍜'),
('สุกี้น้ำ (เนื้อ)', 50, 3, true, '🍜'),
('สุกี้น้ำ (ไก่)', 50, 3, true, '🍜'),
('สุกี้น้ำ (ทะเล)', 60, 3, true, '🍜'),
('สุกี้แห้ง (หมู)', 50, 3, true, '🍜'),
('สุกี้แห้ง (เนื้อ)', 50, 3, true, '🍜'),
('สุกี้แห้ง (ไก่)', 50, 3, true, '🍜'),
('สุกี้แห้ง (ทะเล)', 60, 3, true, '🍜'),
('ราดหน้า (หมู)', 50, 3, true, '🍜'),
('ราดหน้า (เนื้อ)', 50, 3, true, '🍜'),
('ราดหน้า (ไก่)', 50, 3, true, '🍜'),
('ราดหน้า (ทะเล)', 60, 3, true, '🍜'),
('ผัดซีอิ๊ว (หมู)', 50, 3, true, '🍜'),
('ผัดซีอิ๊ว (เนื้อ)', 50, 3, true, '🍜'),
('ผัดซีอิ๊ว (ไก่)', 50, 3, true, '🍜'),
('ผัดซีอิ๊ว (ทะเล)', 60, 3, true, '🍜'),
('ผัดไทย', 50, 3, true, '🍜'),
('หอยทอด', 60, 3, true, '🍜'),
('ก๋วยเตี๋ยวคั่วไก่', 60, 3, true, '🍜'),
('ก๋วยเตี๋ยวโบราณ', 50, 3, true, '🍜');

-- ประเภทกับข้าว
INSERT INTO menu_items (name, price, category_id, available, emoji) VALUES
('ผัดพริกแกง (หมู)', 80, 4, true, '🍲'),
('ผัดพริกแกง (ไก่)', 80, 4, true, '🍲'),
('ผัดพริกแกง (กุ้ง)', 80, 4, true, '🍲'),
('ผัดพริกแกง (หมึก)', 80, 4, true, '🍲'),
('ผัดน้ำมันหอย (หมู)', 80, 4, true, '🍲'),
('ผัดน้ำมันหอย (ไก่)', 80, 4, true, '🍲'),
('ผัดน้ำมันหอย (กุ้ง)', 80, 4, true, '🍲'),
('ผัดน้ำมันหอย (หมึก)', 80, 4, true, '🍲'),
('ต้มผัดพริกเผา (หมู)', 80, 4, true, '🍲'),
('ต้มผัดพริกเผา (ไก่)', 80, 4, true, '🍲'),
('ต้มผัดพริกเผา (กุ้ง)', 80, 4, true, '🍲'),
('ต้มผัดพริกเผา (หมึก)', 80, 4, true, '🍲'),
('เต้าหู้หมูสับผัดน้ำมันหอย', 80, 4, true, '🍲'),
('เต้าหู้ทรงเครื่อง', 80, 4, true, '🍲'),
('กะหล่ำปลีทอดน้ำปลา', 80, 4, true, '🍲'),
('หมึกผัดไข่เค็ม', 80, 4, true, '🍲'),
('หมูกรอบคั่วพริกเกลือ', 80, 4, true, '🍲'),
('ไก่ป๊อปคั่วพริกเกลือ', 80, 4, true, '🍲'),
('หมูสามชั้นทอดน้ำปลา', 80, 4, true, '🍲'),
('ปีกไก่ทอดน้ำปลา', 80, 4, true, '🍲'),
('แกงจืดสาหร่ายเต้าหู้หมูสับ', 80, 4, true, '🍲'),
('ต้มยำน้ำข้น (หมู)', 80, 4, true, '🍲'),
('ต้มยำน้ำข้น (เนื้อ)', 80, 4, true, '🍲'),
('ต้มยำน้ำข้น (ไก่)', 80, 4, true, '🍲'),
('ต้มยำน้ำข้น (ทะเล)', 100, 4, true, '🍲'),
('ต้มยำน้ำใสเลิศ (หมู)', 80, 4, true, '🍲'),
('ต้มยำน้ำใสเลิศ (เนื้อ)', 80, 4, true, '🍲'),
('ต้มยำน้ำใสเลิศ (ไก่)', 80, 4, true, '🍲'),
('ต้มยำน้ำใสเลิศ (ทะเล)', 100, 4, true, '🍲');

-- ประเภทยำ
INSERT INTO menu_items (name, price, category_id, available, emoji) VALUES
('ยำวุ้นเส้น', 60, 5, true, '🥗'),
('ยำมาม่า', 50, 5, true, '🥗'),
('ยำหมูยอ', 60, 5, true, '🥗'),
('คอหมูย่าง', 70, 5, true, '🥗');

-- ประเภทน้ำตก
INSERT INTO menu_items (name, price, category_id, available, emoji) VALUES
('น้ำตกเนื้อ', 70, 6, true, '🍛'),
('น้ำตกหมู', 60, 6, true, '🍛'),
('น้ำตกคอหมูย่าง', 70, 6, true, '🍛'),
('ตับหวาน', 60, 6, true, '🍛'),
('ลาบหมู', 60, 6, true, '🍛'),
('ลาบเนื้อ', 70, 6, true, '🍛');

-- ประเภทตำ
INSERT INTO menu_items (name, price, category_id, available, emoji) VALUES
('ตำปูปลาร้า', 50, 7, true, '🥒'),
('ตำถั่ว', 45, 7, true, '🥒'),
('ตำไทย', 50, 7, true, '🥒'),
('ตำซั่วโฟดไข่เค็ม', 60, 7, true, '🥒'),
('ตำกุ้งสด', 70, 7, true, '🥒'),
('ตำหมูยอ', 60, 7, true, '🥒');

-- เมนูทานเล่น
INSERT INTO menu_items (name, price, category_id, available, emoji) VALUES
('ปีกไก่ทอด', 50, 8, true, '🍟'),
('เอ็นข้อไก่', 70, 8, true, '🍟'),
('นักเก็ต', 50, 8, true, '🍟'),
('เฟรนช์ฟราย', 50, 8, true, '🍟');

-- เมนูเพิ่มเติม
INSERT INTO menu_items (name, price, category_id, available, emoji) VALUES
('ไข่ดาว', 10, 9, true, '➕'),
('ไข่ต้ม', 10, 9, true, '➕'),
('ไข่เจียว', 10, 9, true, '➕');

-- Verify the data
SELECT 'Categories:' as info, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Menu Items:', COUNT(*) FROM menu_items
UNION ALL
SELECT 'Orders:', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items:', COUNT(*) FROM order_items;