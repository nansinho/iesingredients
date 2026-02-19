export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  fr: "Fran\u00e7ais",
  en: "English",
};

export const localePrefixes = {
  fr: {
    catalogue: "/catalogue",
    entreprise: "/entreprise",
    equipe: "/equipe",
    actualites: "/actualites",
    podcast: "/podcast",
    contact: "/contact",
    "mon-compte": "/mon-compte",
    login: "/login",
    register: "/register",
    admin: "/admin",
  },
  en: {
    catalogue: "/catalog",
    entreprise: "/company",
    equipe: "/team",
    actualites: "/news",
    podcast: "/podcast",
    contact: "/contact",
    "mon-compte": "/my-account",
    login: "/login",
    register: "/register",
    admin: "/admin",
  },
} as const;
