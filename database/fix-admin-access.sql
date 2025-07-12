-- Fix Unauthorized Access
-- This script will help sync Supabase Auth users with admin_users table

-- First, check if admin user exists
SELECT * FROM admin_users WHERE email = 'borbixz@gmail.com';

-- If no admin exists, insert one
-- Make sure to use the same email that you use for Supabase Auth login
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES ('borbixz@gmail.com', 'managed_by_supabase_auth', 'Admin', 'super_admin', true)
ON CONFLICT (email) 
DO UPDATE SET 
    is_active = true,
    role = 'super_admin';

-- Verify the admin was created/updated
SELECT * FROM admin_users WHERE email = 'borbixz@gmail.com';

-- Optional: If you have other emails in auth.users that should be admins
-- You can check auth.users table
-- SELECT email FROM auth.users;

-- Then add them to admin_users as needed
-- INSERT INTO admin_users (email, password_hash, name, role, is_active)
-- VALUES ('other@email.com', 'managed_by_supabase_auth', 'Other Admin', 'admin', true);