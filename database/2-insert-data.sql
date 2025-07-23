-- Step 2: เพิ่มข้อมูลเริ่มต้น
-- รันหลังจากสร้างตารางแล้ว

-- เพิ่มหมวดหมู่
INSERT INTO menu_categories (name, slug) VALUES 
    ('ข้าว', 'rice'),
    ('เส้น', 'noodle'),
    ('กับข้าว', 'sidedish'),
    ('เครื่องดื่ม', 'drink')
ON CONFLICT (name) DO NOTHING;

-- เพิ่มเมนูอาหาร
INSERT INTO menu_items (name, description, price, category_id, is_popular, is_recommended, is_hot) VALUES
    -- ข้าว (category_id = 1)
    ('ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสด หอมกระเทียม พริกไทย', 50, 1, FALSE, FALSE, TRUE),
    ('ข้าวผัดหมู', 'ข้าวผัดหมูนุ่ม ใส่ไข่ดาว อร่อยมาก', 45, 1, TRUE, FALSE, FALSE),
    ('ข้าวผัดไก่', 'ข้าวผัดไก่ หอมพริกไทย กลมกล่อม', 45, 1, FALSE, FALSE, FALSE),
    ('ข้าวผัดปู', 'ข้าวผัดปู เนื้อปูแน่นๆ หอมมัน', 55, 1, FALSE, TRUE, FALSE),
    ('ข้าวผัดผัก', 'ข้าวผัดผักรวม สำหรับมังสวิรัติ สุขภาพดี', 40, 1, FALSE, FALSE, FALSE),
    
    -- เส้น (category_id = 2)
    ('ผัดไทยกุ้งสด', 'ผัดไทยกุ้งสด รสชาติต้นตำรับ', 45, 2, TRUE, FALSE, FALSE),
    ('ผัดซีอิ๊วหมู', 'เส้นใหญ่ผัดซีอิ๊ว หมูนุ่ม', 40, 2, FALSE, FALSE, FALSE),
    ('ราดหน้าหมู', 'ราดหน้าเส้นใหญ่ น้ำข้นกำลังดี', 45, 2, FALSE, FALSE, FALSE),
    ('บะหมี่แห้ง', 'บะหมี่แห้งหมูแดง กรอบนอกนุ่มใน', 35, 2, FALSE, FALSE, FALSE),
    ('ก๋วยเตี๋ยวต้มยำ', 'ต้มยำน้ำข้น รสจัดจ้าน', 40, 2, FALSE, FALSE, TRUE),
    
    -- กับข้าว (category_id = 3)
    ('ไก่ทอดกระเทียม', 'ไก่ทอดกรอบ หอมกระเทียม', 50, 3, FALSE, TRUE, FALSE),
    ('หมูกรอบคั่วพริกเกลือ', 'หมูกรอบ คั่วพริกเกลือ', 55, 3, FALSE, FALSE, TRUE),
    ('ผัดกะเพราหมูสับ', 'กะเพราหมูสับ ใบกะเพราหอม', 45, 3, TRUE, FALSE, TRUE),
    ('ต้มยำกุ้ง', 'ต้มยำกุ้งน้ำข้น รสชาติจัดจ้าน', 60, 3, FALSE, TRUE, TRUE),
    ('ยำวุ้นเส้น', 'ยำวุ้นเส้น รสชาติกลมกล่อม', 35, 3, FALSE, FALSE, FALSE),
    
    -- เครื่องดื่ม (category_id = 4)
    ('ชาเย็น', 'ชาเย็นหวานมัน', 25, 4, TRUE, FALSE, FALSE),
    ('กาแฟเย็น', 'กาแฟเย็นหอมมัน', 25, 4, FALSE, FALSE, FALSE),
    ('น้ำส้ม', 'น้ำส้มคั้นสด', 20, 4, FALSE, FALSE, FALSE),
    ('โค้ก', 'โค้กเย็นๆ', 15, 4, FALSE, FALSE, FALSE),
    ('น้ำเปล่า', 'น้ำเปล่าเย็น', 10, 4, FALSE, FALSE, FALSE);

-- เพิ่ม Admin Users
INSERT INTO admin_users (email, password_hash, name, role) VALUES
    ('admin@kruakhunying.com', 'managed_by_supabase_auth', 'Admin', 'super_admin'),
    ('admin.borbix@kruakhunying.com', 'managed_by_supabase_auth', 'admin.borbix', 'super_admin')
ON CONFLICT (email) DO NOTHING;