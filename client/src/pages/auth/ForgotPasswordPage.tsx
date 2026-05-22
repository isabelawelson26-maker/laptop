import { useState } from 'react';
import { Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Loader2, MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocale } from '../../context/LocaleContext';
import api from '../../lib/api';
import AuthLayout from '../../components/layout/AuthLayout';
import { btnPrimary, inputClass, labelClass } from '../../lib/ui';
import { cn } from '../../lib/utils';

export default function ForgotPasswordPage() {
  const { locale } = useLocale();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => api.post('/auth/forgot-password', { email, lang: locale }),
    onSuccess: () => { setSent(true); toast.success(locale === 'ar' ? 'تم إرسال رابط الاسترداد' : 'Reset link sent'); },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <AuthLayout
      title={locale === 'ar' ? 'نسيت كلمة المرور' : 'Forgot password'}
      subtitle={locale === 'ar' ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.' : "Enter your email and we'll send you a reset link."}
      footer={
        <p className="text-center text-sm">
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            {locale === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to sign in'}
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="empty-state py-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <MailCheck className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            {locale === 'ar' ? 'تم إرسال رابط الاسترداد إلى بريدك الإلكتروني إن كان مسجلاً.' : 'If your email is registered, a reset link has been sent.'}
          </p>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-5">
          <div>
            <label className={labelClass}>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={mutation.isPending} className={cn(btnPrimary, 'w-full btn-lg')}>
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
              </>
            ) : (
              locale === 'ar' ? 'إرسال رابط الاسترداد' : 'Send reset link'
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
