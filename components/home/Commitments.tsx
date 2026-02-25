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
          className="mb-12"
        >
          <span className="text-sm uppercase tracking-[0.2em] text-forest-600 font-medium block mb-3">
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
          className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] rounded-2xl sm:rounded-3xl overflow-hidden mb-12"
        >
          <Image
            src="/images/leaves-hero.jpg"
            alt="Nos engagements"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                    {stat.value}
                  </p>
                  <p className="text-white/70 text-sm mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-forest-50 rounded-2xl p-6 hover:shadow-md transition-shadow duration-500"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-forest-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{t(feature.titleKey)}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{t(feature.descKey)}</p>
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
            className="inline-flex items-center gap-1.5 text-base font-medium text-forest-700 hover:text-forest-500 hover:gap-2.5 transition-all duration-300"
          >
            {t("link")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
