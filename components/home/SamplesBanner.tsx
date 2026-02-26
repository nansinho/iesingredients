"use client";

import { ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function SamplesBanner() {
  const t = useTranslations("samplesBanner");

  return (
    <section className="bg-cream dark:bg-dark-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/8 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-lavender/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] w-[90%] mx-auto py-20 md:py-28 text-center relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-peach/15 border border-peach/25 flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
          <Gift className="w-7 h-7 text-peach-dark" />
        </div>

        <h2 className="text-dark dark:text-cream-light tracking-tight">
          Échantillons <span className="font-playfair italic text-brown">gratuits</span>
        </h2>
        <p className="text-dark/50 dark:text-cream-light/50 mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          {t("description")}
        </p>

        <div className="mt-8">
          <Button
            asChild
            variant="peach"
            size="lg"
          >
            <Link href="/contact">
              {t("cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
