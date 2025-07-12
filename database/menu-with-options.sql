-- ระบบเมนูใหม่ที่มีตัวเลือกเนื้อสัตว์
-- ลบข้อมูลเก่าทั้งหมดก่อน

-- Step 1: ลบข้อมูลเก่า
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_items;
DELETE FROM menu_categories;

-- Step 2: รีเซ็ต sequences
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_items_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_categories_id_seq RESTART WITH 1;

-- Step 3: สร้างตารางใหม่สำหรับตัวเลือกเนื้อสัตว์ (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS menu_options (
    id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    option_name VARCHAR(50) NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE
);

-- Step 4: เพิ่มหมวดหมู่
INSERT INTO menu_categories (id, name, slug) VALUES
(1, 'อาหารจานเดียวแนะนำ', 'recommended-dishes'),
(2, 'อาหารจานเดียว', 'single-dishes'),
(3, 'อาหารประเภทเส้น', 'noodles'),
(4, 'ประเภทกับข้าว', 'side-dishes'),
(5, 'ประเภทยำ', 'salads'),
(6, 'ประเภทน้ำตก', 'namtok'),
(7, 'ประเภทตำ', 'somtam'),
(8, 'เมนูทานเล่น', 'snacks'),
(9, 'เมนูเพิ่มเติม', 'extras');

-- Step 5: เพิ่มเมนูหลัก (ราคาพื้นฐาน)

-- อาหารจานเดียวแนะนำ
INSERT INTO menu_items (id, name, description, price, category_id, is_available, is_recommended) VALUES
(1, 'ข้าวกระเพราสูตรพริกแห้งโบราณ', 'เลือกเนื้อสัตว์ได้', 50, 1, true, true),
(2, 'ข้าวผัดโบราณ', 'ข้าวผัดสูตรโบราณ', 50, 1, true, true),
(3, 'ข้าวหมึกผัดไข่เค็ม', 'หมึกผัดไข่เค็มหอมมัน', 60, 1, true, true);

-- อาหารจานเดียว
INSERT INTO menu_items (id, name, description, price, category_id, is_available) VALUES
(4, 'ข้าวหมูทอดกระเทียม', 'หมูทอดหอมกระเทียม', 50, 2, true),
(5, 'ข้าวคอหมูย่าง', 'คอหมูย่างน้ำจิ้มแจ่ว', 60, 2, true),
(6, 'ข้าวต้มรสไฟ', 'เลือกเนื้อสัตว์ได้', 50, 2, true),
(7, 'ข้าวผัดแหนม', 'ข้าวผัดแหนมหอมมัน', 50, 2, true),
(8, 'ข้าวผัดเขียวหวาน', 'ข้าวผัดเขียวหวานใส่ใบโหระพา', 50, 2, true),
(9, 'ข้าวผัดพริกแกงปลาระเบิด', 'ข้าวผัดพริกแกงใส่ปลาระเบิด', 50, 2, true),
(10, 'ข้าวผัดอเมริกัน', 'ข้าวผัดอเมริกันใส่ไส้กรอก', 60, 2, true);

-- อาหารประเภทเส้น
INSERT INTO menu_items (id, name, description, price, category_id, is_available) VALUES
(11, 'สุกี้น้ำ', 'เลือกเนื้อสัตว์ได้', 50, 3, true),
(12, 'สุกี้แห้ง', 'เลือกเนื้อสัตว์ได้', 50, 3, true),
(13, 'ราดหน้า', 'เลือกเนื้อสัตว์ได้', 50, 3, true),
(14, 'ผัดซีอิ๊ว', 'เลือกเนื้อสัตว์ได้', 50, 3, true),
(15, 'ผัดไทย', 'ผัดไทยกุ้งสด', 50, 3, true),
(16, 'หอยทอด', 'หอยทอดกรอบ', 60, 3, true),
(17, 'ก๋วยเตี๋ยวคั่วไก่', 'ก๋วยเตี๋ยวคั่วไก่หอมมัน', 60, 3, true),
(18, 'ก๋วยเตี๋ยวโบราณ', 'ก๋วยเตี๋ยวน้ำใสโบราณ', 50, 3, true);

-- ประเภทกับข้าว
INSERT INTO menu_items (id, name, description, price, category_id, is_available) VALUES
(19, 'ผัดพริกแกง', 'เลือกเนื้อสัตว์ได้', 80, 4, true),
(20, 'ผัดน้ำมันหอย', 'เลือกเนื้อสัตว์ได้', 80, 4, true),
(21, 'ต้มผัดพริกเผา', 'เลือกเนื้อสัตว์ได้', 80, 4, true),
(22, 'เต้าหู้หมูสับผัดน้ำมันหอย', 'เต้าหู้ใส่หมูสับ', 80, 4, true),
(23, 'เต้าหู้ทรงเครื่อง', 'เต้าหู้ทอดราดซอส', 80, 4, true),
(24, 'กะหล่ำปลีทอดน้ำปลา', 'กะหล่ำปลีทอดกรอบ', 80, 4, true),
(25, 'หมึกผัดไข่เค็ม', 'หมึกผัดไข่เค็มหอมมัน', 80, 4, true),
(26, 'หมูกรอบคั่วพริกเกลือ', 'หมูกรอบคั่วพริกเกลือ', 80, 4, true),
(27, 'ไก่ป๊อปคั่วพริกเกลือ', 'ไก่ป๊อปคั่วพริกเกลือ', 80, 4, true),
(28, 'หมูสามชั้นทอดน้ำปลา', 'หมูสามชั้นทอดกรอบ', 80, 4, true),
(29, 'ปีกไก่ทอดน้ำปลา', 'ปีกไก่ทอดหอมน้ำปลา', 80, 4, true),
(30, 'แกงจืดสาหร่ายเต้าหู้หมูสับ', 'แกงจืดสาหร่าย', 80, 4, true),
(31, 'ต้มยำน้ำข้น', 'เลือกเนื้อสัตว์ได้', 80, 4, true),
(32, 'ต้มยำน้ำใสเลิศ', 'เลือกเนื้อสัตว์ได้', 80, 4, true);

-- Step 6: เพิ่มตัวเลือกเนื้อสัตว์

-- ข้าวกระเพรา (id: 1)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(1, 'หมู', 0),
(1, 'ไก่', 0),
(1, 'เนื้อ', 0),
(1, 'หมูกรอบ', 0),
(1, 'ทะเล', 10);

-- ข้าวต้มรสไฟ (id: 6)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(6, 'หมู', 0),
(6, 'ไก่', 0),
(6, 'ทะเล', 10);

-- สุกี้น้ำ (id: 11)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(11, 'หมู', 0),
(11, 'เนื้อ', 0),
(11, 'ไก่', 0),
(11, 'ทะเล', 10);

-- สุกี้แห้ง (id: 12)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(12, 'หมู', 0),
(12, 'เนื้อ', 0),
(12, 'ไก่', 0),
(12, 'ทะเล', 10);

-- ราดหน้า (id: 13)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(13, 'หมู', 0),
(13, 'เนื้อ', 0),
(13, 'ไก่', 0),
(13, 'ทะเล', 10);

-- ผัดซีอิ๊ว (id: 14)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(14, 'หมู', 0),
(14, 'เนื้อ', 0),
(14, 'ไก่', 0),
(14, 'ทะเล', 10);

-- ผัดพริกแกง (id: 19)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(19, 'หมู', 0),
(19, 'ไก่', 0),
(19, 'กุ้ง', 0),
(19, 'หมึก', 0);

-- ผัดน้ำมันหอย (id: 20)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(20, 'หมู', 0),
(20, 'ไก่', 0),
(20, 'กุ้ง', 0),
(20, 'หมึก', 0);

-- ต้มผัดพริกเผา (id: 21)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(21, 'หมู', 0),
(21, 'ไก่', 0),
(21, 'กุ้ง', 0),
(21, 'หมึก', 0);

-- ต้มยำน้ำข้น (id: 31)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(31, 'หมู', 0),
(31, 'เนื้อ', 0),
(31, 'ไก่', 0),
(31, 'ทะเล', 20);

-- ต้มยำน้ำใสเลิศ (id: 32)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(32, 'หมู', 0),
(32, 'เนื้อ', 0),
(32, 'ไก่', 0),
(32, 'ทะเล', 20);

-- เมนูที่เหลือให้เพิ่มตามรายการจริง...

-- ประเภทยำ
INSERT INTO menu_items (name, price, category_id, is_available) VALUES
('ยำวุ้นเส้น', 60, 5, true),
('ยำมาม่า', 50, 5, true),
('ยำหมูยอ', 60, 5, true),
('คอหมูย่าง', 70, 5, true);

-- ประเภทน้ำตก
INSERT INTO menu_items (name, price, category_id, is_available) VALUES
('น้ำตกเนื้อ', 70, 6, true),
('น้ำตกหมู', 60, 6, true),
('น้ำตกคอหมูย่าง', 70, 6, true),
('ตับหวาน', 60, 6, true),
('ลาบหมู', 60, 6, true),
('ลาบเนื้อ', 70, 6, true);

-- ประเภทตำ
INSERT INTO menu_items (name, price, category_id, is_available) VALUES
('ตำปูปลาร้า', 50, 7, true),
('ตำถั่ว', 45, 7, true),
('ตำไทย', 50, 7, true),
('ตำซั่วโฟดไข่เค็ม', 60, 7, true),
('ตำกุ้งสด', 70, 7, true),
('ตำหมูยอ', 60, 7, true);

-- เมนูทานเล่น
INSERT INTO menu_items (name, price, category_id, is_available) VALUES
('ปีกไก่ทอด', 50, 8, true),
('เอ็นข้อไก่', 70, 8, true),
('นักเก็ต', 50, 8, true),
('เฟรนช์ฟราย', 50, 8, true);

-- เมนูเพิ่มเติม
INSERT INTO menu_items (name, price, category_id, is_available) VALUES
('ไข่ดาว', 10, 9, true),
('ไข่ต้ม', 10, 9, true),
('ไข่เจียว', 10, 9, true);

-- สร้าง View สำหรับดูเมนูพร้อมตัวเลือก
CREATE OR REPLACE VIEW menu_with_options AS
SELECT 
    m.id,
    m.name,
    m.description,
    m.price as base_price,
    m.category_id,
    c.name as category_name,
    mo.option_name,
    m.price + COALESCE(mo.price_adjustment, 0) as final_price
FROM menu_items m
LEFT JOIN menu_categories c ON m.category_id = c.id
LEFT JOIN menu_options mo ON m.id = mo.menu_item_id
WHERE m.is_available = true
ORDER BY m.category_id, m.id, mo.id;

-- ตรวจสอบข้อมูล
SELECT * FROM menu_with_options WHERE id IN (1, 6, 11, 19, 31) LIMIT 20;