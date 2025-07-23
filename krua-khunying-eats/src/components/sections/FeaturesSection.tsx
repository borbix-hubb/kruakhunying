import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ChefHat, 
  Truck, 
  Heart, 
  Star, 
  Shield,
  Phone,
  CreditCard
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "เรื่องของความสะอาด",
      description: "ทีมพ่อครัวที่มีประสบการณ์กว่า 15 ปี ใส่ใจทุกรายละเอียด",
      badge: "คุณภาพ"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "จัดส่งรวดเร็ว",
      description: "จัดส่งภายใน 30-45 นาที พร้อมอาหารร้อนๆ ถึงมือคุณ",
      badge: "รวดเร็ว"
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "วัตถุดิบสด ใหม่",
      description: "คัดสรรวัตถุดิบคุณภาพดีทุกวัน รสชาติเข้มข้นเหมือนทำเอง",
      badge: "สดใหม่"
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "รสชาติถูกปาก",
      description: "ปรับรสชาติได้ตามต้องการ เผ็ด หวาน เค็ม เปรี้ยว",
      badge: "ปรับได้"
    }
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kanit">
            ทำไมต้องเลือก <span className="text-primary">ครัวคุณหญิง</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-kanit">
            เราให้ความสำคัญกับคุณภาพอาหาร การบริการที่ดี และความพึงพอใจของลูกค้าเป็นอันดับแรก
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="restaurant-card group">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                
                <div className="mb-2 flex justify-center">
                  <Badge variant="secondary" className="text-xs font-kanit bg-primary/10 text-primary border-primary/20">
                    {feature.badge}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 font-kanit">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed font-kanit">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-6 py-3 rounded-full">
            <Star className="h-5 w-5 text-primary" />
            <span className="font-kanit font-medium text-primary">
              รับประกันความพึงพอใจ 100%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;