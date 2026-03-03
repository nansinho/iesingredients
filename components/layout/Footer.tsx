import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Instagram,
  Linkedin,
  Facebook,
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

const certifications = ["COSMOS", "ECOCERT", "BIO", "VEGAN", "ISO 9001"];

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* ── Newsletter Strip ── */}
      <div className="bg-[var(--brand-accent-light)]">
        <div className="w-[94%] mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
            </div>
            <div>
              <h4 className="font-semibold text-[var(--brand-primary)] text-sm">
                {t("newsletter")}
              </h4>
              <p className="text-[var(--brand-primary)]/60 text-sm">
                {t("newsletterDesc")}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder={t("newsletterPlaceholder")}
              className="h-11 px-4 rounded-full bg-white/70 border border-[var(--brand-primary)]/10 text-sm text-[var(--brand-primary)] placeholder:text-[var(--brand-primary)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 flex-1 md:w-72"
            />
            <button className="h-11 px-6 rounded-full bg-[var(--brand-primary)] text-white text-sm font-semibold hover:bg-[var(--brand-primary)]/90 transition-colors duration-300 shrink-0">
              {t("subscribe")}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="bg-navy text-cream-light">
        <div className="w-[94%] mx-auto py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-5">
              <Link href="/" className="inline-block mb-5">
                <Image
                  src="/images/logo-ies.png"
                  alt="IES Ingredients"
                  width={140}
                  height={56}
                  className="h-10 w-auto brightness-0 invert"
                />
              </Link>
              <p className="text-cream-light/40 text-sm leading-relaxed max-w-sm mb-8">
                {t("description")}
              </p>

              {/* Certifications */}
              <div className="mb-8">
                <h4 className="font-semibold mb-3 text-cream-light/60 text-xs uppercase tracking-wider">
                  {t("certifications")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cream-light/[0.08] bg-cream-light/[0.04] text-[11px] font-semibold text-cream-light/50 tracking-wider"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-mint/60" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mint text-[var(--brand-primary)] text-sm font-semibold hover:bg-[var(--brand-accent-hover)] transition-all duration-300 shadow-lg shadow-mint/10"
              >
                {t("requestQuote")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Navigation Column */}
            <div className="lg:col-span-2">
              <h4 className="font-semibold mb-5 text-cream-light text-sm uppercase tracking-wider">
                {t("navigation")}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/catalogue"
                    className="text-cream-light/40 hover:text-mint transition-colors duration-200"
                  >
                    {nav("catalog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/entreprise"
                    className="text-cream-light/40 hover:text-mint transition-colors duration-200"
                  >
                    {nav("company")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/equipe"
                    className="text-cream-light/40 hover:text-mint transition-colors duration-200"
                  >
                    {nav("team")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/actualites"
                    className="text-cream-light/40 hover:text-mint transition-colors duration-200"
                  >
                    {nav("news")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/podcast"
                    className="text-cream-light/40 hover:text-mint transition-colors duration-200"
                  >
                    {nav("podcast")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-cream-light/40 hover:text-mint transition-colors duration-200"
                  >
                    {nav("contact")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help & Contact Column */}
            <div className="lg:col-span-3">
              <h4 className="font-semibold mb-5 text-cream-light text-sm uppercase tracking-wider">
                {t("helpContact")}
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 text-mint/60 shrink-0" />
                  <span className="text-cream-light/40">Nice, France</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-mint/60 shrink-0" />
                  <a
                    href="tel:+33493000000"
                    className="text-cream-light/40 hover:text-mint transition-colors duration-200"
                  >
                    +33 4 93 00 00 00
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-mint/60 shrink-0" />
                  <a
                    href="mailto:contact@ies-ingredients.com"
                    className="text-cream-light/40 hover:text-mint transition-colors duration-200"
                  >
                    contact@ies-ingredients.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div className="lg:col-span-2">
              <h4 className="font-semibold mb-5 text-cream-light text-sm uppercase tracking-wider">
                {t("followUs")}
              </h4>
              <ul className="space-y-3">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <li key={social.name}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-cream-light/40 hover:text-cream-light transition-colors duration-200 group"
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
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="bg-navy border-t border-cream-light/[0.06]">
        <div className="w-[94%] mx-auto py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream-light/30">
          <p>
            &copy; {currentYear} IES Ingredients. {t("rights")}.
          </p>
          <p className="text-cream-light/20 text-xs hidden md:block">
            {t("madeIn")}
          </p>
          <div className="flex flex-wrap gap-6">
            <span className="hover:text-mint transition-colors duration-200 cursor-pointer">
              {t("legalMentions")}
            </span>
            <span className="hover:text-mint transition-colors duration-200 cursor-pointer">
              {t("privacy")}
            </span>
            <span className="hover:text-mint transition-colors duration-200 cursor-pointer">
              {t("terms")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
