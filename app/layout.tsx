import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// NOTE: When deployed on VPS with internet access, replace this file's
// font setup with next/font/google for optimal performance:
//
//   import { Inter, Cormorant_Garamond } from "next/font/google";
//   const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
//   const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", display: "swap", weight: ["400", "500", "600", "700"] });
//
// And add className={`${inter.variable} ${cormorant.variable}`} to <html>.
// This will enable self-hosted Google Fonts with zero CLS.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ies-ingredients.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a2e1f" },
    { media: "(prefers-color-scheme: dark)", color: "#0a2e1f" },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Fonts - loaded via link tag for now.
            Will be replaced by next/font/google when deployed on VPS. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
