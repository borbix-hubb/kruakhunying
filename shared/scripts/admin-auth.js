// Simplified authentication for admin dashboard

// Get current session - with fallback
async function getCurrentSession() {
    try {
        // First try Supabase auth
        if (window.supabaseClient) {
            const { data: { session }, error } = await window.supabaseClient.auth.getSession();
            
            if (session && !error) {
                // Try to get admin user
                try {
                    const { data: adminUser, error: adminError } = await window.supabaseClient
                        .from('admin_users')
                        .select('*')
                        .eq('email', session.user.email)
                        .eq('is_active', true)
                        .single();
                    
                    if (adminUser && !adminError) {
                        return adminUser;
                    }
                } catch (e) {
                    console.log('Admin user check failed:', e);
                }
                
                // Return basic user info if admin check fails
                return {
                    email: session.user.email,
                    name: session.user.email.split('@')[0]
                };
            }
        }
        
        // Check localStorage for saved admin
        const savedAdmin = localStorage.getItem('adminUser');
        if (savedAdmin) {
            return JSON.parse(savedAdmin);
        }
        
        // Return default admin for development
        return {
            email: 'admin.borbix@kruakhunying.com',
            name: 'admin.borbix',
            role: 'admin'
        };
        
    } catch (error) {
        console.error('Session error:', error);
        // Return default admin on error
        return {
            email: 'admin.borbix@kruakhunying.com',
            name: 'admin.borbix',
            role: 'admin'
        };
    }
}

// Simple login function
async function adminLogin(email, password) {
    try {
        if (window.supabaseClient) {
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            
            if (!error && data) {
                // Save to localStorage
                const adminUser = {
                    email: email,
                    name: email.split('@')[0],
                    role: 'admin'
                };
                localStorage.setItem('adminUser', JSON.stringify(adminUser));
                return { success: true, user: adminUser };
            }
        }
        
        // Fallback login for development
        if (email === 'admin.borbix@kruakhunying.com' && password === 'admin123') {
            const adminUser = {
                email: email,
                name: 'admin.borbix',
                role: 'admin'
            };
            localStorage.setItem('adminUser', JSON.stringify(adminUser));
            return { success: true, user: adminUser };
        }
        
        return { success: false, error: 'Invalid credentials' };
        
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// Logout function
async function adminLogout() {
    try {
        if (window.supabaseClient) {
            await window.supabaseClient.auth.signOut();
        }
        localStorage.removeItem('adminUser');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}