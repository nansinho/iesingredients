import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "IES Ingredients - Ingr\u00e9dients Naturels B2B",
    template: "%s | IES Ingredients",
  },
  description:
    "Plus de 5000 ingr\u00e9dients cosm\u00e9tiques, parfums et ar\u00f4mes alimentaires. Distribution B2B d'ingr\u00e9dients naturels de qualit\u00e9.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ies-ingredients.com"
  ),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    siteName: "IES Ingredients",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
