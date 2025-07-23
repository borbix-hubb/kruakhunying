// Menu API Functions

// Get all menu items with categories
async function getMenuItems() {
    try {
        const { data, error } = await supabaseClient
            .from('menu_items')
            .select(`
                *,
                category:menu_categories(name, slug)
            `)
            .eq('is_available', true)
            .order('category_id', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

// Get menu items by category
async function getMenuItemsByCategory(categorySlug) {
    try {
        const { data, error } = await supabaseClient
            .from('menu_items')
            .select(`
                *,
                category:menu_categories!inner(name, slug)
            `)
            .eq('category.slug', categorySlug)
            .eq('is_available', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching menu items by category:', error);
        return [];
    }
}

// Get single menu item
async function getMenuItem(id) {
    try {
        const { data, error } = await supabaseClient
            .from('menu_items')
            .select(`
                *,
                category:menu_categories(name, slug)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching menu item:', error);
        return null;
    }
}

// Add menu item (admin only)
async function addMenuItem(menuItem) {
    try {
        const { data, error } = await supabaseClient
            .from('menu_items')
            .insert([menuItem])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error adding menu item:', error);
        return { success: false, error: error.message };
    }
}

// Update menu item (admin only)
async function updateMenuItem(id, updates) {
    try {
        const { data, error } = await supabaseClient
            .from('menu_items')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating menu item:', error);
        return { success: false, error: error.message };
    }
}

// Delete menu item (admin only)
async function deleteMenuItem(id) {
    try {
        const { error } = await supabaseClient
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return { success: false, error: error.message };
    }
}

// Get all categories
async function getCategories() {
    try {
        const { data, error } = await supabaseClient
            .from('menu_categories')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}