import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://ies-ingredients.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages with localized paths
  const staticPages: MetadataRoute.Sitemap = [
    // French pages
    { url: `${BASE_URL}/fr`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/fr/catalogue`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/fr/entreprise`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/fr/equipe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/fr/actualites`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/fr/podcast`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/fr/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // English pages
    { url: `${BASE_URL}/en`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/en/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/en/company`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/en/team`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/en/news`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/en/podcast`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/en/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic product pages - query each table explicitly to keep proper types
  const productPages: MetadataRoute.Sitemap = [];

  const addProducts = (data: { code: string | null; updated_at: string | null }[] | null) => {
    if (!data) return;
    for (const product of data) {
      if (product.code) {
        productPages.push({
          url: `${BASE_URL}/fr/catalogue/${product.code}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
        productPages.push({
          url: `${BASE_URL}/en/catalog/${product.code}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  };

  const [cosmetique, parfum, aromes] = await Promise.all([
    supabase.from("cosmetique_fr").select("code, updated_at").eq("statut", "ACTIF").not("code", "is", null),
    supabase.from("parfum_fr").select("code, updated_at").eq("statut", "ACTIF").not("code", "is", null),
    supabase.from("aromes_fr").select("code, updated_at").eq("statut", "ACTIF").not("code", "is", null),
  ]);

  addProducts(cosmetique.data);
  addProducts(parfum.data);
  addProducts(aromes.data);

  // Dynamic blog article pages
  const { data: rawArticles } = await supabase
    .from("blog_articles")
    .select("slug, updated_at")
    .eq("published", true);

  const articles = (rawArticles || []) as { slug: string; updated_at: string | null }[];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/fr/actualites/${article.slug}`,
    lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articlePagesEn: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/en/news/${article.slug}`,
    lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...articlePages, ...articlePagesEn];
}
