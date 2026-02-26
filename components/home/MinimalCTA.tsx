"use client";

import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function MinimalCTA() {
  const t = useTranslations("cta");

  return (
    <section className="relative overflow-hidden">
      {/* Warm cream gradient background */}
      <div className="absolute inset-0 section-cream" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-400/8 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10 py-24 md:py-36 text-center relative z-10"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-600 text-xs font-semibold uppercase tracking-[0.15em] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          {t("surtitle")}
        </span>
        <h2 className="text-forest-950 tracking-tight mb-5">
          {t("title")}
        </h2>
        <p className="text-forest-400 text-base sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gold-500 text-white hover:bg-gold-600 rounded-full px-10 h-14 font-semibold shadow-xl shadow-gold-500/25 hover:shadow-gold-500/40 transition-all duration-300 hover:scale-[1.02] text-base"
          >
            <Link href="/contact">
              <Mail className="w-4 h-4 mr-2" />
              {t("contact")}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-forest-200 text-forest-900 hover:bg-forest-50 hover:border-forest-300 rounded-full px-10 h-14 font-medium transition-all duration-300 text-base"
          >
            <Link href="/catalogue">
              {t("viewCatalog")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
