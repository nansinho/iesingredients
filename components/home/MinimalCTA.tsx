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
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background image — parallax scroll effect */}
      <motion.div className="absolute inset-0 scale-125" style={{ y }}>
        <Image
          src="/images/botanicals-flat.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
        {/* Single solid overlay */}
        <div className="absolute inset-0 bg-[var(--brand-primary)]/80" />
      </motion.div>

      {/* Content — cleanly separated */}
      <div className="relative z-10 w-[94%] max-w-7xl mx-auto py-28 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-white tracking-tight mb-5">
            Prêt à découvrir nos{" "}
            <span className="font-playfair italic text-[var(--brand-accent-light)]">
              ingrédients
            </span>{" "}
            ?
          </h2>
          <p className="text-white/60 text-base sm:text-lg mb-12 leading-relaxed">
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
