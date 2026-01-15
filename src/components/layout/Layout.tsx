import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Language } from '@/lib/i18n';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

interface LayoutProps {
  children: ReactNode;
  lang: Language;
}

export const Layout = ({ children, lang }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-[100vw] overflow-x-hidden">
      <Header lang={lang} />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">{children}</main>
      <Footer lang={lang} />
      <ScrollToTop />
    </div>
  );
};
