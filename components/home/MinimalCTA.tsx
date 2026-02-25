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
      {/* Rose Blush gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-200 via-gold-100 to-cream-50" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-400/15 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 py-24 md:py-36 text-center relative z-10"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-950/10 border border-forest-950/10 text-forest-700 text-xs font-semibold uppercase tracking-[0.15em] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          {t("surtitle")}
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-forest-950 tracking-tight mb-5">
          {t("title")}
        </h2>
        <p className="text-forest-500 text-base sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-forest-950 text-white hover:bg-forest-800 rounded-full px-10 h-14 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] text-base"
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
            className="border-forest-300 text-forest-900 hover:bg-forest-50 hover:border-forest-400 rounded-full px-10 h-14 font-medium transition-all duration-300 text-base"
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
