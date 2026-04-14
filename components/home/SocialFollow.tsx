"use client";

import { Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const socials = [
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/ies_ingredients/",
    handle: "@ies_ingredients",
    bg: "bg-gradient-to-br from-gold-600 via-arome to-parfum",
    hoverShadow:
      "hover:shadow-[0_20px_50px_rgba(212,144,126,0.35)]",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/company/ies-ingredients/",
    handle: "IES Ingredients",
    bg: "bg-brand-primary",
    hoverShadow:
      "hover:shadow-[0_20px_50px_rgba(46,31,61,0.35)]",
  },
];

export function SocialFollow() {
  const t = useTranslations("social");

  return (
    <section className="py-20 md:py-28 bg-cream-light">
      <div className="w-[94%] max-w-7xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark tracking-[-0.03em] leading-[1.05]">
            {t("title")}{" "}
            <span className="font-playfair italic text-brand-accent">
              {t("titleAccent")}
            </span>
          </h2>
          <p className="text-dark/45 mt-4 text-base max-w-lg mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Social cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`group relative overflow-hidden rounded-3xl ${social.bg} ${social.hoverShadow} p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2 shadow-lg`}
            >
              {/* Decorative glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <social.icon
                    className="w-7 h-7 text-white"
                    strokeWidth={1.5}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {social.name}
                  </h3>
                  <p className="text-white/50 text-sm mt-1">{social.handle}</p>
                </div>

                <span className="inline-flex items-center gap-2 text-sm font-medium text-white bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2.5 transition-all duration-300 group-hover:bg-white/25 group-hover:border-white/30 group-hover:gap-3">
                  {t("follow")}
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
