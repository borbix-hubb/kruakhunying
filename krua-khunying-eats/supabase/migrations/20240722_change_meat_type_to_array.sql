-- First drop the old column if it exists
ALTER TABLE menu_items DROP COLUMN IF EXISTS meat_type;

-- Add meat_types as an array column if it doesn't exist
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS meat_types TEXT[] DEFAULT '{}';

-- Drop old constraint if exists
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS valid_meat_types;

-- Add a check constraint to ensure only valid values
ALTER TABLE menu_items 
ADD CONSTRAINT valid_meat_types CHECK (
  meat_types <@ ARRAY['ไก่', 'หมู', 'หมูกรอบ', 'หมูสับ', 'เนื้อ', 'กุ้ง', 'ทะเล', 'รวมมิตร']::TEXT[]
);