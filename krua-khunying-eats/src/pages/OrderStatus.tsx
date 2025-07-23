import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, ChefHat, CheckCircle, Truck } from 'lucide-react';
import { getSimplifiedStatusText, getSimplifiedStatusColor, getSimplifiedStatusIcon, OrderStatus as OrderStatusType } from '@/lib/orderStatus';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const OrderStatus = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate('/menu');
      return;
    }

    // Check if this order belongs to the current browser
    import('@/lib/browserStorage').then(({ getOrderIds }) => {
      const orderIds = getOrderIds();
      if (!orderIds.includes(orderId) && !user) {
        toast({
          title: "ไม่พบคำสั่งซื้อ",
          description: "คุณไม่มีสิทธิ์ดูคำสั่งซื้อนี้",
          variant: "destructive"
        });
        navigate('/menu');
        return;
      }
    });

    fetchOrderData();

    // Set up real-time subscription for order status updates
    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order updated:', payload);
          setOrder(payload.new as Order);
          
          // Show toast notification for status changes
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, orderId, navigate, toast]);

  const fetchOrderData = async () => {
    try {
      // Fetch order details
      // First try to fetch order without user_id check
      let { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      // If no user is logged in, verify order ID is in browser storage
      if (!user && orderData) {
        const { getOrderIds } = await import('@/lib/browserStorage');
        const orderIds = getOrderIds();
        if (!orderIds.includes(orderId)) {
          throw new Error('Unauthorized access to order');
        }
      }
      
      // If user is logged in, verify ownership
      if (user && orderData && orderData.user_id !== user.id) {
        throw new Error('Unauthorized access to order');
      }

      if (orderError) throw orderError;

      // Fetch order items with menu item details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          menu_items (
            name,
            description
          )
        `)
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      setOrder(orderData);
      setOrderItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้",
        variant: "destructive"
      });
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const iconName = getSimplifiedStatusIcon(status as OrderStatusType);
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

  const getPaymentMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'cash': 'จ่ายปลายทาง',
      'transfer': 'โอนเงิน',
      'promptpay': 'PromptPay'
    };
    return methodMap[method] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-kanit text-muted-foreground">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4 font-kanit">ไม่พบคำสั่งซื้อ</h2>
          <Button onClick={() => navigate('/menu')} className="font-kanit">
            กลับไปเลือกอาหาร
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/menu')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary font-kanit">สถานะคำสั่งซื้อ</h1>
            <p className="text-sm text-muted-foreground font-kanit">#{order.order_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-kanit">เบอร์ติดต่อ</p>
            <p className="text-lg font-bold font-kanit text-primary">📱 {order.phone_number}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-kanit">สถานะปัจจุบัน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full text-white ${getSimplifiedStatusColor(order.status as OrderStatusType)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg font-kanit">{getSimplifiedStatusText(order.status as OrderStatusType)}</h3>
                    <p className="text-sm text-muted-foreground font-kanit">
                      อัปเดตล่าสุด: {new Date(order.created_at).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="font-kanit">รายการอาหาร</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold font-kanit">{item.menu_items.name}</h4>
                        <p className="text-sm text-muted-foreground font-kanit">
                          จำนวน: {item.quantity} | ราคา: ฿{item.price_per_item}
                        </p>
                        {item.special_requests && (
                          <p className="text-sm text-orange-600 font-kanit">
                            หมายเหตุ: {item.special_requests}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold font-kanit">
                          ฿{(item.price_per_item * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-kanit">รายละเอียดคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-kanit text-sm text-muted-foreground">เลขที่คำสั่งซื้อ</Label>
                  <p className="font-semibold font-kanit">{order.order_number}</p>
                </div>

                <div>
                  <Label className="font-kanit text-sm text-muted-foreground">วิธีรับอาหาร</Label>
                  <p className="font-kanit">{getDeliveryMethodText(order.delivery_method)}</p>
                </div>

                {order.delivery_address && (
                  <div>
                    <Label className="font-kanit text-sm text-muted-foreground">ที่อยู่จัดส่ง</Label>
                    <p className="font-kanit">{order.delivery_address}</p>
                  </div>
                )}

                <div>
                  <Label className="font-kanit text-sm text-muted-foreground">เบอร์โทร</Label>
                  <p className="font-kanit">{order.phone_number}</p>
                </div>

                <div>
                  <Label className="font-kanit text-sm text-muted-foreground">วิธีชำระเงิน</Label>
                  <p className="font-kanit">{getPaymentMethodText(order.payment_method)}</p>
                </div>

                {order.special_notes && (
                  <div>
                    <Label className="font-kanit text-sm text-muted-foreground">หมายเหตุ</Label>
                    <p className="font-kanit">{order.special_notes}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="font-kanit">รวมทั้งหมด</span>
                    <span className="font-kanit text-primary">฿{order.total_amount}</span>
                  </div>
                </div>

                <Button 
                  className="w-full font-kanit" 
                  variant="outline"
                  onClick={() => navigate('/menu')}
                >
                  สั่งอาหารอีกครั้ง
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ className, children, ...props }: any) => (
  <label className={className} {...props}>{children}</label>
);

export default OrderStatus;
