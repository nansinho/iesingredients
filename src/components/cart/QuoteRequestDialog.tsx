import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSampleCart, CartCategory } from '@/contexts/SampleCartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/lib/i18n';
import { toast } from 'sonner';
import { Send, ShoppingBag, Sparkles, Droplet, Flower2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuoteRequestDialogProps {
  lang: Language;
}

const categoryConfig: Record<CartCategory, { label: { fr: string; en: string }; icon: React.ElementType; color: string }> = {
  COSMETIQUE: { 
    label: { fr: 'Cosmétique', en: 'Cosmetic' }, 
    icon: Sparkles, 
    color: 'bg-primary/10 text-primary border-primary/20' 
  },
  AROMES: { 
    label: { fr: 'Arômes', en: 'Aromas' }, 
    icon: Droplet, 
    color: 'bg-forest-100 text-forest-700 border-forest-200' 
  },
  PARFUM: { 
    label: { fr: 'Parfum', en: 'Perfume' }, 
    icon: Flower2, 
    color: 'bg-gold-100 text-gold-700 border-gold-200' 
  },
};

export const QuoteRequestDialog = ({ lang }: QuoteRequestDialogProps) => {
  const { isQuoteFormOpen, closeQuoteForm, items, getItemsByCategory, clearCart, totalItems } = useSampleCart();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form state with pre-fill from profile
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });

  // Pre-fill form when dialog opens and user is logged in
  useEffect(() => {
    if (isQuoteFormOpen && profile) {
      const nameParts = (profile.full_name || '').split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profile.email || user?.email || '',
        company: profile.company || '',
        phone: profile.phone || '',
        message: '',
      });
    }
  }, [isQuoteFormOpen, profile, user]);

  const itemsByCategory = getItemsByCategory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create the sample request
      const { data: request, error: requestError } = await supabase
        .from('sample_requests')
        .insert({
          user_id: user?.id || null,
          company: formData.company || null,
          message: formData.message || null,
          contact_name: `${formData.firstName} ${formData.lastName}`.trim(),
          contact_email: formData.email,
          contact_phone: formData.phone || null,
          status: 'pending',
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // 2. Insert cart items
      const itemsToInsert = items.map((item) => ({
        request_id: request.id,
        product_code: item.product.code || '',
        product_name: item.product.nom_commercial || '',
        product_category: item.category,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('sample_request_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Success
      setIsSuccess(true);
      toast.success(
        lang === 'fr' 
          ? 'Votre demande de devis a été envoyée !' 
          : 'Your quote request has been sent!'
      );

      setTimeout(() => {
        setIsSuccess(false);
        closeQuoteForm();
        clearCart();
        setFormData({ firstName: '', lastName: '', email: '', company: '', phone: '', message: '' });
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(
        lang === 'fr' 
          ? 'Erreur lors de l\'envoi de la demande' 
          : 'Error sending request'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategorySummary = (category: CartCategory) => {
    const categoryItems = itemsByCategory[category];
    if (categoryItems.length === 0) return null;

    const config = categoryConfig[category];
    const Icon = config.icon;

    return (
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={cn("text-xs", config.color)}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label[lang]}
          </Badge>
        </div>
        <div className="space-y-1">
          {categoryItems.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground truncate max-w-[200px]">
                {item.product.nom_commercial}
              </span>
              <span className="font-mono text-xs">x{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return (
      <Dialog open={isQuoteFormOpen} onOpenChange={(open) => !open && closeQuoteForm()}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-forest-600" />
            </div>
            <h3 className="font-serif text-xl mb-2">
              {lang === 'fr' ? 'Demande envoyée !' : 'Request sent!'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {lang === 'fr' 
                ? 'Nous vous recontacterons dans les plus brefs délais.' 
                : 'We will contact you as soon as possible.'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isQuoteFormOpen} onOpenChange={(open) => !open && closeQuoteForm()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <ShoppingBag className="w-5 h-5" />
            {lang === 'fr' ? 'Demande de devis' : 'Quote Request'}
          </DialogTitle>
          <DialogDescription>
            {lang === 'fr' 
              ? 'Remplissez vos informations pour recevoir un devis personnalisé' 
              : 'Fill in your information to receive a personalized quote'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Cart Summary */}
          <div className="bg-secondary/30 rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {lang === 'fr' ? 'Récapitulatif' : 'Summary'}
              <Badge variant="secondary">{totalItems}</Badge>
            </h4>
            <ScrollArea className="h-[250px] pr-2">
              {renderCategorySummary('COSMETIQUE')}
              {renderCategorySummary('AROMES')}
              {renderCategorySummary('PARFUM')}
            </ScrollArea>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {lang === 'fr' ? 'Prénom' : 'First Name'} *
                </Label>
                <Input 
                  id="firstName" 
                  required 
                  className="rounded-lg" 
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  {lang === 'fr' ? 'Nom' : 'Last Name'} *
                </Label>
                <Input 
                  id="lastName" 
                  required 
                  className="rounded-lg"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                className="rounded-lg"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">
                {lang === 'fr' ? 'Société' : 'Company'}
              </Label>
              <Input 
                id="company" 
                className="rounded-lg"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                {lang === 'fr' ? 'Téléphone' : 'Phone'}
              </Label>
              <Input 
                id="phone" 
                type="tel" 
                className="rounded-lg"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                {lang === 'fr' ? 'Message (optionnel)' : 'Message (optional)'}
              </Label>
              <Textarea 
                id="message" 
                rows={3} 
                className="rounded-lg resize-none"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder={lang === 'fr' 
                  ? 'Précisez vos besoins, quantités souhaitées...' 
                  : 'Specify your needs, desired quantities...'}
              />
            </div>

            <Separator />

            <Button 
              type="submit" 
              className="w-full rounded-full h-12 font-semibold"
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {lang === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {lang === 'fr' ? 'Envoyer la demande' : 'Send request'}
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
