import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContactPageProps {
  lang: Language;
}

export const ContactPage = ({ lang }: ContactPageProps) => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(lang === 'fr' ? 'Message envoyé !' : 'Message sent!');
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{lang === 'fr' ? 'Contact - IES Ingredients' : 'Contact - IES Ingredients'}</title>
        <html lang={lang} />
      </Helmet>

      {/* Hero Section with dark background for header visibility */}
      <section className="relative bg-forest-950 pt-24 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container-luxe relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-forest-950" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-white">
                {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
              </h1>
            </div>
          </div>
          <p className="text-white/70 text-lg max-w-2xl">
            {lang === 'fr' ? 'Notre équipe est à votre disposition pour répondre à toutes vos questions.' : 'Our team is at your service to answer all your questions.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-16">
        <div className="container-luxe max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium mb-2">{lang === 'fr' ? 'Adresse' : 'Address'}</h3>
                <p className="text-sm text-muted-foreground">123 Avenue des Parfums<br />06000 Nice, France</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium mb-2">{lang === 'fr' ? 'Téléphone' : 'Phone'}</h3>
                <a href="tel:+33493000000" className="text-sm text-muted-foreground hover:text-foreground transition-colors">+33 4 93 00 00 00</a>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Email</h3>
                <a href="mailto:contact@ies-ingredients.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">contact@ies-ingredients.com</a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-serif text-2xl mb-6">{lang === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{lang === 'fr' ? 'Prénom' : 'First name'}</Label>
                      <Input id="firstName" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{lang === 'fr' ? 'Nom' : 'Last name'}</Label>
                      <Input id="lastName" required className="h-12" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">{lang === 'fr' ? 'Entreprise' : 'Company'}</Label>
                      <Input id="company" className="h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{lang === 'fr' ? 'Sujet' : 'Subject'}</Label>
                    <Input id="subject" required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" required rows={5} />
                  </div>
                  <Button type="submit" disabled={isSubmitting} size="lg" className="rounded-full h-12 px-8">
                    <Send className="mr-2 w-4 h-4" />
                    {isSubmitting ? (lang === 'fr' ? 'Envoi...' : 'Sending...') : (lang === 'fr' ? 'Envoyer le message' : 'Send message')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
