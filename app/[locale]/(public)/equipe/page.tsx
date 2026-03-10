import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Users, Mail, ArrowRight, Heart, Globe, Award } from "lucide-react";
import { Link } from "@/i18n/routing";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem } from "@/components/ui/AnimateIn";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { TeamPageClient } from "@/components/team/TeamPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = locale === "fr"
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
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Équipe" : "Team", url: `https://ies-ingredients.com/${locale}/${isFr ? "equipe" : "team"}` },
        ]}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <ParallaxBackground className="absolute inset-0">
          <Image
            src="/images/botanicals-flat.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)] via-[var(--brand-primary)]/75 to-[var(--brand-primary)]/40" />
        </ParallaxBackground>

        <div className="relative z-10 w-[94%] mx-auto pb-20 pt-40 text-center">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-5 backdrop-blur-sm">
              <Users className="w-3.5 h-3.5" />
              {isFr ? "Les personnes derrière IES" : "The people behind IES"}
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6">
              {isFr ? "Notre" : "Our"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent-light)]">{isFr ? "Équipe" : "Team"}</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {isFr
                ? "Une équipe passionnée d'experts en ingrédients naturels, au service de votre réussite."
                : "A passionate team of natural ingredient experts, dedicated to your success."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-cream-light dark:bg-dark border-t border-[var(--brand-primary)]/8 dark:border-white/10">
        <StaggerGrid className="w-[94%] mx-auto grid grid-cols-3 gap-8 py-10 text-center">
          {[
            { icon: Heart, valueFr: "Passionnés", valueEn: "Passionate", labelFr: "Équipe dédiée", labelEn: "Dedicated team" },
            { icon: Globe, valueFr: "International", valueEn: "International", labelFr: "Réseau mondial", labelEn: "Global network" },
            { icon: Award, valueFr: "30+ ans", valueEn: "30+ years", labelFr: "D'expérience cumulée", labelEn: "Combined experience" },
          ].map((stat) => (
            <StaggerItem key={stat.valueFr}>
              <div className="flex flex-col items-center gap-2">
                <stat.icon className="w-5 h-5 text-[var(--brand-accent)]" />
                <p className="text-xl md:text-2xl font-bold text-[var(--brand-primary)] dark:text-[var(--brand-accent-light)]">{isFr ? stat.valueFr : stat.valueEn}</p>
                <p className="text-dark/40 dark:text-cream-light/40 text-xs font-medium uppercase tracking-wider">
                  {isFr ? stat.labelFr : stat.labelEn}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Team Grid with Client-side Filtering */}
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

      {/* Join CTA */}
      <section className="py-20 md:py-28 bg-[var(--brand-accent-light)]/10 dark:bg-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-accent-light)]/15 rounded-full blur-[180px]" />
        <div className="w-[94%] mx-auto relative z-10 text-center">
          <AnimateIn>
            <h2 className="text-dark dark:text-cream-light tracking-tight mb-4">
              {isFr ? "Envie de" : "Want to"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "collaborer ?" : "collaborate?"}</span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-dark/50 dark:text-cream-light/50 text-lg max-w-xl mx-auto mb-8">
              {isFr
                ? "Contactez notre équipe pour discuter de vos besoins en ingrédients naturels."
                : "Contact our team to discuss your natural ingredient needs."}
            </p>
          </AnimateIn>
          <AnimateIn delay={0.2} y={15}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--brand-primary)] text-white text-sm font-semibold hover:bg-[var(--brand-secondary)] transition-all duration-300 shadow-lg"
            >
              <Mail className="w-4 h-4" />
              {isFr ? "Nous contacter" : "Contact us"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
