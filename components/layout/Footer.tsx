import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const currentYear = new Date().getFullYear();

  const certifications = ["COSMOS", "ECOCERT", "BIO", "VEGAN", "ISO 9001"];

  return (
    <footer className="bg-navy text-cream-light">
      {/* Top section with CTA strip */}
      <div className="border-b border-cream-light/[0.06]">
        <div className="max-w-[1400px] w-[90%] mx-auto py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream-light/50 text-sm">
            {t("description")}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="px-3 py-1 rounded-full border border-cream-light/[0.08] bg-cream-light/[0.03] text-[10px] font-semibold text-cream-light/40 tracking-wider"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] w-[90%] mx-auto py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <span className="text-2xl font-bold text-cream-light tracking-tight">
                IES <span className="text-peach">Ingredients</span>
              </span>
            </Link>
            <p className="text-cream-light/40 text-sm leading-relaxed max-w-md mb-6">
              {t("description")}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-peach hover:bg-peach-dark text-dark text-sm font-semibold transition-all duration-300 shadow-lg shadow-peach/20 hover:shadow-peach/30"
            >
              Demander un devis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-5 text-cream-light text-sm uppercase tracking-wider">
              {t("navigation")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/catalogue"
                  className="text-cream-light/40 hover:text-peach transition-colors duration-200"
                >
                  {nav("catalog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/entreprise"
                  className="text-cream-light/40 hover:text-peach transition-colors duration-200"
                >
                  {nav("company")}
                </Link>
              </li>
              <li>
                <Link
                  href="/equipe"
                  className="text-cream-light/40 hover:text-peach transition-colors duration-200"
                >
                  {nav("team")}
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="text-cream-light/40 hover:text-peach transition-colors duration-200"
                >
                  {nav("news")}
                </Link>
              </li>
              <li>
                <Link
                  href="/podcast"
                  className="text-cream-light/40 hover:text-peach transition-colors duration-200"
                >
                  {nav("podcast")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-cream-light text-sm uppercase tracking-wider">
              {nav("contact")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-brown/60 shrink-0" />
                <span className="text-cream-light/40">Nice, France</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brown/60 shrink-0" />
                <a
                  href="tel:+33493000000"
                  className="text-cream-light/40 hover:text-peach transition-colors duration-200"
                >
                  +33 4 93 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brown/60 shrink-0" />
                <a
                  href="mailto:contact@ies-ingredients.com"
                  className="text-cream-light/40 hover:text-peach transition-colors duration-200"
                >
                  contact@ies-ingredients.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream-light/[0.06]">
        <div className="max-w-[1400px] w-[90%] mx-auto py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream-light/30">
          <p>
            &copy; {currentYear} IES Ingredients. {t("rights")}.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-peach transition-colors duration-200 cursor-pointer">
              {t("privacy")}
            </span>
            <span className="hover:text-peach transition-colors duration-200 cursor-pointer">
              {t("terms")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
