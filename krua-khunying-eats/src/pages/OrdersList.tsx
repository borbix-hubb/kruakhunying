import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, ChefHat, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BaseLayout from '@/components/layout/BaseLayout';
import { getOrderIds, cleanupCompletedOrders } from '@/lib/browserStorage';
import { getSimplifiedStatusText, getSimplifiedStatusColor, getSimplifiedStatusIcon } from '@/lib/orderStatus';

interface Order {
  id: string;
  order_number: string;
  delivery_method: string;
  delivery_address?: string;
  phone_number: string;
  special_notes?: string;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price_per_item: number;
  special_requests?: string;
  menu_items: {
    name: string;
    description: string;
  };
}

const OrdersList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<{[key: string]: OrderItem[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    subscribeToOrderUpdates();
  }, []);

  const fetchOrders = async () => {
    try {
      const orderIds = getOrderIds();
      if (orderIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('id', orderIds)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดรายการคำสั่งซื้อได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          menu_items (
            name,
            description
          )
        `)
        .eq('order_id', orderId);

      if (data && !error) {
        setExpandedOrders(prev => ({
          ...prev,
          [orderId]: data
        }));
      }
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  const subscribeToOrderUpdates = () => {
    const orderIds = getOrderIds();
    if (orderIds.length === 0) return;

    const channels = orderIds.map((orderId: string) => {
      return supabase
        .channel(`order-list-${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`
          },
          (payload) => {
            setOrders(prev => 
              prev.map(order => 
                order.id === orderId ? { ...order, ...payload.new } : order
              )
            );
            
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
                description: `คำสั่งซื้อ #${payload.new.order_number} - ${statusMessages[payload.new.status]}`
              });
            }
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach((channel: any) => {
        supabase.removeChannel(channel);
      });
    };
  };

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrders[orderId]) {
      setExpandedOrders(prev => {
        const newExpanded = { ...prev };
        delete newExpanded[orderId];
        return newExpanded;
      });
    } else {
      fetchOrderItems(orderId);
    }
  };

  const getStatusIcon = (status: string) => {
    const iconName = getSimplifiedStatusIcon(status as any);
    switch (iconName) {
      case 'Clock':
        return <Clock className="h-5 w-5" />;
      case 'ChefHat':
        return <ChefHat className="h-5 w-5" />;
      case 'CheckCircle':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };


  const getDeliveryMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'pickup': 'รับเองที่ร้าน',
      'delivery': 'ส่งถึงบ้าน',
      'dine_in': 'ทานที่ร้าน'
    };
    return methodMap[method] || method;
  };

  if (loading) {
    return (
      <BaseLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-kanit text-muted-foreground">กำลังโหลด...</p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/menu')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <h1 className="text-2xl font-bold text-primary font-kanit">รายการคำสั่งซื้อทั้งหมด</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-lg font-kanit text-muted-foreground mb-4">
                คุณยังไม่มีประวัติคำสั่งซื้อ
              </p>
              <Button onClick={() => navigate('/menu')} className="font-kanit">
                เริ่มสั่งอาหาร
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full text-white ${getSimplifiedStatusColor(order.status as any)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <CardTitle className="font-kanit text-lg">
                          คำสั่งซื้อ #{order.order_number}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground font-kanit">
                          {new Date(order.created_at).toLocaleString('th-TH')}
                        </p>
                        <p className="text-sm font-kanit text-primary mt-1">
                          📱 {order.phone_number}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getSimplifiedStatusColor(order.status as any)} text-white font-kanit`}>
                        {getSimplifiedStatusText(order.status as any)}
                      </Badge>
                      <p className="text-lg font-bold font-kanit mt-2">
                        ฿{order.total_amount}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {expandedOrders[order.id] && (
                  <CardContent className="border-t">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground font-kanit">วิธีรับอาหาร</p>
                          <p className="font-kanit">{getDeliveryMethodText(order.delivery_method)}</p>
                        </div>
                        {order.delivery_address && (
                          <div>
                            <p className="text-sm text-muted-foreground font-kanit">ที่อยู่จัดส่ง</p>
                            <p className="font-kanit">{order.delivery_address}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground font-kanit">เบอร์โทร</p>
                          <p className="font-kanit">{order.phone_number}</p>
                        </div>
                        {order.special_notes && (
                          <div>
                            <p className="text-sm text-muted-foreground font-kanit">หมายเหตุ</p>
                            <p className="font-kanit">{order.special_notes}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold font-kanit mb-2">รายการอาหาร</h4>
                        <div className="space-y-2">
                          {expandedOrders[order.id].map((item) => (
                            <div key={item.id} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <p className="font-kanit font-medium">{item.menu_items.name}</p>
                                <p className="text-sm text-muted-foreground font-kanit">
                                  จำนวน {item.quantity} × ฿{item.price_per_item}
                                </p>
                                {item.special_requests && (
                                  <p className="text-sm text-orange-600 font-kanit">
                                    หมายเหตุ: {item.special_requests}
                                  </p>
                                )}
                              </div>
                              <p className="font-semibold font-kanit">
                                ฿{(item.quantity * item.price_per_item).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/order/${order.id}`);
                          }}
                          className="font-kanit"
                        >
                          ดูรายละเอียด
                        </Button>
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/menu');
                            }}
                            className="font-kanit"
                          >
                            สั่งอาหารเพิ่ม
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default OrdersList;