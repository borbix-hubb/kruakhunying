-- สร้างตาราง menu_options สำหรับเก็บตัวเลือกเนื้อสัตว์
CREATE TABLE IF NOT EXISTS menu_options (
    id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    option_name VARCHAR(50) NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- สร้าง index เพื่อเพิ่มประสิทธิภาพ
CREATE INDEX IF NOT EXISTS idx_menu_options_menu_item_id ON menu_options(menu_item_id);

-- เพิ่ม RLS policies
ALTER TABLE menu_options ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read menu_options" ON menu_options
    FOR SELECT USING (true);

-- Allow authenticated users to manage menu_options
CREATE POLICY "Allow authenticated insert menu_options" ON menu_options
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update menu_options" ON menu_options
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete menu_options" ON menu_options
    FOR DELETE USING (auth.role() = 'authenticated');

-- สร้าง trigger สำหรับ update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_menu_options_updated_at BEFORE UPDATE
    ON menu_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ตัวอย่างข้อมูลสำหรับทดสอบ
-- ข้าวกระเพราสูตรพริกแห้งโบราณ (สมมติ id = 1)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(1, 'หมู', 0),
(1, 'ไก่', 0),
(1, 'เนื้อ', 0),
(1, 'หมูกรอบ', 0),
(1, 'ทะเล', 10),
(1, 'กุ้ง', 10)
ON CONFLICT DO NOTHING;

-- ข้าวผัดโบราณ (สมมติ id = 2)
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) VALUES
(2, 'หมู', 0),
(2, 'ไก่', 0),
(2, 'หมูกรอบ', 0),
(2, 'ทะเล', 10),
(2, 'กุ้ง', 10),
(2, 'เนื้อ', 0)
ON CONFLICT DO NOTHING;