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

3. หน้าต่างๆ:
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
- 🌈 ใช้ color scheme: แดง (#FF6B6B), ฟ้า (#4ECDC4), เหลือง (#FFE66D)
- 📱 Fully responsive
- 🎯 เน้น UX ที่ใช้งานง่าย

## Future Enhancements
- [ ] Backend API integration
- [ ] LINE Messaging API
- [ ] Payment gateway
- [ ] Order tracking system
- [ ] Customer reviews
- [ ] Promotion management

## License
This project is created for educational purposes.