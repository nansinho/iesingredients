import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/product-types";

export const revalidate = 300; // ISR 5 min

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("catalogTitle"),
    description: t("catalogDescription"),
    alternates: {
      canonical: `/${locale}/catalogue`,
      languages: { fr: "/fr/catalogue", en: "/en/catalog" },
    },
    openGraph: {
      title: t("catalogTitle"),
      description: t("catalogDescription"),
      url: `https://ies-ingredients.com/${locale}/${locale === "fr" ? "catalogue" : "catalog"}`,
      type: "website",
    },
  };
}

/** Load ALL products once at build/ISR — client handles search/filter/pagination */
async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const allProducts: Product[] = [];

  for (const table of ["cosmetique_fr", "parfum_fr", "aromes_fr"]) {
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("statut", "ACTIF")
      .order("nom_commercial", { ascending: true });

    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allProducts.push(...data.map((p: any) => ({ ...p, _table: table }) as Product));
    }
  }

  return allProducts;
}

export default async function CataloguePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const allProducts = await getAllProducts();

  const siteUrl = "https://ies-ingredients.com";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `${siteUrl}/${locale}` },
          {
            name: locale === "fr" ? "Catalogue" : "Catalog",
            url: `${siteUrl}/${locale}/${locale === "fr" ? "catalogue" : "catalog"}`,
          },
        ]}
      />
      <Suspense fallback={null}>
        <CatalogClient allProducts={allProducts} />
      </Suspense>
    </>
  );
}
