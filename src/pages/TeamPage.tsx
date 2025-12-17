import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Linkedin, Mail } from 'lucide-react';

interface TeamPageProps {
  lang: Language;
}

const teamMembers = [
  { name: 'Marie Dupont', role: { fr: 'Directrice Générale', en: 'CEO' }, email: 'marie@ies.com' },
  { name: 'Jean-Pierre Martin', role: { fr: 'Directeur Commercial', en: 'Sales Director' }, email: 'jp@ies.com' },
  { name: 'Sophie Bernard', role: { fr: 'Responsable R&D', en: 'R&D Manager' }, email: 'sophie@ies.com' },
  { name: 'Alexandre Roux', role: { fr: 'Expert Parfumerie', en: 'Perfumery Expert' }, email: 'alex@ies.com' },
  { name: 'Claire Moreau', role: { fr: 'Responsable Qualité', en: 'Quality Manager' }, email: 'claire@ies.com' },
  { name: 'Thomas Leroy', role: { fr: 'Expert Cosmétique', en: 'Cosmetic Expert' }, email: 'thomas@ies.com' },
];

export const TeamPage = ({ lang }: TeamPageProps) => {
  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{lang === 'fr' ? 'Équipe - IES Ingredients' : 'Team - IES Ingredients'}</title>
        <html lang={lang} />
      </Helmet>

      <div className="pt-24 pb-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl text-foreground mb-4">
              {lang === 'fr' ? 'Notre équipe' : 'Our team'}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {lang === 'fr' ? 'Des experts passionnés à votre service.' : 'Passionate experts at your service.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="aspect-square bg-secondary/30 flex items-center justify-center">
                  <span className="font-serif text-5xl text-muted-foreground/30">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-medium text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{member.role[lang]}</p>
                  <div className="flex gap-2">
                    <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={`mailto:${member.email}`} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Mail className="w-4 h-4" />
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
