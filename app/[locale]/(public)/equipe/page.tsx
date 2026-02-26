import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

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
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/10 border border-peach/20 text-peach text-xs font-semibold uppercase tracking-[0.15em] mb-5">
            <Users className="w-3.5 h-3.5" />
            {isFr ? "Les personnes derrière IES" : "The people behind IES"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-cream-light tracking-[-0.03em] leading-[1.05] mb-6">
            {isFr ? "Notre" : "Our"}{" "}
            <span className="font-playfair italic text-peach">{isFr ? "Équipe" : "Team"}</span>
          </h1>
          <p className="text-cream-light/50 text-lg max-w-2xl">
            {isFr
              ? "Une équipe passionnée d'experts en ingrédients naturels, au service de votre réussite."
              : "A passionate team of natural ingredient experts, dedicated to your success."}
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark">
        <div className="max-w-[1400px] w-[90%] mx-auto">
          {members && members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {members.map((member: any) => (
                <div
                  key={member.id}
                  className="group rounded-2xl overflow-hidden bg-cream-light dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:shadow-xl transition-all duration-500"
                >
                  <div className="aspect-[3/4] relative bg-cream dark:bg-dark">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.name || ""}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-playfair italic text-brown/30">
                          {(member.name || "?").charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
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
              ))}
            </div>
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
