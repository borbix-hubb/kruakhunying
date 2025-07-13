-- Insert Initial Menu Data for Krua Khun Ying
-- รันสคริปต์นี้หลังจากสร้างตารางแล้ว

-- 1. Insert Menu Categories (ถ้ายังไม่มี)
INSERT INTO menu_categories (name, slug) VALUES
('อาหารจานเดียวแนะนำ', 'recommended-dishes'),
('อาหารจานเดียว', 'single-dishes'), 
('อาหารประเภทเส้น', 'noodles'),
('ประเภทกับข้าว', 'side-dishes'),
('ประเภทยำ', 'salads'),
('ประเภทน้ำตก', 'namtok'),
('ประเภทตำ', 'somtam'),
('เมนูทานเล่น', 'snacks'),
('เมนูเพิ่มเติม', 'extras')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Menu Items
-- อาหารจานเดียวแนะนำ
INSERT INTO menu_items (name, description, price, category_id, is_popular, is_recommended, is_available) VALUES
('ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสดใหม่ หอมกระเทียม', 60, (SELECT id FROM menu_categories WHERE slug = 'recommended-dishes'), true, true, true),
('ผัดกะเพราหมูสับ', 'ผัดกะเพราใบโหระพา หอมอร่อย', 50, (SELECT id FROM menu_categories WHERE slug = 'recommended-dishes'), true, true, true),
('ข้าวมันไก่', 'ข้าวมันไก่นุ่ม พร้อมน้ำจิ้มรสเด็ด', 50, (SELECT id FROM menu_categories WHERE slug = 'recommended-dishes'), true, true, true);

-- อาหารจานเดียว
INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
('ข้าวผัดหมู', 'ข้าวผัดหมู หอมกระเทียม', 50, (SELECT id FROM menu_categories WHERE slug = 'single-dishes'), true),
('ข้าวผัดไก่', 'ข้าวผัดไก่ หอมมัน', 50, (SELECT id FROM menu_categories WHERE slug = 'single-dishes'), true),
('ข้าวผัดทะเล', 'ข้าวผัดรวมมิตรทะเล', 70, (SELECT id FROM menu_categories WHERE slug = 'single-dishes'), true),
('ผัดกะเพราไก่', 'ผัดกะเพราไก่สับ เผ็ดร้อน', 50, (SELECT id FROM menu_categories WHERE slug = 'single-dishes'), true),
('ผัดกะเพรากุ้ง', 'ผัดกะเพรากุ้งสด', 70, (SELECT id FROM menu_categories WHERE slug = 'single-dishes'), true),
('ข้าวหมูแดง', 'ข้าวหมูแดง หมูนุ่ม น้ำซอสเข้ม', 55, (SELECT id FROM menu_categories WHERE slug = 'single-dishes'), true),
('ข้าวหมูกรอบ', 'ข้าวหมูกรอบ กรอบนอกนุ่มใน', 55, (SELECT id FROM menu_categories WHERE slug = 'single-dishes'), true),
('ข้าวขาหมู', 'ข้าวขาหมูตุ๋นยาจีน', 60, (SELECT id FROM menu_categories WHERE slug = 'single-dishes'), true);

-- อาหารประเภทเส้น
INSERT INTO menu_items (name, description, price, category_id, is_available, is_hot) VALUES
('ก๋วยเตี๋ยวต้มยำหมู', 'ต้มยำน้ำข้น รสจัดจ้าน', 45, (SELECT id FROM menu_categories WHERE slug = 'noodles'), true, true),
('ก๋วยเตี๋ยวต้มยำทะเล', 'ต้มยำทะเล รสเข้มข้น', 60, (SELECT id FROM menu_categories WHERE slug = 'noodles'), true, true),
('ก๋วยเตี๋ยวน้ำใส', 'น้ำซุปใส รสกลมกล่อม', 40, (SELECT id FROM menu_categories WHERE slug = 'noodles'), true, false),
('ก๋วยเตี๋ยวเย็นตาโฟ', 'เย็นตาโฟน้ำแดง', 45, (SELECT id FROM menu_categories WHERE slug = 'noodles'), true, false),
('บะหมี่หมูแดง', 'บะหมี่หมูแดง น้ำซุปเข้มข้น', 45, (SELECT id FROM menu_categories WHERE slug = 'noodles'), true, false),
('ราดหน้าหมู', 'ราดหน้าน้ำข้น เส้นใหญ่', 50, (SELECT id FROM menu_categories WHERE slug = 'noodles'), true, false),
('ผัดซีอิ๊วหมู', 'ผัดซีอิ๊วเส้นใหญ่ หมูนุ่ม', 50, (SELECT id FROM menu_categories WHERE slug = 'noodles'), true, false),
('ผัดไทยกุ้งสด', 'ผัดไทยกุ้งสด รสชาติต้นตำรับ', 60, (SELECT id FROM menu_categories WHERE slug = 'noodles'), true, false);

