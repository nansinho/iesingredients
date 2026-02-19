import { notFound } from "next/navigation";
import { getProduct, getCategoryConfig } from "@/lib/products";
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

  const config = getCategoryConfig(product.typologie_de_produit);

  return {
    title: `${product.nom_commercial} - IES Ingredients`,
    description:
      product.description ||
      `${product.nom_commercial} - ${config.label} ingredient by IES Ingredients. Code: ${product.code}`,
    alternates: {
      canonical: `/${locale}/catalogue/${code}`,
      languages: {
        fr: `/fr/catalogue/${code}`,
        en: `/en/catalog/${code}`,
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
    notFound();
  }

  const config = getCategoryConfig(product.typologie_de_produit);
  const siteUrl = "https://ies-ingredients.com";

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
      <ProductDetail product={product} />
    </>
  );
}
