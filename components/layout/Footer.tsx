import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1d1d1f] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <span className="text-xl font-semibold text-white tracking-tight">
                IES Ingredients
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              {t("description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium mb-5 text-white text-sm">
              {t("navigation")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/catalogue"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {nav("catalog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/entreprise"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {nav("company")}
                </Link>
              </li>
              <li>
                <Link
                  href="/equipe"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {nav("team")}
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {nav("news")}
                </Link>
              </li>
              <li>
                <Link
                  href="/podcast"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {nav("podcast")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-5 text-white text-sm">
              {nav("contact")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                <span className="text-gray-400">Nice, France</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <a
                  href="tel:+33493000000"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  +33 4 93 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <a
                  href="mailto:contact@ies-ingredients.com"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  contact@ies-ingredients.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            &copy; {currentYear} IES Ingredients. {t("rights")}.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
              {t("privacy")}
            </span>
            <span className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
              {t("terms")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
