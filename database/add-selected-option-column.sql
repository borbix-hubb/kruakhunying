-- Add selected_option column to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS selected_option VARCHAR(100);

COMMENT ON COLUMN order_items.selected_option IS 'Selected protein option (e.g., หมู, ไก่, เนื้อ, ทะเล)';