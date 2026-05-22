import { type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { cn } from '../../lib/utils';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  mainClassName?: string;
  noFooter?: boolean;
}

export default function PageShell({ children, className, mainClassName, noFooter }: PageShellProps) {
  return (
    <div className={cn('min-h-screen flex flex-col bg-background', className)}>
      <Navbar />
      <main className={cn('page-main flex-1', mainClassName)}>{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}
