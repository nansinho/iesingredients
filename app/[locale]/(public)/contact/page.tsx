import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ContactForm } from "@/components/contact/ContactForm";
import { AnimateIn } from "@/components/ui/AnimateIn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = locale === "fr"
    ? "Contactez IES Ingredients pour vos besoins en ingrédients naturels. Notre équipe est à votre disposition à Allauch, Provence."
    : "Contact IES Ingredients for your natural ingredient needs. Our team is available in Allauch, Provence.";

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

      {/* ═══ Hero — minimal ═══ */}
      <section className="relative bg-brand-primary pt-32 sm:pt-40 pb-16 overflow-hidden">
        {/* Subtle radial accent */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, hsl(var(--brand-accent) / 0.15) 0%, transparent 50%)",
          }}
        />
        {/* Dotted grid */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 w-[94%] max-w-7xl mx-auto">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                Contact
              </span>
              <div className="h-px flex-1 max-w-xs bg-white/10" />
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <AnimateIn delay={0.1} y={30} className="lg:col-span-7">
              <h1
                className="text-white font-semibold tracking-[-0.03em] leading-[1.05]"
                style={{ fontSize: "clamp(2.25rem, 4.5vw, 4.5rem)" }}
              >
                {isFr ? "Parlons de" : "Let's discuss"}
                <br />
                <span className="text-white/80">{isFr ? "vos projets." : "your projects."}</span>
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.2} y={20} className="lg:col-span-5">
              <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-md">
                {isFr
                  ? "Notre équipe d'experts est à votre disposition pour répondre à vos questions sur nos ingrédients."
                  : "Our team of experts is available to answer all your questions about our ingredients."}
              </p>
              <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-white/40 font-semibold">
                <span>Réponse sous 24h</span>
                <span className="text-white/20">·</span>
                <span>Allauch, Provence</span>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ═══ Contact Cards — minimal, flush with hero ═══ */}
      <section className="bg-cream-light border-t border-dark/5">
        <div className="w-[94%] max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-dark/8">
            <a
              href="mailto:contact@ies-ingredients.com"
              className="group p-5 sm:p-7 flex flex-col gap-3 hover:bg-white transition-colors"
            >
              <div className="flex items-center justify-between">
                <Mail className="w-4 h-4 text-brand-accent" />
                <ArrowUpRight className="w-3.5 h-3.5 text-dark/25 group-hover:text-dark group-hover:rotate-45 transition-all duration-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark/40 font-semibold mb-1.5">
                  Email
                </p>
                <p className="text-sm font-medium text-dark truncate">
                  contact@ies-ingredients.com
                </p>
              </div>
            </a>

            <a
              href="tel:+33491000000"
              className="group p-5 sm:p-7 flex flex-col gap-3 hover:bg-white transition-colors"
            >
              <div className="flex items-center justify-between">
                <Phone className="w-4 h-4 text-brand-accent" />
                <ArrowUpRight className="w-3.5 h-3.5 text-dark/25 group-hover:text-dark group-hover:rotate-45 transition-all duration-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark/40 font-semibold mb-1.5">
                  {isFr ? "Téléphone" : "Phone"}
                </p>
                <p className="text-sm font-medium text-dark">+33 4 91 00 00 00</p>
              </div>
            </a>

            <div className="p-5 sm:p-7 flex flex-col gap-3">
              <MapPin className="w-4 h-4 text-brand-accent" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark/40 font-semibold mb-1.5">
                  {isFr ? "Adresse" : "Address"}
                </p>
                <p className="text-sm font-medium text-dark">Allauch, Provence</p>
              </div>
            </div>

            <div className="p-5 sm:p-7 flex flex-col gap-3">
              <Clock className="w-4 h-4 text-brand-accent" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark/40 font-semibold mb-1.5">
                  {isFr ? "Horaires" : "Hours"}
                </p>
                <p className="text-sm font-medium text-dark">
                  {isFr ? "Lun — Ven, 9h — 18h" : "Mon — Fri, 9am — 6pm"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Form Section ═══ */}
      <section className="py-20 md:py-28 bg-cream-light">
        <div className="w-[94%] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form */}
          <AnimateIn delay={0.1} y={30} className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-dark/5 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
              <div className="mb-8 pb-8 border-b border-dark/5">
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-dark/40 block mb-3">
                  {isFr ? "Formulaire" : "Form"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-dark tracking-[-0.02em] mb-3">
                  {isFr ? "Envoyez-nous un message" : "Send us a message"}
                </h2>
                <p className="text-sm text-dark/50 leading-relaxed max-w-md">
                  {isFr
                    ? "Remplissez ce formulaire et nous vous recontacterons dans les 24 heures."
                    : "Fill in this form and we'll get back to you within 24 hours."}
                </p>
              </div>
              <ContactForm />
            </div>
          </AnimateIn>

          {/* Side Info */}
          <AnimateIn delay={0.2} y={30} className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-dark/40 block mb-3">
                  {isFr ? "Pourquoi nous contacter" : "Why contact us"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-dark tracking-[-0.02em]">
                  {isFr
                    ? "Un interlocuteur dédié pour chaque besoin."
                    : "A dedicated contact for every need."}
                </h2>
              </div>

              <div className="space-y-px">
                {[
                  {
                    title: isFr ? "Échantillons gratuits" : "Free samples",
                    desc: isFr
                      ? "Testez nos ingrédients avant toute commande."
                      : "Test our ingredients before ordering.",
                  },
                  {
                    title: isFr ? "Conseil technique" : "Technical advice",
                    desc: isFr
                      ? "Nos experts vous accompagnent dans vos formulations."
                      : "Our experts guide you through your formulations.",
                  },
                  {
                    title: isFr ? "Devis personnalisé" : "Custom quote",
                    desc: isFr
                      ? "Offres adaptées à vos volumes et exigences."
                      : "Offers tailored to your volumes and requirements.",
                  },
                  {
                    title: isFr ? "Réponse sous 24h" : "Response within 24h",
                    desc: isFr
                      ? "Une équipe commerciale réactive, à votre écoute."
                      : "A responsive sales team, ready to listen.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 py-5 border-b border-dark/8 group/row hover:border-brand-accent/30 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-brand-accent mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark text-sm mb-1">{item.title}</p>
                      <p className="text-sm text-dark/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
