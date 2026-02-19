"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

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
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const locale = useLocale();
  const isFr = locale === "fr";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_submissions").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company: formData.company || null,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      } as any);

      if (error) throw error;

      setStatus("success");
      setFormData(initialFormData);
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="font-serif text-3xl text-forest-900 mb-2">
        {isFr ? "Envoyez-nous un message" : "Send us a message"}
      </h2>
      <p className="text-forest-600 mb-8">
        {isFr
          ? "Remplissez le formulaire ci-dessous et nous vous répondrons rapidement."
          : "Fill out the form below and we will get back to you quickly."}
      </p>

      {status === "success" && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800">
          <p className="font-medium">
            {isFr ? "Message envoyé avec succès !" : "Message sent successfully!"}
          </p>
          <p className="text-sm mt-1">
            {isFr
              ? "Nous vous répondrons dans les plus brefs délais."
              : "We will get back to you as soon as possible."}
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
          <p className="font-medium">
            {isFr ? "Erreur lors de l'envoi" : "Error sending message"}
          </p>
          <p className="text-sm mt-1">
            {isFr ? "Veuillez réessayer." : "Please try again."}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">{isFr ? "Prénom" : "First name"} *</Label>
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
            <Label htmlFor="lastName">{isFr ? "Nom" : "Last name"} *</Label>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <Label htmlFor="phone">{isFr ? "Téléphone" : "Phone"}</Label>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company">{isFr ? "Entreprise" : "Company"}</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="h-12"
              placeholder={isFr ? "Votre entreprise" : "Your company"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">{isFr ? "Sujet" : "Subject"} *</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="h-12"
              placeholder={isFr ? "Objet de votre message" : "Subject of your message"}
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
            placeholder={
              isFr
                ? "Décrivez votre projet ou posez-nous vos questions..."
                : "Describe your project or ask us your questions..."
            }
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-forest-500">
            * {isFr ? "Champs obligatoires" : "Required fields"}
          </p>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full sm:w-auto bg-forest-900 hover:bg-forest-800 text-white rounded-full px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                {isFr ? "Envoi en cours..." : "Sending..."}
              </>
            ) : (
              <>
                <Send className="mr-2 w-4 h-4" />
                {isFr ? "Envoyer le message" : "Send message"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
