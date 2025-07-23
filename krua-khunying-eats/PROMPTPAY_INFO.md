# ข้อมูล PromptPay สำหรับระบบ

## วิธีการแก้ไขข้อมูล PromptPay

### 1. แก้ไข QR Code
- วางไฟล์รูป QR Code ใหม่ที่: `/public/images/promptpay-qr.png`
- รูปควรเป็นไฟล์ PNG ขนาดประมาณ 400x400 pixels

### 2. แก้ไขข้อมูลธนาคาร (สำหรับการโอนเงิน)
- เปิดไฟล์: `/src/pages/Checkout.tsx`
- ค้นหาบรรทัดที่ 313-315:
  ```
  <p className="font-kanit">ธนาคาร: กสิกรไทย</p>
  <p className="font-kanit">เลขที่บัญชี: xxx-x-xxxxx-x</p>
  <p className="font-kanit">ชื่อบัญชี: ร้านอาหารของเรา</p>
  ```
- แก้ไขข้อมูลตามต้องการ

### 3. ตำแหน่งไฟล์สำคัญใน Cursor
- **Checkout Page**: `/src/pages/Checkout.tsx` (หน้าชำระเงิน)
- **QR Code Image**: `/public/images/promptpay-qr.png`

### การค้นหาใน Cursor
- กด `Cmd+P` (Mac) หรือ `Ctrl+P` (Windows) แล้วพิมพ์ชื่อไฟล์
- กด `Cmd+F` (Mac) หรือ `Ctrl+F` (Windows) เพื่อค้นหาคำในไฟล์
- ค้นหาคำว่า: "promptpay", "โอนเงิน", "ธนาคาร"

EOF < /dev/null