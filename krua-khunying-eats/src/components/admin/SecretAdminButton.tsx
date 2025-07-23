import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const SecretAdminButton = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const [clickCount, setClickCount] = useState(0);

  // ถ้าไม่ใช่แอดมิน หรือกำลังโหลด ไม่แสดงอะไร
  if (loading || !isAdmin) {
    return null;
  }

  // ต้องคลิก 3 ครั้งภายใน 2 วินาที
  const handleClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount >= 2) {
      // คลิกครบ 3 ครั้ง ไปหน้าแอดมิน
      navigate('/admin/dashboard');
      setClickCount(0);
    }

    // รีเซ็ตหลังจาก 2 วินาที
    setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 h-8 w-8 opacity-10 hover:opacity-100 transition-opacity duration-300"
      onClick={handleClick}
      title={`คลิก ${3 - clickCount} ครั้ง`}
    >
      <Settings className="h-4 w-4" />
    </Button>
  );
};

export default SecretAdminButton;