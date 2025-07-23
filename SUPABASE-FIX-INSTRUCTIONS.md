# วิธีแก้ไขปัญหา Database ใน Supabase

## ขั้นตอนการแก้ไข:

### 1. เข้า Supabase Dashboard
- ไปที่ https://app.supabase.com
- เลือกโปรเจคของคุณ

### 2. ไปที่ SQL Editor
- คลิกที่ "SQL Editor" ในเมนูด้านซ้าย
- คลิก "New query"

### 3. รัน SQL Script
- Copy code ทั้งหมดจากไฟล์ `database/fix-orders-table.sql`
- วางใน SQL Editor
- คลิก "Run" หรือกด Ctrl+Enter

### 4. ตรวจสอบผลลัพธ์
Script จะทำสิ่งต่อไปนี้:
- ✅ เพิ่ม column `line_user_id` ในตาราง orders
- ✅ เพิ่ม column สำหรับ delivery info
- ✅ สร้าง indexes สำหรับ performance
- ✅ เปิด Row Level Security และสร้าง policies
- ✅ แสดงโครงสร้างตารางที่อัพเดทแล้ว
- ✅ สร้าง function `create_order_with_customer` (optional)

### 5. ทดสอบ
หลังจากรัน script แล้ว ลองทดสอบ:

1. **ทดสอบสั่งอาหารใหม่**
   - เปิด https://borbix-hubb.github.io/kruakhunying/liff/
   - Login ด้วย LINE
   - คลิก "สั่งอาหาร"
   - สั่งอาหารตามปกติ

2. **ตรวจสอบใน LIFF**
   - กลับมาที่ LIFF
   - ดูหน้า "สถานะ" - ควรเห็นออเดอร์ที่สั่ง
   - ดูหน้า "ประวัติ" - จะเห็นเมื่อออเดอร์เสร็จ

## หากยังมีปัญหา:

### ตรวจสอบ Error Log
ใน Supabase Dashboard:
1. ไปที่ "Logs" > "API logs"
2. ดู error messages ล่าสุด

### ตรวจสอบ Browser Console
1. เปิด Developer Tools (F12)
2. ดูที่ Console tab
3. ดู error messages

### Clear Cache อีกครั้ง
1. Hard refresh: Ctrl+Shift+R (Windows) หรือ Cmd+Shift+R (Mac)
2. หรือเปิดในโหมด Incognito

## โครงสร้างตารางที่ถูกต้อง:

### orders table
- id (primary key)
- order_number
- customer_id (foreign key to customers)
- line_user_id (สำหรับ LINE)
- total_amount
- status
- payment_method
- delivery_method
- delivery_dorm
- delivery_room
- delivery_note
- note
- created_at
- updated_at

### customers table
- id (primary key)
- name
- phone
- dorm
- room
- created_at

### order_items table
- id (primary key)
- order_id (foreign key to orders)
- menu_item_id (foreign key to menu_items)
- quantity
- price
- subtotal

## สิ่งที่ระบบทำได้หลังแก้ไข:
1. ✅ บันทึก LINE user ID กับทุกออเดอร์
2. ✅ แสดงเฉพาะออเดอร์ของผู้ใช้แต่ละคนใน LIFF
3. ✅ ไม่ต้องใส่เบอร์โทรเพื่อติดตามออเดอร์
4. ✅ ปุ่ม Logout ในหน้าโปรไฟล์
5. ✅ Realtime updates เมื่อสถานะเปลี่ยน