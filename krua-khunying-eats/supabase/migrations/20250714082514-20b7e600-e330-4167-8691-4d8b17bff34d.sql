
-- Update an existing user to have admin role
-- Replace 'your-email@example.com' with the actual email you want to make admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);

-- If you want to see all users first, you can run this query:
-- SELECT u.email, p.full_name, p.role 
-- FROM auth.users u 
-- LEFT JOIN public.profiles p ON u.id = p.id;
