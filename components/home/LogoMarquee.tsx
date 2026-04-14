"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
  { name: "Givaudan", src: "/images/logo-givaudan.svg" },
  { name: "DSM-Firmenich", src: "/images/logo-dsm-firmenich.svg" },
  { name: "MayFlower", src: "/images/logo-mayflower.svg" },
  { name: "Sensient Beauty", src: "/images/logo-sensient.svg" },
  { name: "Xinrui Aromatics", src: "/images/logo-xinrui.svg" },
];

export function LogoMarquee() {
  return (
    <section className="py-10 md:py-14 bg-cream-light border-b border-cream-dark/20">
      <div className="w-[94%] max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-dark/25 mb-8"
        >
          Nos partenaires
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-3 md:grid-cols-5 items-center gap-y-6 gap-x-8"
        >
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="relative h-10 md:h-14 opacity-40 hover:opacity-70 transition-opacity duration-500"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
                sizes="20vw"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
