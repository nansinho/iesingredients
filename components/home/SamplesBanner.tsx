"use client";

import { ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function SamplesBanner() {
  const t = useTranslations("samplesBanner");

  return (
    <section className="bg-brown relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] w-[90%] mx-auto py-20 md:py-28 text-center relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-cream-light/15 border border-cream-light/25 flex items-center justify-center mx-auto mb-6">
          <Gift className="w-7 h-7 text-cream-light" />
        </div>

        <h2 className="text-cream-light tracking-tight">
          Échantillons <span className="font-playfair uppercase tracking-wide text-peach">gratuits</span>
        </h2>
        <p className="text-cream-light/70 mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          {t("description")}
        </p>

        <div className="mt-8">
          <Button
            asChild
            variant="premium"
            size="lg"
            className="bg-cream-light text-dark hover:bg-cream hover:text-dark"
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
