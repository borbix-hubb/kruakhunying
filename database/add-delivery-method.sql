-- Add delivery_method column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(50) DEFAULT 'delivery';

COMMENT ON COLUMN orders.delivery_method IS 'Delivery method: delivery (ส่งที่ห้อง) or pickup (มารับเอง)';