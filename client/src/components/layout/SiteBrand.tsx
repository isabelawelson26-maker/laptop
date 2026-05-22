import { Laptop } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { cn } from '../../lib/utils';

type BrandSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<BrandSize, { box: string; icon: string }> = {
  sm: { box: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { box: 'w-9 h-9', icon: 'w-5 h-5' },
  lg: { box: 'w-10 h-10', icon: 'w-6 h-6' },
};

interface SiteBrandProps {
  size?: BrandSize;
  showName?: boolean;
  nameClassName?: string;
  /** White text for dark backgrounds (e.g. auth panel) */
  inverted?: boolean;
}

export default function SiteBrand({ size = 'md', showName = true, nameClassName, inverted }: SiteBrandProps) {
  const { siteName, siteLogo } = useSiteSettings();
  const s = sizeMap[size];

  return (
    <>
      <div
        className={cn(
          s.box,
          'bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0'
        )}
      >
        {siteLogo ? (
          <img src={siteLogo} alt={siteName || 'logo'} className="w-full h-full object-contain" />
        ) : (
          <Laptop className={cn(s.icon, 'text-white')} />
        )}
      </div>
      {showName && siteName ? (
        <span
          className={cn(
            inverted ? 'font-bold text-white' : 'font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent',
            nameClassName
          )}
        >
          {siteName}
        </span>
      ) : null}
    </>
  );
}
