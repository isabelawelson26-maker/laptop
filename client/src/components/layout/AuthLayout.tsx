import { type ReactNode } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Shield, Truck, Headphones, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import SiteBrand from './SiteBrand';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

export default function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  const { locale, isRTL } = useLocale();

  const perks = [
    { icon: Shield, ar: 'تسوق آمن وموثوق', en: 'Secure & trusted shopping' },
    { icon: Truck, ar: 'شحن سريع لجميع المناطق', en: 'Fast delivery nationwide' },
    { icon: Headphones, ar: 'دعم عملاء على مدار الساعة', en: '24/7 customer support' },
  ];

  return (
    <div className="min-h-screen auth-shell">
      <div className="auth-grid min-h-screen">
        <aside className="auth-panel hidden lg:flex flex-col justify-between p-10 xl:p-14">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-white/95 hover:text-white transition-colors">
              <SiteBrand size="lg" inverted nameClassName="text-xl" />
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-16 max-w-md"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-4">
                {locale === 'ar' ? 'منصة تسوق احترافية' : 'Premium shopping platform'}
              </p>
              <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight">
                {locale === 'ar'
                  ? 'تجربة شراء لابتوبات بمعايير عالمية'
                  : 'World-class laptop shopping experience'}
              </h2>
              <p className="mt-4 text-white/75 text-base leading-relaxed">
                {locale === 'ar'
                  ? 'سجّل دخولك أو أنشئ حساباً جديداً للوصول إلى العروض، الطلبات، والمحفظة.'
                  : 'Sign in or create an account to access offers, orders, and your wallet.'}
              </p>
            </motion.div>
          </div>
          <ul className="space-y-4">
            {perks.map(({ icon: Icon, ar, en }, i) => (
              <motion.li
                key={en}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-4 text-white/90"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-medium">{locale === 'ar' ? ar : en}</span>
              </motion.li>
            ))}
          </ul>
        </aside>

        <main className="auth-form-side flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-[440px] mx-auto">
            <Link
              href="/"
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 lg:hidden',
              )}
            >
              {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {locale === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="auth-card"
            >
              <div className="mb-8">
                <div className="lg:hidden mb-6">
                  <SiteBrand size="md" nameClassName="text-lg font-bold" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{title}</h1>
                {subtitle && (
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">{subtitle}</p>
                )}
              </div>
              {children}
              {footer && <div className="mt-8 pt-6 border-t border-border">{footer}</div>}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
