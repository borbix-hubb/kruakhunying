
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getCartKey } from '@/lib/browserStorage';

interface CartItem {
  id: string;
  cartItemId: string;
  name: string;
  price: number;
  basePrice: number;
  quantity: number;
  image: string;
  special_requests?: string;
  options?: {
    meat?: string;
    special?: boolean;
  };
}

const Cart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // โหลดข้อมูลตะกร้าจาก browser-specific storage
    const cartKey = getCartKey();
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(cartItemId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem(getCartKey(), JSON.stringify(updatedItems));
  };

  const removeItem = (cartItemId: string) => {
    const updatedItems = cartItems.filter(item => item.cartItemId !== cartItemId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    toast({
      title: "ลบรายการแล้ว",
      description: "รายการถูกลบออกจากตะกร้าเรียบร้อยแล้ว"
    });
  };

  const updateSpecialRequests = (itemId: string, requests: string) => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, special_requests: requests } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem(getCartKey(), JSON.stringify(updatedItems));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "ตะกร้าว่าง",
        description: "กรุณาเลือกอาหารก่อนดำเนินการต่อ",
        variant: "destructive"
      });
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/menu')} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Button>
            <h1 className="text-2xl font-bold text-primary font-kanit">ตะกร้าสินค้า</h1>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-foreground mb-4 font-kanit">ตะกร้าของคุณว่างเปล่า</h2>
            <p className="text-muted-foreground mb-6 font-kanit">เลือกเมนูอาหารที่คุณชอบได้เลย</p>
            <Button onClick={() => navigate('/menu')} className="font-kanit">
              เลือกอาหาร
            </Button>
          </div>
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
          <h1 className="text-2xl font-bold text-primary font-kanit">ตะกร้าสินค้า</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.cartItemId || item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{item.image}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg font-kanit">{item.name}</h3>
                        {item.options && (
                          <div className="flex gap-2 mt-1">
                            {item.options.meat && (
                              <Badge variant="secondary" className="text-xs font-kanit">
                                {item.options.meat === 'pork' ? 'หมู' : 
                                 item.options.meat === 'chicken' ? 'ไก่' :
                                 item.options.meat === 'shrimp' ? 'กุ้ง' : 'หมึก'}
                              </Badge>
                            )}
                            {item.options.special && (
                              <Badge variant="secondary" className="text-xs font-kanit">
                                พิเศษ
                              </Badge>
                            )}
                          </div>
                        )}
                        <p className="text-primary font-bold font-kanit">฿{item.price}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 bg-muted rounded font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.cartItemId || item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder="หมายเหตุพิเศษ (เช่น ไม่ใส่พริก, แยกน้ำ)"
                            value={item.special_requests || ''}
                            onChange={(e) => updateSpecialRequests(item.cartItemId || item.id, e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm font-kanit"
                          />
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary font-kanit">
                          ฿{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-kanit">สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-kanit">รายการ ({cartItems.length})</span>
                  <span className="font-kanit">฿{calculateTotal().toFixed(2)}</span>
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
                  onClick={proceedToCheckout}
                >
                  ดำเนินการสั่งซื้อ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
