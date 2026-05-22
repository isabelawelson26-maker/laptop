import { Link } from 'wouter';
import { Home, Search } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import { useLocale } from '../context/LocaleContext';
import { btnPrimary, btnSecondary } from '../lib/ui';
import { cn } from '../lib/utils';

export default function NotFound() {
  const { locale } = useLocale();
  return (
    <PageShell>
      <div className="page-section">
        <div className="empty-state max-w-md mx-auto">
          <p className="text-[7rem] sm:text-[8rem] font-black leading-none text-primary/15 select-none">404</p>
          <h1 className="section-title text-xl sm:text-2xl -mt-4">
            {locale === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'}
          </h1>
          <p className="section-subtitle mx-auto mt-3">
            {locale === 'ar' ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.' : 'Sorry, the page you are looking for does not exist or has been moved.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full sm:w-auto">
            <Link href="/" className={cn(btnPrimary, 'btn-md w-full sm:w-auto')}>
              <Home className="w-4 h-4" />
              {locale === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
            </Link>
            <Link href="/products" className={cn(btnSecondary, 'btn-md w-full sm:w-auto')}>
              <Search className="w-4 h-4" />
              {locale === 'ar' ? 'تصفح المنتجات' : 'Browse products'}
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
