import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// NOTE: When deployed on VPS with internet access, replace this file's
// font setup with next/font/google for optimal performance:
//
//   import { DM_Sans, Playfair_Display } from "next/font/google";
//   const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
//   const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", weight: ["400", "500", "600", "700"] });
//
// And add className={`${dmSans.variable} ${playfair.variable}`} to <html>.
// This will enable self-hosted Google Fonts with zero CLS.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ies-ingredients.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF5E0" },
    { media: "(prefers-color-scheme: dark)", color: "#181818" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "IES Ingredients - Ingrédients Naturels B2B | Cosmétique, Parfumerie, Arômes",
    template: "%s | IES Ingredients",
  },
  description:
    "Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires. Distribution B2B d'ingrédients naturels de qualité. Basé à Nice, livraison internationale.",
  keywords: [
    "ingrédients naturels",
    "cosmétique B2B",
    "parfumerie",
    "arômes alimentaires",
    "huiles essentielles",
    "extraits botaniques",
    "distribution ingrédients",
    "natural ingredients",
    "cosmetic ingredients",
    "essential oils",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    siteName: "IES Ingredients",
    title: "IES Ingredients - Ingrédients Naturels B2B",
    description:
      "Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires. Distribution B2B d'ingrédients naturels de qualité.",
    images: [
      {
        url: `${siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "IES Ingredients - Ingrédients Naturels B2B",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IES Ingredients - Ingrédients Naturels B2B",
    description:
      "Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires.",
    images: [`${siteUrl}/images/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "verification-code",
  },
  category: "business",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let locale = "fr";
  try {
    locale = await getLocale();
  } catch {
    // Fallback to "fr" when no request context (e.g. global-error prerender)
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Fonts — DM Sans (body) + Playfair Display (accent) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        {/* Dark mode FOUC prevention — set class before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}else{d.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
