import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Linkedin, Mail } from 'lucide-react';

interface TeamPageProps {
  lang: Language;
}

const teamMembers = [
  {
    name: 'Marie Dupont',
    role: { fr: 'Directrice Générale', en: 'CEO' },
    image: null,
    linkedin: '#',
    email: 'marie.dupont@ies-ingredients.com',
  },
  {
    name: 'Jean-Pierre Martin',
    role: { fr: 'Directeur Commercial', en: 'Sales Director' },
    image: null,
    linkedin: '#',
    email: 'jp.martin@ies-ingredients.com',
  },
  {
    name: 'Sophie Bernard',
    role: { fr: 'Responsable R&D', en: 'R&D Manager' },
    image: null,
    linkedin: '#',
    email: 's.bernard@ies-ingredients.com',
  },
  {
    name: 'Alexandre Roux',
    role: { fr: 'Expert Parfumerie', en: 'Perfumery Expert' },
    image: null,
    linkedin: '#',
    email: 'a.roux@ies-ingredients.com',
  },
  {
    name: 'Claire Moreau',
    role: { fr: 'Responsable Qualité', en: 'Quality Manager' },
    image: null,
    linkedin: '#',
    email: 'c.moreau@ies-ingredients.com',
  },
  {
    name: 'Thomas Leroy',
    role: { fr: 'Expert Cosmétique', en: 'Cosmetic Expert' },
    image: null,
    linkedin: '#',
    email: 't.leroy@ies-ingredients.com',
  },
];

export const TeamPage = ({ lang }: TeamPageProps) => {
  return (
    <Layout lang={lang}>
      <Helmet>
        <title>
          {lang === 'fr' ? 'Équipe - IES Ingredients' : 'Team - IES Ingredients'}
        </title>
        <meta
          name="description"
          content={
            lang === 'fr'
              ? 'Rencontrez l\'équipe d\'experts IES Ingredients, passionnés par les ingrédients cosmétiques, parfums et arômes.'
              : 'Meet the IES Ingredients team of experts, passionate about cosmetic ingredients, perfumes and flavors.'
          }
        />
        <html lang={lang} />
      </Helmet>

      <div className="pt-28 pb-20">
        <div className="container">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              {lang === 'fr' ? 'Notre équipe' : 'Our team'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4 animate-fade-in-up">
              {lang === 'fr' ? 'Des experts passionnés' : 'Passionate experts'}
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up stagger-1">
              {lang === 'fr'
                ? 'Une équipe d\'experts dédiés à votre réussite, avec plus de 100 ans d\'expérience combinée.'
                : 'A team of experts dedicated to your success, with over 100 years of combined experience.'}
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image placeholder */}
                <div className="aspect-square bg-gradient-nature relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-display text-4xl font-bold text-primary/30">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{member.role[lang]}</p>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    <a
                      href={member.linkedin}
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
