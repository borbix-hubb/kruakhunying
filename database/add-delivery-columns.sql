-- Add delivery columns to orders table
-- Run this if your orders table doesn't have delivery columns

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_dorm VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_room VARCHAR(20),
ADD COLUMN IF NOT EXISTS delivery_note TEXT;

-- If order_number column doesn't exist (our code expects it to auto-generate)
-- Remove the NOT NULL constraint from order_number or make it optional
ALTER TABLE orders 
ALTER COLUMN order_number DROP NOT NULL;

-- Or better, drop order_number and let our app handle order ID
-- ALTER TABLE orders DROP COLUMN IF EXISTS order_number;