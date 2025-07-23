
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import StatsCards from '@/components/admin/StatsCards';
import OrdersManagement from '@/components/admin/OrdersManagement';
import MemberManagement from '@/components/admin/MemberManagement';
import MenuManagement from '@/components/admin/MenuManagement';

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
  user_id: string;
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    checkAdminAccess();
    fetchOrders();
    fetchStats();

    // Set up real-time subscription
    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const checkAdminAccess = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "ไม่มีสิทธิ์เข้าถึง",
          description: "คุณไม่มีสิทธิ์เข้าถึงหน้าแอดมิน",
          variant: "destructive"
        });
        navigate('/menu');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/menu');
    }
  };

  const fetchOrders = async () => {
    try {
      // First fetch orders with order items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_per_item,
            special_requests,
            menu_items (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Then fetch user profiles
      const userIds = ordersData?.map(order => order.user_id).filter(Boolean) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      // Create a map of user profiles
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.id, { full_name: profile.full_name }]) || []
      );

      // Merge orders with profiles
      const transformedOrders: OrderWithItems[] = (ordersData || []).map(order => ({
        ...order,
        profiles: order.user_id ? profilesMap.get(order.user_id) || null : null
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('status, total_amount, created_at');

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      if (ordersData) {
        // คำนวณ stats จากข้อมูลจริง
        const totalOrders = ordersData.length;
        
        // นับออเดอร์ที่กำลังดำเนินการ (ยังไม่เสร็จ)
        const pendingOrders = ordersData.filter(o => 
          o.status === 'pending' || 
          o.status === 'confirmed' || 
          o.status === 'preparing' ||
          o.status === 'ready'
        ).length;
        
        // นับออเดอร์ที่เสร็จแล้ว
        const completedOrders = ordersData.filter(o => o.status === 'completed').length;
        
        // คำนวณรายได้รวม (เฉพาะออเดอร์ที่ completed)
        const totalRevenue = ordersData
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

        setStats({
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // ตั้งค่า default ถ้าเกิดข้อผิดพลาด
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-kanit text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary font-kanit">แดชบอร์ดแอดมิน</h1>
          <Button variant="outline" onClick={() => navigate('/menu')} className="font-kanit">
            กลับสู่เมนู
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="font-kanit">คำสั่งซื้อ</TabsTrigger>
            <TabsTrigger value="menu" className="font-kanit">จัดการเมนู</TabsTrigger>
            <TabsTrigger value="members" className="font-kanit">จัดการสมาชิก</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrdersManagement orders={orders} onOrderUpdate={() => { fetchOrders(); fetchStats(); }} />
          </TabsContent>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>

          {/* Member Management Tab */}
          <TabsContent value="members">
            <MemberManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
