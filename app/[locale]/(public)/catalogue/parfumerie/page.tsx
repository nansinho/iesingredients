import { Suspense } from "react";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/product-types";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Catalogue Parfumerie — IES Ingredients" : "Perfumery Catalog — IES Ingredients",
    description: locale === "fr"
      ? "Découvrez nos huiles essentielles, absolues et molécules de synthèse pour la parfumerie."
      : "Discover our essential oils, absolutes and synthetic molecules for perfumery.",
    alternates: {
      canonical: `/${locale}/catalogue/parfumerie`,
    },
  };
}

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("parfum_fr")
    .select("*")
    .eq("statut", "ACTIF")
    .order("nom_commercial", { ascending: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((p: any) => ({ ...p, _table: "parfum_fr" }) as Product);
}

export default async function ParfumeriePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const products = await getProducts();
  const siteUrl = "https://ies-ingredients.com";

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "IES Ingredients", url: `${siteUrl}/${locale}` },
        { name: "Catalogue", url: `${siteUrl}/${locale}/catalogue` },
        { name: "Parfumerie", url: `${siteUrl}/${locale}/catalogue/parfumerie` },
      ]} />
      <Suspense fallback={null}>
        <CatalogClient allProducts={products} initialCategory="parfum" />
      </Suspense>
    </>
  );
}
