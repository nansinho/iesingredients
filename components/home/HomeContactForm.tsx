"use client";

import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/ContactForm";

export function HomeContactForm() {
  const t = useTranslations("homeContact");

  return (
    <section className="py-24 md:py-32 bg-black-matte relative overflow-hidden">
      <div className="max-w-[1400px] w-[90%] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-light/8 border border-cream-light/12 text-cream-light text-xs font-semibold uppercase tracking-[0.15em] mb-5">
            <MessageCircle className="w-3.5 h-3.5" />
            Contact
          </span>
          <h2 className="text-cream-light tracking-tight">
            Parlons de vos <span className="font-playfair tracking-wide text-peach">projets</span>.
          </h2>
          <p className="text-cream-light/50 text-lg mt-3 max-w-xl">
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
            <div className="bg-dark-card rounded-2xl p-6 sm:p-8 border border-cream-light/8 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
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
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-dark-card border border-cream-light/8 hover:border-cream-light/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <MapPin className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-cream-light text-sm">Adresse</p>
                  <p className="text-sm text-dark/50 dark:text-cream-light/50 mt-1">Nice, France</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-dark-card border border-cream-light/8 hover:border-cream-light/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <Phone className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-cream-light text-sm">Téléphone</p>
                  <a
                    href="tel:+33493000000"
                    className="text-sm text-cream-light/50 mt-1 hover:text-peach transition-colors"
                  >
                    +33 4 93 00 00 00
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-dark-card border border-cream-light/8 hover:border-cream-light/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <Mail className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-cream-light text-sm">Email</p>
                  <a
                    href="mailto:contact@ies-ingredients.com"
                    className="text-sm text-cream-light/50 mt-1 hover:text-peach transition-colors"
                  >
                    contact@ies-ingredients.com
                  </a>
                </div>
              </div>

              {/* Trust badge */}
              <div className="mt-6 p-5 rounded-2xl bg-cream-light/5 border border-cream-light/10">
                <p className="text-peach font-semibold text-sm mb-1">Réponse sous 24h</p>
                <p className="text-cream-light/50 text-xs leading-relaxed">
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
