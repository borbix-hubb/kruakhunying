
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  special_requests?: string;
}

const Checkout = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [building, setBuilding] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [otherLocation, setOtherLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentSlip(file);
      toast({
        title: "อัปโหลดสลิปสำเร็จ",
        description: "สลิปการโอนเงินถูกเลือกแล้ว"
      });
    }
  };

  const getDeliveryAddress = () => {
    if (deliveryMethod !== 'room_delivery') return null;
    
    const parts = [];
    if (building) parts.push(`ตึก ${building}`);
    if (roomNumber) parts.push(`ห้อง ${roomNumber}`);
    if (otherLocation) parts.push(otherLocation);
    
    return parts.join(', ') || null;
  };

  const submitOrder = async () => {
    if (!phoneNumber) {
      toast({
        title: "กรุณากรอกเบอร์โทรศัพท์",
        description: "เบอร์โทรศัพท์จำเป็นสำหรับการติดต่อ",
        variant: "destructive"
      });
      return;
    }

    if (deliveryMethod === 'room_delivery' && !building && !roomNumber && !otherLocation) {
      toast({
        title: "กรุณากรอกข้อมูลที่อยู่",
        description: "กรุณาระบุตึก หรือเลขห้อง หรือสถานที่อื่นๆ",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'transfer' && !paymentSlip) {
      toast({
        title: "กรุณาแนบสลิป",
        description: "สลิปการโอนเงินจำเป็นสำหรับการชำระด้วยการโอน",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // สร้างคำสั่งซื้อ - ไม่ต้องส่ง order_number เพราะ trigger จะสร้างให้
      const orderData: Omit<TablesInsert<'orders'>, 'order_number'> = {
        user_id: user?.id || null,
        delivery_method: deliveryMethod,
        delivery_address: getDeliveryAddress(),
        phone_number: phoneNumber,
        special_notes: specialNotes || null,
        payment_method: paymentMethod,
        total_amount: calculateTotal(),
        status: paymentMethod === 'transfer' ? 'confirmed' : 'pending' // โอนเงินแล้วยืนยันทันที
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData as any) // Type assertion to bypass the order_number requirement
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      // สร้างรายการอาหารในคำสั่งซื้อ
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price_per_item: item.price,
        special_requests: item.special_requests || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        throw itemsError;
      }

      // เก็บ order ID ใน localStorage
      const savedOrderIds = localStorage.getItem('userOrderIds');
      const orderIds = savedOrderIds ? JSON.parse(savedOrderIds) : [];
      orderIds.push(order.id);
      localStorage.setItem('userOrderIds', JSON.stringify(orderIds));
      
      // ลบตะกร้าสินค้า
      localStorage.removeItem('cart');

      const statusMessage = paymentMethod === 'transfer' ? 'ยืนยันคำสั่งซื้อแล้ว!' : 'สั่งอาหารสำเร็จ!';
      toast({
        title: statusMessage,
        description: `เลขที่คำสั่งซื้อ: ${order.order_number}`
      });

      navigate(`/order-status/${order.id}`);

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/cart')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <h1 className="text-2xl font-bold text-primary font-kanit">ชำระเงิน</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-kanit">ข้อมูลติดต่อ</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="phone" className="font-kanit">เบอร์โทรศัพท์ *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0xx-xxx-xxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 font-kanit"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="font-kanit">วิธีรับอาหาร</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="font-kanit">รับเองที่ร้าน</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="room_delivery" id="room_delivery" />
                    <Label htmlFor="room_delivery" className="font-kanit">ส่งที่ห้อง</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dine_in" id="dine_in" />
                    <Label htmlFor="dine_in" className="font-kanit">ทานที่ร้าน</Label>
                  </div>
                </RadioGroup>

                {deliveryMethod === 'room_delivery' && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="building" className="font-kanit">ตึก</Label>
                        <Select value={building} onValueChange={setBuilding}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="เลือกตึก" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">ตึก 1</SelectItem>
                            <SelectItem value="2">ตึก 2</SelectItem>
                            <SelectItem value="3">ตึก 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="room" className="font-kanit">เลขห้อง</Label>
                        <Input
                          id="room"
                          type="text"
                          placeholder="เช่น 101, 202"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          className="mt-1 font-kanit"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="other" className="font-kanit">อื่นๆ (ไม่ได้อยู่ที่นี่)</Label>
                      <Textarea
                        id="other"
                        placeholder="ระบุสถานที่อื่นๆ เช่น ห้องประชุม, คาเฟ่, ลานจอดรถ"
                        value={otherLocation}
                        onChange={(e) => setOtherLocation(e.target.value)}
                        className="mt-1 font-kanit"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="font-kanit">หมายเหตุเพิ่มเติม</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="เช่น ไม่ใส่พริก, แยกน้ำ, กล่องแยก"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="font-kanit"
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="font-kanit">วิธีชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="font-kanit">เงินสด</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="font-kanit">โอนเงิน (ยืนยันทันที)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="promptpay" id="promptpay" />
                    <Label htmlFor="promptpay" className="font-kanit">PromptPay (ยืนยันอัตโนมัติ)</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'transfer' && (
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-semibold font-kanit mb-2">ข้อมูลการโอน:</p>
                      <p className="font-kanit">ธนาคาร: กสิกรไทย</p>
                      <p className="font-kanit">เลขที่บัญชี: xxx-x-xxxxx-x</p>
                      <p className="font-kanit">ชื่อบัญชี: ร้านอาหารของเรา</p>
                    </div>
                    <div>
                      <Label htmlFor="slip" className="font-kanit">แนบสลิปการโอน</Label>
                      <input
                        id="slip"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('slip')?.click()}
                        className="w-full mt-1 font-kanit"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {paymentSlip ? paymentSlip.name : 'เลือกไฟล์สลิป'}
                      </Button>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-kanit text-sm">
                        📋 เมื่อแนบสลิปแล้ว คำสั่งซื้อจะถูกยืนยันทันที
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'promptpay' && (
                  <div className="mt-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="mb-4">
                        <p className="font-kanit text-sm mb-2 text-gray-600">สแกน QR Code เพื่อชำระเงิน</p>
                        <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                          <div className="w-56 h-56 mx-auto flex items-center justify-center">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg opacity-10"></div>
                              <div className="p-2 bg-white rounded">
                                <div className="text-xs text-center text-gray-500 mb-2 font-kanit">
                                  กรุณาวางไฟล์ QR Code ของคุณที่<br/>
                                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/public/images/promptpay-qr.png</code>
                                </div>
                                <div className="w-48 h-48 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed border-gray-300">
                                  <div className="text-center">
                                    <div className="text-4xl mb-2">📱</div>
                                    <p className="text-xs text-gray-500 font-kanit">QR Code<br/>จะแสดงที่นี่</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-1">
                          <p className="font-kanit text-sm font-semibold">ชื่อบัญชี: ร้านครัวคุณหญิง</p>
                          <p className="font-kanit text-sm text-gray-600">PromptPay: xxx-xxx-8744</p>
                          <p className="font-kanit text-xs text-gray-500 mt-2">* ผู้จ่ายเป็นผู้ระบุจำนวนเงิน</p>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-3">
                        <p className="text-blue-800 font-kanit text-sm">
                          🔄 ระบบจะยืนยันคำสั่งซื้ออัตโนมัติเมื่อได้รับการชำระเงิน
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-kanit">สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="font-kanit">{item.name} x{item.quantity}</span>
                      <span className="font-kanit">฿{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="font-kanit">รวมทั้งหมด</span>
                    <span className="font-kanit text-primary">฿{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full font-kanit" 
                  size="lg"
                  onClick={submitOrder}
                  disabled={loading}
                >
                  {loading ? 'กำลังดำเนินการ...' : 
                   paymentMethod === 'transfer' ? 'ยืนยันสั่งอาหาร' : 
                   paymentMethod === 'promptpay' ? 'สั่งอาหาร (รอยืนยันอัตโนมัติ)' : 
                   'สั่งอาหาร'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
