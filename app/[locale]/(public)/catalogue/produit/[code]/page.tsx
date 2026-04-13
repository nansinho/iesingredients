import { notFound } from "next/navigation";
import {
  getProduct,
  getCategoryConfig,
  getProductPerformance,
  getProductStabilite,
  getRelatedProducts,
} from "@/lib/products";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ProductDetail } from "@/components/product/ProductDetail";

// ISR: revalidate every 5 minutes
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const product = await getProduct(code);

  if (!product) {
    return { title: "Product not found" };
  }

  const config = getCategoryConfig(product.typologie_de_produit, product._table);

  return {
    title: `${product.nom_commercial} - IES Ingredients`,
    description:
      product.description ||
      `${product.nom_commercial} - ${config.label} ingredient by IES Ingredients. Code: ${product.code}`,
    alternates: {
      canonical: `/${locale}/catalogue/produit/${code}`,
      languages: {
        fr: `/fr/catalogue/produit/${code}`,
        en: `/en/catalog/product/${code}`,
      },
    },
    openGraph: {
      title: `${product.nom_commercial} - IES Ingredients`,
      description: product.description || undefined,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const product = await getProduct(code);

  if (!product) {
    return notFound();
  }

  const config = getCategoryConfig(product.typologie_de_produit, product._table);
  const siteUrl = "https://ies-ingredients.com";
  const isParfum = product._table === "parfum_fr";

  // Fetch performance, stability, and related products in parallel
  const [performance, stabilite, relatedProducts] = await Promise.all([
    isParfum ? getProductPerformance(code) : Promise.resolve([]),
    isParfum ? getProductStabilite(code) : Promise.resolve([]),
    getRelatedProducts(
      code,
      product._table || "cosmetique_fr",
      isParfum ? "famille_olfactive" : product._table === "aromes_fr" ? "famille_arome" : "famille_cosmetique",
      isParfum ? product.famille_olfactive || null : product._table === "aromes_fr" ? product.famille_arome || null : product.famille_cosmetique || null
    ),
  ]);

  // Product JSON-LD
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nom_commercial,
    description: product.description,
    sku: product.code,
    image: product.image_url,
    brand: {
      "@type": "Brand",
      name: "IES Ingredients",
    },
    category: config.label,
    ...(product.origine && {
      countryOfOrigin: {
        "@type": "Country",
        name: product.origine,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `${siteUrl}/${locale}` },
          {
            name: locale === "fr" ? "Catalogue" : "Catalog",
            url: `${siteUrl}/${locale}/${locale === "fr" ? "catalogue" : "catalog"}`,
          },
          {
            name: product.nom_commercial || code,
            url: `${siteUrl}/${locale}/${locale === "fr" ? "catalogue" : "catalog"}/${code}`,
          },
        ]}
      />
      <ProductDetail
        product={product}
        performance={performance}
        stabilite={stabilite}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
