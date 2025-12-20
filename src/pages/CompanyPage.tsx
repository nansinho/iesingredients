import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Award, Users, Globe, Leaf } from 'lucide-react';

interface CompanyPageProps {
  lang: Language;
}

export const CompanyPage = ({ lang }: CompanyPageProps) => {
  const location = useLocation();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const values = [
    { icon: Award, title: lang === 'fr' ? 'Excellence' : 'Excellence', desc: lang === 'fr' ? 'Des ingrédients de la plus haute qualité' : 'Highest quality ingredients' },
    { icon: Leaf, title: lang === 'fr' ? 'Durabilité' : 'Sustainability', desc: lang === 'fr' ? 'Sources responsables et durables' : 'Responsible and sustainable sources' },
    { icon: Users, title: lang === 'fr' ? 'Expertise' : 'Expertise', desc: lang === 'fr' ? '30 ans d\'expérience' : '30 years of experience' },
    { icon: Globe, title: lang === 'fr' ? 'Global' : 'Global', desc: lang === 'fr' ? 'Présence internationale' : 'International presence' },
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{lang === 'fr' ? 'Entreprise - IES Ingredients' : 'Company - IES Ingredients'}</title>
        <html lang={lang} />
      </Helmet>

      {/* Hero Section with dark background for header visibility */}
      <section className="relative bg-forest-950 pt-32 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container-luxe relative z-10">
          <span className="inline-block text-gold-500 text-sm font-medium uppercase tracking-widest mb-4">
            {lang === 'fr' ? 'À propos' : 'About'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            {lang === 'fr' ? 'Notre Histoire' : 'Our Story'}
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl">
            {lang === 'fr'
              ? 'Depuis 1990, IES Ingredients accompagne les formulateurs dans la création de produits d\'exception.'
              : 'Since 1990, IES Ingredients has been supporting formulators in creating exceptional products.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-16">
        <div className="container-luxe">
          {/* About */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl text-foreground mb-6">
                  {lang === 'fr' ? 'Un partenaire de confiance' : 'A trusted partner'}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>{lang === 'fr' ? 'Fondée à Nice, au cœur de la capitale mondiale de la parfumerie, IES Ingredients s\'est imposée comme un acteur majeur dans la distribution d\'ingrédients cosmétiques, de matières premières pour la parfumerie et d\'arômes alimentaires.' : 'Founded in Nice, in the heart of the world capital of perfumery, IES Ingredients has established itself as a major player in the distribution of cosmetic ingredients, perfumery raw materials and food flavors.'}</p>
                  <p>{lang === 'fr' ? 'Notre catalogue de plus de 5000 références témoigne de notre engagement à offrir une gamme complète et diversifiée.' : 'Our catalog of over 5000 references reflects our commitment to offering a complete and diverse range.'}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-forest-100 to-gold-100 rounded-2xl aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="font-serif text-7xl text-forest-600">30+</div>
                  <div className="text-forest-700">{lang === 'fr' ? 'Années d\'expérience' : 'Years of experience'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl text-foreground mb-8 text-center">
              {lang === 'fr' ? 'Nos valeurs' : 'Our values'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-forest-900 to-forest-800 rounded-3xl p-12 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><div className="font-serif text-4xl text-gold-400">5000+</div><div className="text-sm text-white/70 mt-1">{lang === 'fr' ? 'Références' : 'References'}</div></div>
              <div><div className="font-serif text-4xl text-gold-400">500+</div><div className="text-sm text-white/70 mt-1">{lang === 'fr' ? 'Clients' : 'Clients'}</div></div>
              <div><div className="font-serif text-4xl text-gold-400">50+</div><div className="text-sm text-white/70 mt-1">{lang === 'fr' ? 'Pays' : 'Countries'}</div></div>
              <div><div className="font-serif text-4xl text-gold-400">100%</div><div className="text-sm text-white/70 mt-1">{lang === 'fr' ? 'Traçabilité' : 'Traceability'}</div></div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
