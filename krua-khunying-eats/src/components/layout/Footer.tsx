import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="ครัวคุณหญิง" className="h-12 w-12 rounded-lg" />
              <div>
                <h3 className="text-xl font-bold font-kanit text-primary">ครัวคุณหญิง</h3>
                <p className="text-sm text-background/80">ร้านอาหารตามสั่ง</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <Link to="/contact" className="inline-block">
              <h4 className="text-lg font-semibold font-kanit text-primary hover:text-primary/80 transition-colors cursor-pointer">ติดต่อเรา</h4>
            </Link>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-kanit">094-762-1932</p>
                  <p className="text-sm text-background/70">สำหรับสั่งอาหาร</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-kanit">Wealth Condo</p>
                  <p className="text-sm text-background/70">ลาดพร้าว 87 แยก 1 (แยกวินมอไซค์)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-kanit text-primary">เวลาทำการ</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-kanit">อังคาร - อาทิตย์</span>
                <span className="font-kanit text-primary">9:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-kanit">ออเดอร์สุดท้าย</span>
                <span className="font-kanit text-primary">21:30</span>
              </div>
              <div className="flex justify-between">
                <span className="font-kanit">วันจันทร์</span>
                <span className="font-kanit text-red-400">ปิด</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-primary/20 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-kanit text-background">เปิดให้บริการตอนนี้</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/70 font-kanit text-sm">
            © 2024 ครัวคุณหญิง. สงวนลิขสิทธิ์ทุกประการ
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-background/70 hover:text-primary transition-colors font-kanit text-sm">
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link to="/terms" className="text-background/70 hover:text-primary transition-colors font-kanit text-sm">
              ข้อกำหนดการใช้งาน
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;