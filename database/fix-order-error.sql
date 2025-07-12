-- Fix order submission error
-- Run this to ensure your database schema is correct

-- 1. First check your customers table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'customers';

-- 2. If you see default_dorm or default_room columns, drop them
-- ALTER TABLE customers DROP COLUMN IF EXISTS default_dorm;
-- ALTER TABLE customers DROP COLUMN IF EXISTS default_room;

-- 3. Make sure the correct columns exist
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS dorm VARCHAR(50),
ADD COLUMN IF NOT EXISTS room VARCHAR(20);

-- 4. Check orders table has delivery columns
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_dorm VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_room VARCHAR(20),
ADD COLUMN IF NOT EXISTS delivery_note TEXT;

-- 5. Make order_number nullable or add default
ALTER TABLE orders 
ALTER COLUMN order_number DROP NOT NULL;

-- 6. Verify the structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('customers', 'orders')
ORDER BY table_name, ordinal_position;