import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ContactForm } from "@/components/contact/ContactForm";
import { AnimateIn, StaggerGrid, StaggerItem } from "@/components/ui/AnimateIn";

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

      {/* Hero — Immersive with background image */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/serum-collection.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)] via-[var(--brand-primary)]/75 to-[var(--brand-primary)]/40" />
        </div>

        <div className="relative z-10 w-[94%] mx-auto pb-24 pt-40 text-center">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-6 backdrop-blur-sm">
              <MessageCircle className="w-3.5 h-3.5" />
              Contact
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6">
              {isFr ? "Parlons de vos" : "Let's discuss your"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent-light)]">{isFr ? "projets" : "projects"}</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {isFr
                ? "Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions sur nos ingrédients naturels."
                : "Our team of experts is available to answer all your questions about our natural ingredients."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Quick Contact Bar — Glass overlay */}
      <section className="relative z-20 -mt-12">
        <div className="max-w-[1100px] w-[90%] mx-auto">
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StaggerItem>
              <a href="mailto:contact@ies-ingredients.com" className="flex items-center gap-3 p-4 rounded-2xl bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border border-brown/8 dark:border-brown/10 shadow-[0_12px_40px_rgba(46,31,61,0.12)] hover:shadow-[0_16px_50px_rgba(46,31,61,0.18)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent-light)]/15 border border-[var(--brand-accent-light)]/25 flex items-center justify-center shrink-0 group-hover:bg-[var(--brand-accent-light)]/25 transition-all">
                  <Mail className="w-4.5 h-4.5 text-[var(--brand-accent)]" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-dark dark:text-cream-light text-sm">Email</p>
                  <p className="text-xs text-dark/50 dark:text-cream-light/50 truncate">contact@ies-ingredients.com</p>
                </div>
              </a>
            </StaggerItem>
            <StaggerItem>
              <a href="tel:+33493000000" className="flex items-center gap-3 p-4 rounded-2xl bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border border-brown/8 dark:border-brown/10 shadow-[0_12px_40px_rgba(46,31,61,0.12)] hover:shadow-[0_16px_50px_rgba(46,31,61,0.18)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent-light)]/15 border border-[var(--brand-accent-light)]/25 flex items-center justify-center shrink-0 group-hover:bg-[var(--brand-accent-light)]/25 transition-all">
                  <Phone className="w-4.5 h-4.5 text-[var(--brand-accent)]" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-dark dark:text-cream-light text-sm">{isFr ? "Téléphone" : "Phone"}</p>
                  <p className="text-xs text-dark/50 dark:text-cream-light/50">+33 4 93 00 00 00</p>
                </div>
              </a>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border border-brown/8 dark:border-brown/10 shadow-[0_12px_40px_rgba(46,31,61,0.12)] group">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent-light)]/15 border border-[var(--brand-accent-light)]/25 flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-[var(--brand-accent)]" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-dark dark:text-cream-light text-sm">{isFr ? "Adresse" : "Address"}</p>
                  <p className="text-xs text-dark/50 dark:text-cream-light/50">Nice, France</p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border border-brown/8 dark:border-brown/10 shadow-[0_12px_40px_rgba(46,31,61,0.12)] group">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent-light)]/15 border border-[var(--brand-accent-light)]/25 flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5 text-[var(--brand-accent)]" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-dark dark:text-cream-light text-sm">{isFr ? "Horaires" : "Hours"}</p>
                  <p className="text-xs text-dark/50 dark:text-cream-light/50">{isFr ? "Lun - Ven : 9h - 18h" : "Mon - Fri: 9am - 6pm"}</p>
                </div>
              </div>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-dark relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-lavender/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-peach/3 rounded-full blur-[120px]" />

        <div className="w-[94%] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form — main column */}
          <AnimateIn delay={0.1} y={30} className="lg:col-span-3">
            <div className="bg-cream-light dark:bg-dark-card rounded-2xl p-6 sm:p-8 md:p-10 border border-brown/8 dark:border-brown/10 shadow-[0_8px_40px_rgba(200,168,168,0.06)]">
              <ContactForm />
            </div>
          </AnimateIn>

          {/* Side Info */}
          <AnimateIn delay={0.2} y={30} className="lg:col-span-2">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-dark dark:text-cream-light tracking-tight mb-2">
                  {isFr ? "Pourquoi nous" : "Why"}{" "}
                  <span className="font-playfair italic text-brown dark:text-peach">{isFr ? "contacter ?" : "contact us?"}</span>
                </h2>
                <p className="text-sm text-dark/50 dark:text-cream-light/50 leading-relaxed">
                  {isFr
                    ? "Que vous cherchiez des échantillons, des informations techniques ou un partenariat, notre équipe vous accompagne."
                    : "Whether you need samples, technical information or a partnership, our team is here to help."}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-cream dark:bg-dark border border-brown/6 dark:border-brown/8">
                  <CheckCircle2 className="w-5 h-5 text-[var(--brand-primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-dark dark:text-cream-light text-sm">
                      {isFr ? "Échantillons gratuits" : "Free samples"}
                    </p>
                    <p className="text-xs text-dark/45 dark:text-cream-light/45 mt-0.5">
                      {isFr ? "Testez nos ingrédients avant de commander" : "Test our ingredients before ordering"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-cream dark:bg-dark border border-brown/6 dark:border-brown/8">
                  <CheckCircle2 className="w-5 h-5 text-[var(--brand-primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-dark dark:text-cream-light text-sm">
                      {isFr ? "Conseil technique" : "Technical advice"}
                    </p>
                    <p className="text-xs text-dark/45 dark:text-cream-light/45 mt-0.5">
                      {isFr ? "Nos experts vous guident dans vos formulations" : "Our experts guide you in your formulations"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-cream dark:bg-dark border border-brown/6 dark:border-brown/8">
                  <CheckCircle2 className="w-5 h-5 text-[var(--brand-primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-dark dark:text-cream-light text-sm">
                      {isFr ? "Devis personnalisé" : "Custom quote"}
                    </p>
                    <p className="text-xs text-dark/45 dark:text-cream-light/45 mt-0.5">
                      {isFr ? "Offres adaptées à vos volumes et besoins" : "Offers adapted to your volumes and needs"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust badge */}
              <div className="p-5 rounded-2xl bg-[var(--brand-accent-light)]/10 border border-[var(--brand-accent-light)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Send className="w-4 h-4 text-[var(--brand-accent)]" />
                  <p className="text-[var(--brand-primary)] dark:text-[var(--brand-accent-light)] font-semibold text-sm">
                    {isFr ? "Réponse sous 24h" : "Response within 24h"}
                  </p>
                </div>
                <p className="text-dark/50 dark:text-cream-light/50 text-xs leading-relaxed">
                  {isFr
                    ? "Notre équipe commerciale vous répond rapidement pour toute demande d'échantillons ou de devis."
                    : "Our sales team responds quickly for any sample or quote request."}
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
