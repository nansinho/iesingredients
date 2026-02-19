const SITE_URL = "https://ies-ingredients.com";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IES Ingredients",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-ies.png`,
    description:
      "Distribution B2B d'ingrédients naturels pour la cosmétique, la parfumerie et l'agroalimentaire.",
    foundingDate: "1994",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nice",
      addressRegion: "Provence-Alpes-Côte d'Azur",
      addressCountry: "FR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+33-4-93-00-00-00",
      contactType: "sales",
      availableLanguage: ["French", "English"],
    },
    sameAs: [],
    knowsAbout: [
      "Natural ingredients",
      "Cosmetic ingredients",
      "Perfumery ingredients",
      "Food flavors",
      "Essential oils",
      "Botanical extracts",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "IES Ingredients",
    url: SITE_URL,
    description:
      "Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires. Distribution B2B d'ingrédients naturels de qualité.",
    inLanguage: ["fr", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/fr/catalogue?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebPageJsonLd({
  name,
  description,
  url,
  speakable,
}: {
  name: string;
  description: string;
  url: string;
  speakable?: string[];
}) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "IES Ingredients",
      url: SITE_URL,
    },
  };

  if (speakable && speakable.length > 0) {
    jsonLd.speakable = {
      "@type": "SpeakableSpecification",
      cssSelector: speakable,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "IES Ingredients",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-ies.png`,
    image: `${SITE_URL}/images/og-default.jpg`,
    telephone: "+33-4-93-00-00-00",
    email: "contact@ies-ingredients.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nice",
      addressRegion: "Provence-Alpes-Côte d'Azur",
      postalCode: "06000",
      addressCountry: "FR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
