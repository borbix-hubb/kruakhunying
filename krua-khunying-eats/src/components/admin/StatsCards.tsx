
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, CheckCircle, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="flex items-center p-6">
          <Package className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground font-kanit">คำสั่งซื้อทั้งหมด</p>
            <p className="text-2xl font-bold font-kanit">{stats.totalOrders}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-6">
          <Clock className="h-8 w-8 text-orange-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground font-kanit">รอดำเนินการ</p>
            <p className="text-2xl font-bold font-kanit">{stats.pendingOrders}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground font-kanit">เสร็จสิ้นแล้ว</p>
            <p className="text-2xl font-bold font-kanit">{stats.completedOrders}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground font-kanit">รายได้รวม</p>
            <p className="text-2xl font-bold font-kanit">฿{stats.totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
