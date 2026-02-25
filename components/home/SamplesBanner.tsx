"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function SamplesBanner() {
  const t = useTranslations("samplesBanner");

  return (
    <section className="bg-forest-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {t("title")}
          </h2>
          <p className="text-gray-400 mt-2 max-w-lg text-sm md:text-base">
            {t("description")}
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 bg-white text-forest-950 hover:bg-gray-100 rounded-full px-8 h-12 text-sm font-medium transition-all duration-300"
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
