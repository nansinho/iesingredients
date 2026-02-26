"use client";

import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/ContactForm";

export function HomeContactForm() {
  const t = useTranslations("homeContact");

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-dark relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-lavender/5 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-peach/3 rounded-full blur-[120px]" />

      <div className="w-[94%] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brown/8 border border-brown/12 text-brown text-xs font-semibold uppercase tracking-[0.15em] mb-5">
            <MessageCircle className="w-3.5 h-3.5" />
            Contact
          </span>
          <h2 className="text-dark dark:text-cream-light tracking-tight">
            Parlons de vos <span className="font-playfair italic text-brown">projets</span>.
          </h2>
          <p className="text-dark/50 dark:text-cream-light/50 text-lg mt-3 max-w-xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 2 Columns: Form + Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-cream-light dark:bg-dark-card rounded-2xl p-6 sm:p-8 border border-brown/8 dark:border-brown/10 shadow-[0_4px_30px_rgba(163,123,104,0.04)]">
              <ContactForm />
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="space-y-5 lg:mt-0">
              {/* Address */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-light dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <MapPin className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-dark dark:text-cream-light text-sm">Adresse</p>
                  <p className="text-sm text-dark/50 dark:text-cream-light/50 mt-1">Nice, France</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-light dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <Phone className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-dark dark:text-cream-light text-sm">Téléphone</p>
                  <a
                    href="tel:+33493000000"
                    className="text-sm text-dark/50 dark:text-cream-light/50 mt-1 hover:text-brown transition-colors"
                  >
                    +33 4 93 00 00 00
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-light dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <Mail className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-dark dark:text-cream-light text-sm">Email</p>
                  <a
                    href="mailto:contact@ies-ingredients.com"
                    className="text-sm text-dark/50 dark:text-cream-light/50 mt-1 hover:text-brown transition-colors"
                  >
                    contact@ies-ingredients.com
                  </a>
                </div>
              </div>

              {/* Trust badge */}
              <div className="mt-6 p-5 rounded-2xl bg-peach/8 border border-peach/12">
                <p className="text-brown-dark dark:text-peach font-semibold text-sm mb-1">Réponse sous 24h</p>
                <p className="text-dark/50 dark:text-cream-light/50 text-xs leading-relaxed">
                  Notre équipe commerciale vous répond rapidement pour toute demande d&apos;échantillons ou de devis.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
