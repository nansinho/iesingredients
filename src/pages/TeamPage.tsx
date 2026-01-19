import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { Linkedin, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TeamPageProps {
  lang: Language;
}

interface TeamMember {
  id: string;
  name: string;
  role_fr: string;
  role_en: string | null;
  email: string | null;
  linkedin_url: string | null;
  photo_url: string | null;
  bio_fr: string | null;
  bio_en: string | null;
  display_order: number;
}

export const TeamPage = ({ lang }: TeamPageProps) => {
  const location = useLocation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Layout lang={lang}>
      <SEOHead
        lang={lang}
        title={lang === 'fr' ? 'Notre Équipe - IES Ingredients' : 'Our Team - IES Ingredients'}
        description={lang === 'fr'
          ? 'Découvrez l\'équipe d\'experts passionnés d\'IES Ingredients. Spécialistes en cosmétique, parfumerie et arômes alimentaires.'
          : 'Meet the passionate expert team at IES Ingredients. Specialists in cosmetics, perfumery and food flavors.'}
      />

      {/* Hero Section */}
      <section className="relative bg-forest-950 pt-32 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container-luxe relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block text-gold-500 text-sm font-medium uppercase tracking-widest mb-4">
              {lang === 'fr' ? 'Nos experts' : 'Our experts'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              {lang === 'fr' ? 'Notre équipe' : 'Our team'}
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl">
              {lang === 'fr' 
                ? 'Une équipe d\'experts passionnés, dédiée à l\'excellence et à l\'innovation dans le domaine des ingrédients naturels.'
                : 'A team of passionate experts, dedicated to excellence and innovation in the field of natural ingredients.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="bg-background py-16 sm:py-20">
        <div className="container-luxe">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-muted-foreground">
                {lang === 'fr' ? 'Chargement...' : 'Loading...'}
              </p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                {lang === 'fr' ? 'Aucun membre de l\'équipe à afficher.' : 'No team members to display.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group border-forest-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {/* Photo or Initials */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-forest-100 to-gold-100 dark:from-forest-900 dark:to-gold-900/50 flex items-center justify-center relative overflow-hidden">
                      {member.photo_url ? (
                        <img 
                          src={member.photo_url} 
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="font-serif text-5xl sm:text-6xl text-forest-600/50 dark:text-forest-400/50 group-hover:scale-110 transition-transform duration-300">
                          {getInitials(member.name)}
                        </span>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {lang === 'fr' ? member.role_fr : (member.role_en || member.role_fr)}
                      </p>

                      {/* Bio (if exists) */}
                      {(member.bio_fr || member.bio_en) && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {lang === 'fr' ? member.bio_fr : (member.bio_en || member.bio_fr)}
                        </p>
                      )}

                      {/* Social Links */}
                      <div className="flex gap-2">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                            aria-label={`LinkedIn de ${member.name}`}
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                            aria-label={lang === 'fr' ? `Envoyer un email à ${member.name}` : `Email ${member.name}`}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container-luxe text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-2xl sm:text-3xl mb-4">
              {lang === 'fr' ? 'Rejoignez notre équipe' : 'Join our team'}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              {lang === 'fr' 
                ? 'Vous êtes passionné par les ingrédients naturels et l\'innovation ? Découvrez nos opportunités.'
                : 'Are you passionate about natural ingredients and innovation? Discover our opportunities.'}
            </p>
            <a 
              href={`/${lang}/contact`}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};
