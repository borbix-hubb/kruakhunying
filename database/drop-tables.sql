-- Drop all tables (BE CAREFUL - This will delete all data!)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS menu_categories CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column();