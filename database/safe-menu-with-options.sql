-- ระบบเมนูใหม่ที่มีตัวเลือกเนื้อสัตว์ (แก้ปัญหา duplicate key)

-- Step 1: ลบข้อมูลในลำดับที่ถูกต้อง
DELETE FROM order_items;
DELETE FROM orders;

-- ลบตาราง menu_options ถ้ามี (เนื่องจากอ้างอิงกับ menu_items)
DROP TABLE IF EXISTS menu_options CASCADE;

-- ลบ menu_items และ categories
DELETE FROM menu_items;
DELETE FROM menu_categories;

-- Step 2: รีเซ็ต sequences
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_items_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_categories_id_seq RESTART WITH 1;

-- Step 3: สร้างตารางใหม่สำหรับตัวเลือกเนื้อสัตว์
CREATE TABLE menu_options (
    id SERIAL PRIMARY KEY,
    menu_item_id INTEGER,
    option_name VARCHAR(50) NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Step 4: เพิ่มหมวดหมู่
INSERT INTO menu_categories (name, slug) VALUES
('อาหารจานเดียวแนะนำ', 'recommended-dishes'),
('อาหารจานเดียว', 'single-dishes'),
('อาหารประเภทเส้น', 'noodles'),
('ประเภทกับข้าว', 'side-dishes'),
('ประเภทยำ', 'salads'),
('ประเภทน้ำตก', 'namtok'),
('ประเภทตำ', 'somtam'),
('เมนูทานเล่น', 'snacks'),
('เมนูเพิ่มเติม', 'extras');

-- Step 5: เพิ่มเมนูหลัก (ไม่ระบุ id ให้ auto generate)

-- อาหารจานเดียวแนะนำ
INSERT INTO menu_items (name, description, price, category_id, is_available, is_recommended) VALUES
('ข้าวกระเพราสูตรพริกแห้งโบราณ', 'เลือกเนื้อสัตว์ได้', 50, 1, true, true),
('ข้าวผัดโบราณ', 'ข้าวผัดสูตรโบราณ', 50, 1, true, true),
('ข้าวหมึกผัดไข่เค็ม', 'หมึกผัดไข่เค็มหอมมัน', 60, 1, true, true);

-- อาหารจานเดียว
INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
('ข้าวหมูทอดกระเทียม', 'หมูทอดหอมกระเทียม', 50, 2, true),
('ข้าวคอหมูย่าง', 'คอหมูย่างน้ำจิ้มแจ่ว', 60, 2, true),
('ข้าวต้มรสไฟ', 'เลือกเนื้อสัตว์ได้', 50, 2, true),
('ข้าวผัดแหนม', 'ข้าวผัดแหนมหอมมัน', 50, 2, true),
('ข้าวผัดเขียวหวาน', 'ข้าวผัดเขียวหวานใส่ใบโหระพา', 50, 2, true),
('ข้าวผัดพริกแกงปลาระเบิด', 'ข้าวผัดพริกแกงใส่ปลาระเบิด', 50, 2, true),
('ข้าวผัดอเมริกัน', 'ข้าวผัดอเมริกันใส่ไส้กรอก', 60, 2, true);

-- อาหารประเภทเส้น
INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
('สุกี้น้ำ', 'เลือกเนื้อสัตว์ได้', 50, 3, true),
('สุกี้แห้ง', 'เลือกเนื้อสัตว์ได้', 50, 3, true),
('ราดหน้า', 'เลือกเนื้อสัตว์ได้', 50, 3, true),
('ผัดซีอิ๊ว', 'เลือกเนื้อสัตว์ได้', 50, 3, true),
('ผัดไทย', 'ผัดไทยกุ้งสด', 50, 3, true),
('หอยทอด', 'หอยทอดกรอบ', 60, 3, true),
('ก๋วยเตี๋ยวคั่วไก่', 'ก๋วยเตี๋ยวคั่วไก่หอมมัน', 60, 3, true),
('ก๋วยเตี๋ยวโบราณ', 'ก๋วยเตี๋ยวน้ำใสโบราณ', 50, 3, true);

-- ประเภทกับข้าว
INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
('ผัดพริกแกง', 'เลือกเนื้อสัตว์ได้', 80, 4, true),
('ผัดน้ำมันหอย', 'เลือกเนื้อสัตว์ได้', 80, 4, true),
('ต้มผัดพริกเผา', 'เลือกเนื้อสัตว์ได้', 80, 4, true),
('เต้าหู้หมูสับผัดน้ำมันหอย', 'เต้าหู้ใส่หมูสับ', 80, 4, true),
('เต้าหู้ทรงเครื่อง', 'เต้าหู้ทอดราดซอส', 80, 4, true),
('กะหล่ำปลีทอดน้ำปลา', 'กะหล่ำปลีทอดกรอบ', 80, 4, true),
('หมึกผัดไข่เค็ม', 'หมึกผัดไข่เค็มหอมมัน', 80, 4, true),
('หมูกรอบคั่วพริกเกลือ', 'หมูกรอบคั่วพริกเกลือ', 80, 4, true),
('ไก่ป๊อปคั่วพริกเกลือ', 'ไก่ป๊อปคั่วพริกเกลือ', 80, 4, true),
('หมูสามชั้นทอดน้ำปลา', 'หมูสามชั้นทอดกรอบ', 80, 4, true),
('ปีกไก่ทอดน้ำปลา', 'ปีกไก่ทอดหอมน้ำปลา', 80, 4, true),
('แกงจืดสาหร่ายเต้าหู้หมูสับ', 'แกงจืดสาหร่าย', 80, 4, true),
('ต้มยำน้ำข้น', 'เลือกเนื้อสัตว์ได้', 80, 4, true),
('ต้มยำน้ำใสเลิศ', 'เลือกเนื้อสัตว์ได้', 80, 4, true);

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

-- Step 6: เพิ่ม Foreign Key constraint หลังจากที่มีข้อมูลแล้ว
ALTER TABLE menu_options 
ADD CONSTRAINT fk_menu_options_menu_item 
FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE;

-- Step 7: เพิ่มตัวเลือกเนื้อสัตว์ (ใช้ชื่อแทน id)

-- ข้าวกระเพรา
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'ข้าวกระเพราสูตรพริกแห้งโบราณ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'ข้าวกระเพราสูตรพริกแห้งโบราณ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เนื้อ', 0 FROM menu_items WHERE name = 'ข้าวกระเพราสูตรพริกแห้งโบราณ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมูกรอบ', 0 FROM menu_items WHERE name = 'ข้าวกระเพราสูตรพริกแห้งโบราณ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 10 FROM menu_items WHERE name = 'ข้าวกระเพราสูตรพริกแห้งโบราณ';

-- ข้าวต้มรสไฟ
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'ข้าวต้มรสไฟ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'ข้าวต้มรสไฟ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 10 FROM menu_items WHERE name = 'ข้าวต้มรสไฟ';

-- สุกี้น้ำ
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'สุกี้น้ำ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เนื้อ', 0 FROM menu_items WHERE name = 'สุกี้น้ำ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'สุกี้น้ำ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 10 FROM menu_items WHERE name = 'สุกี้น้ำ';

-- สุกี้แห้ง
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'สุกี้แห้ง';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เนื้อ', 0 FROM menu_items WHERE name = 'สุกี้แห้ง';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'สุกี้แห้ง';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 10 FROM menu_items WHERE name = 'สุกี้แห้ง';

-- ราดหน้า
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'ราดหน้า';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เนื้อ', 0 FROM menu_items WHERE name = 'ราดหน้า';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'ราดหน้า';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 10 FROM menu_items WHERE name = 'ราดหน้า';

-- ผัดซีอิ๊ว
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'ผัดซีอิ๊ว';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เนื้อ', 0 FROM menu_items WHERE name = 'ผัดซีอิ๊ว';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'ผัดซีอิ๊ว';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 10 FROM menu_items WHERE name = 'ผัดซีอิ๊ว';

-- ผัดพริกแกง
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'ผัดพริกแกง';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'ผัดพริกแกง';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'กุ้ง', 0 FROM menu_items WHERE name = 'ผัดพริกแกง';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมึก', 0 FROM menu_items WHERE name = 'ผัดพริกแกง';

-- ผัดน้ำมันหอย
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'ผัดน้ำมันหอย';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'ผัดน้ำมันหอย';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'กุ้ง', 0 FROM menu_items WHERE name = 'ผัดน้ำมันหอย';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมึก', 0 FROM menu_items WHERE name = 'ผัดน้ำมันหอย';

-- ต้มผัดพริกเผา
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'ต้มผัดพริกเผา';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'ต้มผัดพริกเผา';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'กุ้ง', 0 FROM menu_items WHERE name = 'ต้มผัดพริกเผา';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมึก', 0 FROM menu_items WHERE name = 'ต้มผัดพริกเผา';

-- ต้มยำน้ำข้น
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'ต้มยำน้ำข้น';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เนื้อ', 0 FROM menu_items WHERE name = 'ต้มยำน้ำข้น';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'ต้มยำน้ำข้น';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 20 FROM menu_items WHERE name = 'ต้มยำน้ำข้น';

-- ต้มยำน้ำใสเลิศ
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name = 'ต้มยำน้ำใสเลิศ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เนื้อ', 0 FROM menu_items WHERE name = 'ต้มยำน้ำใสเลิศ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name = 'ต้มยำน้ำใสเลิศ';

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 20 FROM menu_items WHERE name = 'ต้มยำน้ำใสเลิศ';

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
    m.price + COALESCE(mo.price_adjustment, 0) as final_price,
    m.is_available,
    m.is_recommended
FROM menu_items m
LEFT JOIN menu_categories c ON m.category_id = c.id
LEFT JOIN menu_options mo ON m.id = mo.menu_item_id
WHERE m.is_available = true
ORDER BY m.category_id, m.id, mo.id;

-- ตรวจสอบข้อมูล
SELECT 'Categories:' as info, COUNT(*) as count FROM menu_categories
UNION ALL
SELECT 'Menu Items:', COUNT(*) FROM menu_items
UNION ALL
SELECT 'Menu Options:', COUNT(*) FROM menu_options;