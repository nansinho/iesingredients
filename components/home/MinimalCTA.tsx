"use client";

import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function MinimalCTA() {
  const t = useTranslations("cta");

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-700/50 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4 block"
        >
          {t("surtitle")}
        </motion.span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
          {t("title")}
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">{t("subtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-full px-8 shadow-lg shadow-gold-500/25"
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
            className="border-gold-400/30 text-gold-400 hover:bg-gold-400/10 hover:border-gold-400/50 rounded-full px-8"
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
