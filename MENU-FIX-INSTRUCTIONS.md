# วิธีแก้ไขปัญหาเมนูไม่แสดง

## ปัญหาที่พบ:
- เมนูอาหารไม่แสดงในหน้าสั่งอาหาร
- ระบบพยายามโหลดจาก view `menu_with_options` ที่ยังไม่ได้สร้าง

## วิธีแก้ไข:

### ขั้นตอนที่ 1: รัน SQL Script แรก (ถ้ายังไม่ได้ทำ)
1. เข้า Supabase Dashboard > SQL Editor
2. รัน `database/fix-orders-table.sql`

### ขั้นตอนที่ 2: สร้าง Menu View
1. ยังอยู่ใน SQL Editor
2. Copy code จาก `database/create-menu-view-new.sql`
3. วางและรัน

Script นี้จะ:
- สร้าง view `menu_with_options`
- สร้างตาราง `menu_options` (ถ้ายังไม่มี)
- เพิ่ม sample menu data (ถ้าไม่มีข้อมูล)
- ตั้ง permissions ที่ถูกต้อง

### ขั้นตอนที่ 3: ตรวจสอบผลลัพธ์
ที่ด้านล่างของ SQL Editor จะแสดง:
- จำนวน Categories
- จำนวน Menu Items
- จำนวน Available Items

ควรมีข้อมูลอย่างน้อย 8 categories และ 10 menu items

### ขั้นตอนที่ 4: Clear Cache และทดสอบ
1. กด F12 > คลิกขวาที่ Reload > Empty Cache and Hard Reload
2. เปิด https://borbix-hubb.github.io/kruakhunying/public/app.html?v=3
3. ควรเห็นเมนูอาหารแสดงแล้ว

## ถ้ายังไม่เห็นเมนู:

### ตรวจสอบ Console
1. กด F12 เปิด Developer Tools
2. ดูที่ Console tab
3. ดูว่ามี error อะไร

### ตรวจสอบ Network
1. ใน Developer Tools > Network tab
2. Refresh หน้า
3. ดูว่ามี request ไป Supabase หรือไม่
4. ดู response ว่ามีข้อมูลหรือ error

### ตรวจสอบใน Supabase
1. ไปที่ Table Editor
2. ดูตาราง `menu_items` - ต้องมีข้อมูล
3. ดูตาราง `menu_categories` - ต้องมีข้อมูล
4. ลองรัน query ทดสอบ:

```sql
SELECT * FROM menu_items WHERE is_available = true;
```

## โค้ดที่อัพเดท:
- แก้ไข `app.js` ให้มี fallback เมื่อ view ไม่มี
- โหลดจากตาราง `menu_items` โดยตรงถ้า view error
- แสดง error message ที่ชัดเจนใน console

## หมายเหตุ:
- ระบบจะพยายามโหลดจาก view ก่อน
- ถ้า view ไม่มี จะโหลดจากตารางโดยตรง
- ถ้ายังไม่มีข้อมูลเมนู script จะเพิ่ม sample data ให้

ลองทำตามขั้นตอนแล้วบอกผลครับ!