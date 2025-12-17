import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ContactPageProps {
  lang: Language;
}

export const ContactPage = ({ lang }: ContactPageProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success(
      lang === 'fr'
        ? 'Message envoyé avec succès !'
        : 'Message sent successfully!'
    );
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>
          {lang === 'fr' ? 'Contact - IES Ingredients' : 'Contact - IES Ingredients'}
        </title>
        <meta
          name="description"
          content={
            lang === 'fr'
              ? 'Contactez IES Ingredients pour vos besoins en ingrédients cosmétiques, parfums et arômes alimentaires.'
              : 'Contact IES Ingredients for your cosmetic ingredients, perfumes and food flavors needs.'
          }
        />
        <html lang={lang} />
      </Helmet>

      <div className="pt-28 pb-20">
        <div className="container">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
              {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up stagger-1">
              {lang === 'fr'
                ? 'Notre équipe est à votre disposition pour répondre à toutes vos questions.'
                : 'Our team is at your disposal to answer all your questions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8 animate-fade-in-up stagger-2">
              <div className="bg-card border border-border rounded-2xl p-6 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {lang === 'fr' ? 'Adresse' : 'Address'}
                </h3>
                <p className="text-muted-foreground">
                  123 Avenue des Parfums<br />
                  06000 Nice, France
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {lang === 'fr' ? 'Téléphone' : 'Phone'}
                </h3>
                <a
                  href="tel:+33493000000"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +33 4 93 00 00 00
                </a>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">Email</h3>
                <a
                  href="mailto:contact@ies-ingredients.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  contact@ies-ingredients.com
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 animate-fade-in-up stagger-3">
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-display text-2xl font-bold mb-6">
                  {lang === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {lang === 'fr' ? 'Prénom' : 'First name'}
                      </Label>
                      <Input
                        id="firstName"
                        required
                        placeholder={lang === 'fr' ? 'Votre prénom' : 'Your first name'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {lang === 'fr' ? 'Nom' : 'Last name'}
                      </Label>
                      <Input
                        id="lastName"
                        required
                        placeholder={lang === 'fr' ? 'Votre nom' : 'Your last name'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">
                        {lang === 'fr' ? 'Entreprise' : 'Company'}
                      </Label>
                      <Input
                        id="company"
                        placeholder={lang === 'fr' ? 'Votre entreprise' : 'Your company'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {lang === 'fr' ? 'Sujet' : 'Subject'}
                    </Label>
                    <Input
                      id="subject"
                      required
                      placeholder={
                        lang === 'fr'
                          ? 'Demande d\'échantillon, information produit...'
                          : 'Sample request, product information...'
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      placeholder={
                        lang === 'fr'
                          ? 'Décrivez votre demande...'
                          : 'Describe your request...'
                      }
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="animate-pulse">
                        {lang === 'fr' ? 'Envoi...' : 'Sending...'}
                      </span>
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        {lang === 'fr' ? 'Envoyer le message' : 'Send message'}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
