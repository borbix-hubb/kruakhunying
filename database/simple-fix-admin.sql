-- Simple fix for admin creation
-- Run this in Supabase SQL Editor

-- Step 1: Temporarily disable RLS
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Step 2: Create your admin user
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES ('borbixz@gmail.com', 'managed_by_supabase_auth', 'Admin', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET is_active = true;

-- Step 3: Re-enable RLS (optional - you can leave it disabled for testing)
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 4: Verify
SELECT * FROM admin_users;