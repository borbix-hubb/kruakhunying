import { Phone, MapPin, Clock, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BaseLayout from "@/components/layout/BaseLayout";

const Contact = () => {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-kanit text-center mb-8">ติดต่อเรา</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-kanit text-xl">ข้อมูลติดต่อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-kanit font-semibold">โทรศัพท์</p>
                  <p className="text-muted-foreground">094-762-1932</p>
                  <p className="text-sm text-muted-foreground">สำหรับสั่งอาหาร</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-kanit font-semibold">ที่อยู่</p>
                  <p className="text-muted-foreground">Wealth Condo</p>
                  <p className="text-sm text-muted-foreground">ลาดพร้าว 87 แยก 1 (แยกวินมอไซค์)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-kanit font-semibold">เวลาทำการ</p>
                  <p className="text-muted-foreground">อังคาร - อาทิตย์: 9:00 - 22:00</p>
                  <p className="text-sm text-muted-foreground">ออเดอร์สุดท้าย: 21:30</p>
                  <p className="text-sm text-red-500">วันจันทร์: ปิด</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map or Image Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-kanit text-xl">แผนที่</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-4 font-kanit">
                ใกล้กับ: แยกวินมอไซค์ ลาดพร้าว 87
              </p>
            </CardContent>
          </Card>
        </div>


        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground font-kanit mb-4">
            หากมีข้อสงสัยหรือต้องการสั่งอาหาร สามารถติดต่อเราได้ทุกช่องทาง
          </p>
          <a href="tel:094-762-1932">
            <Button 
              size="lg" 
              className="font-kanit"
            >
              <Phone className="h-5 w-5 mr-2" />
              โทรสั่งอาหารเลย
            </Button>
          </a>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Contact;