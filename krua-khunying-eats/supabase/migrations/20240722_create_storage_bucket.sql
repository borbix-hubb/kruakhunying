-- Enable storage if not already enabled
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images', 
  'menu-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Set up RLS policies for menu images bucket
CREATE POLICY "Public Access menu-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'menu-images');

CREATE POLICY "Auth users upload menu-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth users update menu-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth users delete menu-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');