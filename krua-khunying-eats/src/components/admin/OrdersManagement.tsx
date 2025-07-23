
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, ChefHat, CheckCircle, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getSimplifiedStatusText, getSimplifiedStatusColor, getSimplifiedStatusIcon, OrderStatus as OrderStatusType } from '@/lib/orderStatus';

interface Order {
  id: string;
  order_number: string;
  delivery_method: string;
  delivery_address?: string;
  special_notes?: string;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
  } | null;
}

interface OrderItem {
  quantity: number;
  price_per_item: number;
  special_requests?: string;
  menu_items: {
    name: string;
  };
}

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

interface OrdersManagementProps {
  orders: OrderWithItems[];
  onOrderUpdate: () => void;
}

const OrdersManagement = ({ orders, onOrderUpdate }: OrdersManagementProps) => {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "อัปเดตสถานะสำเร็จ",
        description: `สถานะถูกเปลี่ยนเป็น ${getSimplifiedStatusText(newStatus as OrderStatusType)}`
      });

      onOrderUpdate();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    const iconName = getSimplifiedStatusIcon(status as OrderStatusType);
    switch (iconName) {
      case 'Clock':
        return <Clock className="h-4 w-4" />;
      case 'ChefHat':
        return <ChefHat className="h-4 w-4" />;
      case 'CheckCircle':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDeliveryMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'pickup': 'รับเองที่ร้าน',
      'room_delivery': 'ส่งที่ห้อง',
      'dine_in': 'ทานที่ร้าน'
    };
    return methodMap[method] || method;
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'cash': 'เงินสด',
      'transfer': 'โอนเงิน',
      'promptpay': 'PromptPay'
    };
    return methodMap[method] || method;
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="mb-6">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="เลือกสถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="pending">รอคิว</SelectItem>
            <SelectItem value="preparing">กำลังทำ</SelectItem>
            <SelectItem value="completed">เสร็จแล้ว</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-kanit text-lg">#{order.order_number}</CardTitle>
                  <p className="text-sm text-muted-foreground font-kanit">
                    {order.profiles?.full_name || 'ไม่ระบุชื่อ'} • {new Date(order.created_at).toLocaleString('th-TH')}
                  </p>
                </div>
                <Badge className={`${getSimplifiedStatusColor(order.status as OrderStatusType)} text-white font-kanit`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{getSimplifiedStatusText(order.status as OrderStatusType)}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 className="font-semibold font-kanit mb-2">รายการอาหาร</h4>
                  <div className="space-y-1">
                    {order.order_items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="font-kanit">{item.menu_items.name} x{item.quantity}</span>
                        <span className="font-kanit">฿{(item.price_per_item * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="font-kanit">รวม</span>
                      <span className="font-kanit">฿{order.total_amount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium font-kanit text-blue-700 mb-1">วิธีรับอาหาร</p>
                      <p className="text-base font-kanit text-blue-900 font-semibold">{getDeliveryMethodText(order.delivery_method)}</p>
                    </div>
                    
                    {order.delivery_address && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm font-medium font-kanit text-green-700 mb-1">ที่อยู่จัดส่ง</p>
                        <p className="text-base font-kanit text-green-900 font-semibold">{order.delivery_address}</p>
                      </div>
                    )}

                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm font-medium font-kanit text-purple-700 mb-1">วิธีชำระเงิน</p>
                      <p className="text-base font-kanit text-purple-900 font-semibold">{getPaymentMethodText(order.payment_method)}</p>
                    </div>

                    {order.special_notes && (
                      <div className="bg-orange-50 rounded-lg p-3">
                        <p className="text-sm font-medium font-kanit text-orange-700 mb-1">หมายเหตุ</p>
                        <p className="text-base font-kanit text-orange-900">{order.special_notes}</p>
                      </div>
                    )}

                    <div className="pt-1">
                      <p className="text-sm font-medium font-kanit mb-1">อัปเดตสถานะ</p>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">รอคิว</SelectItem>
                          <SelectItem value="preparing">กำลังทำ</SelectItem>
                          <SelectItem value="completed">เสร็จแล้ว</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground font-kanit">ไม่มีคำสั่งซื้อในสถานะนี้</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersManagement;
