-- เพิ่มหมวดหมู่ย่อย "ของหวาน" สำหรับเครื่องดื่ม
DO $$
DECLARE
  beverage_category_id UUID;
  dessert_subcategory_id UUID;
BEGIN
  -- หา category_id ของเครื่องดื่ม
  SELECT id INTO beverage_category_id FROM public.menu_categories WHERE name LIKE '%เครื่องดื่ม%' LIMIT 1;
  
  IF beverage_category_id IS NOT NULL THEN
    -- เพิ่มหมวดหมู่ย่อย "ของหวาน"
    INSERT INTO public.subcategories (name, name_en, category_id, sort_order) VALUES
    ('ของหวาน', 'Dessert Beverages', beverage_category_id, 4)
    RETURNING id INTO dessert_subcategory_id;
    
    -- อัปเดต menu_items ที่เป็นของหวานให้ไปหมวดหมู่ย่อยของหวาน
    UPDATE public.menu_items 
    SET subcategory_id = dessert_subcategory_id 
    WHERE category_id = beverage_category_id 
    AND (name ILIKE '%ชอคโกแลต%' OR name ILIKE '%คุกกี้%' OR name ILIKE '%บราวนี่%' OR 
         name ILIKE '%เค้ก%' OR name ILIKE '%ครีม%' OR name ILIKE '%วิปครีม%' OR
         name ILIKE '%โอริโอ%' OR name ILIKE '%คาราเมล%' OR name ILIKE '%วานิลลา%' OR
         name ILIKE '%มิลค์เชค%' OR name ILIKE '%เฟรป%' OR name ILIKE '%เบอร์รี่%');
    
    RAISE NOTICE 'Created dessert subcategory for beverage category: %', beverage_category_id;
  ELSE
    RAISE NOTICE 'No beverage category found';
  END IF;
END $$;