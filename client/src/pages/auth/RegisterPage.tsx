import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocale } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import PhoneInput from '../../components/PhoneInput';
import AuthLayout from '../../components/layout/AuthLayout';
import { btnPrimary, inputClass, labelClass } from '../../lib/ui';
import { cn } from '../../lib/utils';

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
    <AuthLayout
      title={locale === 'ar' ? 'إنشاء حساب' : 'Create account'}
      subtitle={locale === 'ar' ? 'انضم إلينا في دقائق — بدون خطوات تحقق إضافية.' : 'Join in minutes — no extra verification steps.'}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          {locale === 'ar' ? 'لديك حساب؟ ' : 'Already have an account? '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
          </Link>
        </p>
      }
    >
      <form onSubmit={e => { e.preventDefault(); registerMutation.mutate(); }} className="space-y-5">
        <div>
          <label className={labelClass}>{locale === 'ar' ? 'الاسم الكامل' : 'Full name'}</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoComplete="name"
            className={inputClass}
            placeholder={locale === 'ar' ? 'أحمد محمد' : 'John Doe'}
          />
        </div>
        <div>
          <label className={labelClass}>{locale === 'ar' ? 'رقم الهاتف' : 'Phone number'}</label>
          <PhoneInput value={phone} onChange={setPhone} required />
        </div>
        <div>
          <label className={labelClass}>{locale === 'ar' ? 'كلمة المرور' : 'Password'}</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={cn(inputClass, 'pe-11')}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute top-1/2 -translate-y-1/2 end-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className={labelClass}>{locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm password'}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={registerMutation.isPending} className={cn(btnPrimary, 'w-full btn-lg')}>
          {registerMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {locale === 'ar' ? 'جاري الإنشاء...' : 'Creating account...'}
            </>
          ) : (
            locale === 'ar' ? 'إنشاء الحساب' : 'Create account'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
