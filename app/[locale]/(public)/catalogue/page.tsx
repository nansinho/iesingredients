import { getTranslations } from "next-intl/server";
import { searchProducts } from "@/lib/products";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

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
      languages: {
        fr: "/fr/catalogue",
        en: "/en/catalog",
      },
    },
    openGraph: {
      title: t("catalogTitle"),
      description: t("catalogDescription"),
      url: `https://ies-ingredients.com/${locale}/${locale === "fr" ? "catalogue" : "catalog"}`,
      type: "website",
    },
  };
}

export default async function CataloguePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;

  const result = await searchProducts({
    search: sp.search,
    category: sp.category,
    page: sp.page,
  });

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
      <CatalogClient
        products={result.products}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        searchParams={sp}
      />
    </>
  );
}
