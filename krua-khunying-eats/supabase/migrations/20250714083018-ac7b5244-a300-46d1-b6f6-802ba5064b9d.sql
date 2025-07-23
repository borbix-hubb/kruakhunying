
-- First, let's see what users exist in the system
SELECT u.email, p.full_name, p.role 
FROM auth.users u 
LEFT JOIN public.profiles p ON u.id = p.id;

-- Update the first user found to have admin role
-- This will make the first registered user an admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  ORDER BY created_at ASC 
  LIMIT 1
);
