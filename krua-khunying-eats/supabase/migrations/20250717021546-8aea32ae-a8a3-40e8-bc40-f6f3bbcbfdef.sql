-- สร้างตาราง subcategories สำหรับหมวดหมู่ย่อย
CREATE TABLE public.subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- เพิ่มคอลัมน์ subcategory_id ในตาราง menu_items
ALTER TABLE public.menu_items 
ADD COLUMN subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- สร้าง index เพื่อประสิทธิภาพ
CREATE INDEX idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX idx_menu_items_subcategory_id ON public.menu_items(subcategory_id);

-- Enable RLS
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- สร้าง RLS policies สำหรับ subcategories
CREATE POLICY "Anyone can view subcategories" 
ON public.subcategories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert subcategories" 
ON public.subcategories 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update subcategories" 
ON public.subcategories 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete subcategories" 
ON public.subcategories 
FOR DELETE 
USING (is_admin(auth.uid()));

-- หาหมวดหมู่เครื่องดื่ม
DO $$
DECLARE
  beverage_category_id UUID;
  hot_subcategory_id UUID;
  cold_subcategory_id UUID;
  blended_subcategory_id UUID;
BEGIN
  -- หา category_id ของเครื่องดื่ม
  SELECT id INTO beverage_category_id FROM public.menu_categories WHERE name = 'เครื่องดื่ม' LIMIT 1;
  
  IF beverage_category_id IS NOT NULL THEN
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
    AND (name ILIKE '%กาแฟ%' OR name ILIKE '%ชา%' OR name ILIKE '%ร้อน%');
    
    -- เครื่องดื่มเย็น
    UPDATE public.menu_items 
    SET subcategory_id = cold_subcategory_id 
    WHERE category_id = beverage_category_id 
    AND (name ILIKE '%เย็น%' OR name ILIKE '%โซดา%' OR name ILIKE '%น้ำ%')
    AND subcategory_id IS NULL;
    
    -- เครื่องดื่มปั่น
    UPDATE public.menu_items 
    SET subcategory_id = blended_subcategory_id 
    WHERE category_id = beverage_category_id 
    AND (name ILIKE '%สมูทตี้%' OR name ILIKE '%ปั่น%' OR name ILIKE '%เฟรป%')
    AND subcategory_id IS NULL;
    
    -- ที่เหลือที่ยังไม่ได้จัดให้ไปเครื่องดื่มเย็น
    UPDATE public.menu_items 
    SET subcategory_id = cold_subcategory_id 
    WHERE category_id = beverage_category_id 
    AND subcategory_id IS NULL;
  END IF;
END $$;