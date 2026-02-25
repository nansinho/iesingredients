"use client";

import { ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function SamplesBanner() {
  const t = useTranslations("samplesBanner");

  return (
    <section className="bg-forest-950 relative overflow-hidden">
      {/* Decorative warm gradient blob */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10"
      >
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/20 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {t("title")}
            </h2>
            <p className="text-white/40 mt-1.5 max-w-lg text-sm md:text-base leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 bg-gold-500 text-white hover:bg-gold-400 rounded-full px-8 h-12 text-sm font-semibold transition-all duration-300 shadow-lg shadow-gold-500/20"
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
