import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/catalogue": {
      fr: "/catalogue",
      en: "/catalog",
    },
    "/catalogue/[code]": {
      fr: "/catalogue/[code]",
      en: "/catalog/[code]",
    },
    "/entreprise": {
      fr: "/entreprise",
      en: "/company",
    },
    "/equipe": {
      fr: "/equipe",
      en: "/team",
    },
    "/actualites": {
      fr: "/actualites",
      en: "/news",
    },
    "/actualites/[slug]": {
      fr: "/actualites/[slug]",
      en: "/news/[slug]",
    },
    "/podcast": "/podcast",
    "/contact": "/contact",
    "/mon-compte": {
      fr: "/mon-compte",
      en: "/my-account",
    },
    "/login": "/login",
    "/register": "/register",
    "/admin": "/admin",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
