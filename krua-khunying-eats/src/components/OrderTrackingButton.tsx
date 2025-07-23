import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getOrderIds, cleanupCompletedOrders } from '@/lib/browserStorage';
import { getSimplifiedStatusText, getSimplifiedStatusColor, OrderStatus as OrderStatusType } from '@/lib/orderStatus';

interface Order {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
}

const OrderTrackingButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const getStatusTextColor = (status: string) => {
    const color = getSimplifiedStatusColor(status as OrderStatusType);
    return color
      .replace('bg-yellow-500', 'text-yellow-600')
      .replace('bg-orange-500', 'text-orange-600')
      .replace('bg-green-500', 'text-green-600')
      .replace('bg-gray-500', 'text-gray-600');
  };

  // Fetch active orders from browser-specific storage
  const fetchActiveOrders = async () => {
    try {
      const orderIds = getOrderIds();
      if (orderIds.length === 0) return;

      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, created_at')
        .in('id', orderIds)
        .not('status', 'in', '(completed,cancelled)')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setActiveOrders(data);
        if (data.length > 0) {
          setLatestOrder(data[0]);
        }
        
        // Cleanup completed orders from storage
        const completedOrderIds = orderIds.filter(id => 
          !data.some(order => order.id === id)
        );
        if (completedOrderIds.length > 0) {
          cleanupCompletedOrders(completedOrderIds);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchActiveOrders();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (activeOrders.length === 0) return;

    const channels = activeOrders.map(order => {
      return supabase
        .channel(`order-tracking-${order.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${order.id}`
          },
          (payload) => {
            console.log('Order updated:', payload);
            
            // Update the order in state
            setActiveOrders(prev => 
              prev.map(o => o.id === order.id ? {...o, status: payload.new.status} : o)
            );
            
            // Update latest order if it matches
            if (latestOrder?.id === order.id) {
              setLatestOrder(prev => prev ? {...prev, status: payload.new.status} : null);
            }
            
            // Show toast notification
            const statusMessages: { [key: string]: string } = {
              'confirmed': '✅ คำสั่งซื้อได้รับการยืนยันแล้ว',
              'preparing': '👨‍🍳 เริ่มทำอาหารแล้ว',
              'ready': '✅ อาหารเสร็จแล้ว พร้อมรับ',
              'delivering': '🛵 กำลังจัดส่ง',
              'completed': '🎉 เสร็จสิ้น ขอบคุณที่ใช้บริการ'
            };
            
            if (statusMessages[payload.new.status]) {
              toast({
                title: "สถานะอัปเดต",
                description: statusMessages[payload.new.status]
              });
            }

            // Remove from active orders if completed or cancelled
            if (payload.new.status === 'completed' || payload.new.status === 'cancelled') {
              setActiveOrders(prev => prev.filter(o => o.id !== order.id));
              if (latestOrder?.id === order.id) {
                setLatestOrder(null);
              }
            }
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [activeOrders, latestOrder, toast]);

  const handleClick = () => {
    navigate('/orders');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="font-kanit relative"
      onClick={handleClick}
    >
      <Clock className="h-4 w-4 mr-1 sm:mr-2" />
      <span className="hidden sm:inline">ติดตามสถานะ</span>
      <span className="sm:hidden">สถานะ</span>
      {activeOrders.length === 0 ? (
        <span className="ml-2 text-xs text-gray-500">
          (ไม่มีคำสั่งซื้อ)
        </span>
      ) : latestOrder ? (
        <span className={`ml-2 text-xs ${getStatusTextColor(latestOrder.status)}`}>
          ({getSimplifiedStatusText(latestOrder.status as OrderStatusType)})
        </span>
      ) : null}
      {activeOrders.length > 1 && (
        <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
          {activeOrders.length}
        </Badge>
      )}
    </Button>
  );
};

export default OrderTrackingButton;