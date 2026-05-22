import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { User, Save, Loader2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import PageShell from '../components/layout/PageShell';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'wouter';
import api from '../lib/api';
import { btnPrimary, inputClass, labelClass } from '../lib/ui';
import { cn } from '../lib/utils';

export default function ProfilePage() {
  const { locale } = useLocale();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [, navigate] = useLocation();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get<{ user: any }>('/auth/me'),
    enabled: isAuthenticated,
    onSuccess: (d: any) => {
      setName(d.user.name || '');
      setPhone(d.user.phone || '');
      setAddress(d.user.address || '');
    },
  } as any);

  useEffect(() => {
    if (data) {
      const u = (data as any).user;
      setName(u.name || '');
      setPhone(u.phone || '');
      setAddress(u.address || '');
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => api.put('/auth/profile', { name, phone, address }),
    onSuccess: () => {
      toast.success(locale === 'ar' ? 'تم تحديث الملف الشخصي' : 'Profile updated');
      updateUser({ name });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!isAuthenticated) {
    return (
      <PageShell>
        <div className="empty-state min-h-[50vh]">
          <p className="text-muted-foreground mb-6">{locale === 'ar' ? 'سجّل الدخول لعرض ملفك الشخصي' : 'Sign in to view your profile'}</p>
          <Link href="/auth/login" className={cn(btnPrimary, 'btn-md')}>
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="page-section">
        <div className="max-w-xl mx-auto">
          <h1 className="section-title text-2xl sm:text-3xl mb-8 flex items-center gap-3">
            <User className="w-7 h-7 text-primary shrink-0" />
            {locale === 'ar' ? 'الملف الشخصي' : 'My profile'}
          </h1>

          <div className="surface-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <div className="w-16 h-16 sm:w-18 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-primary">{(name || user?.email || 'U')[0].toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{name || (locale === 'ar' ? 'المستخدم' : 'User')}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                <span className={cn(
                  'badge-pill mt-2',
                  user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  {user?.role === 'SUPER_ADMIN' ? (locale === 'ar' ? 'مدير عام' : 'Super Admin') : user?.role === 'ADMIN' ? (locale === 'ar' ? 'مدير' : 'Admin') : (locale === 'ar' ? 'عميل' : 'Customer')}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>{locale === 'ar' ? 'الاسم الكامل' : 'Full name'}</label>
                <input value={name} onChange={e => setName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{locale === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{locale === 'ar' ? 'العنوان' : 'Address'}</label>
                <input value={address} onChange={e => setAddress(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                <input value={user?.email || ''} disabled className={cn(inputClass, 'opacity-70 cursor-not-allowed')} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={() => mutation.mutate()} disabled={mutation.isPending}
                className={cn(btnPrimary, 'flex-1 btn-md')}>
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {locale === 'ar' ? 'حفظ التغييرات' : 'Save changes'}
              </button>
              <button onClick={() => { logout(); navigate('/'); }}
                className="btn btn-md border border-destructive/30 text-destructive hover:bg-destructive/10 px-5">
                <LogOut className="w-4 h-4" />
                {locale === 'ar' ? 'خروج' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
