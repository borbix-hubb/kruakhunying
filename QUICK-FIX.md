# คู่มือแก้ไขด่วน - เมนูไม่แสดง

## ปัญหาที่พบ:
Error: `column mo.name does not exist` เพราะพยายามสร้าง view ก่อนสร้างตาราง

## วิธีแก้ไขด่วน:

### 1. เข้า Supabase SQL Editor
- https://app.supabase.com
- เลือกโปรเจคของคุณ
- คลิก "SQL Editor"

### 2. Copy และรัน SQL นี้ทั้งหมด
Copy ทั้งหมดจากไฟล์ `database/fix-menu-complete.sql` แล้วรัน

### 3. ผลที่จะได้:
- ✅ สร้างตาราง menu_options
- ✅ เพิ่ม categories 8 หมวด
- ✅ เพิ่มเมนูตัวอย่าง 15 รายการ
- ✅ สร้าง view ที่ใช้งานได้
- ✅ ตั้ง permissions ถูกต้อง

### 4. ตรวจสอบผล
ด้านล่างจะแสดง:
```
NOTICE: Categories: 8
NOTICE: Total Menu Items: 15
NOTICE: Available Items: 15
```

### 5. Clear Cache และทดสอบ
- กด Ctrl+Shift+R (Windows) หรือ Cmd+Shift+R (Mac)
- เปิด https://borbix-hubb.github.io/kruakhunying/public/app.html
- ควรเห็นเมนูแสดงแล้ว!

## หากยังไม่เห็นเมนู:

### ตรวจสอบใน Supabase:
```sql
-- ดูว่ามีเมนูหรือไม่
SELECT * FROM menu_items;

-- ดูว่า view ทำงานหรือไม่
SELECT * FROM menu_with_options LIMIT 5;
```

### ดู Console Error:
1. กด F12
2. ดูที่ Console
3. ถ่ายภาพ error มาให้ดู

## สรุป Script ที่รันแล้ว:
1. ✅ fix-orders-table.sql (เพิ่ม LINE user ID)
2. ✅ fix-menu-complete.sql (แก้ปัญหาเมนู)

พร้อมใช้งานแล้วครับ!