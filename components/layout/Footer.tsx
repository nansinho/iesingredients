import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold text-white">
                IES Ingredients
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              {t("description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium mb-4 text-white text-sm uppercase tracking-widest">
              {t("navigation")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/catalogue"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  {nav("catalog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/entreprise"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  {nav("company")}
                </Link>
              </li>
              <li>
                <Link
                  href="/equipe"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  {nav("team")}
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  {nav("news")}
                </Link>
              </li>
              <li>
                <Link
                  href="/podcast"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  {nav("podcast")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-white text-sm uppercase tracking-widest">
              {nav("contact")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-500 shrink-0" />
                <span className="text-white/60">Nice, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a
                  href="tel:+33493000000"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  +33 4 93 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a
                  href="mailto:contact@ies-ingredients.com"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                >
                  contact@ies-ingredients.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>
            &copy; {currentYear} IES Ingredients. {t("rights")}.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-gold-400 transition-colors cursor-pointer">
              {t("privacy")}
            </span>
            <span className="hover:text-gold-400 transition-colors cursor-pointer">
              {t("terms")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
