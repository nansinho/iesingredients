import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-var",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ies-ingredients.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F7F4F0",
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
    <html lang="fr" suppressHydrationWarning className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        {/* FOUC prevention: color theme and locale from URL */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;d.classList.remove('dark');d.style.colorScheme='light';if(location.pathname.startsWith('/en')){d.lang='en'}}catch(e){}})()`,
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
