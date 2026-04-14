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
    <section className="py-24 md:py-32 bg-blue-mist relative overflow-hidden">

      <div className="w-[94%] max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark/10 border border-dark/15 text-dark text-xs font-semibold uppercase tracking-[0.15em] mb-5">
            <Award className="w-3.5 h-3.5" />
            {t("surtitle")}
          </span>
          <h2 className="text-dark tracking-tight">
            Nos <span className="font-playfair italic text-forest-green">engagements</span>.
          </h2>
        </motion.div>

        {/* Large Image with Stats Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full aspect-[16/7] sm:aspect-[2.4/1] rounded-2xl overflow-hidden mb-10 border border-dark/10"
        >
          <Image
            src="/images/leaves-hero.jpg"
            alt="Nos engagements"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />

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
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-dark leading-none">
                    {stat.value}
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm mt-1.5 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-dark/8 backdrop-blur-sm rounded-2xl p-6 border border-dark/10 hover:border-dark/25 hover:bg-dark/12 transition-all duration-500 group"
            >
              <div className="w-11 h-11 rounded-xl bg-dark/10 border border-dark/10 flex items-center justify-center mb-4 group-hover:bg-dark/15 transition-all duration-300">
                <feature.icon className="w-5 h-5 text-dark" />
              </div>
              <h3 className="font-bold text-dark mb-1.5 text-sm">{t(feature.titleKey)}</h3>
              <p className="text-sm text-dark/60 leading-relaxed">{t(feature.descKey)}</p>
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
            className="inline-flex items-center gap-2 text-base font-semibold text-dark hover:text-forest-green hover:gap-3 transition-all duration-300"
          >
            {t("link")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
