"use client";

import Image from "next/image";
import { ArrowRight, Leaf, Search, Award, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const features = [
  { icon: Leaf, titleKey: "feature1Title" as const, descKey: "feature1Desc" as const },
  { icon: Search, titleKey: "feature2Title" as const, descKey: "feature2Desc" as const },
  { icon: Award, titleKey: "feature3Title" as const, descKey: "feature3Desc" as const },
  { icon: Users, titleKey: "feature4Title" as const, descKey: "feature4Desc" as const },
];

export function Commitments() {
  const t = useTranslations("commitments");

  const stats = [
    { value: t("stat1"), label: t("stat1Label") },
    { value: t("stat2"), label: t("stat2Label") },
    { value: t("stat3"), label: t("stat3Label") },
    { value: t("stat4"), label: t("stat4Label") },
  ];

  return (
    <section className="py-24 md:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-forest-500 font-medium block mb-4">
            {t("surtitle")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-forest-950 tracking-tight">
            {t("title")}
          </h2>
        </motion.div>

        {/* Large Image with Stats Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full aspect-[16/7] sm:aspect-[2.4/1] rounded-2xl sm:rounded-3xl overflow-hidden mb-10 border border-forest-200"
        >
          <Image
            src="/images/leaves-hero.jpg"
            alt="Nos engagements"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/20 to-transparent" />

          {/* Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm mt-1.5 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature Cards Grid — with borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-forest-200 hover:border-gold-400 hover:shadow-lg transition-all duration-500 group"
            >
              <div className="w-11 h-11 rounded-xl bg-gold-100 border border-gold-200 flex items-center justify-center mb-4 group-hover:bg-gold-200 transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-gold-700" />
              </div>
              <h3 className="font-bold text-forest-950 mb-1.5 text-sm">{t(feature.titleKey)}</h3>
              <p className="text-sm text-forest-400 leading-relaxed">{t(feature.descKey)}</p>
            </motion.div>
          ))}
        </div>

        {/* Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/entreprise"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-gold-600 hover:text-gold-500 hover:gap-2.5 transition-all duration-300"
          >
            {t("link")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
