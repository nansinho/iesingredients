import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Users, Mail, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { TeamPageClient } from "@/components/team/TeamPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description =
    locale === "fr"
      ? "Rencontrez l'équipe IES Ingredients : des experts passionnés en ingrédients naturels au service de votre réussite."
      : "Meet the IES Ingredients team: passionate natural ingredient experts dedicated to your success.";

  return {
    title: t("teamTitle"),
    description,
    alternates: {
      canonical: `/${locale}/equipe`,
      languages: { fr: "/fr/equipe", en: "/en/team" },
    },
    openGraph: {
      title: t("teamTitle"),
      description,
      url: `https://ies-ingredients.com/${locale}/${locale === "fr" ? "equipe" : "team"}`,
      type: "website",
    },
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          {
            name: "IES Ingredients",
            url: `https://ies-ingredients.com/${locale}`,
          },
          {
            name: isFr ? "Équipe" : "Team",
            url: `https://ies-ingredients.com/${locale}/${isFr ? "equipe" : "team"}`,
          },
        ]}
      />

      {/* Compact hero with image */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <Image
          src="/images/botanicals-flat.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/70 to-brand-primary/30" />

        <div className="relative z-10 w-[94%] max-w-7xl mx-auto pb-10 pt-32">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold uppercase tracking-[0.12em] mb-4 backdrop-blur-sm">
            <Users className="w-3.5 h-3.5" />
            {isFr ? "Notre équipe" : "Our team"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.1]">
            {isFr ? "Les experts" : "The experts"}{" "}
            <span className="font-playfair italic text-white">
              IES
            </span>
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-xl mt-3 leading-relaxed">
            {isFr
              ? "Une équipe passionnée au service de vos projets en ingrédients naturels."
              : "A passionate team dedicated to your natural ingredient projects."}
          </p>
        </div>
      </section>

      {/* Team directory */}
      <TeamPageClient
        members={(members || []).map((m: Record<string, unknown>) => ({
          id: m.id as string,
          name: m.name as string,
          role_fr: m.role_fr as string,
          role_en: (m.role_en as string) || null,
          email: (m.email as string) || null,
          phone: (m.phone as string) || null,
          linkedin_url: (m.linkedin_url as string) || null,
          photo_url: (m.photo_url as string) || null,
          bio_fr: (m.bio_fr as string) || null,
          bio_en: (m.bio_en as string) || null,
          department: (m.department as string) || null,
          display_order: (m.display_order as number) || null,
        }))}
        locale={locale}
      />

      {/* Contact CTA */}
      <section className="py-16 md:py-20 bg-[var(--color-cream-light)]">
        <div className="w-[94%] max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark tracking-tight mb-3">
            {isFr ? "Envie de" : "Want to"}{" "}
            <span className="font-playfair italic text-brand-accent">
              {isFr ? "collaborer ?" : "collaborate?"}
            </span>
          </h2>
          <p className="text-brand-primary/45 text-base max-w-lg mx-auto mb-6">
            {isFr
              ? "Contactez notre équipe pour discuter de vos besoins en ingrédients naturels."
              : "Contact our team to discuss your natural ingredient needs."}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-[var(--color-charcoal)] transition-colors duration-200 shadow-md"
          >
            <Mail className="w-4 h-4" />
            {isFr ? "Nous contacter" : "Contact us"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
