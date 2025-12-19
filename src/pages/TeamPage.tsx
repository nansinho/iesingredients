import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Linkedin, Mail, Users } from 'lucide-react';

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
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{lang === 'fr' ? 'Équipe - IES Ingredients' : 'Team - IES Ingredients'}</title>
        <html lang={lang} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-forest-950 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="container-luxe relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center">
              <Users className="w-7 h-7 text-forest-950" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white">
              {lang === 'fr' ? 'Notre équipe' : 'Our team'}
            </h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl">
            {lang === 'fr' ? 'Des experts passionnés à votre service.' : 'Passionate experts at your service.'}
          </p>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container-luxe">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-forest-100 to-gold-100 flex items-center justify-center">
                  <span className="font-serif text-5xl text-forest-600/50">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-medium text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{member.role[lang]}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={lang === 'fr' ? 'LinkedIn (bientôt)' : 'LinkedIn (coming soon)'}
                      onClick={() => {
                        // no-op placeholder (avoid # navigation causing scroll + console noise)
                      }}
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <a
                      href={`mailto:${member.email}`}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={lang === 'fr' ? `Envoyer un email à ${member.name}` : `Email ${member.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};
