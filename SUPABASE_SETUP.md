# การตั้งค่า Supabase สำหรับครัวคุณหญิง

## ขั้นตอนการติดตั้ง

### 1. สร้างโปรเจค Supabase
1. ไปที่ [https://supabase.com](https://supabase.com)
2. สร้างโปรเจคใหม่
3. รอให้โปรเจคสร้างเสร็จ (ประมาณ 2 นาที)

### 2. ตั้งค่าฐานข้อมูล
1. ไปที่ SQL Editor ในแดชบอร์ด Supabase
2. คัดลอกโค้ดทั้งหมดจากไฟล์ `database/schema.sql`
3. วางในช่อง SQL Editor และคลิก Run
4. ตรวจสอบว่าตารางถูกสร้างเรียบร้อยแล้ว

### 3. ตั้งค่า Authentication
1. ไปที่ Authentication > Providers
2. เปิดใช้งาน Email provider
3. ตั้งค่า Site URL เป็น URL ของเว็บไซต์คุณ

### 4. ตั้งค่า API Keys
1. ไปที่ Settings > API
2. คัดลอก Project URL และ anon public key
3. เปิดไฟล์ `shared/config/supabase.js`
4. แทนที่:
   - `YOUR_SUPABASE_URL` ด้วย Project URL
   - `YOUR_SUPABASE_ANON_KEY` ด้วย anon public key

### 5. สร้าง Admin User แรก
1. เปิด Console ในเบราว์เซอร์ (F12)
2. ไปที่หน้า Admin Dashboard
3. รันคำสั่งนี้ใน Console:
```javascript
await createFirstAdmin('admin@kruakhunying.com', 'your_secure_password', 'Admin')
```

### 6. ตั้งค่า Row Level Security (RLS)
รันคำสั่งต่อไปนี้ใน SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can read menu
CREATE POLICY "Public can read categories" ON menu_categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read available menu items" ON menu_items
    FOR SELECT USING (is_available = true);

-- Authenticated admins can manage menu
CREATE POLICY "Admins can manage menu items" ON menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );

-- Anyone can create orders
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- Only admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );

-- Admins can update orders
CREATE POLICY "Admins can update orders" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );
```

## การใช้งาน

### สำหรับลูกค้า
- เข้าหน้าสั่งอาหาร: `/public/app.html`
- ไม่ต้องล็อกอิน
- สามารถดูเมนูและสั่งอาหารได้

### สำหรับ Admin
- เข้าหน้า Admin: `/admin/dashboard.html`
- ล็อกอินด้วย email และ password ที่สร้างไว้
- จัดการเมนู, ดูคำสั่งซื้อ, ดูรายงาน

## การแก้ปัญหา

### ถ้าเชื่อมต่อไม่ได้
1. ตรวจสอบว่าใส่ URL และ API Key ถูกต้อง
2. ตรวจสอบว่า Supabase project ยังทำงานอยู่
3. ดู Console log ในเบราว์เซอร์

### ถ้า Admin ล็อกอินไม่ได้
1. ตรวจสอบว่าสร้าง admin user แล้ว
2. ตรวจสอบว่า email ถูกต้อง
3. ลองรีเซ็ตรหัสผ่านใน Supabase Dashboard

## Security Notes
- อย่าเก็บ API keys ใน public repository
- ใช้ environment variables สำหรับ production
- ตั้งค่า CORS ให้เหมาะสม
- เปิด RLS บนทุกตาราง