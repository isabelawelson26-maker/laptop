import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import HeroSection from '../components/home/HeroSection.tsx';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import ProductCard from '../components/products/ProductCard';
import { useLocale } from '../context/LocaleContext';
import api from '../lib/api';
import type { Product, Category, Banner } from '../types';

interface HomeData {
  banners: Banner[];
  featuredProducts: Product[];
  categories: Category[];
  offerProducts: Product[];
  offersProducts: Product[];
}

export default function HomePage() {
  const { locale, isRTL } = useLocale();

  const { data, isLoading } = useQuery<HomeData>({
    queryKey: ['home'],
    queryFn: () => api.get<HomeData>('/home'),
  });

  return (
    <PageShell>
      <HeroSection banners={data?.banners} locale={locale} />

      {data?.categories && data.categories.length > 0 && (
        <section className="page-section">
          <h2 className="section-title mb-8">
            {locale === 'ar' ? 'تصفح الأقسام' : 'Browse Categories'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {data.categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/products?category=${cat.slug}`} className="flex flex-col items-center gap-3 p-4 sm:p-5 surface-card-hover group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                    {cat.image ? (
                      <img src={cat.image} alt={locale === 'ar' ? cat.nameAr : cat.nameEn} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-2xl">💻</span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {locale === 'ar' ? cat.nameAr : cat.nameEn}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {(data?.featuredProducts && data.featuredProducts.length > 0) || isLoading ? (
        <section className="page-section">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <h2 className="section-title">
              {locale === 'ar' ? 'منتجات مميزة' : 'Featured Products'}
            </h2>
            <Link href="/products?featured=true" className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline shrink-0">
              {locale === 'ar' ? 'عرض الكل' : 'View All'}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          {isLoading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {data!.featuredProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </section>
      ) : null}

      {(data?.offersProducts ?? data?.offerProducts ?? []).length > 0 && (
        <section className="page-section pb-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <h2 className="section-title flex items-center gap-3">
              <span className="w-10 h-10 bg-destructive rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-destructive-foreground" />
              </span>
              {locale === 'ar' ? 'عروض خاصة' : 'Special Offers'}
            </h2>
            <Link href="/products?offers=true" className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline shrink-0">
              {locale === 'ar' ? 'عرض الكل' : 'View All'}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          <div className="product-grid">
            {(data?.offersProducts ?? data?.offerProducts ?? []).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </PageShell>
  );
}
