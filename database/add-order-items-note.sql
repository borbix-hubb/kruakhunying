-- Add note column to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS note TEXT;

-- Add payment_method column to orders table if not exists
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';

-- Update the view or any policies if needed
-- This ensures the new columns are accessible

COMMENT ON COLUMN order_items.note IS 'Special instructions or notes for this menu item';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: cash, promptpay, transfer';