-- ประเภทกับข้าว
INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
('ไข่เจียว', 'ไข่เจียวฟูนุ่ม', 30, (SELECT id FROM menu_categories WHERE slug = 'side-dishes'), true),
('ไข่ดาว', 'ไข่ดาว 2 ฟอง', 20, (SELECT id FROM menu_categories WHERE slug = 'side-dishes'), true),
('หมูทอดกระเทียม', 'หมูทอดกระเทียมพริกไทย', 60, (SELECT id FROM menu_categories WHERE slug = 'side-dishes'), true),
('ไก่ทอด', 'ไก่ทอดกรอบ', 60, (SELECT id FROM menu_categories WHERE slug = 'side-dishes'), true),
('ต้มยำกุ้ง', 'ต้มยำกุ้งน้ำข้น', 80, (SELECT id FROM menu_categories WHERE slug = 'side-dishes'), true),
('ต้มข่าไก่', 'ต้มข่าไก่ใส่เห็ด', 70, (SELECT id FROM menu_categories WHERE slug = 'side-dishes'), true),
('แกงเขียวหวานไก่', 'แกงเขียวหวานไก่ใส่มะเขือ', 60, (SELECT id FROM menu_categories WHERE slug = 'side-dishes'), true),
('ผัดผักรวม', 'ผัดผักรวมมิตร', 40, (SELECT id FROM menu_categories WHERE slug = 'side-dishes'), true);

-- ประเภทยำ
INSERT INTO menu_items (name, description, price, category_id, is_available, is_hot) VALUES
('ยำวุ้นเส้น', 'ยำวุ้นเส้นรวมมิตร', 50, (SELECT id FROM menu_categories WHERE slug = 'salads'), true, true),
('ยำมาม่า', 'ยำมาม่ารวมมิตรทะเล', 60, (SELECT id FROM menu_categories WHERE slug = 'salads'), true, true),
('ยำแซลมอน', 'ยำแซลมอนสด', 120, (SELECT id FROM menu_categories WHERE slug = 'salads'), true, true),
('ยำทะเล', 'ยำทะเลรวมมิตร', 80, (SELECT id FROM menu_categories WHERE slug = 'salads'), true, true),
('ลาบหมู', 'ลาบหมูแบบอีสาน', 60, (SELECT id FROM menu_categories WHERE slug = 'salads'), true, true),
('ยำหมูยอ', 'ยำหมูยอพริกเผา', 50, (SELECT id FROM menu_categories WHERE slug = 'salads'), true, true);

-- ประเภทน้ำตก
INSERT INTO menu_items (name, description, price, category_id, is_available, is_hot) VALUES
('น้ำตกหมู', 'น้ำตกหมูย่าง แบบอีสาน', 60, (SELECT id FROM menu_categories WHERE slug = 'namtok'), true, true),
('น้ำตกเนื้อ', 'น้ำตกเนื้อย่าง', 80, (SELECT id FROM menu_categories WHERE slug = 'namtok'), true, true),
('คอหมูย่าง', 'คอหมูย่างจิ้มแจ่ว', 70, (SELECT id FROM menu_categories WHERE slug = 'namtok'), true, false),
('หมูย่าง', 'หมูย่างหมักสูตรพิเศษ', 60, (SELECT id FROM menu_categories WHERE slug = 'namtok'), true, false);

