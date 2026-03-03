"use client";

import { Instagram, Linkedin, Facebook } from "lucide-react";
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
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/iesingredients/",
    handle: "IES Ingredients",
    color: "#1877F2",
  },
];

export function SocialFollow() {
  const t = useTranslations("social");

  return (
    <section className="py-20 md:py-28 bg-[var(--brand-accent-light)]">
      <div className="w-[94%] mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/50 border border-white/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(46,31,61,0.15)] hover:bg-white/80 hover:border-white/80"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${social.color}15` }}
              >
                <social.icon
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: social.color }}
                />
              </div>
              <div>
                <p className="text-[var(--brand-primary)] font-semibold text-base transition-colors">
                  {social.name}
                </p>
                <p className="text-[var(--brand-primary)]/50 text-sm mt-0.5 transition-colors">
                  {social.handle}
                </p>
              </div>
              <span className="text-xs font-semibold text-[var(--brand-primary)]/40 uppercase tracking-wider group-hover:text-[var(--brand-primary)]/70 transition-colors">
                {t("follow")}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
