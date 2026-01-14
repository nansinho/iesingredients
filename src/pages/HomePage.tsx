import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { SEOHead, createFAQSchema } from '@/components/SEOHead';
import { MinimalHero } from '@/components/home/MinimalHero';
import { LogoStrip } from '@/components/home/LogoStrip';
import { BentoExpertise } from '@/components/home/BentoExpertise';
import { MinimalAbout } from '@/components/home/MinimalAbout';
import { MinimalProducts } from '@/components/home/MinimalProducts';
import { MinimalCTA } from '@/components/home/MinimalCTA';

interface HomePageProps {
  lang: Language;
}

export const HomePage = ({ lang }: HomePageProps) => {
  return (
    <Layout lang={lang}>
      <SEOHead
        lang={lang}
        title={`IES Ingredients - ${lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}`}
        description={lang === 'fr' 
          ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels. Actifs botaniques et huiles végétales certifiés.'
          : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors. Certified botanical actives and vegetable oils.'}
        structuredData={createFAQSchema([
          {
            question: lang === 'fr' ? 'Quels types d\'ingrédients proposez-vous ?' : 'What types of ingredients do you offer?',
            answer: lang === 'fr' 
              ? 'Nous proposons plus de 5000 références d\'ingrédients naturels : actifs cosmétiques, huiles essentielles pour la parfumerie, et arômes alimentaires.'
              : 'We offer over 5000 natural ingredient references: cosmetic actives, essential oils for perfumery, and food flavors.',
          },
          {
            question: lang === 'fr' ? 'Vos ingrédients sont-ils certifiés ?' : 'Are your ingredients certified?',
            answer: lang === 'fr'
              ? 'Oui, nous proposons des ingrédients certifiés biologiques, COSMOS, Ecocert et autres certifications reconnues.'
              : 'Yes, we offer organic, COSMOS, Ecocert and other recognized certified ingredients.',
          },
        ])}
      />

      {/* Hero Section - Light & Airy */}
      <MinimalHero lang={lang} />

      {/* Certification Logos Strip */}
      <LogoStrip lang={lang} />

      {/* Bento Grid Expertise */}
      <BentoExpertise lang={lang} />

      {/* About Section */}
      <MinimalAbout lang={lang} />

      {/* Featured Products */}
      <MinimalProducts lang={lang} />

      {/* CTA Section */}
      <MinimalCTA lang={lang} />
    </Layout>
  );
};