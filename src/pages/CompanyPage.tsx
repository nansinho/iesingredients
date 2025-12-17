import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Award, Users, Globe, Leaf, Target, Heart } from 'lucide-react';

interface CompanyPageProps {
  lang: Language;
}

export const CompanyPage = ({ lang }: CompanyPageProps) => {
  const values = [
    {
      icon: Award,
      title: lang === 'fr' ? 'Excellence' : 'Excellence',
      description:
        lang === 'fr'
          ? 'Nous sélectionnons uniquement les meilleurs ingrédients pour garantir une qualité irréprochable.'
          : 'We select only the best ingredients to guarantee impeccable quality.',
    },
    {
      icon: Leaf,
      title: lang === 'fr' ? 'Durabilité' : 'Sustainability',
      description:
        lang === 'fr'
          ? 'Engagement envers des pratiques responsables et des sources durables.'
          : 'Commitment to responsible practices and sustainable sources.',
    },
    {
      icon: Target,
      title: lang === 'fr' ? 'Innovation' : 'Innovation',
      description:
        lang === 'fr'
          ? 'À la pointe des dernières avancées en formulation cosmétique et aromatique.'
          : 'At the forefront of the latest advances in cosmetic and aromatic formulation.',
    },
    {
      icon: Heart,
      title: lang === 'fr' ? 'Passion' : 'Passion',
      description:
        lang === 'fr'
          ? 'Une équipe passionnée au service de votre créativité.'
          : 'A passionate team at the service of your creativity.',
    },
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>
          {lang === 'fr' ? 'Entreprise - IES Ingredients' : 'Company - IES Ingredients'}
        </title>
        <meta
          name="description"
          content={
            lang === 'fr'
              ? 'Découvrez IES Ingredients, spécialiste des ingrédients cosmétiques, parfums et arômes depuis plus de 30 ans.'
              : 'Discover IES Ingredients, specialist in cosmetic ingredients, perfumes and flavors for over 30 years.'
          }
        />
        <html lang={lang} />
      </Helmet>

      <div className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20 mb-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
                {lang === 'fr' ? 'Notre Histoire' : 'Our Story'}
              </h1>
              <p className="text-xl text-primary-foreground/80 animate-fade-in-up stagger-1">
                {lang === 'fr'
                  ? 'Depuis plus de 30 ans, IES Ingredients accompagne les formulateurs dans la création de produits d\'exception.'
                  : 'For over 30 years, IES Ingredients has been supporting formulators in creating exceptional products.'}
              </p>
            </div>
          </div>
        </section>

        <div className="container">
          {/* About Section */}
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <span className="text-sm font-medium text-accent uppercase tracking-wider">
                  {lang === 'fr' ? 'À propos' : 'About'}
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  {lang === 'fr'
                    ? 'Un partenaire de confiance'
                    : 'A trusted partner'}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    {lang === 'fr'
                      ? 'Fondée en 1990 à Nice, au cœur de la capitale mondiale de la parfumerie, IES Ingredients s\'est imposée comme un acteur majeur dans la distribution d\'ingrédients cosmétiques, de matières premières pour la parfumerie et d\'arômes alimentaires.'
                      : 'Founded in 1990 in Nice, in the heart of the world capital of perfumery, IES Ingredients has established itself as a major player in the distribution of cosmetic ingredients, raw materials for perfumery and food flavors.'}
                  </p>
                  <p>
                    {lang === 'fr'
                      ? 'Notre catalogue de plus de 5000 références témoigne de notre engagement à offrir une gamme complète et diversifiée pour répondre à tous les besoins de formulation.'
                      : 'Our catalog of over 5000 references reflects our commitment to offering a complete and diverse range to meet all formulation needs.'}
                  </p>
                  <p>
                    {lang === 'fr'
                      ? 'Nous travaillons avec les meilleurs producteurs du monde entier pour vous garantir des ingrédients de la plus haute qualité, avec une traçabilité totale.'
                      : 'We work with the best producers from around the world to guarantee you ingredients of the highest quality, with complete traceability.'}
                  </p>
                </div>
              </div>
              <div className="relative animate-fade-in-up stagger-1">
                <div className="aspect-square rounded-3xl bg-gradient-nature flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-display text-8xl font-bold text-primary/20">30+</div>
                    <div className="text-primary font-medium">
                      {lang === 'fr' ? 'Années d\'expérience' : 'Years of experience'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <span className="text-sm font-medium text-accent uppercase tracking-wider">
                {lang === 'fr' ? 'Nos valeurs' : 'Our values'}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                {lang === 'fr' ? 'Ce qui nous anime' : 'What drives us'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="bg-card border border-border rounded-2xl p-6 hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-muted/30 rounded-3xl p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10 mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground">50+</div>
                <div className="text-muted-foreground text-sm">
                  {lang === 'fr' ? 'Pays desservis' : 'Countries served'}
                </div>
              </div>
              <div className="animate-fade-in-up stagger-1">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10 mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground">500+</div>
                <div className="text-muted-foreground text-sm">
                  {lang === 'fr' ? 'Clients actifs' : 'Active clients'}
                </div>
              </div>
              <div className="animate-fade-in-up stagger-2">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10 mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground">5000+</div>
                <div className="text-muted-foreground text-sm">
                  {lang === 'fr' ? 'Références' : 'References'}
                </div>
              </div>
              <div className="animate-fade-in-up stagger-3">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10 mb-4">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground">100%</div>
                <div className="text-muted-foreground text-sm">
                  {lang === 'fr' ? 'Traçabilité' : 'Traceability'}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};
