import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface MenuItemOption {
  id: string;
  name: string;
  price?: number;
}

interface MenuItem {
  id: string;
  name: string;
  name_en: string;
  description: string;
  price: number;
  rating: number;
  review_count: number;
  is_popular: boolean;
  is_spicy: boolean;
  is_available: boolean;
  image_url: string | null;
  meat_types: string[] | null;
}

interface MenuItemOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onAddToCart: (item: MenuItem, options: { meat?: string; special?: boolean; totalPrice: number }) => void;
}

const MenuItemOptionsModal = ({ isOpen, onClose, item, onAddToCart }: MenuItemOptionsModalProps) => {
  const [selectedMeat, setSelectedMeat] = useState<string>('');
  const [isSpecial, setIsSpecial] = useState(false);

  if (!item) return null;

  // Check if item has meat options
  const hasMeatOptions = item.meat_types && item.meat_types.length > 0;
  
  // Set default meat type when item changes
  if (hasMeatOptions && !selectedMeat && item.meat_types) {
    setSelectedMeat(item.meat_types[0]);
  }
  
  // For dishes that typically have seafood options
  const seafoodDishes = ['ผัดไทย', 'ราดหน้า', 'ข้าวผัด'];
  const canHaveSeafood = seafoodDishes.some(dish => item.name.includes(dish));

  const meatOptions: MenuItemOption[] = hasMeatOptions && item.meat_types
    ? item.meat_types.map(meat => ({
        id: meat,
        name: meat
      }))
    : [];

  const calculateTotalPrice = () => {
    let total = item.price;
    if (isSpecial) total += 10;
    return total;
  };

  const handleAddToCart = () => {
    onAddToCart(item, {
      meat: hasMeatOptions ? selectedMeat : undefined,
      special: isSpecial,
      totalPrice: calculateTotalPrice(),
    });
    // Reset state
    setSelectedMeat(item.meat_types && item.meat_types.length > 0 ? item.meat_types[0] : '');
    setIsSpecial(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-kanit text-xl">
            {item.name}
          </DialogTitle>
          {item.image_url && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
              <img 
                src={item.image_url} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground font-kanit">
            {item.description}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Meat Selection */}
          {hasMeatOptions && (
            <div className="space-y-3">
              <h3 className="font-kanit font-semibold">เลือกเนื้อสัตว์</h3>
              <RadioGroup
                value={selectedMeat}
                onValueChange={setSelectedMeat}
              >
                {meatOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="font-kanit cursor-pointer flex-1"
                    >
                      {option.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Special Options */}
          <div className="space-y-3">
            <h3 className="font-kanit font-semibold">ตัวเลือกพิเศษ</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="special"
                checked={isSpecial}
                onCheckedChange={(checked) => setIsSpecial(checked as boolean)}
              />
              <Label
                htmlFor="special"
                className="font-kanit cursor-pointer flex-1"
              >
                พิเศษ (เพิ่มปริมาณ)
              </Label>
              <Badge variant="secondary" className="font-kanit">
                +10 บาท
              </Badge>
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-kanit text-muted-foreground">ราคาปกติ</span>
              <span className="font-kanit">฿{item.price}</span>
            </div>
            {isSpecial && (
              <div className="flex items-center justify-between mt-2">
                <span className="font-kanit text-muted-foreground">พิเศษ</span>
                <span className="font-kanit">+฿10</span>
              </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <span className="font-kanit font-semibold">ราคารวม</span>
              <span className="font-kanit font-semibold text-lg text-primary">
                ฿{calculateTotalPrice()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="font-kanit"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleAddToCart}
            className="font-kanit"
          >
            เพิ่มลงตะกร้า
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemOptionsModal;