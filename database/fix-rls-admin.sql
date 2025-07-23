-- Fix RLS Policy for admin_users table
-- This allows initial admin creation

-- First, temporarily disable RLS to fix the issue
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Insert the first admin if it doesn't exist
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES ('borbixz@gmail.com', 'managed_by_supabase_auth', 'Admin', 'super_admin', true)
ON CONFLICT (email) 
DO UPDATE SET 
    is_active = true,
    role = 'super_admin';

-- Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow initial admin creation" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- Create new policies
-- 1. Allow anyone to create the first admin (when no admins exist)
CREATE POLICY "Allow initial admin creation" ON admin_users
    FOR INSERT WITH CHECK (
        NOT EXISTS (SELECT 1 FROM admin_users WHERE is_active = true)
    );

-- 2. Allow authenticated users to check if they are admin
CREATE POLICY "Users can check their admin status" ON admin_users
    FOR SELECT USING (
        email = auth.email()
    );

-- 3. Allow active admins to view all admin users
CREATE POLICY "Admins can view all admin users" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );

-- 4. Allow super admins to manage admin users
CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND role = 'super_admin'
            AND is_active = true
        )
    );

-- Verify the admin was created
SELECT * FROM admin_users WHERE email = 'borbixz@gmail.com';