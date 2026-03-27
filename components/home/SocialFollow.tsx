"use client";

import { Instagram, Linkedin, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const socials = [
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/ies_ingredients/",
    handle: "@ies_ingredients",
    color: "#E1306C",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/company/ies-ingredients/",
    handle: "IES Ingredients",
    color: "#0A66C2",
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

        {/* Social links - elegant inline style */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group flex items-center gap-4 rounded-full border border-[var(--brand-primary)]/10 bg-[var(--brand-primary)]/[0.04] backdrop-blur-sm pl-2 pr-6 py-2 transition-all duration-400 hover:border-[var(--brand-primary)]/25 hover:bg-[var(--brand-primary)]/[0.08] hover:shadow-[0_8px_30px_rgba(46,31,61,0.08)]"
            >
              {/* Icon circle */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${social.color}12` }}
              >
                <social.icon
                  className="w-[18px] h-[18px] transition-colors duration-300"
                  style={{ color: social.color }}
                />
              </div>

              {/* Text */}
              <div className="text-left">
                <p className="text-sm font-semibold text-[var(--brand-primary)] leading-tight">
                  {social.name}
                </p>
                <p className="text-xs text-[var(--brand-primary)]/45 leading-tight mt-0.5">
                  {social.handle}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-4 h-4 text-[var(--brand-primary)]/25 ml-1 transition-all duration-300 group-hover:text-[var(--brand-primary)]/50 group-hover:translate-x-1" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
