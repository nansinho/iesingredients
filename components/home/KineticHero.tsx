"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";

const partners = [
  { name: "Givaudan", src: "/images/logo-givaudan.svg" },
  { name: "DSM-Firmenich", src: "/images/logo-dsm-firmenich.svg" },
  { name: "MayFlower", src: "/images/logo-mayflower.svg" },
  { name: "Sensient Beauty", src: "/images/logo-sensient.svg" },
  { name: "Xinrui Aromatics", src: "/images/logo-xinrui.svg" },
];

const scenes = [
  {
    id: "parfum",
    label: "Parfumerie",
    keyword: "Absolues · Naturels · Molécules",
    image: "/images/Parfum/Parfum Banniere.jpg",
    accent: "#D4907E",
  },
  {
    id: "cosmetique",
    label: "Cosmétique",
    keyword: "Actifs · Extraits · Huiles",
    image: "/images/Cosmetique/Banniere Cosmetique.jpg",
    accent: "#5B7B6B",
  },
  {
    id: "arome",
    label: "Arômes",
    keyword: "Naturels · Synthèse · Food grade",
    image: "/images/Aromes/Aromes Banniere.jpg",
    accent: "#D4907E",
  },
];

const SCENE_DURATION = 6000;

export function KineticHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % scenes.length);
    }, SCENE_DURATION);
    return () => clearInterval(id);
  }, []);

  const scene = scenes[index];

  return (
    <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-black text-white">
      {/* ── Cinematic backdrop with Ken Burns ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: SCENE_DURATION / 1000 + 2, ease: "linear" },
          }}
          className="absolute inset-0"
        >
          <Image
            src={scene.image}
            alt={scene.label}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          {/* Cinematic gradient — bottom darker */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/85" />
          {/* Side vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
        </motion.div>
      </AnimatePresence>

      {/* ── Film grain ── */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ═══════════ Content ═══════════ */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top bar — scene indicator */}
        <div className="pt-28 sm:pt-32 px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] font-semibold">
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${scene.id}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: scene.accent }}
                />
                <span className="text-white/90">{scene.label}</span>
                <span className="hidden sm:inline text-white/40 font-normal normal-case tracking-normal text-xs">
                  {scene.keyword}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Scene counter + progress */}
            <div className="flex items-center gap-3">
              <span className="text-white/40 font-mono normal-case tracking-normal text-xs">
                {String(index + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
              </span>
              <div className="hidden sm:flex gap-1">
                {scenes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className="relative h-[2px] w-8 bg-white/20 overflow-hidden"
                    aria-label={`Scène ${i + 1}`}
                  >
                    {i === index && (
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: SCENE_DURATION / 1000, ease: "linear" }}
                        key={`progress-${index}`}
                      />
                    )}
                    {i < index && <div className="absolute inset-0 bg-white/60" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center — title */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16">
          <div className="w-full max-w-6xl text-center mx-auto flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="leading-[1.05] tracking-[-0.035em] font-semibold"
              style={{ fontSize: "clamp(2.25rem, 4.2vw, 4.5rem)" }}
            >
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block text-white md:whitespace-nowrap"
              >
                Distributeur d&apos;ingrédients au service
              </motion.span>
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="block mt-2"
                style={{ color: scene.accent, transition: "color 1.4s ease" }}
              >
                de vos créations.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-8 text-base sm:text-lg text-white/60 max-w-xl leading-relaxed mx-auto"
            >
              Explorez nos matières premières, dédiées aux professionnels de la
              parfumerie, de la cosmétique et des arômes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/catalogue"
                className="group inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-full px-7 py-3.5 text-sm font-semibold shadow-lg shadow-brand-accent/20 transition-all duration-300"
              >
                <span>Explorer le catalogue</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300"
              >
                <span>Nous contacter</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom — integrated partners strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="pb-6 sm:pb-8 px-6 sm:px-10 lg:px-16"
        >
          {/* Divider with label */}
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold text-white/40 whitespace-nowrap">
              Nos partenaires
            </span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          {/* Partners row */}
          <div className="flex items-center justify-between gap-4">
            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="hidden sm:flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold text-white/40"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Scroll</span>
            </motion.div>

            {/* Logos — marquee on mobile, row on desktop */}
            <div className="flex-1 min-w-0 overflow-hidden sm:overflow-visible [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:[mask-image:none]">
              {/* Mobile: marquee */}
              <motion.div
                className="flex items-center gap-10 w-max sm:hidden"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              >
                {[...partners, ...partners].map((logo, i) => (
                  <div key={`${logo.name}-${i}`} className="relative h-7 w-20 shrink-0 opacity-60">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      className="object-contain brightness-0 invert"
                      sizes="80px"
                    />
                  </div>
                ))}
              </motion.div>

              {/* Desktop: evenly spaced row */}
              <div className="hidden sm:flex items-center justify-around gap-6 lg:gap-10">
                {partners.map((logo) => (
                  <div
                    key={logo.name}
                    className="relative h-8 lg:h-10 w-24 lg:w-28 opacity-50 hover:opacity-80 transition-opacity duration-300"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      className="object-contain brightness-0 invert"
                      sizes="112px"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stat */}
            <div className="hidden sm:block shrink-0 text-right">
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white/50">
                500+ références
              </div>
              <div className="text-white/30 text-[10px] mt-0.5">Allauch · Provence</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
