
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ChefHat, Plus, Edit, Trash2, Eye, EyeOff, ToggleRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_spicy: boolean;
  category_id: string | null;
  meat_types: string[] | null;
  created_at: string;
  menu_categories?: {
    name: string;
  } | null;
}

interface MenuCategory {
  id: string;
  name: string;
  name_en: string | null;
  icon: string | null;
  is_active: boolean;
}


const MenuManagement = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategoryInForm, setSelectedCategoryInForm] = useState<string>('');
  const [selectedMeatTypes, setSelectedMeatTypes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');

  useEffect(() => {
    fetchData();
    checkAuth();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setSelectedMeatTypes(editingItem.meat_types || []);
      setSelectedCategoryInForm(editingItem.category_id || '');
    }
  }, [editingItem]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      toast({
        title: "ไม่ได้เข้าสู่ระบบ",
        description: "กรุณาเข้าสู่ระบบก่อนจัดการเมนู",
        variant: "destructive"
      });
    }
  };

  const fetchData = async () => {
    try {
      // Fetch menu items with categories and subcategories
      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (categoriesError) throw categoriesError;


      setMenuItems(itemsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลเมนูได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "ไฟล์ใหญ่เกินไป",
        description: "กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 10MB",
        variant: "destructive"
      });
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Convert image to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      toast({
        title: "เกิดข้อผิดพลาดในการประมวลผลรูปภาพ",
        description: "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
      return null;
    }
  };

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !currentStatus })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "อัปเดตสำเร็จ",
        description: `สถานะของเมนูได้ถูกเปลี่ยนเป็น ${!currentStatus ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}`
      });

      fetchData();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive"
      });
    }
  };

  const toggleAllAvailability = async (makeAvailable: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: makeAvailable })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all items

      if (error) throw error;

      toast({
        title: "อัปเดตสำเร็จ",
        description: `${makeAvailable ? 'เปิด' : 'ปิด'}การขายเมนูทั้งหมดแล้ว`
      });

      fetchData();
    } catch (error) {
      console.error('Error toggling all availability:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive"
      });
    }
  };

  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadingImage(true);
    
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = editingItem?.image_url || null;
    
    // Upload new image if selected
    if (imageFile) {
      console.log('Uploading image:', imageFile.name);
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        console.log('Image uploaded successfully:', uploadedUrl);
        imageUrl = uploadedUrl;
      } else {
        console.error('Failed to upload image');
      }
    }
    
    const itemData = {
      name: formData.get('name') as string,
      name_en: formData.get('name_en') as string || null,
      description: formData.get('description') as string || null,
      price: parseFloat(formData.get('price') as string),
      image_url: imageUrl,
      category_id: formData.get('category_id') === 'none' ? null : formData.get('category_id') as string || null,
      meat_types: selectedMeatTypes.length > 0 ? selectedMeatTypes : null,
      is_popular: formData.get('is_popular') === 'on',
      is_spicy: formData.get('is_spicy') === 'on',
      is_available: formData.get('is_available') === 'on',
    };

    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;

        toast({
          title: "อัปเดตสำเร็จ",
          description: "เมนูได้ถูกอัปเดตแล้ว"
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('menu_items')
          .insert([itemData]);

        if (error) throw error;

        toast({
          title: "เพิ่มสำเร็จ",
          description: "เมนูใหม่ได้ถูกเพิ่มแล้ว"
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setSelectedMeatTypes([]);
      setImageFile(null);
      setImagePreview(null);
      fetchData();
    } catch (error: any) {
      console.error('Error saving menu item:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถบันทึกเมนูได้",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบเมนูนี้?')) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "ลบสำเร็จ",
        description: "เมนูได้ถูกลบแล้ว"
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบเมนูได้",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredAndSortedItems = menuItems
    .filter(item => filterCategory === 'all' || item.category_id === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'popular':
          return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0);
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-6 w-6" />
          <h2 className="text-2xl font-bold font-kanit">จัดการเมนู</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="font-kanit"
            onClick={() => toggleAllAvailability(false)}
          >
            <EyeOff className="h-4 w-4 mr-2" />
            ปิดขายทั้งหมด
          </Button>
          
          <Button 
            variant="outline" 
            className="font-kanit"
            onClick={() => toggleAllAvailability(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            เปิดขายทั้งหมด
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-kanit" onClick={() => {
              setEditingItem(null);
              setSelectedCategoryInForm('');
              setSelectedMeatTypes([]);
              setImageFile(null);
              setImagePreview(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มเมนูใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-kanit">
                {editingItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-kanit">ชื่อเมนู (ไทย) *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingItem?.name || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_en" className="font-kanit">ชื่อเมนู (English)</Label>
                  <Input
                    id="name_en"
                    name="name_en"
                    defaultValue={editingItem?.name_en || ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-kanit">รายละเอียด</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description || ''}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="font-kanit">ราคา (บาท) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem?.price || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category_id" className="font-kanit">หมวดหมู่</Label>
                  <Select 
                    name="category_id" 
                    defaultValue={editingItem?.category_id || ''}
                    onValueChange={(value) => setSelectedCategoryInForm(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">ไม่ระบุ</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>


              {/* Meat Type Selection */}
              <div className="space-y-2">
                <Label className="font-kanit">ประเภทเนื้อสัตว์</Label>
                <div className="grid grid-cols-2 gap-4">
                  {['ไก่', 'หมู', 'หมูกรอบ', 'หมูสับ', 'เนื้อ', 'กุ้ง', 'ทะเล', 'รวมมิตร'].map((meatType) => (
                    <div key={meatType} className="flex items-center space-x-2">
                      <Checkbox
                        id={meatType}
                        checked={selectedMeatTypes.includes(meatType)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedMeatTypes([...selectedMeatTypes, meatType]);
                          } else {
                            setSelectedMeatTypes(selectedMeatTypes.filter(t => t !== meatType));
                          }
                        }}
                      />
                      <Label htmlFor={meatType} className="font-kanit cursor-pointer">
                        {meatType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="font-kanit">รูปภาพ</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageSelect(file);
                    }
                  }}
                />
                {/* Show new image preview */}
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground font-kanit">รูปภาพที่เลือก:</p>
                    <img 
                      src={imagePreview} 
                      alt="Selected image" 
                      className="w-32 h-32 object-cover rounded mt-1 border"
                    />
                  </div>
                )}
                {/* Show current image if editing and no new image selected */}
                {editingItem?.image_url && !imageFile && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground font-kanit">รูปภาพปัจจุบัน:</p>
                    <img 
                      src={editingItem.image_url} 
                      alt="Current image" 
                      className="w-32 h-32 object-cover rounded mt-1 border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_available"
                    name="is_available"
                    defaultChecked={editingItem?.is_available ?? true}
                  />
                  <Label htmlFor="is_available" className="font-kanit">พร้อมขาย</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_popular"
                    name="is_popular"
                    defaultChecked={editingItem?.is_popular ?? false}
                  />
                  <Label htmlFor="is_popular" className="font-kanit">เมนูยอดนิยม</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_spicy"
                    name="is_spicy"
                    defaultChecked={editingItem?.is_spicy ?? false}
                  />
                  <Label htmlFor="is_spicy" className="font-kanit">เมนูเผ็ด</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1 font-kanit"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'กำลังอัพโหลด...' : (editingItem ? 'อัปเดต' : 'เพิ่มเมนู')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="font-kanit"
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Sort Options */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label className="font-kanit mb-2 block">กรองตามหมวดหมู่</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="font-kanit mb-2 block">เรียงตาม</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกการเรียง" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">วันที่เพิ่มล่าสุด</SelectItem>
                  <SelectItem value="name">ชื่อเมนู (ก-ฮ)</SelectItem>
                  <SelectItem value="price_asc">ราคา (น้อย-มาก)</SelectItem>
                  <SelectItem value="price_desc">ราคา (มาก-น้อย)</SelectItem>
                  <SelectItem value="popular">ยอดนิยม</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-kanit">รายการเมนู ({filteredAndSortedItems.length} รายการ)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-kanit">ชื่อเมนู</TableHead>
                <TableHead className="font-kanit">หมวดหมู่</TableHead>
                <TableHead className="font-kanit">ราคา</TableHead>
                <TableHead className="font-kanit">สถานะ</TableHead>
                <TableHead className="font-kanit">คุณสมบัติ</TableHead>
                <TableHead className="font-kanit">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold font-kanit">{item.name}</div>
                      {item.name_en && (
                        <div className="text-sm text-muted-foreground">{item.name_en}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-kanit">
                    {item.menu_categories?.name || 'ไม่ระบุ'}
                    {item.meat_types && item.meat_types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.meat_types.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-kanit">
                    ฿{item.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.is_available}
                        onCheckedChange={() => toggleAvailability(item.id, item.is_available)}
                      />
                      <Badge
                        variant={item.is_available ? "default" : "secondary"}
                        className="font-kanit"
                      >
                        {item.is_available ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {item.is_popular && (
                        <Badge variant="outline" className="text-xs font-kanit">ยอดนิยม</Badge>
                      )}
                      {item.is_spicy && (
                        <Badge variant="outline" className="text-xs font-kanit">เผ็ด</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item);
                          setSelectedCategoryInForm(item.category_id || '');
                          setSelectedMeatTypes(item.meat_types || []);
                          setImageFile(null);
                          setImagePreview(null);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-kanit">ยังไม่มีเมนูในระบบ</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuManagement;
