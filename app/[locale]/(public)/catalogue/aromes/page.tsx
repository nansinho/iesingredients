import { Suspense } from "react";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/product-types";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Catalogue Arômes — IES Ingredients" : "Flavors Catalog — IES Ingredients",
    description: locale === "fr"
      ? "Découvrez nos arômes naturels et de synthèse pour l'agroalimentaire."
      : "Discover our natural and synthetic flavors for the food industry.",
    alternates: {
      canonical: `/${locale}/catalogue/aromes`,
    },
  };
}

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("aromes_fr")
    .select("*")
    .eq("statut", "ACTIF")
    .order("nom_commercial", { ascending: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((p: any) => ({ ...p, _table: "aromes_fr" }) as Product);
}

export default async function AromesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const products = await getProducts();
  const siteUrl = "https://ies-ingredients.com";

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "IES Ingredients", url: `${siteUrl}/${locale}` },
        { name: "Catalogue", url: `${siteUrl}/${locale}/catalogue` },
        { name: "Arômes", url: `${siteUrl}/${locale}/catalogue/aromes` },
      ]} />
      <Suspense fallback={null}>
        <CatalogClient allProducts={products} initialCategory="arome" />
      </Suspense>
    </>
  );
}
