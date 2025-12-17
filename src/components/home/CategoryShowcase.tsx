import { Link } from 'react-router-dom';
import { ArrowRight, Beaker, Sparkles, Leaf } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface CategoryShowcaseProps {
  lang: Language;
}

export const CategoryShowcase = ({ lang }: CategoryShowcaseProps) => {
  const t = useTranslation(lang);

  const categories = [
    {
      key: 'cosmetic',
      icon: Beaker,
      color: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'group-hover:border-pink-400',
      iconColor: 'text-pink-500',
      count: 2500,
      description:
        lang === 'fr'
          ? 'Actifs, extraits botaniques, huiles essentielles pour formulateurs cosmétiques'
          : 'Actives, botanical extracts, essential oils for cosmetic formulators',
    },
    {
      key: 'perfume',
      icon: Sparkles,
      color: 'from-purple-500/20 to-violet-500/20',
      borderColor: 'group-hover:border-purple-400',
      iconColor: 'text-purple-500',
      count: 1500,
      description:
        lang === 'fr'
          ? 'Matières premières nobles pour la création de parfums exceptionnels'
          : 'Noble raw materials for creating exceptional perfumes',
    },
    {
      key: 'aroma',
      icon: Leaf,
      color: 'from-orange-500/20 to-amber-500/20',
      borderColor: 'group-hover:border-orange-400',
      iconColor: 'text-orange-500',
      count: 1000,
      description:
        lang === 'fr'
          ? 'Arômes naturels et extraits food grade pour l\'industrie alimentaire'
          : 'Natural flavors and food grade extracts for the food industry',
    },
  ];

  return (
    <section className="py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            {lang === 'fr' ? 'Nos expertises' : 'Our expertise'}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {lang === 'fr' ? 'Trois univers, une passion' : 'Three worlds, one passion'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {lang === 'fr'
              ? 'Découvrez notre catalogue organisé en trois grandes catégories pour répondre à tous vos besoins de formulation.'
              : 'Discover our catalog organized into three main categories to meet all your formulation needs.'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.key}
              to={`/${lang}/catalogue?category=${category.key}`}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover-lift animate-fade-in-up',
                category.borderColor
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background gradient */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                  category.color
                )}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500',
                    category.iconColor
                  )}
                >
                  <category.icon className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {t.categories[category.key as keyof typeof t.categories]}
                </h3>

                {/* Count */}
                <p className="text-sm text-accent font-semibold mb-4">
                  {category.count.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}{' '}
                  {lang === 'fr' ? 'références' : 'references'}
                </p>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {category.description}
                </p>

                {/* Link */}
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  {lang === 'fr' ? 'Explorer' : 'Explore'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
