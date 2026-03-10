import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Users, Mail, ArrowRight, Heart, Globe, Award } from "lucide-react";
import { Link } from "@/i18n/routing";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem, HoverLift } from "@/components/ui/AnimateIn";

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
    .order("display_order", { ascending: true });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Équipe" : "Team", url: `https://ies-ingredients.com/${locale}/${isFr ? "equipe" : "team"}` },
        ]}
      />

      {/* Hero — Immersive with background image */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
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
        </div>

        <div className="relative z-10 w-[94%] mx-auto pb-20 pt-40">
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
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
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

      {/* Team Grid */}
      <section className="py-20 md:py-28 bg-white dark:bg-dark">
        <div className="w-[94%] mx-auto">
          <AnimateIn className="text-center mb-14">
            <h2 className="text-dark dark:text-cream-light tracking-tight">
              {isFr ? "Rencontrez nos" : "Meet our"}{" "}
              <span className="font-playfair italic text-brown dark:text-peach">{isFr ? "Experts" : "Experts"}</span>
            </h2>
            <p className="text-dark/50 dark:text-cream-light/50 mt-3 text-base max-w-lg mx-auto">
              {isFr
                ? "Chaque membre apporte une expertise unique au service de vos projets."
                : "Each member brings unique expertise to serve your projects."}
            </p>
          </AnimateIn>

          {members && members.length > 0 ? (
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {members.map((member: any) => (
                <StaggerItem key={member.id}>
                  <HoverLift>
                    <div className="group rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 hover:shadow-[0_20px_60px_rgba(200,168,168,0.1)] transition-all duration-500">
                      <div className="p-3">
                        <div className="aspect-[3/4] relative overflow-hidden rounded-xl bg-cream dark:bg-dark">
                          {member.photo_url ? (
                            <Image
                              src={member.photo_url}
                              alt={member.name || ""}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent-light)]/20">
                              <span className="text-5xl font-playfair italic text-[var(--brand-primary)]/30">
                                {(member.name || "?").charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>
                      <div className="px-5 pb-5 pt-1">
                        <h3 className="font-semibold text-xl text-dark dark:text-cream-light">{member.name}</h3>
                        <p className="text-[var(--brand-accent)] dark:text-[var(--brand-accent-light)] text-sm mt-1 font-medium">
                          {isFr ? member.role_fr || member.role : member.role_en || member.role}
                        </p>
                        {member.bio && (
                          <p className="text-dark/50 dark:text-cream-light/50 text-sm mt-3 leading-relaxed line-clamp-3">
                            {isFr ? member.bio_fr || member.bio : member.bio_en || member.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </HoverLift>
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : (
            <div className="text-center py-20">
              <p className="text-dark/50 dark:text-cream-light/50">
                {isFr ? "L'équipe sera bientôt présentée." : "The team will be presented soon."}
              </p>
            </div>
          )}
        </div>
      </section>

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
