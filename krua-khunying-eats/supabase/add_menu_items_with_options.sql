-- Add menu items with meat options to test the options modal
INSERT INTO menu_items (name, name_en, description, price, category_id, is_available, is_popular, rating, review_count)
VALUES
  -- ผัดกะเพรา
  ('ผัดกะเพรา (หมู/ไก่)', 'Stir-fried Basil (Pork/Chicken)', 'ผัดกะเพราหอมๆ เลือกหมูหรือไก่ได้', 60, 
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, true, 4.8, 245),
  
  -- ข้าวผัด
  ('ข้าวผัด (หมู/ไก่/กุ้ง)', 'Fried Rice (Pork/Chicken/Shrimp)', 'ข้าวผัดหอมๆ เลือกเนื้อสัตว์ได้', 65,
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, true, 4.7, 189),
  
  -- ผัดพริกแกง
  ('ผัดพริกแกง (หมู/ไก่)', 'Stir-fried Curry Paste (Pork/Chicken)', 'ผัดพริกแกงหอมๆ เผ็ดถึงใจ', 70,
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, false, 4.5, 134),
  
  ('ผัดพริกแกง (กุ้ง/หมึก)', 'Stir-fried Curry Paste (Shrimp/Squid)', 'ผัดพริกแกงทะเล รสเผ็ดจัดจ้าน', 85,
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, false, 4.6, 98),
  
  -- ผัดขี้เมา
  ('ผัดขี้เมา (หมู/ไก่)', 'Drunken Noodles (Pork/Chicken)', 'ผัดขี้เมาใบกะเพรา เผ็ดร้อน', 65,
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, true, 4.7, 167),
  
  -- ราดหน้า
  ('ราดหน้า (หมู/ไก่)', 'Flat Noodles with Gravy (Pork/Chicken)', 'เส้นใหญ่ราดหน้าน้ำข้นๆ', 65,
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, false, 4.5, 145),
  
  ('ราดหน้า (ทะเล)', 'Flat Noodles with Gravy (Seafood)', 'เส้นใหญ่ราดหน้าทะเล กุ้ง หมึก', 85,
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, false, 4.6, 112),
  
  -- ผัดซีอิ๊ว
  ('ผัดซีอิ๊ว (หมู/ไก่)', 'Pad See Ew (Pork/Chicken)', 'เส้นใหญ่ผัดซีอิ๊วหวานนุ่ม', 60,
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, true, 4.6, 198),
  
  -- ผัดไทย
  ('ผัดไทย (กุ้ง)', 'Pad Thai (Shrimp)', 'ผัดไทยกุ้งสด รสชาติต้นตำรับ', 75,
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, true, 4.8, 223),
  
  ('ผัดไทย (หมู/ไก่)', 'Pad Thai (Pork/Chicken)', 'ผัดไทยรสชาติต้นตำรับ', 65,
   (SELECT id FROM menu_categories WHERE name = '🍽️ อาหารจานเดียว'), true, false, 4.7, 187);

-- แสดงผลลัพธ์
SELECT name, price FROM menu_items WHERE name LIKE '%(%)%' ORDER BY created_at DESC LIMIT 10;