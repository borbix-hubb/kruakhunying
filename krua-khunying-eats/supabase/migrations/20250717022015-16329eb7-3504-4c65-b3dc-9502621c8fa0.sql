-- แก้ไขการสร้างหมวดหมู่ย่อยให้ใช้ชื่อที่ถูกต้อง
DO $$
DECLARE
  beverage_category_id UUID;
  hot_subcategory_id UUID;
  cold_subcategory_id UUID;
  blended_subcategory_id UUID;
BEGIN
  -- หา category_id ของเครื่องดื่ม (ใช้ LIKE เพื่อหาชื่อที่มี emoji)
  SELECT id INTO beverage_category_id FROM public.menu_categories WHERE name LIKE '%เครื่องดื่ม%' LIMIT 1;
  
  IF beverage_category_id IS NOT NULL THEN
    -- ลบหมวดหมู่ย่อยเก่าถ้ามี
    DELETE FROM public.subcategories WHERE category_id = beverage_category_id;
    
    -- เพิ่มหมวดหมู่ย่อยสำหรับเครื่องดื่ม
    INSERT INTO public.subcategories (name, name_en, category_id, sort_order) VALUES
    ('เครื่องดื่มร้อน', 'Hot Beverages', beverage_category_id, 1)
    RETURNING id INTO hot_subcategory_id;
    
    INSERT INTO public.subcategories (name, name_en, category_id, sort_order) VALUES
    ('เครื่องดื่มเย็น', 'Cold Beverages', beverage_category_id, 2)
    RETURNING id INTO cold_subcategory_id;
    
    INSERT INTO public.subcategories (name, name_en, category_id, sort_order) VALUES
    ('เครื่องดื่มปั่น', 'Blended Beverages', beverage_category_id, 3)
    RETURNING id INTO blended_subcategory_id;
    
    -- อัปเดต menu_items ให้มี subcategory_id ตามชื่อ
    -- เครื่องดื่มร้อน
    UPDATE public.menu_items 
    SET subcategory_id = hot_subcategory_id 
    WHERE category_id = beverage_category_id 
    AND (name ILIKE '%กาแฟ%' OR name ILIKE '%ชา%' OR name ILIKE '%ร้อน%' OR name ILIKE '%ลาเต้%' OR name ILIKE '%คาปูชิโน่%' OR name ILIKE '%อเมริกาโน่%');
    
    -- เครื่องดื่มเย็น
    UPDATE public.menu_items 
    SET subcategory_id = cold_subcategory_id 
    WHERE category_id = beverage_category_id 
    AND (name ILIKE '%เย็น%' OR name ILIKE '%โซดา%' OR name ILIKE '%น้ำ%' OR name ILIKE '%โค้ก%' OR name ILIKE '%เป๊ปซี่%')
    AND subcategory_id IS NULL;
    
    -- เครื่องดื่มปั่น
    UPDATE public.menu_items 
    SET subcategory_id = blended_subcategory_id 
    WHERE category_id = beverage_category_id 
    AND (name ILIKE '%สมูทตี้%' OR name ILIKE '%ปั่น%' OR name ILIKE '%เฟรป%' OR name ILIKE '%เชค%')
    AND subcategory_id IS NULL;
    
    -- ที่เหลือที่ยังไม่ได้จัดให้ไปเครื่องดื่มเย็น
    UPDATE public.menu_items 
    SET subcategory_id = cold_subcategory_id 
    WHERE category_id = beverage_category_id 
    AND subcategory_id IS NULL;
    
    RAISE NOTICE 'Created subcategories for beverage category: %', beverage_category_id;
  ELSE
    RAISE NOTICE 'No beverage category found';
  END IF;
END $$;