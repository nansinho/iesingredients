import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
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
      <section className="bg-forest-950 pt-28 sm:pt-32 pb-16">
        <div className="container-luxe">
          <span className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4 block">
            {isFr ? "Les personnes derrière IES" : "The people behind IES"}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {isFr ? "Notre Équipe" : "Our Team"}
          </h1>
          <p className="text-cream-200 text-lg max-w-2xl">
            {isFr
              ? "Une équipe passionnée d'experts en ingrédients naturels, au service de votre réussite."
              : "A passionate team of natural ingredient experts, dedicated to your success."}
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {members && members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member: any) => (
                <div
                  key={member.id}
                  className="group rounded-3xl overflow-hidden bg-forest-50 border border-forest-100 hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-[3/4] relative bg-forest-100">
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
                        <span className="text-4xl font-serif text-forest-300">
                          {(member.name || "?").charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-forest-900">{member.name}</h3>
                    <p className="text-gold-600 text-sm mt-1">
                      {isFr ? member.role_fr || member.role : member.role_en || member.role}
                    </p>
                    {member.bio && (
                      <p className="text-forest-600 text-sm mt-3 leading-relaxed line-clamp-3">
                        {isFr ? member.bio_fr || member.bio : member.bio_en || member.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-forest-600">
                {isFr ? "L'équipe sera bientôt présentée." : "The team will be presented soon."}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
