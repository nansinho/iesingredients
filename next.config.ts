import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : "";
const supabaseProtocol = supabaseUrl.startsWith("https") ? "https" : "http";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
      ...(supabaseHost
        ? [
            {
              protocol: supabaseProtocol as "http" | "https",
              hostname: supabaseHost,
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              `img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://*.supabase.in${supabaseHost ? ` ${supabaseProtocol}://${supabaseHost}` : ""}`,
              `connect-src 'self' blob: https://*.supabase.co https://*.supabase.in${supabaseHost ? ` ${supabaseProtocol}://${supabaseHost}` : ""}`,
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // 301 redirects from old SPA routes to new Next.js routes
      { source: "/catalog", destination: "/fr/catalogue", permanent: true },
      { source: "/catalog/:code", destination: "/fr/catalogue/:code", permanent: true },
      { source: "/company", destination: "/fr/entreprise", permanent: true },
      { source: "/team", destination: "/fr/equipe", permanent: true },
      { source: "/news", destination: "/fr/actualites", permanent: true },
      { source: "/news/:slug", destination: "/fr/actualites/:slug", permanent: true },
      { source: "/blog", destination: "/fr/actualites", permanent: true },
      { source: "/blog/:slug", destination: "/fr/actualites/:slug", permanent: true },
      // Old site: articles at root (e.g. /cosmetagora-2025 → /fr/actualites/cosmetagora-2025)
      { source: "/actualites", destination: "/fr/actualites", permanent: true },
      { source: "/actualites/:slug", destination: "/fr/actualites/:slug", permanent: true },
      ...[
        "cfia-2025", "le-reboisement-dallauch-2025", "cosmetagora-2025",
        "kit-le-biomimetisme", "eterwell-youth-nomine-aux-cfic-awards",
        "gulfood-2024", "bwme-2024", "kit-lart-et-la-nature",
        "les-webinaires-dies", "rapport-rse-2024", "beauty-world-saudi-arabia",
        "cosmetagora-2024", "ies-ingredients-au-bwme-2023", "baby-cosmetic-kit",
        "plante-du-mois-absolue-rose-turquie", "quarterly-nugget-green-olfactive-family",
        "plant-of-the-month-tonka-bean-brazil", "discover-givaudan-new-absolutes-vanilla-ambrette",
        "ies-ingredients-x-givaudan-flavour-ingredients", "summer-cosmetic-kit",
        "ies-ingredients-au-simppar-2023", "pepite-olfactive-fruite",
        "tour-du-monde-biologique-espagne", "decouvrez-bois-de-santal",
        "certification-ecovadis-platinium-pour-ies-ingredients", "pepharange-cb",
        "pepite-olfactive-agrumes", "ies-ingredients-au-cosmetagora-2023",
        "ies-ingredients-au-gulfood-manufacturing", "ies-ingredients-au-beauty-world-me-dubai",
        "natexpo-2022", "rapport-rse-2022", "alpaflor-event-2",
        "inauguration-du-nouveau-site-ies-ingredients", "simppar-2022-entre-synthese-et-naturel",
        "retour-sur-le-in-cosmetics-2022", "un-avenir-innovant-aux-cotes-daethera-biotech",
        "vitamine-b12-cryst", "salon-cosmetagora-2022", "ungerer-company",
        "rapport-rse-2021", "les-vitamines-nos-super-heros", "hya-act",
        "infiniment-beauty", "bonne-annee-2021", "rapport-rse-2020",
        "distribution-albert-vieille", "informations-covid19", "cosmetagora-2020",
        "fie-2019", "alpaflor-event", "simppar-2019",
        "notre-politique-rse-nos-actions", "incosmeticsglobal2019",
        "changement-direction-ies-ingredients-sabater-poinsignon-fabre-2026",
      ].map(slug => ({ source: `/${slug}`, destination: `/fr/actualites/${slug}`, permanent: true })),
      // Redirect www to non-www
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ies-ingredients.com" }],
        destination: "https://ies-ingredients.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
