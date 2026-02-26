import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ContactForm } from "@/components/contact/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = locale === "fr"
    ? "Contactez IES Ingredients pour vos besoins en ingrédients naturels. Notre équipe est à votre disposition à Nice, France."
    : "Contact IES Ingredients for your natural ingredient needs. Our team is available in Nice, France.";

  return {
    title: t("contactTitle"),
    description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { fr: "/fr/contact", en: "/en/contact" },
    },
    openGraph: {
      title: t("contactTitle"),
      description,
      url: `https://ies-ingredients.com/${locale}/contact`,
      type: "website",
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: "Contact", url: `https://ies-ingredients.com/${locale}/contact` },
        ]}
      />

      {/* Hero */}
      <section className="bg-dark pt-32 sm:pt-36 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[120px] -translate-x-1/3" />

        <div className="max-w-[1400px] w-[90%] mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/10 border border-peach/20 text-peach text-xs font-semibold uppercase tracking-[0.15em] mb-5">
            <MessageCircle className="w-3.5 h-3.5" />
            Contact
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-cream-light tracking-[-0.03em] leading-[1.05] mb-6">
            {isFr ? "Contactez" : "Contact"}{" "}
            <span className="font-playfair italic text-peach">{isFr ? "nous" : "Us"}</span>
          </h1>
          <p className="text-cream-light/50 text-lg max-w-2xl">
            {isFr
              ? "Notre équipe est à votre disposition pour répondre à toutes vos questions."
              : "Our team is available to answer all your questions."}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 md:py-32 px-4 bg-white dark:bg-dark relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-lavender/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-peach/3 rounded-full blur-[120px]" />

        <div className="max-w-[1400px] w-[90%] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h2 className="text-dark dark:text-cream-light tracking-tight mb-8">
              {isFr ? "Nos" : "Our"}{" "}
              <span className="font-playfair italic text-brown">{isFr ? "coordonnées" : "details"}</span>.
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-light dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <MapPin className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-dark dark:text-cream-light text-sm">{isFr ? "Adresse" : "Address"}</p>
                  <p className="text-sm text-dark/50 dark:text-cream-light/50 mt-1">Nice, France</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-light dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <Phone className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-dark dark:text-cream-light text-sm">{isFr ? "Téléphone" : "Phone"}</p>
                  <a href="tel:+33493000000" className="text-sm text-dark/50 dark:text-cream-light/50 mt-1 hover:text-brown transition-colors">
                    +33 4 93 00 00 00
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-light dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <Mail className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-dark dark:text-cream-light text-sm">Email</p>
                  <a href="mailto:contact@ies-ingredients.com" className="text-sm text-dark/50 dark:text-cream-light/50 mt-1 hover:text-brown transition-colors">
                    contact@ies-ingredients.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-cream-light dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-300 group shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-peach/10 border border-peach/20 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-all">
                  <Clock className="w-5 h-5 text-peach-dark" />
                </div>
                <div>
                  <p className="font-medium text-dark dark:text-cream-light text-sm">{isFr ? "Horaires" : "Hours"}</p>
                  <p className="text-sm text-dark/50 dark:text-cream-light/50 mt-1">
                    {isFr ? "Lun - Ven : 9h - 18h" : "Mon - Fri: 9am - 6pm"}
                  </p>
                </div>
              </div>

              {/* Trust badge */}
              <div className="mt-6 p-5 rounded-2xl bg-peach/8 border border-peach/12">
                <p className="text-brown-dark dark:text-peach font-semibold text-sm mb-1">
                  {isFr ? "Réponse sous 24h" : "Response within 24h"}
                </p>
                <p className="text-dark/50 dark:text-cream-light/50 text-xs leading-relaxed">
                  {isFr
                    ? "Notre équipe commerciale vous répond rapidement pour toute demande d'échantillons ou de devis."
                    : "Our sales team responds quickly for any sample or quote request."}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-cream-light dark:bg-dark-card rounded-2xl p-6 sm:p-8 border border-brown/8 dark:border-brown/10 shadow-[0_4px_30px_rgba(163,123,104,0.04)]">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
