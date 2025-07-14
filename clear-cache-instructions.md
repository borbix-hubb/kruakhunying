# วิธีเคลียร์ Cache เพื่อดูการอัพเดทล่าสุด

## สำหรับ Chrome/Edge:
1. กด `F12` เพื่อเปิด Developer Tools
2. คลิกขวาที่ปุ่ม Reload (↻)
3. เลือก **"Empty Cache and Hard Reload"**

## หรือใช้ Keyboard Shortcut:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

## สำหรับ Mobile (LINE App):
1. ปิดแอพ LINE completely
2. เปิดใหม่และเข้า LIFF อีกครั้ง

## ทดสอบลิงก์ใหม่:
- LIFF (มีปุ่ม Logout แล้ว): https://borbix-hubb.github.io/kruakhunying/liff/

## สิ่งที่เพิ่มในหน้าโปรไฟล์:
1. ปุ่ม "บันทึกที่อยู่จัดส่ง" (สีส้ม)
2. ปุ่ม "ออกจากระบบ" (สีแดง) - **ใหม่!**
   - มีไอคอน sign-out
   - ถามยืนยันก่อน logout
   - ลบ LINE user ID จาก localStorage
   - Logout จาก LIFF และ reload หน้า

## หากยังไม่เห็นการเปลี่ยนแปลง:
1. ลองเปิดในโหมด Incognito/Private
2. หรือเพิ่ม ?v=2 ต่อท้าย URL: https://borbix-hubb.github.io/kruakhunying/liff/?v=2