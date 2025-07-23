# 🚀 Quick Setup Guide - ครัวคุณหญิง

## Step 1: เข้า Supabase SQL Editor
1. Login เข้า Supabase: https://supabase.com
2. เลือก Project ของคุณ
3. คลิก **SQL Editor** ในเมนูด้านซ้าย
4. คลิก **+ New query**

## Step 2: Copy & Run SQL
1. Copy ข้อความทั้งหมดจากไฟล์ `database/setup-complete.sql`
2. วางใน SQL Editor
3. คลิกปุ่ม **RUN** (สีเขียว)

## Step 3: ตรวจสอบ
ไปที่ **Table Editor** คุณควรเห็น 6 ตาราง:
- ✅ menu_categories (4 หมวดหมู่)
- ✅ menu_items (20 เมนู)
- ✅ customers
- ✅ orders
- ✅ order_items
- ✅ admin_users (2 admins)

## Step 4: ทดสอบ
1. เปิด `verify-data.html`
2. กดปุ่ม "ดูคำสั่งซื้อทั้งหมด"
3. ถ้าเห็น "พบ 20 เมนู" = สำเร็จ! 🎉

## ❌ ถ้ามี Error
- "relation already exists" = ตารางมีอยู่แล้ว (ไม่เป็นไร)
- "permission denied" = ต้อง enable RLS policies
- Error อื่นๆ = ส่ง screenshot มาให้ดู

## 📱 เริ่มใช้งาน
1. **หน้าสั่งอาหาร**: เปิด `public/app.html`
2. **Admin Dashboard**: เปิด `admin/dashboard.html`
3. **ทดสอบสั่ง**: เปิด `test-order.html`