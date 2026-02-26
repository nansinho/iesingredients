import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";
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

      {/* Hero */}
      <section className="bg-dark pt-32 sm:pt-36 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[120px] -translate-x-1/3" />

        <div className="max-w-[1400px] w-[90%] mx-auto relative z-10">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/10 border border-peach/20 text-peach text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <Users className="w-3.5 h-3.5" />
              {isFr ? "Les personnes derrière IES" : "The people behind IES"}
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-cream-light tracking-[-0.03em] leading-[1.05] mb-6">
              {isFr ? "Notre" : "Our"}{" "}
              <span className="font-playfair tracking-wide text-peach">{isFr ? "Équipe" : "Team"}</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream-light/50 text-lg max-w-2xl">
              {isFr
                ? "Une équipe passionnée d'experts en ingrédients naturels, au service de votre réussite."
                : "A passionate team of natural ingredient experts, dedicated to your success."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark">
        <div className="max-w-[1400px] w-[90%] mx-auto">
          {members && members.length > 0 ? (
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {members.map((member: any) => (
                <StaggerItem key={member.id}>
                  <HoverLift>
                    <div className="group rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 hover:shadow-[0_20px_60px_rgba(163,123,104,0.1)] transition-all duration-500">
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
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl font-playfair tracking-wide text-brown/30">
                                {(member.name || "?").charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
                        </div>
                      </div>
                      <div className="px-5 pb-5 pt-1">
                        <h3 className="font-semibold text-xl text-dark dark:text-cream-light">{member.name}</h3>
                        <p className="text-brown dark:text-peach text-sm mt-1">
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
    </>
  );
}
