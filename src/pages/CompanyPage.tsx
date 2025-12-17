import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Award, Users, Globe, Leaf } from 'lucide-react';

interface CompanyPageProps {
  lang: Language;
}

export const CompanyPage = ({ lang }: CompanyPageProps) => {
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

      <div className="pt-24 pb-16">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20 mb-16">
          <div className="container">
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              {lang === 'fr' ? 'Notre Histoire' : 'Our Story'}
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              {lang === 'fr'
                ? 'Depuis 1990, IES Ingredients accompagne les formulateurs dans la création de produits d\'exception.'
                : 'Since 1990, IES Ingredients has been supporting formulators in creating exceptional products.'}
            </p>
          </div>
        </section>

        <div className="container">
          {/* About */}
          <section className="mb-16">
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
              <div className="bg-secondary/50 rounded-lg aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="font-serif text-7xl text-primary/20">30+</div>
                  <div className="text-muted-foreground">{lang === 'fr' ? 'Années d\'expérience' : 'Years of experience'}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-foreground mb-8 text-center">
              {lang === 'fr' ? 'Nos valeurs' : 'Our values'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 text-center">
                  <v.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-medium mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="bg-secondary/50 rounded-lg p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><div className="font-serif text-3xl text-foreground">5000+</div><div className="text-sm text-muted-foreground">{lang === 'fr' ? 'Références' : 'References'}</div></div>
              <div><div className="font-serif text-3xl text-foreground">500+</div><div className="text-sm text-muted-foreground">{lang === 'fr' ? 'Clients' : 'Clients'}</div></div>
              <div><div className="font-serif text-3xl text-foreground">50+</div><div className="text-sm text-muted-foreground">{lang === 'fr' ? 'Pays' : 'Countries'}</div></div>
              <div><div className="font-serif text-3xl text-foreground">100%</div><div className="text-sm text-muted-foreground">{lang === 'fr' ? 'Traçabilité' : 'Traceability'}</div></div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};
