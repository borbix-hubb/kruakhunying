-- Update Sipit category slug to match the frontend expectation
UPDATE menu_categories 
SET slug = 'drinks' 
WHERE name = 'ร้านน้ำ Sipit';

-- Verify the change
SELECT * FROM menu_categories WHERE name = 'ร้านน้ำ Sipit';