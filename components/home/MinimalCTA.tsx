"use client";

import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function MinimalCTA() {
  const t = useTranslations("cta");

  return (
    <section className="bg-forest-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 py-20 md:py-24 text-center"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          {t("title")}
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-forest-950 hover:bg-gray-100 rounded-full px-8 h-12 font-medium"
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
            className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-8 h-12 font-medium"
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
