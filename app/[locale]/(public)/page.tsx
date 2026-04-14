export const revalidate = 3600;

import { getTranslations } from "next-intl/server";
import { ParallaxHero } from "@/components/home/ParallaxHero";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { ThreeUniverses } from "@/components/home/ThreeUniverses";
import { Commitments } from "@/components/home/Commitments";
import { MinimalProducts } from "@/components/home/MinimalProducts";
import { SamplesBanner } from "@/components/home/SamplesBanner";
import { SocialFollow } from "@/components/home/SocialFollow";
import { LatestPublications } from "@/components/home/LatestPublications";
import { MinimalCTA } from "@/components/home/MinimalCTA";
import { OrganizationJsonLd, WebSiteJsonLd, LocalBusinessJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      url: `https://ies-ingredients.com/${locale}`,
      siteName: "IES Ingredients",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const faqItems =
    locale === "fr"
      ? [
          {
            question: "Quels types d'ingrédients proposez-vous ?",
            answer:
              "Nous proposons plus de 5000 ingrédients naturels pour la cosmétique, la parfumerie et les arômes alimentaires, incluant des actifs botaniques, huiles essentielles, absolues et extraits naturels.",
          },
          {
            question: "Livrez-vous à l'international ?",
            answer:
              "Oui, IES Ingredients livre dans le monde entier. Nous disposons d'un réseau logistique international avec livraison en 48h en Europe.",
          },
          {
            question: "Vos ingrédients sont-ils certifiés ?",
            answer:
              "Nos ingrédients sont certifiés COSMOS, ECOCERT, BIO et répondent aux normes ISO 9001. Nous proposons également des options Vegan.",
          },
        ]
      : [
          {
            question: "What types of ingredients do you offer?",
            answer:
              "We offer over 5000 natural ingredients for cosmetics, perfumery and food flavors, including botanical actives, essential oils, absolutes and natural extracts.",
          },
          {
            question: "Do you deliver internationally?",
            answer:
              "Yes, IES Ingredients delivers worldwide. We have an international logistics network with 48h delivery in Europe.",
          },
          {
            question: "Are your ingredients certified?",
            answer:
              "Our ingredients are COSMOS, ECOCERT, BIO certified and meet ISO 9001 standards. We also offer Vegan options.",
          },
        ];

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <LocalBusinessJsonLd />
      <FAQJsonLd items={faqItems} />
      <ParallaxHero />
      <LogoMarquee />
      <ThreeUniverses />
      <Commitments />
      <MinimalProducts />
      <SamplesBanner />
      <LatestPublications />
      <SocialFollow />
      <MinimalCTA />
    </>
  );
}
