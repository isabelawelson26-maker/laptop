import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Laptop, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocale } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import PhoneInput from '../../components/PhoneInput';

export default function RegisterPage() {
  const { locale } = useLocale();
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);

  const registerMutation = useMutation({
    mutationFn: () => api.post<{ token: string; user: any }>('/auth/register', { name, phone, password, confirmPassword, lang: locale }),
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success(locale === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
      navigate('/');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950 p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow-lg">
            <Laptop className="w-7 h-7 text-white" />
          </Link>
          <h1 className="text-2xl font-black text-foreground">{locale === 'ar' ? 'إنشاء حساب' : 'Create Account'}</h1>
        </div>

        <form onSubmit={e => { e.preventDefault(); registerMutation.mutate(); }} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
            <PhoneInput value={phone} onChange={setPhone} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{locale === 'ar' ? 'كلمة المرور' : 'Password'}</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 pe-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-3 end-3 text-muted-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button type="submit" disabled={registerMutation.isPending}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60">
            {registerMutation.isPending ? (locale === 'ar' ? 'جاري الإنشاء...' : 'Creating...') : (locale === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {locale === 'ar' ? 'لديك حساب؟ ' : 'Have an account? '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}
