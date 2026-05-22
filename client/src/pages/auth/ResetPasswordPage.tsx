import { useState } from 'react';
import { Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocale } from '../../context/LocaleContext';
import api from '../../lib/api';
import AuthLayout from '../../components/layout/AuthLayout';
import { btnPrimary, inputClass, labelClass } from '../../lib/ui';
import { cn } from '../../lib/utils';

export default function ResetPasswordPage() {
  const { locale } = useLocale();
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: () => api.post('/auth/reset-password', { token, password }),
    onSuccess: () => { setDone(true); toast.success(locale === 'ar' ? 'تم تغيير كلمة المرور' : 'Password changed'); },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error(locale === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'); return; }
    if (password.length < 6) { toast.error(locale === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters'); return; }
    mutation.mutate();
  };

  return (
    <AuthLayout
      title={locale === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Set new password'}
      subtitle={locale === 'ar' ? 'اختر كلمة مرور قوية لحسابك.' : 'Choose a strong password for your account.'}
    >
      {done ? (
        <div className="empty-state py-6">
          <CheckCircle className="w-14 h-14 text-emerald-500 mb-4" />
          <p className="font-semibold text-foreground mb-6">{locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully'}</p>
          <Link href="/auth/login" className={cn(btnPrimary, 'w-full btn-lg')}>
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>{locale === 'ar' ? 'كلمة المرور الجديدة' : 'New password'}</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={cn(inputClass, 'pe-11')}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>{locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm password'}</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className={inputClass} />
          </div>
          <button type="submit" disabled={mutation.isPending} className={cn(btnPrimary, 'w-full btn-lg')}>
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {locale === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              locale === 'ar' ? 'حفظ كلمة المرور' : 'Save password'
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
