"use client";

import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function MinimalCTA() {
  const t = useTranslations("cta");

  return (
    <section className="relative overflow-hidden bg-peach">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] w-[90%] mx-auto py-24 md:py-36 text-center relative z-10"
      >
        <h2 className="text-dark tracking-tight mb-5">
          Prêt à découvrir nos <span className="font-playfair tracking-wide text-brown-dark">ingrédients</span> ?
        </h2>
        <p className="text-dark/60 text-base sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="default"
            size="xl"
            className="bg-dark text-cream-light hover:bg-dark/90"
          >
            <Link href="/contact">
              <Mail className="w-4 h-4 mr-2" />
              {t("contact")}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="border-dark/30 text-dark hover:bg-dark/10"
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
