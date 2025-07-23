
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Clock, Phone, MapPin, Lock } from "lucide-react";
import logo from "@/assets/logo.png";
import AdminDashboardButton from "@/components/admin/AdminDashboardButton";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const navItems = [
    { name: "หน้าแรก", href: "/" },
    { name: "เกี่ยวกับเรา", href: "/about" },
    { name: "ติดต่อ", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar with info */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground border-b border-border/50">
          <div className="hidden sm:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="hidden md:inline">อังคาร-อาทิตย์ 9:00-22:00 (ปิดวันจันทร์)</span>
              <span className="md:hidden">9:00-22:00</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>094-762-1932</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Wealth Condo</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-50 hover:opacity-100 transition-opacity"
              onClick={handleLoginClick}
              title="เข้าสู่ระบบ"
            >
              <Lock className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="ครัวคุณหญิง" className="h-12 w-12 rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-primary font-kanit">ครัวคุณหญิง</h1>
              <p className="text-sm text-muted-foreground">ร้านอาหารตามสั่ง</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-primary transition-smooth font-medium font-kanit"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <AdminDashboardButton />
            <Button variant="warm" className="hidden md:inline-flex" asChild>
              <Link to="/menu">สั่งอาหารออนไลน์</Link>
            </Button>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center space-x-3">
                    <img src={logo} alt="ครัวคุณหญิง" className="h-10 w-10 rounded-lg" />
                    <div>
                      <h2 className="text-xl font-bold text-primary font-kanit">ครัวคุณหญิง</h2>
                      <p className="text-sm text-muted-foreground">ร้านอาหารตามสั่ง</p>
                    </div>
                  </div>
                  
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-foreground hover:text-primary transition-smooth font-kanit"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>อังคาร-อาทิตย์ 9:00-22:00</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>094-762-1932</span>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button variant="warm" className="w-full" asChild>
                        <Link to="/menu">สั่งอาหารออนไลน์</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
