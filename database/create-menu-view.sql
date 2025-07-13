-- Create or update menu_with_options view
-- This view combines menu items with their options and categories

-- Drop existing view if any
DROP VIEW IF EXISTS menu_with_options CASCADE;

-- Create view with all menu items and their options
CREATE OR REPLACE VIEW menu_with_options AS
SELECT 
    mi.id,
    mi.name,
    mi.description,
    mi.price as base_price,
    mi.category_id,
    mi.is_available,
    mc.name as category_name,
    mc.slug as category_slug,
    mo.id as option_id,
    mo.option_name,
    mo.price_adjustment,
    COALESCE(mi.price + mo.price_adjustment, mi.price) as final_price,
    FALSE as is_popular,
    FALSE as is_recommended
FROM menu_items mi
LEFT JOIN menu_categories mc ON mi.category_id = mc.id
LEFT JOIN menu_options mo ON mi.id = mo.menu_item_id
WHERE mi.is_available = TRUE
ORDER BY mi.category_id, mi.id, mo.option_name;

-- Grant permissions to allow public access
GRANT SELECT ON menu_with_options TO anon, authenticated;

-- Test the view
SELECT COUNT(DISTINCT id) as total_items, 
       COUNT(*) as total_rows,
       COUNT(DISTINCT category_name) as total_categories
FROM menu_with_options;

-- Show Sipit items
SELECT DISTINCT name, base_price, category_name 
FROM menu_with_options 
WHERE category_name = 'ร้านน้ำ Sipit'
LIMIT 10;