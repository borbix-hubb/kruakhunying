-- 1. Check table structure completely
SELECT 
    c.column_name,
    c.data_type,
    c.column_default,
    c.is_nullable,
    c.ordinal_position
FROM information_schema.columns c
WHERE c.table_name = 'orders'
AND c.table_schema = 'public'
ORDER BY c.ordinal_position;

-- 2. Force refresh by creating a view
CREATE OR REPLACE VIEW orders_with_delivery AS
SELECT 
    id,
    order_number,
    customer_id,
    total_amount,
    status,
    payment_method,
    payment_status,
    note,
    delivery_dorm,
    delivery_room,
    delivery_note,
    delivery_method,
    created_at,
    updated_at
FROM orders;

-- 3. Check the view
SELECT * FROM orders_with_delivery LIMIT 5;

-- 4. Alternative: Recreate the column with a different approach
-- First, rename the existing column (if it exists)
ALTER TABLE orders 
RENAME COLUMN delivery_method TO delivery_method_old;

-- Then add it back
ALTER TABLE orders 
ADD COLUMN delivery_method VARCHAR(50) DEFAULT 'delivery';

-- Copy data from old column if it exists
UPDATE orders 
SET delivery_method = COALESCE(delivery_method_old, 'delivery')
WHERE delivery_method_old IS NOT NULL;

-- Drop the old column
ALTER TABLE orders 
DROP COLUMN IF EXISTS delivery_method_old;