-- Add meat_type column to menu_items table
ALTER TABLE menu_items 
ADD COLUMN meat_type TEXT CHECK (meat_type IN ('ไก่', 'หมู', 'หมูกรอบ', 'หมูสับ', 'ทะเล', 'รวมมิตร', 'ทุกเมนู'));