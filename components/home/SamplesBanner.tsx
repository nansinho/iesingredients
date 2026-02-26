"use client";

import { ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function SamplesBanner() {
  const t = useTranslations("samplesBanner");

  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #e3cd8b 0%, #cc8860 50%, #b47068 100%)' }}>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-[94%] mx-auto py-20 md:py-28 text-center relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
          <Gift className="w-7 h-7 text-white" />
        </div>

        <h2 className="text-white tracking-tight">
          Échantillons <span className="font-playfair italic text-white/90">gratuits</span>
        </h2>
        <p className="text-white/70 mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
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
