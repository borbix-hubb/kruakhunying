-- Disable RLS on menu_items table temporarily
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;

-- Grant full access to authenticated users
GRANT ALL ON menu_items TO authenticated;
GRANT ALL ON menu_items TO anon;
EOF < /dev/null