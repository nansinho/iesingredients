import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/product-types";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Catalogue Cosmétique — IES Ingredients" : "Cosmetics Catalog — IES Ingredients",
    description: locale === "fr"
      ? "Découvrez nos actifs botaniques et extraits naturels pour la cosmétique."
      : "Discover our botanical actives and natural extracts for cosmetics.",
    alternates: {
      canonical: `/${locale}/catalogue/cosmetique`,
    },
  };
}

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cosmetique_fr")
    .select("*")
    .eq("statut", "ACTIF")
    .order("nom_commercial", { ascending: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((p: any) => ({ ...p, _table: "cosmetique_fr" }) as Product);
}

export default async function CosmetiquePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const products = await getProducts();
  const siteUrl = "https://ies-ingredients.com";

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "IES Ingredients", url: `${siteUrl}/${locale}` },
        { name: "Catalogue", url: `${siteUrl}/${locale}/catalogue` },
        { name: "Cosmétique", url: `${siteUrl}/${locale}/catalogue/cosmetique` },
      ]} />
      <Suspense fallback={null}>
        <CatalogClient allProducts={products} initialCategory="cosmetique" />
      </Suspense>
    </>
  );
}
