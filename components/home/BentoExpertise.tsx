"use client";

import Image from "next/image";
import { ArrowRight, Leaf, Droplets, Cherry } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export function BentoExpertise() {
  const t = useTranslations("expertise");
  const cat = useTranslations("categories");

  return (
    <section className="py-24 px-4 bg-forest-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4 block">
            {t("surtitle")}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {/* Large Botanical Image */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer"
          >
            <Image
              src="/images/botanicals-flat.jpg"
              alt="Botanicals"
              fill
              className="object-cover min-h-[400px] md:min-h-[500px] group-hover:scale-[1.08] transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-gold-400 text-sm uppercase tracking-widest mb-2 block">
                {t("natural")}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-white">
                {t("botanicalIngredients")}
              </h3>
            </div>
          </motion.div>

          {/* Cosmetic Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            className="col-span-1 bg-forest-800 rounded-3xl p-6 flex flex-col justify-between min-h-[200px] group cursor-pointer border border-forest-700"
          >
            <Leaf className="w-8 h-8 text-gold-400" />
            <div>
              <span className="text-gold-400/80 text-xs uppercase tracking-widest">
                {cat("cosmetic")}
              </span>
              <p className="text-2xl md:text-3xl font-serif text-white mt-1">2000+</p>
              <p className="text-white/60 text-sm mt-1">{t("naturalActives")}</p>
              <Link
                href={{ pathname: "/catalogue", query: { category: "cosmetique" } }}
                className="inline-flex items-center text-gold-400 hover:text-gold-300 text-sm mt-3 group-hover:gap-2 transition-all"
              >
                {cat("explore")}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Perfume Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            className="col-span-1 bg-forest-800 rounded-3xl p-6 flex flex-col justify-between min-h-[200px] group cursor-pointer border border-forest-700"
          >
            <Droplets className="w-8 h-8 text-gold-400" />
            <div>
              <span className="text-gold-400/80 text-xs uppercase tracking-widest">
                {cat("perfume")}
              </span>
              <p className="text-2xl md:text-3xl font-serif text-white mt-1">1500+</p>
              <p className="text-white/60 text-sm mt-1">{t("rareEssences")}</p>
              <Link
                href={{ pathname: "/catalogue", query: { category: "parfum" } }}
                className="inline-flex items-center text-gold-400 hover:text-gold-300 text-sm mt-3 group-hover:gap-2 transition-all"
              >
                {cat("explore")}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Serum Collection Image */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="col-span-2 md:col-span-1 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[200px]"
          >
            <Image
              src="/images/serum-collection.jpg"
              alt="Serums"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-600"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="text-white/90 text-sm font-medium">
                {t("serumCollection")}
              </span>
            </div>
          </motion.div>

          {/* Aroma Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            className="col-span-1 bg-forest-800 rounded-3xl p-6 flex flex-col justify-between min-h-[200px] group cursor-pointer border border-forest-700"
          >
            <Cherry className="w-8 h-8 text-gold-400" />
            <div>
              <span className="text-gold-400/80 text-xs uppercase tracking-widest">
                {cat("aroma")}
              </span>
              <p className="text-2xl md:text-3xl font-serif text-white mt-1">1500+</p>
              <p className="text-white/60 text-sm mt-1">{t("foodFlavors")}</p>
              <Link
                href={{ pathname: "/catalogue", query: { category: "arome" } }}
                className="inline-flex items-center text-gold-400 hover:text-gold-300 text-sm mt-3 group-hover:gap-2 transition-all"
              >
                {cat("explore")}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
