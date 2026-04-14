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
    bg: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    shadow: "shadow-[0_8px_30px_rgba(225,48,108,0.4)]",
    hoverShadow: "hover:shadow-[0_20px_50px_rgba(225,48,108,0.5)]",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/company/ies-ingredients/",
    handle: "IES Ingredients",
    bg: "bg-[#0A66C2]",
    shadow: "shadow-[0_8px_30px_rgba(10,102,194,0.4)]",
    hoverShadow: "hover:shadow-[0_20px_50px_rgba(10,102,194,0.5)]",
  },
];

export function SocialFollow() {
  const t = useTranslations("social");

  return (
    <section className="py-20 md:py-28 bg-brand-accent-light">
      <div className="w-[94%] max-w-7xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-brand-primary tracking-tight">
            {t("title")}{" "}
            <span className="font-playfair italic text-brand-primary/70">
              {t("titleAccent")}
            </span>
          </h2>
          <p className="text-brand-primary/60 mt-3 text-base max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Social cards - bold & colorful */}
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
              className={`group relative overflow-hidden rounded-3xl ${social.bg} ${social.shadow} ${social.hoverShadow} p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]`}
            >
              {/* Decorative glow circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.07] blur-xl" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center gap-5">
                {/* Large icon */}
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <social.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {social.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    {social.handle}
                  </p>
                </div>

                {/* Follow button */}
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
