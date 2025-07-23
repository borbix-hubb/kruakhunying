
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import BaseLayout from '@/components/layout/BaseLayout';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/menu" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowEmailConfirmation(false);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, fullName);
      }

      if (result.error) {
        console.error('Auth error:', result.error);
        
        // Handle specific error cases
        if (result.error.message === 'Email not confirmed') {
          setShowEmailConfirmation(true);
          toast({
            title: "กรุณายืนยันอีเมล",
            description: "คุณต้องยืนยันอีเมลก่อนเข้าสู่ระบบ กรุณาตรวจสอบกล่องจดหมาย",
            variant: "destructive"
          });
        } else if (result.error.message.includes('rate limit')) {
          toast({
            title: "ส่งอีเมลบ่อยเกินไป",
            description: "กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
            variant: "destructive"
          });
        } else if (result.error.message === 'Invalid login credentials') {
          toast({
            title: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง",
            description: "กรุณาตรวจสอบอีเมลและรหัสผ่าน",
            variant: "destructive"
          });
        } else {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: result.error.message || "กรุณาลองใหม่อีกครั้ง",
            variant: "destructive"
          });
        }
      } else if (!isLogin) {
        setShowEmailConfirmation(true);
        toast({
          title: "สมัครสมาชิกสำเร็จ",
          description: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีก่อนเข้าสู่ระบบ",
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "เกิดข้อผิดพลาดที่ไม่คาดคิด",
        description: "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Button variant="ghost" asChild className="p-0 h-auto font-normal">
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับหน้าแรก
              </Link>
            </Button>
          </div>

          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary font-kanit">
                {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </CardTitle>
              <CardDescription className="font-kanit">
                {isLogin ? 'เข้าสู่ระบบเพื่อสั่งอาหาร' : 'สมัครสมาชิกเพื่อเริ่มใช้งาน'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {showEmailConfirmation && (
                <Alert className="mb-4 border-blue-200 bg-blue-50">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="font-kanit text-blue-800">
                    เราได้ส่งลิงก์ยืนยันไปยัง <strong>{email}</strong> แล้ว 
                    กรุณาตรวจสอบกล่องจดหมายและคลิกลิงก์เพื่อยืนยันก่อนเข้าสู่ระบบ
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-kanit">ชื่อ-นามสกุล</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                      required={!isLogin}
                      className="font-kanit"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-kanit">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="กรุณากรอกอีเมล"
                    required
                    className="font-kanit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-kanit">รหัสผ่าน</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรุณากรอกรหัสผ่าน"
                    required
                    className="font-kanit"
                    minLength={6}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full font-kanit" 
                  disabled={loading}
                >
                  {loading ? 'กำลังดำเนินการ...' : (isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setShowEmailConfirmation(false);
                  }}
                  className="text-primary hover:underline font-kanit text-sm"
                >
                  {isLogin ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
                </button>
              </div>

              {isLogin && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800 font-kanit">
                      <p className="font-medium mb-1">หากคุณเพิ่งสมัครสมาชิก:</p>
                      <p>กรุณาตรวจสอบอีเมลและคลิกลิงก์ยืนยันก่อนเข้าสู่ระบบ</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Auth;
