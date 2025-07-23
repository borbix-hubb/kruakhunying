import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Star, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-restaurant.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="ครัวคุณหญิง - อาหารไทยแสนอร่อย" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-kanit">
            <span className="hero-text">ครัวคุณหญิง</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 font-kanit text-white/90">
            ร้านอาหารตามสั่ง รสชาติเหมือนแม่ทำ
          </p>
          <p className="text-lg mb-8 font-kanit text-white/80 max-w-2xl mx-auto">
            เปิดให้บริการทุกวัน อังคาร-อาทิตย์ เวลา 9:00-22:00 น. 
            (รับออเดอร์สุดท้าย 21:30 น.) <br />
            ปิดทุกวันจันทร์
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button variant="hero" size="lg" className="group" onClick={() => navigate('/menu')}>
              สั่งอาหารตอนนี้
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Opening Hours Badge */}
          <div className="mt-8 inline-flex items-center space-x-2 bg-success/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="font-kanit font-medium">เปิดให้บริการ</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;