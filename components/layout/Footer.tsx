import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Instagram,
  Linkedin,
  Facebook,
  Leaf,
  FlaskConical,
  Droplets,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

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
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/iesingredients/",
    color: "#1877F2",
  },
];

const certifications = [
  { name: "COSMOS", src: "/images/certifications/cosmos.svg" },
  { name: "ECOCERT", src: "/images/certifications/ecocert.svg" },
  { name: "BIO", src: "/images/certifications/bio.svg" },
  { name: "VEGAN", src: "/images/certifications/vegan.svg" },
  { name: "ISO 9001", src: "/images/certifications/iso9001.svg" },
];

const universes = [
  { key: "cosmetic" as const, icon: Leaf, href: { pathname: "/catalogue" as const, query: { univers: "cosmetique" } } },
  { key: "perfume" as const, icon: FlaskConical, href: { pathname: "/catalogue" as const, query: { univers: "parfum" } } },
  { key: "aroma" as const, icon: Droplets, href: { pathname: "/catalogue" as const, query: { univers: "arome" } } },
];

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* ═══════════════════════════════════════
          Newsletter Strip — peach accent
          ═══════════════════════════════════════ */}
      <div className="bg-[#F0C5B3]">
        <div className="w-[94%] mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E1F3D]/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[#2E1F3D]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#1a1a1a] text-sm">
                {t("newsletter")}
              </h4>
              <p className="text-[#2E1F3D]/60 text-sm">
                {t("newsletterDesc")}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder={t("newsletterPlaceholder")}
              className="h-11 px-4 rounded-full bg-white/70 border border-[#2E1F3D]/10 text-sm text-[#1a1a1a] placeholder:text-[#2E1F3D]/40 focus:outline-none focus:ring-2 focus:ring-[#2E1F3D]/20 flex-1 md:w-72"
            />
            <button className="h-11 px-6 rounded-full bg-[#2E1F3D] text-white text-sm font-semibold hover:bg-[#1E0F2D] transition-colors duration-300 shrink-0">
              {t("subscribe")}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Main Footer — IMMENSE, violet #2E1F3D
          ═══════════════════════════════════════ */}
      <div className="bg-[#2E1F3D] text-white">
        {/* Top section — Brand + Grid */}
        <div className="w-[94%] mx-auto pt-20 md:pt-28 pb-16 md:pb-20">
          {/* Brand hero area */}
          <div className="text-center mb-16 md:mb-20">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo-ies.png"
                alt="IES Ingredients"
                width={180}
                height={72}
                className="h-14 w-auto brightness-0 invert mx-auto"
              />
            </Link>
            <p className="text-white/40 text-base leading-relaxed max-w-xl mx-auto mb-8">
              {t("description")}
            </p>
            {/* Social icons row */}
            <div className="flex items-center justify-center gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300 hover:scale-110"
                    style={
                      {
                        "--hover-bg": `${social.color}30`,
                      } as React.CSSProperties
                    }
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-white/[0.06] mb-16 md:mb-20" />

          {/* Footer grid — 5 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12">
            {/* Column 1: Nos Univers */}
            <div>
              <h4 className="font-semibold mb-6 text-[#F0C5B3] text-xs uppercase tracking-[0.15em]">
                {t("ourUniverses")}
              </h4>
              <ul className="space-y-3.5 text-sm">
                {universes.map((u) => {
                  const Icon = u.icon;
                  return (
                    <li key={u.key}>
                      <Link
                        href={u.href}
                        className="flex items-center gap-2.5 text-white/40 hover:text-[#F0C5B3] transition-colors duration-200 group"
                      >
                        <Icon className="w-3.5 h-3.5 text-white/20 group-hover:text-[#F0C5B3]/60 transition-colors" />
                        {nav(u.key)}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link
                    href="/catalogue"
                    className="flex items-center gap-2.5 text-white/40 hover:text-[#F0C5B3] transition-colors duration-200 font-medium"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-white/20" />
                    {t("allCatalog")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="font-semibold mb-6 text-[#F0C5B3] text-xs uppercase tracking-[0.15em]">
                {t("navigation")}
              </h4>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link
                    href="/entreprise"
                    className="text-white/40 hover:text-[#F0C5B3] transition-colors duration-200"
                  >
                    {nav("company")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/equipe"
                    className="text-white/40 hover:text-[#F0C5B3] transition-colors duration-200"
                  >
                    {nav("team")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/actualites"
                    className="text-white/40 hover:text-[#F0C5B3] transition-colors duration-200"
                  >
                    {nav("news")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/podcast"
                    className="text-white/40 hover:text-[#F0C5B3] transition-colors duration-200"
                  >
                    {nav("podcast")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Aide & Contact */}
            <div>
              <h4 className="font-semibold mb-6 text-[#F0C5B3] text-xs uppercase tracking-[0.15em]">
                {t("helpContact")}
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#F0C5B3]/50 shrink-0" />
                  <span className="text-white/40">Nice, France</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#F0C5B3]/50 shrink-0" />
                  <a
                    href="tel:+33493000000"
                    className="text-white/40 hover:text-[#F0C5B3] transition-colors duration-200"
                  >
                    +33 4 93 00 00 00
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#F0C5B3]/50 shrink-0" />
                  <a
                    href="mailto:contact@ies-ingredients.com"
                    className="text-white/40 hover:text-[#F0C5B3] transition-colors duration-200"
                  >
                    contact@ies-ingredients.com
                  </a>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-[#F0C5B3] text-[#2E1F3D] text-sm font-semibold hover:bg-[#e6b5a3] transition-all duration-300"
              >
                {t("requestQuote")}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Column 4: Suivez-nous */}
            <div>
              <h4 className="font-semibold mb-6 text-[#F0C5B3] text-xs uppercase tracking-[0.15em]">
                {t("followUs")}
              </h4>
              <ul className="space-y-3.5">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <li key={social.name}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-white/40 hover:text-white transition-colors duration-200 group"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{ backgroundColor: `${social.color}20` }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{ color: social.color }}
                          />
                        </div>
                        <span className="text-sm">{social.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 5: Informations légales */}
            <div>
              <h4 className="font-semibold mb-6 text-[#F0C5B3] text-xs uppercase tracking-[0.15em]">
                {t("legalMentions")}
              </h4>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <span className="text-white/40 hover:text-[#F0C5B3] transition-colors duration-200 cursor-pointer">
                    {t("privacy")}
                  </span>
                </li>
                <li>
                  <span className="text-white/40 hover:text-[#F0C5B3] transition-colors duration-200 cursor-pointer">
                    {t("terms")}
                  </span>
                </li>
                <li>
                  <span className="text-white/40 hover:text-[#F0C5B3] transition-colors duration-200 cursor-pointer">
                    {t("cookies")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            Certification Logos — Grande section
            ═══════════════════════════════════════ */}
        <div className="border-t border-white/[0.06]">
          <div className="w-[94%] mx-auto py-16 md:py-20">
            <h4 className="text-center font-semibold text-[#F0C5B3] text-xs uppercase tracking-[0.2em] mb-10">
              {t("certifications")}
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  <Image
                    src={cert.src}
                    alt={cert.name}
                    width={80}
                    height={80}
                    className="w-16 h-16 md:w-20 md:h-20"
                  />
                  <span className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">
                    {cert.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            Partners Logos
            ═══════════════════════════════════════ */}
        <div className="border-t border-white/[0.06]">
          <div className="w-[94%] mx-auto py-12 md:py-16">
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 lg:gap-20 opacity-30">
              <Image
                src="/images/logo-dsm-firmenich.svg"
                alt="DSM-Firmenich"
                width={120}
                height={40}
                className="h-6 md:h-8 w-auto brightness-0 invert"
              />
              <Image
                src="/images/logo-givaudan.svg"
                alt="Givaudan"
                width={120}
                height={40}
                className="h-6 md:h-8 w-auto brightness-0 invert"
              />
              <Image
                src="/images/logo-sensient.svg"
                alt="Sensient"
                width={120}
                height={40}
                className="h-6 md:h-8 w-auto brightness-0 invert"
              />
              <Image
                src="/images/logo-mayflower.svg"
                alt="Mayflower"
                width={120}
                height={40}
                className="h-6 md:h-8 w-auto brightness-0 invert"
              />
              <Image
                src="/images/logo-xinrui.svg"
                alt="Xinrui"
                width={120}
                height={40}
                className="h-6 md:h-8 w-auto brightness-0 invert"
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            Bottom Bar
            ═══════════════════════════════════════ */}
        <div className="border-t border-white/[0.06]">
          <div className="w-[94%] mx-auto py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/25">
            <p>
              &copy; {currentYear} IES Ingredients. {t("rights")}.
            </p>
            <p className="text-white/15 text-xs font-playfair italic">
              {t("madeIn")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
