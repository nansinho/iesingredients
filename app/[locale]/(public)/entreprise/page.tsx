import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Shield, Award, Globe, Users, Leaf, Heart } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("companyTitle"),
    alternates: {
      canonical: `/${locale}/entreprise`,
      languages: { fr: "/fr/entreprise", en: "/en/company" },
    },
  };
}

const values = [
  { icon: Shield, titleFr: "Qualité", titleEn: "Quality", descFr: "Sélection rigoureuse de chaque ingrédient pour garantir l'excellence.", descEn: "Rigorous selection of each ingredient to guarantee excellence." },
  { icon: Globe, titleFr: "International", titleEn: "International", descFr: "Un réseau mondial de fournisseurs partenaires depuis 30 ans.", descEn: "A worldwide network of partner suppliers for 30 years." },
  { icon: Heart, titleFr: "Passion", titleEn: "Passion", descFr: "L'amour des ingrédients naturels est au cœur de notre métier.", descEn: "Love for natural ingredients is at the heart of our business." },
  { icon: Leaf, titleFr: "Durabilité", titleEn: "Sustainability", descFr: "Engagement envers un sourcing responsable et éthique.", descEn: "Commitment to responsible and ethical sourcing." },
  { icon: Award, titleFr: "Certifications", titleEn: "Certifications", descFr: "COSMOS, ECOCERT, BIO, ISO 9001 pour une qualité vérifiable.", descEn: "COSMOS, ECOCERT, BIO, ISO 9001 for verifiable quality." },
  { icon: Users, titleFr: "Proximité", titleEn: "Proximity", descFr: "Un accompagnement personnalisé pour chaque client.", descEn: "Personalized support for each client." },
];

export default async function CompanyPage({
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
          { name: isFr ? "Entreprise" : "Company", url: `https://ies-ingredients.com/${locale}/${isFr ? "entreprise" : "company"}` },
        ]}
      />

      {/* Hero */}
      <section className="bg-forest-950 pt-28 sm:pt-32 pb-16">
        <div className="container-luxe">
          <span className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4 block">
            {isFr ? "Notre histoire" : "Our story"}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {isFr ? "IES Ingredients" : "IES Ingredients"}
          </h1>
          <p className="text-cream-200 text-lg max-w-3xl">
            {isFr
              ? "Depuis 1994, nous sélectionnons et distribuons les meilleurs ingrédients naturels pour l'industrie cosmétique, la parfumerie et l'agroalimentaire."
              : "Since 1994, we have been selecting and distributing the finest natural ingredients for the cosmetic industry, perfumery and food industry."}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
            <Image
              src="/images/botanicals-flat.jpg"
              alt={isFr ? "Ingrédients botaniques" : "Botanical ingredients"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <span className="text-gold-600 text-sm uppercase tracking-widest font-medium">
              {isFr ? "Notre mission" : "Our mission"}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-forest-900 mt-4 mb-6">
              {isFr ? "L'Excellence au Service de la Nature" : "Excellence in Service of Nature"}
            </h2>
            <div className="space-y-4 text-forest-700 text-lg leading-relaxed">
              <p>
                {isFr
                  ? "IES Ingredients est un distributeur B2B spécialisé dans les ingrédients naturels de haute qualité. Notre expertise couvre trois domaines clés : la cosmétique, la parfumerie et les arômes alimentaires."
                  : "IES Ingredients is a B2B distributor specializing in high-quality natural ingredients. Our expertise covers three key areas: cosmetics, perfumery and food flavors."}
              </p>
              <p>
                {isFr
                  ? "Basés à Nice, au cœur de la Côte d'Azur, nous bénéficions d'une position géographique idéale pour servir les industries de la beauté et des arômes à l'échelle internationale."
                  : "Based in Nice, in the heart of the French Riviera, we benefit from an ideal geographic position to serve the beauty and flavor industries internationally."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-forest-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4 block">
              {isFr ? "Nos valeurs" : "Our values"}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white">
              {isFr ? "Ce Qui Nous Anime" : "What Drives Us"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.titleFr}
                className="bg-forest-800 rounded-3xl p-8 border border-forest-700 hover:border-gold-500/30 transition-colors"
              >
                <v.icon className="w-8 h-8 text-gold-400 mb-4" />
                <h3 className="font-serif text-xl text-white mb-2">
                  {isFr ? v.titleFr : v.titleEn}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {isFr ? v.descFr : v.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "30+", labelFr: "Ans d'expertise", labelEn: "Years of expertise" },
            { value: "5000+", labelFr: "Ingrédients", labelEn: "Ingredients" },
            { value: "50+", labelFr: "Pays livrés", labelEn: "Countries served" },
            { value: "500+", labelFr: "Clients actifs", labelEn: "Active clients" },
          ].map((stat) => (
            <div key={stat.value}>
              <p className="text-4xl md:text-5xl font-serif text-gold-600">{stat.value}</p>
              <p className="text-forest-600 mt-2 text-sm">
                {isFr ? stat.labelFr : stat.labelEn}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
