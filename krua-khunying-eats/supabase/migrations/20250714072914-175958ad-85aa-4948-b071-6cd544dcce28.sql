
-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create menu categories table
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on menu tables (public read access)
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu tables (allow public read access)
CREATE POLICY "Anyone can view menu categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT USING (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample menu categories
INSERT INTO public.menu_categories (name, name_en, icon, sort_order) VALUES
('เมนูยอดนิยม', 'Popular', '🔥', 1),
('ข้าวราด', 'Rice Dishes', '🍚', 2),
('เส้นและก๋วยเตี๋ยว', 'Noodles', '🍜', 3),
('ผัด', 'Stir-fry', '🥘', 4),
('แกง', 'Curry', '🍛', 5),
('ทอด', 'Fried', '🍤', 6),
('เครื่องดื่ม', 'Beverages', '🥤', 7);

-- Insert sample menu items
INSERT INTO public.menu_items (category_id, name, name_en, description, price, is_popular, is_spicy, rating, review_count) 
SELECT 
  (SELECT id FROM public.menu_categories WHERE name = 'เมนูยอดนิยม'),
  'ข้าวผัดกุ้ง',
  'Shrimp Fried Rice',
  'ข้าวผัดกุ้งสดใหม่ เข้มข้น หอมกระเทียม พร้อมผักสด',
  120.00,
  true,
  false,
  4.8,
  156
UNION ALL SELECT 
  (SELECT id FROM public.menu_categories WHERE name = 'เมนูยอดนิยม'),
  'ต้มยำกุ้งน้ำข้น',
  'Tom Yum Goong',
  'ต้มยำรสจัดจ้าน เปรื้ยว เผ็ด เครื่องแกงแท้ กุ้งใหญ่',
  150.00,
  true,
  true,
  4.9,
  203
UNION ALL SELECT 
  (SELECT id FROM public.menu_categories WHERE name = 'เมนูยอดนิยม'),
  'ผัดไทยกุ้งสด',
  'Pad Thai with Shrimp',
  'ผัดไทยต้นตำรับ รสชาติหวานนำเค็มตาม กุ้งสดใหญ่',
  130.00,
  true,
  false,
  4.7,
  89;
