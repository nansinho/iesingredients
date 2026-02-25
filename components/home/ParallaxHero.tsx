"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const certifications = [
  { name: "COSMOS" },
  { name: "ECOCERT" },
  { name: "BIO" },
  { name: "VEGAN" },
  { name: "ISO 9001" },
];

export function ParallaxHero() {
  const t = useTranslations("hero");
  const certT = useTranslations("certifications");

  return (
    <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Surtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm uppercase tracking-[0.2em] text-forest-600 font-medium mb-4"
        >
          {t("surtitle")}
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-forest-950 tracking-tight leading-[0.95] max-w-4xl"
        >
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </motion.h1>

        {/* Large Banner Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-12 relative w-full aspect-[21/9] sm:aspect-[2.5/1] rounded-2xl sm:rounded-3xl overflow-hidden group"
        >
          <Image
            src="/images/botanicals-flat.jpg"
            alt="IES Ingredients"
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 md:bottom-10 md:left-10">
            <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-3">
              {t("bannerText")}
            </p>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 hover:bg-white text-forest-950 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300"
            >
              {t("bannerCta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10"
        >
          <Button
            asChild
            size="lg"
            className="h-12 bg-forest-900 hover:bg-forest-800 text-white rounded-full px-8 text-sm font-medium transition-all duration-300"
          >
            <Link href="/catalogue">
              {t("cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-full px-8 text-sm font-medium border-gray-300 text-forest-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            <Link href="/contact">
              {t("ctaSecondary")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Certifications Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6"
        >
          <span className="text-xs uppercase tracking-widest text-gray-400 mr-2">
            {certT("title")}
          </span>
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex items-center justify-center h-10 px-4 rounded-lg bg-forest-50 text-xs font-semibold text-gray-600 tracking-wide"
            >
              {cert.name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
