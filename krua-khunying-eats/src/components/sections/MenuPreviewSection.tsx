
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Eye } from "lucide-react";

const MenuPreviewSection = () => {
  const [activeCategory, setActiveCategory] = useState("popular");
  const navigate = useNavigate();

  const categories = [
    { id: "popular", name: "เมนูยอดนิยม", icon: "🔥" },
    { id: "rice", name: "ข้าวราด", icon: "🍚" },
    { id: "noodles", name: "เส้นและก๋วยเตี๋ยว", icon: "🍜" },
    { id: "stir-fry", name: "ผัด", icon: "🥘" }
  ];

  const menuItems = {
    popular: [
      {
        id: 1,
        name: "ข้าวผัดกุ้ง",
        description: "ข้าวผัดกุ้งสดใหม่ เข้มข้น หอมกระเทียม พร้อมผักสด",
        price: 120,
        rating: 4.8,
        reviews: 156,
        image: "🍤",
        isPopular: true,
        isSpicy: false
      },
      {
        id: 2,
        name: "ต้มยำกุ้งน้ำข้น",
        description: "ต้มยำรสจัดจ้าน เปรื้ยว เผ็ด เครื่องแกงแท้ กุ้งใหญ่",
        price: 150,
        rating: 4.9,
        reviews: 203,
        image: "🍲",
        isPopular: true,
        isSpicy: true
      },
      {
        id: 3,
        name: "ผัดไทยกุ้งสด",
        description: "ผัดไทยต้นตำรับ รสชาติหวานนำเค็มตาม กุ้งสดใหญ่",
        price: 130,
        rating: 4.7,
        reviews: 89,
        image: "🍝",
        isPopular: true,
        isSpicy: false
      },
      {
        id: 4,
        name: "แกงเขียวหวานไก่",
        description: "แกงเขียวหวานรสเข้มข้น ใส่มะเขือ ใบโหระพา",
        price: 140,
        rating: 4.6,
        reviews: 67,
        image: "🍛",
        isPopular: false,
        isSpicy: true
      }
    ],
    rice: [
      {
        id: 5,
        name: "ข้าวราดแกงเขียวหวาน",
        description: "แกงเขียวหวานรสจัด เครื่องแกงใหม่ทุกวัน",
        price: 85,
        rating: 4.5,
        reviews: 45,
        image: "🍛",
        isPopular: false,
        isSpicy: true
      },
      {
        id: 6,
        name: "ข้าวราดกะเพราหมูสับ",
        description: "กะเพราหมูสับใส่พริก ไข่ดาวใสๆ",
        price: 80,
        rating: 4.4,
        reviews: 78,
        image: "🍳",
        isPopular: false,
        isSpicy: true
      }
    ],
    noodles: [
      {
        id: 7,
        name: "ก๋วยเตี๋ยวต้มยำน้ำข้น",
        description: "ก๋วยเตี๋ยวเส้นเล็ก น้ำข้นรสจัด",
        price: 65,
        rating: 4.3,
        reviews: 134,
        image: "🍜",
        isPopular: false,
        isSpicy: true
      },
      {
        id: 8,
        name: "ผัดซีอิ๊วหมู",
        description: "เส้นใหญ่ผัดซีอิ๊ว หมูนุ่ม คะน้าสด",
        price: 75,
        rating: 4.2,
        reviews: 52,
        image: "🍝",
        isPopular: false,
        isSpicy: false
      }
    ],
    "stir-fry": [
      {
        id: 9,
        name: "ผัดพริกแกงหมู",
        description: "ผัดพริกแกงหมูใส่ถั่วฝักยาว ใบโหระพา",
        price: 90,
        rating: 4.4,
        reviews: 89,
        image: "🌶️",
        isPopular: false,
        isSpicy: true
      },
      {
        id: 10,
        name: "ผัดผักรวมน้ำมันหอย",
        description: "ผักรวม 6 ชนิด น้ำมันหอยหอมกรุ่น",
        price: 70,
        rating: 4.1,
        reviews: 33,
        image: "🥬",
        isPopular: false,
        isSpicy: false
      }
    ]
  };

  const handleOrderClick = () => {
    navigate('/auth');
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kanit">
            เมนู <span className="text-primary">แนะนำ</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-kanit">
            เมนูขายดีที่ลูกค้าทั่วไปและร้านแนะนำ อร่อยถูกปาก ราคาไม่แพง
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="font-kanit"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems[activeCategory as keyof typeof menuItems].map((item) => (
            <Card key={item.id} className="menu-item-card group overflow-hidden">
              <CardContent className="p-0">
                {/* Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-6xl">{item.image}</span>
                  {item.isPopular && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      🔥 ยอดนิยม
                    </Badge>
                  )}
                  {item.isSpicy && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                      🌶️ เผ็ด
                    </Badge>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4 mr-1" />
                      ดู
                    </Button>
                    <Button size="sm" variant="default" onClick={handleOrderClick}>
                      <Plus className="h-4 w-4 mr-1" />
                      เพิ่ม
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground font-kanit">
                      {item.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 font-kanit leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-primary font-kanit">
                        ฿{item.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({item.reviews} รีวิว)
                      </span>
                    </div>
                    <Button size="sm" variant="warm" onClick={handleOrderClick}>
                      สั่งเลย
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Menu Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="font-kanit" onClick={handleOrderClick}>
            ดูเมนูทั้งหมด ({Object.values(menuItems).flat().length}+ เมนู)
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreviewSection;
