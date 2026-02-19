import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ContactForm } from "@/components/contact/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("contactTitle"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { fr: "/fr/contact", en: "/en/contact" },
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
      <section className="bg-forest-950 pt-28 sm:pt-32 pb-16">
        <div className="container-luxe">
          <span className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4 block">
            Contact
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {isFr ? "Contactez-Nous" : "Contact Us"}
          </h1>
          <p className="text-cream-200 text-lg max-w-2xl">
            {isFr
              ? "Notre équipe est à votre disposition pour répondre à toutes vos questions."
              : "Our team is available to answer all your questions."}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-3xl text-forest-900 mb-8">
              {isFr ? "Nos Coordonnées" : "Our Details"}
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-medium text-forest-900">{isFr ? "Adresse" : "Address"}</h3>
                  <p className="text-forest-600 mt-1">Nice, France</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-medium text-forest-900">{isFr ? "Téléphone" : "Phone"}</h3>
                  <a href="tel:+33493000000" className="text-forest-600 mt-1 hover:text-gold-600 transition-colors">
                    +33 4 93 00 00 00
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-medium text-forest-900">Email</h3>
                  <a href="mailto:contact@ies-ingredients.com" className="text-forest-600 mt-1 hover:text-gold-600 transition-colors">
                    contact@ies-ingredients.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-medium text-forest-900">{isFr ? "Horaires" : "Hours"}</h3>
                  <p className="text-forest-600 mt-1">
                    {isFr ? "Lun - Ven : 9h - 18h" : "Mon - Fri: 9am - 6pm"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
