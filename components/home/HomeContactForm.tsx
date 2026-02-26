"use client";

import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/ContactForm";

export function HomeContactForm() {
  const t = useTranslations("homeContact");

  return (
    <section className="py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-10 section-blush-light relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold-400/3 rounded-full blur-[120px]" />

      <div className="max-w-[100rem] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-600 text-xs font-semibold uppercase tracking-[0.15em] mb-5">
            <MessageCircle className="w-3.5 h-3.5" />
            Contact
          </span>
          <h2 className="text-forest-950 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-forest-400 text-lg mt-3 max-w-xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 2 Columns: Form + Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form - Takes more space */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-forest-100 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
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
              <div className="flex items-start gap-4 p-5 rounded-[16px] bg-white border border-forest-100 hover:border-gold-500/30 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 transition-all">
                  <MapPin className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <p className="font-medium text-forest-950 text-sm">Adresse</p>
                  <p className="text-sm text-forest-400 mt-1">Nice, France</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-5 rounded-[16px] bg-white border border-forest-100 hover:border-gold-500/30 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 transition-all">
                  <Phone className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <p className="font-medium text-forest-950 text-sm">Téléphone</p>
                  <a
                    href="tel:+33493000000"
                    className="text-sm text-forest-400 mt-1 hover:text-gold-500 transition-colors"
                  >
                    +33 4 93 00 00 00
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-5 rounded-[16px] bg-white border border-forest-100 hover:border-gold-500/30 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 transition-all">
                  <Mail className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <p className="font-medium text-forest-950 text-sm">Email</p>
                  <a
                    href="mailto:contact@ies-ingredients.com"
                    className="text-sm text-forest-400 mt-1 hover:text-gold-500 transition-colors"
                  >
                    contact@ies-ingredients.com
                  </a>
                </div>
              </div>

              {/* Premium trust badge */}
              <div className="mt-6 p-5 rounded-[16px] bg-gradient-to-br from-gold-500/10 to-gold-400/5 border border-gold-500/15">
                <p className="text-gold-600 font-semibold text-sm mb-1">Réponse sous 24h</p>
                <p className="text-forest-400 text-xs leading-relaxed">
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
