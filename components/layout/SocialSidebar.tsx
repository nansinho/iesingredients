"use client";

import { Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const socials = [
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/ies_ingredients/",
    color: "#E1306C",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/company/ies-ingredients/",
    color: "#0A66C2",
  },
];

export function SocialSidebar() {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2"
    >
      <div className="flex flex-col gap-1.5 p-1.5 rounded-full backdrop-blur-sm bg-dark/5 dark:bg-white/5 border border-dark/8 dark:border-white/10">
        {socials.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="group relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: `${social.color}15` }}
              />
              <Icon
                className="w-4 h-4 text-dark/30 dark:text-white/30 transition-colors duration-300 relative z-10"
                style={{
                  // Use CSS variable approach for hover color
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as SVGElement).style.color = social.color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as SVGElement).style.color = "";
                }}
              />
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}
