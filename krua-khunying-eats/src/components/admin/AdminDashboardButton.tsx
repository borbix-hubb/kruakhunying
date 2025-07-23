
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const AdminDashboardButton = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();

  // ไม่แสดงปุ่มถ้ากำลังโหลดหรือไม่ใช่แอดมิน
  if (loading || !isAdmin) {
    return null;
  }

  const handleClick = () => {
    navigate('/admin/dashboard');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleClick}
      className="font-kanit"
    >
      <LayoutDashboard className="h-4 w-4 mr-2" />
      แดชบอร์ดแอดมิน
    </Button>
  );
};

export default AdminDashboardButton;
