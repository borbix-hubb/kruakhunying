// Authentication API Functions

// Admin login
async function adminLogin(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        // Check if user is admin
        const { data: adminUser, error: adminError } = await supabaseClient
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .eq('is_active', true)
            .single();
        
        if (adminError || !adminUser) {
            await supabaseClient.auth.signOut();
            throw new Error('Unauthorized access');
        }
        
        // Update last login
        await supabaseClient
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', adminUser.id);
        
        return { success: true, user: adminUser };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// Admin logout
async function adminLogout() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

// Get current session
async function getCurrentSession() {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (error) throw error;
        
        if (!session) return null;
        
        // Verify admin user
        const { data: adminUser, error: adminError } = await supabaseClient
            .from('admin_users')
            .select('*')
            .eq('email', session.user.email)
            .eq('is_active', true)
            .single();
        
        if (adminError || !adminUser) return null;
        
        return adminUser;
    } catch (error) {
        console.error('Session error:', error);
        return null;
    }
}

// Subscribe to auth changes
function onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
            const adminUser = await getCurrentSession();
            callback(adminUser);
        } else if (event === 'SIGNED_OUT') {
            callback(null);
        }
    });
}

// Create first admin user (run once)
async function createFirstAdmin(email, password, name) {
    try {
        // First create auth user
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email,
            password
        });
        
        if (authError) throw authError;
        
        // Then create admin user record
        const { data, error } = await supabaseClient
            .from('admin_users')
            .insert([{
                email,
                password_hash: 'managed_by_supabase_auth',
                name,
                role: 'super_admin'
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error creating admin:', error);
        return { success: false, error: error.message };
    }
}