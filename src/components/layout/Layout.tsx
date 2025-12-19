import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Language } from '@/lib/i18n';

interface LayoutProps {
  children: ReactNode;
  lang: Language;
}

export const Layout = ({ children, lang }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header lang={lang} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer lang={lang} />
    </div>
  );
};
