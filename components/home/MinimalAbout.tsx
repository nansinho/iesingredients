"use client";

import Image from "next/image";
import { ArrowRight, Shield, Award, Clock, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function MinimalAbout() {
  const t = useTranslations("about");

  const features = [
    { icon: Shield, titleKey: "ethicalTitle" as const, descKey: "ethicalDesc" as const },
    { icon: Award, titleKey: "certifiedTitle" as const, descKey: "certifiedDesc" as const },
    { icon: Clock, titleKey: "fastTitle" as const, descKey: "fastDesc" as const },
    { icon: Users, titleKey: "expertTitle" as const, descKey: "expertDesc" as const },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
              <Image
                src="/images/leaves-hero.jpg"
                alt="Natural ingredients"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-forest-900 rounded-2xl shadow-xl p-6 border border-forest-700"
            >
              <p className="text-4xl md:text-5xl font-serif text-gold-400">30+</p>
              <p className="text-white/70 text-sm mt-1">{t("yearsExpertise")}</p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-gold-600 text-sm uppercase tracking-widest font-medium">
              {t("surtitle")}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-900 mt-4 mb-6">
              {t("title")}
            </h2>
            <p className="text-forest-700 text-lg leading-relaxed mb-8">
              {t("description")}
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-forest-50 hover:bg-forest-100 transition-colors border border-forest-100"
                >
                  <feature.icon className="w-5 h-5 text-gold-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-forest-900">{t(feature.titleKey)}</p>
                    <p className="text-sm text-forest-600">{t(feature.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/entreprise"
              className="inline-flex items-center gap-2 text-forest-900 font-medium hover:gap-3 hover:text-gold-600 transition-all group"
            >
              {t("discoverStory")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
