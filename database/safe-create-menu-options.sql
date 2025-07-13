-- ตรวจสอบว่ามีตาราง menu_options หรือไม่
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'menu_options') THEN
        -- สร้างตาราง menu_options
        CREATE TABLE menu_options (
            id SERIAL PRIMARY KEY,
            menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
            option_name VARCHAR(50) NOT NULL,
            price_adjustment DECIMAL(10, 2) DEFAULT 0,
            is_available BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- สร้าง index
        CREATE INDEX idx_menu_options_menu_item_id ON menu_options(menu_item_id);

        -- Enable RLS
        ALTER TABLE menu_options ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ลบ policies เก่า (ถ้ามี) และสร้างใหม่
DROP POLICY IF EXISTS "Allow public read menu_options" ON menu_options;
DROP POLICY IF EXISTS "Allow authenticated insert menu_options" ON menu_options;
DROP POLICY IF EXISTS "Allow authenticated update menu_options" ON menu_options;
DROP POLICY IF EXISTS "Allow authenticated delete menu_options" ON menu_options;

-- สร้าง policies ใหม่
CREATE POLICY "Allow public read menu_options" ON menu_options
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert menu_options" ON menu_options
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update menu_options" ON menu_options
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete menu_options" ON menu_options
    FOR DELETE USING (true);

-- สร้าง trigger function ถ้ายังไม่มี
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- สร้าง trigger
DROP TRIGGER IF EXISTS update_menu_options_updated_at ON menu_options;
CREATE TRIGGER update_menu_options_updated_at BEFORE UPDATE
    ON menu_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ตรวจสอบว่ามีข้อมูลเมนูหรือไม่
SELECT COUNT(*) as menu_count FROM menu_items;

-- เพิ่มข้อมูลตัวอย่างถ้ายังไม่มี
INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT 1, 'หมู', 0 WHERE EXISTS (SELECT 1 FROM menu_items WHERE id = 1)
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT 1, 'ไก่', 0 WHERE EXISTS (SELECT 1 FROM menu_items WHERE id = 1)
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT 1, 'หมูกรอบ', 0 WHERE EXISTS (SELECT 1 FROM menu_items WHERE id = 1)
ON CONFLICT DO NOTHING;

INSERT INTO menu_options (menu_item_id, option_name, price_adjustment) 
SELECT 1, 'ทะเล', 10 WHERE EXISTS (SELECT 1 FROM menu_items WHERE id = 1)
ON CONFLICT DO NOTHING;

-- ตรวจสอบผลลัพธ์
SELECT 
    mo.id,
    mi.name as menu_name,
    mo.option_name,
    mo.price_adjustment
FROM menu_options mo
JOIN menu_items mi ON mo.menu_item_id = mi.id
ORDER BY mi.id, mo.option_name;