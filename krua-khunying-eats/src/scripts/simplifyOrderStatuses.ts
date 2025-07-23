// Script to simplify existing order statuses
// Maps detailed statuses to simplified ones: pending, preparing, completed

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const statusMapping: { [key: string]: string } = {
  'confirmed': 'pending',
  'ready': 'preparing',
  'delivering': 'preparing',
  'cancelled': 'completed'
};

async function updateOrderStatuses() {
  try {
    // Get all orders with statuses that need to be mapped
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, status')
      .in('status', ['confirmed', 'ready', 'delivering', 'cancelled']);

    if (fetchError) {
      console.error('Error fetching orders:', fetchError);
      return;
    }

    console.log(`Found ${orders?.length || 0} orders to update`);

    // Update each order
    for (const order of orders || []) {
      const newStatus = statusMapping[order.status];
      if (newStatus) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', order.id);

        if (updateError) {
          console.error(`Error updating order ${order.id}:`, updateError);
        } else {
          console.log(`Updated order ${order.id} from ${order.status} to ${newStatus}`);
        }
      }
    }

    console.log('Status simplification complete!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the script
updateOrderStatuses();