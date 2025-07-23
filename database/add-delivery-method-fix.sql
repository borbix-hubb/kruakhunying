-- First check if column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'delivery_method';

-- If not exists, add it
ALTER TABLE orders 
ADD COLUMN delivery_method VARCHAR(50) DEFAULT 'delivery';

-- Add comment
COMMENT ON COLUMN orders.delivery_method IS 'Delivery method: delivery (ส่งที่ห้อง) or pickup (มารับเอง)';

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'delivery_method';