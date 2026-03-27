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
    gradient: "from-[#f09433] via-[#e6683c] to-[#dc2743]",
    hoverBg: "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#dc2743]",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/company/ies-ingredients/",
    handle: "IES Ingredients",
    gradient: "from-[#0077B5] to-[#0A66C2]",
    hoverBg: "hover:bg-gradient-to-br hover:from-[#0077B5] hover:to-[#0A66C2]",
  },
];

export function SocialFollow() {
  const t = useTranslations("social");

  return (
    <section className="py-20 md:py-28 bg-[var(--brand-accent-light)]">
      <div className="w-[94%] max-w-7xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-[var(--brand-primary)] tracking-tight">
            {t("title")}{" "}
            <span className="font-playfair italic text-[var(--brand-primary)]/70">
              {t("titleAccent")}
            </span>
          </h2>
          <p className="text-[var(--brand-primary)]/60 mt-3 text-base max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Social cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
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
              className={`group relative w-full sm:w-72 overflow-hidden rounded-3xl bg-white border border-[var(--brand-primary)]/[0.06] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(46,31,61,0.12)] ${social.hoverBg} hover:border-transparent`}
            >
              {/* Icon + Arrow row */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${social.gradient} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl`}
                >
                  <social.icon className="w-6 h-6 text-white" />
                </div>
                <div className="w-9 h-9 rounded-full border border-[var(--brand-primary)]/10 flex items-center justify-center transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/20">
                  <ArrowUpRight className="w-4 h-4 text-[var(--brand-primary)]/40 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold text-[var(--brand-primary)] text-left transition-colors duration-300 group-hover:text-white">
                {social.name}
              </h3>
              <p className="text-sm text-[var(--brand-primary)]/50 text-left mt-1 transition-colors duration-300 group-hover:text-white/70">
                {social.handle}
              </p>

              {/* Follow button */}
              <div className="mt-6 flex justify-start">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]/50 border border-[var(--brand-primary)]/10 rounded-full px-4 py-2 transition-all duration-300 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/15">
                  {t("follow")}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
