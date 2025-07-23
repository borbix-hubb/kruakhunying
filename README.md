# ครัวคุณหญิง - Food Ordering Web App

เว็บแอปสั่งอาหารสำหรับร้านอาหารตามสั่งใต้หอพัก พัฒนาด้วย HTML, CSS, และ JavaScript

## Features

### สำหรับลูกค้า
- 🍜 ดูเมนูอาหารแบ่งตามหมวดหมู่
- 🔍 ค้นหาเมนูที่ต้องการ
- 🛒 ระบบตะกร้าสินค้า
- 📱 สั่งอาหารพร้อมระบุหอพักและเลขห้อง
- 📲 รับการแจ้งเตือนผ่าน LINE

### สำหรับร้านค้า (Admin Dashboard)
- 📋 จัดการคำสั่งซื้อ (รอดำเนินการ/กำลังทำ/เสร็จแล้ว)
- 🍽️ จัดการเมนูอาหาร
- 📊 ดูรายงานยอดขาย
- 💬 แจ้งเตือนลูกค้าผ่าน LINE
- 📈 Dashboard แสดงสถิติแบบ Real-time

## Tech Stack
- HTML5
- CSS3 (with modern features like Grid, Flexbox)
- Vanilla JavaScript
- Supabase (Database & Authentication)
- Chart.js (for reports)
- Font Awesome Icons
- Responsive Design

## Project Structure
```
krua-khun-ying/
├── index.html          # Landing page
├── public/
│   └── app.html       # Customer ordering app
├── admin/
│   └── dashboard.html # Admin dashboard
└── shared/
    ├── styles/        # CSS files
    ├── scripts/       # JavaScript files
    └── components/    # Reusable components
```

## Installation & Usage

1. Clone repository:
```bash
git clone https://github.com/borbix-hubb/kruakhunying.git
```

2. เปิดไฟล์ `index.html` ในเว็บเบราว์เซอร์

## 🔗 Website URLs (GitHub Pages)

### หน้าเว็บหลัก
- **🏠 Landing Page**: https://borbix-hubb.github.io/kruakhunying/
- **🍜 สั่งอาหาร (Customer)**: https://borbix-hubb.github.io/kruakhunying/public/app.html
- **📊 Admin Dashboard**: https://borbix-hubb.github.io/kruakhunying/admin/dashboard.html

### หน้า Admin
- **🔐 Admin Login**: https://borbix-hubb.github.io/kruakhunying/admin/login.html
- **🔧 Setup Admin (ครั้งแรก)**: https://borbix-hubb.github.io/kruakhunying/admin/setup.html
- **⚡ Quick Login & Fix**: https://borbix-hubb.github.io/kruakhunying/admin/quick-login.html
- **🛠️ Fix Access**: https://borbix-hubb.github.io/kruakhunying/admin/fix-access.html

## 📁 Project Files

### Database Scripts (ใช้กับ Supabase)
- `database/schema.sql` - สร้างตารางฐานข้อมูล
- `database/schema-safe.sql` - สร้างตารางแบบปลอดภัย (ไม่ error ถ้ามีอยู่แล้ว)
- `database/rls-policies.sql` - Row Level Security policies
- `database/simple-fix-admin.sql` - แก้ปัญหา admin access
- `database/fix-rls-admin.sql` - แก้ปัญหา RLS policies

### Local Development
หากต้องการรันในเครื่อง:
   - **Landing Page**: `index.html`
   - **Customer App**: `public/app.html`
   - **Admin Dashboard**: `admin/dashboard.html`

## Features Overview

### Customer Interface
- เมนูอาหารพร้อมรูปภาพ emoji
- ระบบค้นหาและกรองตามประเภท
- ตะกร้าสินค้าแบบ real-time
- ฟอร์มสั่งอาหารพร้อมระบุข้อมูลจัดส่ง

### Admin Dashboard
- Overview สถิติสำคัญ
- ตารางจัดการคำสั่งซื้อ
- ระบบจัดการเมนู (CRUD)
- รายงานยอดขายพร้อมกราฟ
- การแจ้งเตือนแบบ real-time

## Design
- 🎨 Modern และ Youth-friendly design
- 🧡 ใช้ color scheme: ส้ม-ขาว (Orange #FF6B35, White #FFFFFF)
- 📱 Fully responsive
- 🎯 เน้น UX ที่ใช้งานง่าย
- ✨ Animation และ hover effects

## 🚀 Quick Start Guide

### สำหรับลูกค้า
1. เข้า https://borbix-hubb.github.io/kruakhunying/
2. คลิก "สั่งอาหารเลย"
3. เลือกเมนู → ใส่ตะกร้า → กรอกข้อมูล → สั่งอาหาร

### สำหรับ Admin (ครั้งแรก)
1. ไปที่ Supabase SQL Editor รันไฟล์ `database/simple-fix-admin.sql`
2. เข้า https://borbix-hubb.github.io/kruakhunying/admin/quick-login.html
3. Login ด้วย email: borbixz@gmail.com
4. ระบบจะพาเข้า Dashboard อัตโนมัติ

## Future Enhancements
- [x] Supabase Integration
- [x] Authentication System
- [ ] LINE Messaging API (เตรียมไว้แล้ว)
- [ ] Payment gateway integration
- [ ] Real-time order tracking
- [ ] Customer reviews
- [ ] Promotion management
- [ ] QR Code generator for PromptPay

## License
This project is created for educational purposes.