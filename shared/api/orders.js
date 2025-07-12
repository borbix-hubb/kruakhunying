// Orders API Functions

// Create new order
async function createOrder(orderData) {
    try {
        // Start a transaction
        const { customer, items, total, payment_method, note } = orderData;
        
        // Check if customer exists or create new
        let customerId;
        const { data: existingCustomer } = await supabaseClient
            .from('customers')
            .select('id')
            .eq('phone', customer.phone)
            .single();
        
        if (existingCustomer) {
            customerId = existingCustomer.id;
            // Update customer info
            await supabaseClient
                .from('customers')
                .update({
                    name: customer.name,
                    dorm: customer.dorm,
                    room: customer.room
                })
                .eq('id', customerId);
        } else {
            // Create new customer
            const { data: newCustomer, error: customerError } = await supabaseClient
                .from('customers')
                .insert([customer])
                .select()
                .single();
            
            if (customerError) throw customerError;
            customerId = newCustomer.id;
        }
        
        // Create order
        const orderNumber = 'ORD' + Date.now().toString().slice(-8);
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .insert([{
                order_number: orderNumber,
                customer_id: customerId,
                total_amount: total,
                payment_method: payment_method || 'cash',
                note: note
            }])
            .select()
            .single();
        
        if (orderError) throw orderError;
        
        // Create order items
        const orderItems = items.map(item => ({
            order_id: order.id,
            menu_item_id: item.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        }));
        
        const { error: itemsError } = await supabaseClient
            .from('order_items')
            .insert(orderItems);
        
        if (itemsError) throw itemsError;
        
        return { 
            success: true, 
            data: { ...order, order_number: orderNumber }
        };
        
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: error.message };
    }
}

// Get all orders (admin)
async function getOrders(status = null) {
    try {
        let query = supabaseClient
            .from('orders')
            .select(`
                *,
                customer:customers(*),
                order_items(
                    *,
                    menu_item:menu_items(name, price)
                )
            `)
            .order('created_at', { ascending: false });
        
        if (status) {
            query = query.eq('status', status);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Get single order
async function getOrder(orderId) {
    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select(`
                *,
                customer:customers(*),
                order_items(
                    *,
                    menu_item:menu_items(name, price)
                )
            `)
            .eq('id', orderId)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
}

// Update order status
async function updateOrderStatus(orderId, status) {
    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: error.message };
    }
}

// Update payment status
async function updatePaymentStatus(orderId, payment_status) {
    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .update({ payment_status })
            .eq('id', orderId)
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating payment status:', error);
        return { success: false, error: error.message };
    }
}

// Get today's orders count
async function getTodayOrdersCount() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count, error } = await supabaseClient
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());
        
        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('Error getting today orders count:', error);
        return 0;
    }
}

// Get sales data for reports
async function getSalesData(startDate, endDate) {
    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('total_amount, created_at')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .eq('status', 'completed')
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return [];
    }
}