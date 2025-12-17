import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { mockProducts } from '@/data/mockProducts';
import { Language } from '@/lib/i18n';

interface HomePageProps {
  lang: Language;
}

export const HomePage = ({ lang }: HomePageProps) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value.length >= 3) {
      navigate(`/${lang}/catalogue?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>
          {lang === 'fr'
            ? 'IES Ingredients - Ingrédients Cosmétiques, Parfums & Arômes'
            : 'IES Ingredients - Cosmetic Ingredients, Perfumes & Flavors'}
        </title>
        <meta
          name="description"
          content={
            lang === 'fr'
              ? 'Découvrez plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires. IES Ingredients, votre partenaire formulation depuis plus de 30 ans.'
              : 'Discover over 5000 cosmetic ingredients, perfumes and food flavors. IES Ingredients, your formulation partner for over 30 years.'
          }
        />
        <link
          rel="canonical"
          href={`https://ies-ingredients.com/${lang}`}
        />
        <meta
          property="og:title"
          content={
            lang === 'fr'
              ? 'IES Ingredients - Ingrédients Cosmétiques, Parfums & Arômes'
              : 'IES Ingredients - Cosmetic Ingredients, Perfumes & Flavors'
          }
        />
        <meta property="og:type" content="website" />
        <html lang={lang} />
      </Helmet>

      <HeroSection
        lang={lang}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />
      <CategoryShowcase lang={lang} />
      <FeaturedProducts lang={lang} products={mockProducts} />
      
      {/* Trust Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="font-display text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-primary-foreground/70 text-sm">
                {lang === 'fr' ? 'Références produits' : 'Product references'}
              </div>
            </div>
            <div className="animate-fade-in-up stagger-1">
              <div className="font-display text-4xl md:text-5xl font-bold mb-2">30+</div>
              <div className="text-primary-foreground/70 text-sm">
                {lang === 'fr' ? 'Années d\'expertise' : 'Years of expertise'}
              </div>
            </div>
            <div className="animate-fade-in-up stagger-2">
              <div className="font-display text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-primary-foreground/70 text-sm">
                {lang === 'fr' ? 'Pays livrés' : 'Countries served'}
              </div>
            </div>
            <div className="animate-fade-in-up stagger-3">
              <div className="font-display text-4xl md:text-5xl font-bold mb-2">100%</div>
              <div className="text-primary-foreground/70 text-sm">
                {lang === 'fr' ? 'Traçabilité' : 'Traceability'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
