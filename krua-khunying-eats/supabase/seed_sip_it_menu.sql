-- ลบหมวดหมู่เดิมที่สร้างไปแล้ว (ถ้ามี)
DELETE FROM menu_items WHERE category_id IN (
  SELECT id FROM menu_categories WHERE name IN ('☕ กาแฟ', '🥤 ไม่มีกาแฟ', '🍵 ชา', '🧊 โซดา', '🍓 สมูทตี้')
);
DELETE FROM menu_categories WHERE name IN ('☕ กาแฟ', '🥤 ไม่มีกาแฟ', '🍵 ชา', '🧊 โซดา', '🍓 สมูทตี้');

-- สร้าง subcategories โดยใช้ description เก็บประเภทย่อย
-- โดยจะใส่ทุกอย่างในหมวด "เครื่องดื่ม" และใช้ description แยกประเภท

-- เพิ่มเมนูกาแฟ (ใส่ในหมวดเครื่องดื่ม)
INSERT INTO menu_items (name, name_en, description, price, category_id, is_available, is_popular, rating, review_count) VALUES
-- กาแฟ
('☕ อเมริกาโน่ (ร้อน)', 'Americano (Hot)', 'กาแฟ - กาแฟอเมริกาโน่ร้อน', 35, (SELECT id FROM menu_categories WHERE name = '🥤 เครื่องดื่ม'), true, true, 4.5, 120),
('อเมริกาโน่ (เย็น)', 'Americano (Iced)', 'กาแฟอเมริกาโน่เย็น', 40, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, true, 4.5, 115),
('อเมริกาโน่ (ปั่น)', 'Americano (Frappe)', 'กาแฟอเมริกาโน่ปั่น', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.3, 85),
('อเมริกาโน่น้ำผึ้ง (ร้อน)', 'Honey Americano (Hot)', 'กาแฟอเมริกาโน่ผสมน้ำผึ้งร้อน', 40, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.4, 90),
('อเมริกาโน่น้ำผึ้ง (เย็น)', 'Honey Americano (Iced)', 'กาแฟอเมริกาโน่ผสมน้ำผึ้งเย็น', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.4, 88),
('อเมริกาโน่น้ำผึ้งมะนาว (ร้อน)', 'Honey Lemon Americano (Hot)', 'กาแฟอเมริกาโน่น้ำผึ้งมะนาวร้อน', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.3, 75),
('อเมริกาโน่น้ำผึ้งมะนาว (เย็น)', 'Honey Lemon Americano (Iced)', 'กาแฟอเมริกาโน่น้ำผึ้งมะนาวเย็น', 50, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.3, 72),
('อเมริกาโน่น้ำส้ม (ร้อน)', 'Orange Americano (Hot)', 'กาแฟอเมริกาโน่ผสมน้ำส้มร้อน', 40, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.2, 65),
('อเมริกาโน่น้ำส้ม (เย็น)', 'Orange Americano (Iced)', 'กาแฟอเมริกาโน่ผสมน้ำส้มเย็น', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.2, 63),
('อเมริกาโน่มิ้นท์ (ร้อน)', 'Mint Americano (Hot)', 'กาแฟอเมริกาโน่กลิ่นมิ้นท์ร้อน', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.1, 55),
('อเมริกาโน่มิ้นท์ (เย็น)', 'Mint Americano (Iced)', 'กาแฟอเมริกาโน่กลิ่นมิ้นท์เย็น', 50, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.1, 52),
('อเมริกาโน่มะพร้าว (ร้อน)', 'Coconut Americano (Hot)', 'กาแฟอเมริกาโน่กะทิร้อน', 35, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.0, 45),
('อเมริกาโน่มะพร้าว (เย็น)', 'Coconut Americano (Iced)', 'กาแฟอเมริกาโน่กะทิเย็น', 40, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.0, 42),
('คาปูชิโน่ (ร้อน)', 'Cappuccino (Hot)', 'คาปูชิโน่ร้อน', 40, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, true, 4.6, 135),
('คาปูชิโน่ (เย็น)', 'Cappuccino (Iced)', 'คาปูชิโน่เย็น', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, true, 4.6, 130),
('คาปูชิโน่ (ปั่น)', 'Cappuccino (Frappe)', 'คาปูชิโน่ปั่น', 55, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.5, 95),
('เอสเพรสโซ่ (ร้อน)', 'Espresso (Hot)', 'เอสเพรสโซ่ร้อน', 40, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.4, 80),
('เอสเพรสโซ่ (เย็น)', 'Espresso (Iced)', 'เอสเพรสโซ่เย็น', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.4, 78),
('เอสเพรสโซ่ (ปั่น)', 'Espresso (Frappe)', 'เอสเพรสโซ่ปั่น', 50, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.3, 65),
('ลาเต้ (ร้อน)', 'Latte (Hot)', 'ลาเต้ร้อน', 40, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, true, 4.7, 145),
('ลาเต้ (เย็น)', 'Latte (Iced)', 'ลาเต้เย็น', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, true, 4.7, 140),
('ลาเต้ (ปั่น)', 'Latte (Frappe)', 'ลาเต้ปั่น', 55, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.6, 105),
('มอคค่า (ร้อน)', 'Mocha (Hot)', 'มอคค่าร้อน', 40, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, true, 4.5, 125),
('มอคค่า (เย็น)', 'Mocha (Iced)', 'มอคค่าเย็น', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, true, 4.5, 120),
('มอคค่า (ปั่น)', 'Mocha (Frappe)', 'มอคค่าปั่น', 55, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.4, 95),
('คาราเมลมัคคิอาโต้ (ร้อน)', 'Caramel Macchiato (Hot)', 'คาราเมลมัคคิอาโต้ร้อน', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, true, 4.6, 110),
('คาราเมลมัคคิอาโต้ (เย็น)', 'Caramel Macchiato (Iced)', 'คาราเมลมัคคิอาโต้เย็น', 50, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, true, 4.6, 108),
('คาราเมลมัคคิอาโต้ (ปั่น)', 'Caramel Macchiato (Frappe)', 'คาราเมลมัคคิอาโต้ปั่น', 55, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.5, 85),
('คาราเมลลาเต้ (ร้อน)', 'Caramel Latte (Hot)', 'คาราเมลลาเต้ร้อน', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.5, 95),
('คาราเมลลาเต้ (เย็น)', 'Caramel Latte (Iced)', 'คาราเมลลาเต้เย็น', 50, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.5, 92),
('คาราเมลลาเต้ (ปั่น)', 'Caramel Latte (Frappe)', 'คาราเมลลาเต้ปั่น', 55, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.4, 75),
('วานิลลาลาเต้ (ร้อน)', 'Vanilla Latte (Hot)', 'วานิลลาลาเต้ร้อน', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.5, 88),
('วานิลลาลาเต้ (เย็น)', 'Vanilla Latte (Iced)', 'วานิลลาลาเต้เย็น', 50, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.5, 85),
('วานิลลาลาเต้ (ปั่น)', 'Vanilla Latte (Frappe)', 'วานิลลาลาเต้ปั่น', 55, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.4, 70),
('ชอตตี้ไวท์มอลต์ (เย็น)', 'Shotti White Malt (Iced)', 'ชอตตี้ไวท์มอลต์เย็น', 50, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.3, 65),
('ชอตตี้ไวท์มอลต์ (ปั่น)', 'Shotti White Malt (Frappe)', 'ชอตตี้ไวท์มอลต์ปั่น', 55, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.3, 60),
('คอฟฟี่มิ้นท์ (ร้อน)', 'Coffee Mint (Hot)', 'คอฟฟี่มิ้นท์ร้อน', 45, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.2, 55),
('คอฟฟี่มิ้นท์ (เย็น)', 'Coffee Mint (Iced)', 'คอฟฟี่มิ้นท์เย็น', 50, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.2, 52),
('คอฟฟี่มิ้นท์ (ปั่น)', 'Coffee Mint (Frappe)', 'คอฟฟี่มิ้นท์ปั่น', 55, (SELECT id FROM menu_categories WHERE name = '☕ กาแฟ'), true, false, 4.1, 45);

