"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";

export function SamplesBanner() {
  const t = useTranslations("samplesBanner");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[420px] md:min-h-[500px] flex items-center justify-center"
    >
      {/* Background with parallax */}
      <motion.div className="absolute inset-0 scale-115" style={{ y }}>
        <Image
          src="/images/hero-botanical.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-primary/75" />

      {/* Content */}
      <div className="relative z-10 w-[94%] max-w-3xl mx-auto text-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Accent line */}
          <div className="w-12 h-0.5 bg-brand-accent mx-auto mb-8" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] leading-tight">
            Chaque création
            <br />
            <span className="font-playfair italic text-brand-accent-light">
              mérite l&apos;exceptionnel.
            </span>
          </h2>

          <p className="text-white/50 text-base sm:text-lg mt-6 max-w-md mx-auto leading-relaxed">
            {t("description")}
          </p>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 mt-10 bg-brand-accent text-white rounded-full px-8 py-4 text-sm font-semibold hover:bg-brand-accent-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-accent/20"
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
