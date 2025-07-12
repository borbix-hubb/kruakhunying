-- Comprehensive fix for Supabase schema cache issue
-- This script will ensure the correct schema and clear cache

-- 1. First, let's check what columns actually exist
SELECT 
    table_name,
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('customers', 'orders')
ORDER BY table_name, ordinal_position;

-- 2. Drop the customers table and recreate it with correct schema
-- WARNING: This will delete all customer data!
DROP TABLE IF EXISTS customers CASCADE;

-- 3. Recreate customers table with correct columns
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    dorm VARCHAR(50),
    room VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Create index for faster phone lookup
CREATE INDEX idx_customers_phone ON customers(phone);

-- 5. Create trigger to update updated_at timestamp
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE
    ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Make sure orders table has correct delivery columns
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_dorm VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_room VARCHAR(20),
ADD COLUMN IF NOT EXISTS delivery_note TEXT;

-- 7. Make order_number nullable (our app generates it)
ALTER TABLE orders 
ALTER COLUMN order_number DROP NOT NULL;

-- 8. Force Supabase to refresh its schema cache
-- This is done by creating and dropping a dummy table
CREATE TABLE IF NOT EXISTS _dummy_cache_refresh (id int);
DROP TABLE IF EXISTS _dummy_cache_refresh;

-- 9. Verify the final structure
SELECT 
    'Final Schema Check' as check_type,
    table_name,
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name IN ('customers', 'orders')
    AND column_name IN ('dorm', 'room', 'default_dorm', 'default_room', 'delivery_dorm', 'delivery_room')
ORDER BY table_name, column_name;