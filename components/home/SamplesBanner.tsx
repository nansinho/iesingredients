"use client";

import { ArrowRight, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function SamplesBanner() {
  const t = useTranslations("samplesBanner");

  return (
    <section className="relative overflow-hidden">
      {/* Blush/Rose gradient background */}
      <div className="absolute inset-0 section-parfum-light" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/15 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10"
      >
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center shrink-0 animate-glow-pulse">
            <Gift className="w-7 h-7 text-gold-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span className="text-[11px] uppercase tracking-[0.15em] text-gold-700 font-semibold">
                Offre exclusive
              </span>
            </div>
            <h2 className="text-forest-950 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-forest-500 mt-2 max-w-xl text-sm md:text-base leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 bg-forest-950 text-white hover:bg-forest-800 rounded-full px-10 h-13 text-sm font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
        >
          <Link href="/contact">
            {t("cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