-- ประเภทตำ
INSERT INTO menu_items (name, description, price, category_id, is_available, is_hot) VALUES
('ส้มตำไทย', 'ส้มตำไทยใส่ถั่ว', 40, (SELECT id FROM menu_categories WHERE slug = 'somtam'), true, true),
('ส้มตำปู', 'ส้มตำใส่ปูดอง', 50, (SELECT id FROM menu_categories WHERE slug = 'somtam'), true, true),
('ส้มตำไทยใส่ปู', 'ส้มตำไทยใส่ปูดอง', 60, (SELECT id FROM menu_categories WHERE slug = 'somtam'), true, true),
('ตำถั่ว', 'ตำถั่วฝักยาว', 40, (SELECT id FROM menu_categories WHERE slug = 'somtam'), true, true),
('ตำซั่ว', 'ตำซั่วแบบอีสาน', 50, (SELECT id FROM menu_categories WHERE slug = 'somtam'), true, true);

-- เมนูทานเล่น
INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
('ปอเปี๊ยะทอด', 'ปอเปี๊ยะทอดไส้ผัก', 40, (SELECT id FROM menu_categories WHERE slug = 'snacks'), true),
('ไก่ย่าง', 'ไก่ย่างสูตรพิเศษ', 100, (SELECT id FROM menu_categories WHERE slug = 'snacks'), true),
('หมูปิ้ง', 'หมูปิ้ง 10 ไม้', 50, (SELECT id FROM menu_categories WHERE slug = 'snacks'), true);

-- เมนูเพิ่มเติม
INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES
('ข้าวสวย', 'ข้าวสวยหอมมะลิ', 10, (SELECT id FROM menu_categories WHERE slug = 'extras'), true),
('ข้าวเหนียว', 'ข้าวเหนียวนึ่ง', 10, (SELECT id FROM menu_categories WHERE slug = 'extras'), true),
('ไข่ดาวเพิ่ม', 'ไข่ดาว 1 ฟอง', 10, (SELECT id FROM menu_categories WHERE slug = 'extras'), true);

-- 3. Create menu_options table if not exists (safe)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'menu_options') THEN
        CREATE TABLE menu_options (
            id SERIAL PRIMARY KEY,
            menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
            option_name VARCHAR(50) NOT NULL,
            price_adjustment DECIMAL(10, 2) DEFAULT 0,
            is_available BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX idx_menu_options_menu_item_id ON menu_options(menu_item_id);
        ALTER TABLE menu_options ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Allow public read menu_options" ON menu_options
            FOR SELECT USING (true);
        CREATE POLICY "Allow authenticated insert menu_options" ON menu_options
            FOR INSERT WITH CHECK (true);
        CREATE POLICY "Allow authenticated update menu_options" ON menu_options
            FOR UPDATE USING (true);
        CREATE POLICY "Allow authenticated delete menu_options" ON menu_options
            FOR DELETE USING (true);
    END IF;
END $$;

-- 4. Insert some menu options
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'หมู', 0 FROM menu_items WHERE name LIKE 'ก๋วยเตี๋ยว%' OR name LIKE 'บะหมี่%'
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไก่', 0 FROM menu_items WHERE name LIKE 'ก๋วยเตี๋ยว%' OR name LIKE 'บะหมี่%'
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'เนื้อ', 10 FROM menu_items WHERE name LIKE 'ก๋วยเตี๋ยว%' OR name LIKE 'บะหมี่%'
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ทะเล', 15 FROM menu_items WHERE name LIKE 'ก๋วยเตี๋ยว%' OR name LIKE 'บะหมี่%'
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'ไข่ดาว', 10 FROM menu_items WHERE name LIKE 'ข้าวผัด%' OR name LIKE 'ผัดกะเพรา%'
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT id, 'พิเศษ', 10 FROM menu_items WHERE name IN ('ข้าวผัดหมู', 'ข้าวผัดไก่', 'ข้าวมันไก่', 'ข้าวหมูแดง', 'ข้าวหมูกรอบ')
ON CONFLICT DO NOTHING;

-- Show summary
SELECT 
    (SELECT COUNT(*) FROM menu_categories) as total_categories,
    (SELECT COUNT(*) FROM menu_items) as total_items,
    (SELECT COUNT(*) FROM menu_options) as total_options;