-- Ensure all necessary columns exist for admin dashboard

-- Add payment_method to orders table if not exists
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';

-- Add note column to order_items table if not exists  
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS note TEXT;

-- Add selected_option column to order_items table if not exists
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS selected_option VARCHAR(100);

-- Add delivery columns to orders if not exists
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_dorm VARCHAR(100);

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_room VARCHAR(100);

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_note TEXT;

-- Update existing orders to have default payment method if null
UPDATE orders 
SET payment_method = 'cash' 
WHERE payment_method IS NULL;

-- Add comments for clarity
COMMENT ON COLUMN orders.payment_method IS 'Payment method: cash, promptpay, transfer';
COMMENT ON COLUMN order_items.note IS 'Special instructions or notes for this menu item';
COMMENT ON COLUMN order_items.selected_option IS 'Selected protein option (e.g., หมู, ไก่, เนื้อ, ทะเล)';
COMMENT ON COLUMN orders.delivery_dorm IS 'Delivery dormitory building';
COMMENT ON COLUMN orders.delivery_room IS 'Delivery room number';
COMMENT ON COLUMN orders.delivery_note IS 'Delivery instructions or notes';

-- Show table structure for verification
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;