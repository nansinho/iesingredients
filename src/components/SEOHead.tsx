import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Language } from '@/lib/i18n';

interface SEOHeadProps {
  lang: Language;
  title: string;
  description: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  noindex?: boolean;
  structuredData?: object;
}

const BASE_URL = 'https://ies-ingredients.com';

export const SEOHead = ({
  lang,
  title,
  description,
  type = 'website',
  image = '/og-image.jpg',
  noindex = false,
  structuredData,
}: SEOHeadProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Generate alternate language URL
  const altLang = lang === 'fr' ? 'en' : 'fr';
  const altPath = currentPath.replace(`/${lang}`, `/${altLang}`);
  
  const canonicalUrl = `${BASE_URL}${currentPath}`;
  const altUrl = `${BASE_URL}${altPath}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  // Default breadcrumb schema
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'IES Ingredients',
        item: `${BASE_URL}/${lang}`,
      },
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags for Language Alternates */}
      <link rel="alternate" hrefLang={lang} href={canonicalUrl} />
      <link rel="alternate" hrefLang={altLang} href={altUrl} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/fr`} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_US'} />
      <meta property="og:locale:alternate" content={lang === 'fr' ? 'en_US' : 'fr_FR'} />
      <meta property="og:site_name" content="IES Ingredients" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data - Breadcrumb */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>

      {/* Additional Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// FAQ Schema helper for AEO (Answer Engine Optimization)
export const createFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// Product Schema helper
export const createProductSchema = (product: {
  name: string;
  description: string;
  code: string;
  category?: string;
  origin?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  sku: product.code,
  category: product.category,
  brand: {
    '@type': 'Brand',
    name: 'IES Ingredients',
  },
  manufacturer: {
    '@type': 'Organization',
    name: 'IES Ingredients',
  },
});