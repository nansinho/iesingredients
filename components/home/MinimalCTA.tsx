"use client";

import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function MinimalCTA() {
  const t = useTranslations("cta");

  return (
    <section className="bg-forest-950 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center relative z-10"
      >
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-medium block mb-5">
          {t("surtitle")}
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
          {t("title")}
        </h2>
        <p className="text-white/40 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gold-500 text-white hover:bg-gold-400 rounded-full px-8 h-12 font-semibold shadow-lg shadow-gold-500/20 transition-all duration-300"
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
            className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-full px-8 h-12 font-medium transition-all duration-300"
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
