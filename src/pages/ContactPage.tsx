import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, MapPin, Send, Clock, Loader2, Building, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface ContactPageProps {
  lang: Language;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
};

export const ContactPage = ({ lang }: ContactPageProps) => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_submissions').insert([{
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company: formData.company || null,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      }]);

      if (error) throw error;

      toast.success(
        lang === 'fr' ? 'Message envoyé avec succès !' : 'Message sent successfully!',
        {
          description: lang === 'fr' 
            ? 'Nous vous répondrons dans les plus brefs délais.'
            : 'We will get back to you as soon as possible.',
        }
      );
      setFormData(initialFormData);
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast.error(
        lang === 'fr' ? 'Erreur lors de l\'envoi' : 'Error sending message',
        { description: error.message }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: lang === 'fr' ? 'Adresse' : 'Address',
      content: '123 Avenue des Parfums',
      subcontent: '06000 Nice, France',
    },
    {
      icon: Phone,
      title: lang === 'fr' ? 'Téléphone' : 'Phone',
      content: '+33 4 93 00 00 00',
      href: 'tel:+33493000000',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@ies-ingredients.com',
      href: 'mailto:contact@ies-ingredients.com',
    },
    {
      icon: Clock,
      title: lang === 'fr' ? 'Horaires' : 'Hours',
      content: lang === 'fr' ? 'Lun - Ven : 9h - 18h' : 'Mon - Fri: 9AM - 6PM',
      subcontent: lang === 'fr' ? 'Week-end fermé' : 'Weekend closed',
    },
  ];

  return (
    <Layout lang={lang}>
      <SEOHead
        lang={lang}
        title={lang === 'fr' ? 'Contactez-nous - IES Ingredients' : 'Contact Us - IES Ingredients'}
        description={lang === 'fr'
          ? 'Contactez l\'équipe IES Ingredients pour vos besoins en ingrédients cosmétiques, parfums et arômes.'
          : 'Contact the IES Ingredients team for your cosmetic ingredients, perfumes and flavors needs.'}
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
              {lang === 'fr' ? 'Parlons ensemble' : 'Let\'s talk'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl">
              {lang === 'fr' 
                ? 'Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets.'
                : 'Our team is at your service to answer all your questions and support you in your projects.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-16 sm:py-20">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl mb-2">
                  {lang === 'fr' ? 'Nos coordonnées' : 'Our contact details'}
                </h2>
                <p className="text-muted-foreground">
                  {lang === 'fr' 
                    ? 'Retrouvez-nous à Nice, au cœur de la Côte d\'Azur.'
                    : 'Find us in Nice, in the heart of the French Riviera.'}
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="border-border hover:shadow-md hover:border-primary/20 transition-all duration-300">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground mb-1">{item.title}</h3>
                          {item.href ? (
                            <a 
                              href={item.href} 
                              className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                              {item.content}
                            </a>
                          ) : (
                            <p className="text-foreground font-medium">{item.content}</p>
                          )}
                          {item.subcontent && (
                            <p className="text-sm text-muted-foreground mt-0.5">{item.subcontent}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional info card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <h3 className="font-medium">
                        {lang === 'fr' ? 'Présence internationale' : 'International presence'}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'fr' 
                        ? 'Nous travaillons avec des clients dans plus de 30 pays à travers le monde.'
                        : 'We work with clients in over 30 countries around the world.'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="border-border shadow-sm">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="font-serif text-2xl mb-2">
                      {lang === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}
                    </h2>
                    <p className="text-muted-foreground">
                      {lang === 'fr' 
                        ? 'Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.'
                        : 'Fill out the form below and we will get back to you quickly.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{lang === 'fr' ? 'Prénom' : 'First name'} *</Label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required 
                          className="h-12" 
                          placeholder="Jean"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{lang === 'fr' ? 'Nom' : 'Last name'} *</Label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required 
                          className="h-12"
                          placeholder="Dupont"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required 
                          className="h-12"
                          placeholder="jean.dupont@exemple.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{lang === 'fr' ? 'Téléphone' : 'Phone'}</Label>
                        <Input 
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="h-12"
                          placeholder="+33 4 93 00 00 00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company">
                          <Building className="w-4 h-4 inline mr-1.5" />
                          {lang === 'fr' ? 'Entreprise' : 'Company'}
                        </Label>
                        <Input 
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="h-12"
                          placeholder={lang === 'fr' ? 'Votre entreprise' : 'Your company'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{lang === 'fr' ? 'Sujet' : 'Subject'} *</Label>
                        <Input 
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required 
                          className="h-12"
                          placeholder={lang === 'fr' ? 'Objet de votre message' : 'Subject of your message'}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required 
                        rows={6}
                        className="resize-none"
                        placeholder={lang === 'fr' 
                          ? 'Décrivez votre projet ou posez-nous vos questions...'
                          : 'Describe your project or ask us your questions...'}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                      <p className="text-xs text-muted-foreground">
                        * {lang === 'fr' ? 'Champs obligatoires' : 'Required fields'}
                      </p>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        size="lg" 
                        className="w-full sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            {lang === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 w-4 h-4" />
                            {lang === 'fr' ? 'Envoyer le message' : 'Send message'}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
