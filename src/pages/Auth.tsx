import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, CheckCircle2, XCircle, Sprout } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    district: '',
    taluka: '',
    language: 'mr' as 'en' | 'mr',
  });

  const { login, register, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const passwordStrengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: t('common.error'),
          description: 'Passwords do not match',
          variant: 'destructive',
        });
        return;
      }

      if (formData.mobile.length !== 10) {
        toast({
          title: t('common.error'),
          description: 'Please enter a valid 10-digit mobile number',
          variant: 'destructive',
        });
        return;
      }

      const success = await register({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        district: formData.district,
        taluka: formData.taluka,
        language: formData.language,
      });

      if (success) {
        toast({
          title: t('common.success'),
          description: t('auth.registerSuccess'),
        });
        navigate('/dashboard');
      } else {
        toast({
          title: t('common.error'),
          description: t('auth.registerError'),
          variant: 'destructive',
        });
      }
    } else {
      const success = await login(formData.mobile, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        toast({
          title: t('common.error'),
          description: t('auth.loginError'),
          variant: 'destructive',
        });
      }
    }
  };

  const districts = [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana',
    'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
    'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
    'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad',
    'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha',
    'Washim', 'Yavatmal'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-background via-accent/5 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 shadow-2xl">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <Sprout className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-bold">
              {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
            </CardTitle>
            <CardDescription className="text-center text-base">
              {t('auth.welcome')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="mobile">{t('auth.mobile')}</Label>
                <Input
                  id="mobile"
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">{t('auth.district')}</Label>
                    <Select
                      required
                      value={formData.district}
                      onValueChange={(value) => setFormData({ ...formData, district: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taluka">{t('auth.taluka')}</Label>
                    <Input
                      id="taluka"
                      required
                      value={formData.taluka}
                      onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">{t('auth.preferredLanguage')}</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value: 'en' | 'mr') => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mr">मराठी</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {!isLogin && formData.password && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password Strength</span>
                      <span className={`font-medium ${
                        passwordStrength >= 3 ? 'text-green-500' :
                        passwordStrength >= 2 ? 'text-yellow-500' :
                        passwordStrength >= 1 ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {passwordStrengthLabels[passwordStrength] || 'Weak'}
                      </span>
                    </div>
                    <Progress 
                      value={(passwordStrength + 1) * 25} 
                      className="h-2"
                    />
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {formData.password.length >= 8 ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.password.match(/[a-z]/) && formData.password.match(/[A-Z]/) ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span>Uppercase and lowercase letters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.password.match(/\d/) ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span>At least one number</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {formData.confirmPassword && (
                    <div className="flex items-center gap-2 text-xs">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-500">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full text-lg py-6 shadow-lg">
                  {isLogin ? t('common.login') : t('common.register')}
                </Button>
              </motion.div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:underline"
                >
                  {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