-- เพิ่มเมนูไม่มีกาแฟ
INSERT INTO menu_items (name, name_en, description, price, category_id, is_available, is_popular, rating, review_count) VALUES
('โอวัลติน (ร้อน)', 'Ovaltine (Hot)', 'โอวัลตินร้อน', 35, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, true, 4.5, 95),
('โอวัลติน (เย็น)', 'Ovaltine (Iced)', 'โอวัลตินเย็น', 40, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, true, 4.5, 92),
('โอวัลติน (ปั่น)', 'Ovaltine (Frappe)', 'โอวัลตินปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.4, 75),
('โอวัลตินภูเขาไฟ (เย็น)', 'Ovaltine Volcano (Iced)', 'โอวัลตินภูเขาไฟเย็น', 50, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, true, 4.6, 85),
('โอวัลตินภูเขาไฟ (ปั่น)', 'Ovaltine Volcano (Frappe)', 'โอวัลตินภูเขาไฟปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.5, 70),
('ไวท์มอลต์ (ร้อน)', 'White Malt (Hot)', 'ไวท์มอลต์ร้อน', 40, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.3, 65),
('ไวท์มอลต์ (เย็น)', 'White Malt (Iced)', 'ไวท์มอลต์เย็น', 45, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.3, 62),
('ไวท์มอลต์ (ปั่น)', 'White Malt (Frappe)', 'ไวท์มอลต์ปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.2, 55),
('โกโก้ (ร้อน)', 'Cocoa (Hot)', 'โกโก้ร้อน', 35, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, true, 4.4, 88),
('โกโก้ (เย็น)', 'Cocoa (Iced)', 'โกโก้เย็น', 40, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, true, 4.4, 85),
('โกโก้ (ปั่น)', 'Cocoa (Frappe)', 'โกโก้ปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.3, 68),
('โกโก้คาราเมล (เย็น)', 'Caramel Cocoa (Iced)', 'โกโก้คาราเมลเย็น', 50, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.3, 58),
('โกโก้คาราเมล (ปั่น)', 'Caramel Cocoa (Frappe)', 'โกโก้คาราเมลปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.2, 52),
('นมชมพู (เย็น)', 'Pink Milk (Iced)', 'นมชมพูเย็น', 45, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, true, 4.5, 78),
('นมชมพู (ปั่น)', 'Pink Milk (Frappe)', 'นมชมพูปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.4, 65),
('นมสด (เย็น)', 'Fresh Milk (Iced)', 'นมสดเย็น', 45, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.3, 72),
('นมสด (ปั่น)', 'Fresh Milk (Frappe)', 'นมสดปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.2, 58),
('นมสดคาราเมล (เย็น)', 'Caramel Milk (Iced)', 'นมสดคาราเมลเย็น', 45, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.3, 62),
('นมสดคาราเมล (ปั่น)', 'Caramel Milk (Frappe)', 'นมสดคาราเมลปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.2, 55),
('โอริโอ้นมสด (ปั่น)', 'Oreo Milk (Frappe)', 'โอริโอ้นมสดปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, true, 4.6, 82),
('ป๊อกป๊อกนมสด (เย็น)', 'Popping Boba Milk (Iced)', 'ป๊อกป๊อกนมสดเย็น', 45, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.4, 68),
('ป๊อกป๊อกนมสด (ปั่น)', 'Popping Boba Milk (Frappe)', 'ป๊อกป๊อกนมสดปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🥤 ไม่มีกาแฟ'), true, false, 4.3, 58);

-- เพิ่มเมนูชา
INSERT INTO menu_items (name, name_en, description, price, category_id, is_available, is_popular, rating, review_count) VALUES
('ชาดำ (เย็น)', 'Black Tea (Iced)', 'ชาดำเย็น', 30, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, false, 4.2, 75),
('ชาดำน้ำผึ้ง (เย็น)', 'Honey Black Tea (Iced)', 'ชาดำน้ำผึ้งเย็น', 40, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, false, 4.3, 68),
('ชามะนาว (เย็น)', 'Lemon Tea (Iced)', 'ชามะนาวเย็น', 40, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, true, 4.4, 85),
('ชาไทย (เย็น)', 'Thai Tea (Iced)', 'ชาไทยเย็น', 40, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, true, 4.6, 125),
('ชาไทย (ปั่น)', 'Thai Tea (Frappe)', 'ชาไทยปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, true, 4.5, 95),
('ชาเขียว (เย็น)', 'Green Tea (Iced)', 'ชาเขียวเย็น', 40, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, true, 4.5, 92),
('ชาเขียว (ปั่น)', 'Green Tea (Frappe)', 'ชาเขียวปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, false, 4.4, 72),
('ชานมไต้หวัน (เย็น)', 'Taiwan Milk Tea (Iced)', 'ชานมไต้หวันเย็น', 40, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, true, 4.5, 88),
('ชานมไต้หวัน (ปั่น)', 'Taiwan Milk Tea (Frappe)', 'ชานมไต้หวันปั่น', 55, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, false, 4.4, 68),
('ชาไทยทูโทน (เย็น)', 'Thai Tea Two Tone (Iced)', 'ชาไทยทูโทนเย็น', 45, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, false, 4.4, 72),
('ชาเขียวทูโทน (เย็น)', 'Green Tea Two Tone (Iced)', 'ชาเขียวทูโทนเย็น', 45, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, false, 4.3, 65),
('ชากุหลาบน้ำผึ้ง (เย็น)', 'Rose Honey Tea (Iced)', 'ชากุหลาบน้ำผึ้งเย็น', 45, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, false, 4.3, 58),
('ชากุหลาบน้ำผึ้งมะนาว (เย็น)', 'Rose Honey Lemon Tea (Iced)', 'ชากุหลาบน้ำผึ้งมะนาวเย็น', 45, (SELECT id FROM menu_categories WHERE name = '🍵 ชา'), true, false, 4.2, 52);

-- เพิ่มเมนูโซดา
INSERT INTO menu_items (name, name_en, description, price, category_id, is_available, is_popular, rating, review_count) VALUES
('แดงโซดา (เย็น)', 'Red Soda (Iced)', 'น้ำแดงโซดาเย็น', 30, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.1, 65),
('เขียวโซดา (เย็น)', 'Green Soda (Iced)', 'น้ำเขียวโซดาเย็น', 30, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.1, 62),
('แดงมะนาวโซดา (เย็น)', 'Red Lemon Soda (Iced)', 'น้ำแดงมะนาวโซดาเย็น', 35, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.2, 58),
('เขียวมะนาวโซดา (เย็น)', 'Green Lemon Soda (Iced)', 'น้ำเขียวมะนาวโซดาเย็น', 35, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.2, 55),
('มะนาวโซดา (เย็น)', 'Lemon Soda (Iced)', 'มะนาวโซดาเย็น', 40, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, true, 4.4, 82),
('ยูซุโซดา (เย็น)', 'Yuzu Soda (Iced)', 'ยูซุโซดาเย็น', 50, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.3, 65),
('น้ำผึ้งยูซุโซดา (เย็น)', 'Honey Yuzu Soda (Iced)', 'น้ำผึ้งยูซุโซดาเย็น', 50, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.3, 62),
('น้ำผึ้งมะนาวโซดา (เย็น)', 'Honey Lemon Soda (Iced)', 'น้ำผึ้งมะนาวโซดาเย็น', 50, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.3, 58),
('ลิ้นจี่โซดา (เย็น)', 'Lychee Soda (Iced)', 'ลิ้นจี่โซดาเย็น', 40, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.2, 55),
('ส้มโซดา (เย็น)', 'Orange Soda (Iced)', 'ส้มโซดาเย็น', 40, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.2, 52),
('สตรอว์เบอร์รี่โซดา (เย็น)', 'Strawberry Soda (Iced)', 'สตรอว์เบอร์รี่โซดาเย็น', 30, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.1, 48),
('สตรอว์เบอร์รี่โซดา (ปั่น)', 'Strawberry Soda (Frappe)', 'สตรอว์เบอร์รี่โซดาปั่น', 35, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.0, 42),
('บลูฮาวายโซดา (เย็น)', 'Blue Hawaii Soda (Iced)', 'บลูฮาวายโซดาเย็น', 30, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.1, 45),
('บลูฮาวายโซดา (ปั่น)', 'Blue Hawaii Soda (Frappe)', 'บลูฮาวายโซดาปั่น', 35, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.0, 40),
('องุ่นโซดา (เย็น)', 'Grape Soda (Iced)', 'องุ่นโซดาเย็น', 30, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.1, 43),
('องุ่นโซดา (ปั่น)', 'Grape Soda (Frappe)', 'องุ่นโซดาปั่น', 35, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.0, 38),
('แอปเปิ้ลโซดา (เย็น)', 'Apple Soda (Iced)', 'แอปเปิ้ลโซดาเย็น', 30, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.1, 41),
('แอปเปิ้ลโซดา (ปั่น)', 'Apple Soda (Frappe)', 'แอปเปิ้ลโซดาปั่น', 35, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.0, 36),
('Sip it ทรงพลัง (เย็น)', 'Sip it Power (Iced)', 'M150 ผสมโซดาเย็น', 30, (SELECT id FROM menu_categories WHERE name = '🧊 โซดา'), true, false, 4.0, 35);

-- เพิ่มเมนูสมูทตี้
INSERT INTO menu_items (name, name_en, description, price, category_id, is_available, is_popular, rating, review_count) VALUES
('สตรอว์เบอร์รี่โยเกิร์ต', 'Strawberry Yogurt', 'สตรอว์เบอร์รี่โยเกิร์ตสมูทตี้', 55, (SELECT id FROM menu_categories WHERE name = '🍓 สมูทตี้'), true, true, 4.6, 95),
('มิกซ์เบอร์รี่โยเกิร์ต', 'Mixed Berry Yogurt', 'มิกซ์เบอร์รี่โยเกิร์ตสมูทตี้', 55, (SELECT id FROM menu_categories WHERE name = '🍓 สมูทตี้'), true, true, 4.6, 92),
('มะม่วงโยเกิร์ต', 'Mango Yogurt', 'มะม่วงโยเกิร์ตสมูทตี้', 55, (SELECT id FROM menu_categories WHERE name = '🍓 สมูทตี้'), true, true, 4.5, 88),
('สตรอว์เบอร์รี่', 'Strawberry', 'สตรอว์เบอร์รี่สมูทตี้', 45, (SELECT id FROM menu_categories WHERE name = '🍓 สมูทตี้'), true, false, 4.4, 75),
('มิกซ์เบอร์รี่', 'Mixed Berry', 'มิกซ์เบอร์รี่สมูทตี้', 45, (SELECT id FROM menu_categories WHERE name = '🍓 สมูทตี้'), true, false, 4.4, 72),
('มะม่วง', 'Mango', 'มะม่วงสมูทตี้', 45, (SELECT id FROM menu_categories WHERE name = '🍓 สมูทตี้'), true, false, 4.3, 68),
('ลิ้นจี่', 'Lychee', 'ลิ้นจี่สมูทตี้', 45, (SELECT id FROM menu_categories WHERE name = '🍓 สมูทตี้'), true, false, 4.3, 65),
('ส้ม', 'Orange', 'ส้มสมูทตี้', 45, (SELECT id FROM menu_categories WHERE name = '🍓 สมูทตี้'), true, false, 4.2, 62);

-- อัพเดทข้อมูลร้าน (เพิ่มช่วงเวลาและเบอร์โทร)
UPDATE profiles 
SET full_name = 'SIP IT - ร้านเครื่องดื่ม', 
    phone = '061-392-1005'
WHERE role = 'restaurant';

-- หมายเหตุเพิ่มเติม
-- *Add on เพิ่ม 15 บาท: ช็อตกาแฟ, วิปครีม, น้ำผึ้ง, โอริโอ้, ไซรัป (คาราเมล, วานิลลา, มิ้นท์)
-- เปิดวันอังคาร-อาทิตย์ เวลา 9.00 - 18.00 น.