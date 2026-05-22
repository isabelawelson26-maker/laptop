import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import api from '../../lib/api';
import PhoneInput from '../../components/PhoneInput';
import AuthLayout from '../../components/layout/AuthLayout';
import { btnPrimary, inputClass, labelClass } from '../../lib/ui';
import { cn } from '../../lib/utils';

export default function LoginPage() {
  const { locale } = useLocale();
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const mutation = useMutation({
    mutationFn: () => api.post<{ token: string; user: any }>('/auth/login', { phone, password, lang: locale }),
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success(locale === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
      navigate('/');
    },
    onError: (err: Error) => toast.error(err.message || (locale === 'ar' ? 'بيانات غير صحيحة' : 'Invalid credentials')),
  });

  return (
    <AuthLayout
      title={locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
      subtitle={locale === 'ar' ? 'أهلاً بعودتك! أدخل رقم هاتفك وكلمة المرور للمتابعة.' : 'Welcome back. Enter your phone and password to continue.'}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          {locale === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
          <Link href="/auth/register" className="text-primary font-semibold hover:underline">
            {locale === 'ar' ? 'إنشاء حساب' : 'Create account'}
          </Link>
        </p>
      }
    >
      <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-5">
        <div>
          <label className={labelClass}>{locale === 'ar' ? 'رقم الهاتف' : 'Phone number'}</label>
          <PhoneInput value={phone} onChange={setPhone} required />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={cn(labelClass, 'mb-0')}>{locale === 'ar' ? 'كلمة المرور' : 'Password'}</label>
            <Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">
              {locale === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={cn(inputClass, 'pe-11')}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute top-1/2 -translate-y-1/2 end-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={mutation.isPending} className={cn(btnPrimary, 'w-full btn-lg')}>
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {locale === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...'}
            </>
          ) : (
            locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
