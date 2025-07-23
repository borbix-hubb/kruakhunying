-- 1. Check if column exists and its properties
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'delivery_method';

-- 2. Check actual values in the orders table
SELECT 
    id,
    order_number,
    delivery_method,
    delivery_dorm,
    delivery_room,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;

-- 3. Update existing orders to have delivery_method value if NULL
UPDATE orders 
SET delivery_method = 'delivery' 
WHERE delivery_method IS NULL;

-- 4. Check count of orders by delivery_method
SELECT 
    delivery_method,
    COUNT(*) as count
FROM orders
GROUP BY delivery_method;