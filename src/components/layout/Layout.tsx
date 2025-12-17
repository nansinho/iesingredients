import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Language } from '@/lib/i18n';

interface LayoutProps {
  children: ReactNode;
  lang: Language;
}

export const Layout = ({ children, lang }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
    </div>
  );
};
