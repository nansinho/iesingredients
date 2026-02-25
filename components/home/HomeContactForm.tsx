"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/ContactForm";

export function HomeContactForm() {
  const t = useTranslations("homeContact");

  return (
    <section className="py-24 md:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-forest-950 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-gray-500 text-lg mt-3 max-w-xl">
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
            <ContactForm />
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6 lg:mt-12">
              {/* Address */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#F5F5F7]">
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-forest-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Adresse</p>
                  <p className="text-sm text-gray-500 mt-1">Nice, France</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#F5F5F7]">
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-forest-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Téléphone</p>
                  <a
                    href="tel:+33493000000"
                    className="text-sm text-gray-500 mt-1 hover:text-forest-700 transition-colors"
                  >
                    +33 4 93 00 00 00
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#F5F5F7]">
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-forest-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a
                    href="mailto:contact@ies-ingredients.com"
                    className="text-sm text-gray-500 mt-1 hover:text-forest-700 transition-colors"
                  >
                    contact@ies-ingredients.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
