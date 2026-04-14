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
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="w-[94%] max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-[0.15em] mb-5">
            <Award className="w-3.5 h-3.5" />
            {t("surtitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark tracking-[-0.03em] leading-[1.05]">
            Nos{" "}
            <span className="font-playfair italic text-brand-accent">
              engagements
            </span>
            .
          </h2>
        </motion.div>

        {/* Stats row — large numbers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="text-center py-8 px-4 rounded-2xl bg-cream-light border border-cream-dark/30"
            >
              <p className="text-4xl sm:text-5xl md:text-display-sm font-bold text-brand-primary tracking-tight leading-none">
                {stat.value}
              </p>
              <p className="text-dark/40 text-sm font-medium mt-3 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Image + features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden"
          >
            <Image
              src="/images/leaves-hero.jpg"
              alt="Nos engagements qualité"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/30 to-transparent" />
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="rounded-2xl p-6 bg-cream-light border border-cream-dark/20 hover:border-brand-accent/20 hover:shadow-lg transition-all duration-500 group"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-primary/8 flex items-center justify-center mb-4 group-hover:bg-brand-accent/10 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-brand-primary group-hover:text-brand-accent transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-dark text-sm mb-1.5">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-dark/50 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/entreprise"
            className="inline-flex items-center gap-2 text-base font-semibold text-brand-primary hover:text-brand-accent hover:gap-3 transition-all duration-300"
          >
            {t("link")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
