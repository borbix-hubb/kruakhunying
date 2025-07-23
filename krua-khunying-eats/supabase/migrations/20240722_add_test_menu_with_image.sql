-- Add a test menu item with image to verify images work
INSERT INTO menu_items (
  name,
  name_en,
  description,
  price,
  image_url,
  category_id,
  meat_types,
  is_available,
  is_popular,
  is_spicy
) VALUES (
  'ผัดกะเพราทดสอบ',
  'Test Pad Krapow',
  'เมนูทดสอบการแสดงรูปภาพ',
  65,
  'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=400&fit=crop',
  (SELECT id FROM menu_categories WHERE name LIKE '%อาหาร%' LIMIT 1),
  ARRAY['หมู', 'ไก่', 'กุ้ง'],
  true,
  true,
  true
);