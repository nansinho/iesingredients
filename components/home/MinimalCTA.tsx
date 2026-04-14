"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";

export function MinimalCTA() {
  const t = useTranslations("cta");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0 scale-125" style={{ y }}>
        <Image
          src="/images/botanicals-flat.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-brand-primary/80" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-[94%] max-w-7xl mx-auto py-28 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Accent line */}
          <div className="w-12 h-0.5 bg-brand-accent-light mx-auto mb-8" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] leading-tight mb-5">
            Prêt à découvrir nos ingrédients ?{" "}
            <span className="font-playfair italic text-brand-accent-light">
              Contactez-nous.
            </span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg mb-12 leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="accent" size="xl">
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                {t("contact")}
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              className="bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:border-white/30 transition-all duration-300"
            >
              <Link href="/catalogue">
                {t("viewCatalog")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
