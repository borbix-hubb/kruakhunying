import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'รอคิว',
      'confirmed': 'ยืนยันแล้ว',
      'preparing': 'กำลังทำ',
      'ready': 'เสร็จแล้ว',
      'delivering': 'จัดส่ง',
      'completed': 'เสร็จสิ้น',
      'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'confirmed':
        return 'text-blue-600';
      case 'preparing':
        return 'text-orange-600';
      case 'ready':
        return 'text-green-600';
      case 'delivering':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  // Fetch active orders from localStorage
  const fetchActiveOrders = async () => {
    try {
      const savedOrderIds = localStorage.getItem('userOrderIds');
      if (!savedOrderIds) return;
      
      const orderIds = JSON.parse(savedOrderIds);
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
    if (latestOrder) {
      navigate(`/order/${latestOrder.id}`);
    } else if (activeOrders.length > 0) {
      navigate(`/order/${activeOrders[0].id}`);
    } else {
      // Show toast if no orders
      toast({
        title: "ไม่มีคำสั่งซื้อ",
        description: "คุณยังไม่มีคำสั่งซื้อที่ต้องติดตาม"
      });
    }
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
        <span className={`ml-2 text-xs ${getStatusColor(latestOrder.status)}`}>
          ({getStatusText(latestOrder.status)})
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