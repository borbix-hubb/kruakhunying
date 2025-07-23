
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Edit, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
  room_number: string | null;
  building: string | null;
  address: string | null;
  created_at: string;
}

const MemberManagement = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลสมาชิกได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileId: string, updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "อัปเดตสำเร็จ",
        description: "ข้อมูลสมาชิกได้ถูกอัปเดตแล้ว"
      });

      fetchProfiles();
      setIsDialogOpen(false);
      setEditingProfile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลได้",
        variant: "destructive"
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProfile) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as string,
      room_number: formData.get('room_number') as string,
      building: formData.get('building') as string,
      address: formData.get('address') as string,
    };

    updateProfile(editingProfile.id, updates);
  };

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'staff':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleText = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'แอดมิน';
      case 'staff':
        return 'พนักงาน';
      default:
        return 'ลูกค้า';
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchTerm || 
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.phone?.includes(searchTerm) ||
      profile.room_number?.includes(searchTerm);
    
    const matchesRole = selectedRole === 'all' || profile.role === selectedRole || (selectedRole === 'customer' && !profile.role);
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h2 className="text-2xl font-bold font-kanit">จัดการสมาชิก</h2>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาด้วยชื่อ เบอร์โทร หรือเลขห้อง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="เลือกบทบาท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="admin">แอดมิน</SelectItem>
                <SelectItem value="staff">พนักงาน</SelectItem>
                <SelectItem value="customer">ลูกค้า</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-kanit">รายการสมาชิก ({filteredProfiles.length} คน)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-kanit">ชื่อ</TableHead>
                <TableHead className="font-kanit">เบอร์โทร</TableHead>
                <TableHead className="font-kanit">ที่อยู่</TableHead>
                <TableHead className="font-kanit">บทบาท</TableHead>
                <TableHead className="font-kanit">วันที่สมัคร</TableHead>
                <TableHead className="font-kanit">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-kanit">
                    {profile.full_name || 'ไม่ระบุชื่อ'}
                  </TableCell>
                  <TableCell className="font-kanit">
                    {profile.phone || '-'}
                  </TableCell>
                  <TableCell className="font-kanit">
                    <div className="text-sm">
                      {profile.room_number && profile.building && (
                        <div>ห้อง {profile.room_number} ตึก {profile.building}</div>
                      )}
                      {profile.address && (
                        <div className="text-muted-foreground">{profile.address}</div>
                      )}
                      {!profile.room_number && !profile.building && !profile.address && '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleColor(profile.role)} text-white font-kanit`}>
                      {getRoleText(profile.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-kanit">
                    {new Date(profile.created_at).toLocaleDateString('th-TH')}
                  </TableCell>
                  <TableCell>
                    <Dialog open={isDialogOpen && editingProfile?.id === profile.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProfile(profile)}
                          className="font-kanit"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          แก้ไข
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-kanit">แก้ไขข้อมูลสมาชิก</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="full_name" className="font-kanit">ชื่อ-นามสกุล</Label>
                            <Input
                              id="full_name"
                              name="full_name"
                              defaultValue={editingProfile?.full_name || ''}
                              className="font-kanit"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="font-kanit">เบอร์โทร</Label>
                            <Input
                              id="phone"
                              name="phone"
                              defaultValue={editingProfile?.phone || ''}
                              className="font-kanit"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="room_number" className="font-kanit">เลขห้อง</Label>
                              <Input
                                id="room_number"
                                name="room_number"
                                defaultValue={editingProfile?.room_number || ''}
                                className="font-kanit"
                              />
                            </div>
                            <div>
                              <Label htmlFor="building" className="font-kanit">ตึก</Label>
                              <Input
                                id="building"
                                name="building"
                                defaultValue={editingProfile?.building || ''}
                                className="font-kanit"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="address" className="font-kanit">ที่อยู่</Label>
                            <Input
                              id="address"
                              name="address"
                              defaultValue={editingProfile?.address || ''}
                              className="font-kanit"
                            />
                          </div>
                          <div>
                            <Label htmlFor="role" className="font-kanit">บทบาท</Label>
                            <Select name="role" defaultValue={editingProfile?.role || 'customer'}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="customer">ลูกค้า</SelectItem>
                                <SelectItem value="staff">พนักงาน</SelectItem>
                                <SelectItem value="admin">แอดมิน</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" className="flex-1 font-kanit">
                              บันทึก
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredProfiles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-kanit">ไม่พบข้อมูลสมาชิกที่ค้นหา</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberManagement;
