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

      <div className="pt-24 pb-16">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl text-foreground mb-4">
              {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {lang === 'fr' ? 'Notre équipe est à votre disposition.' : 'Our team is at your service.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <MapPin className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-medium mb-1">{lang === 'fr' ? 'Adresse' : 'Address'}</h3>
                <p className="text-sm text-muted-foreground">123 Avenue des Parfums<br />06000 Nice, France</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Phone className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-medium mb-1">{lang === 'fr' ? 'Téléphone' : 'Phone'}</h3>
                <a href="tel:+33493000000" className="text-sm text-muted-foreground hover:text-foreground">+33 4 93 00 00 00</a>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Mail className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-medium mb-1">Email</h3>
                <a href="mailto:contact@ies-ingredients.com" className="text-sm text-muted-foreground hover:text-foreground">contact@ies-ingredients.com</a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{lang === 'fr' ? 'Prénom' : 'First name'}</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{lang === 'fr' ? 'Nom' : 'Last name'}</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">{lang === 'fr' ? 'Entreprise' : 'Company'}</Label>
                      <Input id="company" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{lang === 'fr' ? 'Sujet' : 'Subject'}</Label>
                    <Input id="subject" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" required rows={5} />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    <Send className="mr-2 w-4 h-4" />
                    {isSubmitting ? (lang === 'fr' ? 'Envoi...' : 'Sending...') : (lang === 'fr' ? 'Envoyer' : 'Send')}
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
