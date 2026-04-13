---
name: audit-seo
description: Audit SEO, AEO (Answer Engine Optimization) et SEA du site IES Ingredients. Vérifie les métadonnées, le structured data (JSON-LD), le sitemap, les Core Web Vitals, l'optimisation des articles de blog, le maillage interne, l'i18n SEO, et la compatibilité avec les moteurs de réponse IA (ChatGPT, Perplexity, Google AI Overviews).
disable-model-invocation: false
allowed-tools: Glob Read Grep Agent
---

# Audit SEO / AEO / SEA — IES Ingredients

Tu es un expert SEO/AEO senior spécialisé dans les sites B2B, e-commerce et Next.js. Effectue un audit complet couvrant le SEO technique, le SEO on-page, l'AEO (Answer Engine Optimization) et les recommandations SEA.

**Contexte du projet :**
- Site B2B pour IES Ingredients — distributeur de matières premières pour parfumerie, cosmétique et arômes alimentaires
- Basé à Allauch (Provence), France
- Next.js 16 App Router, TypeScript, Tailwind CSS
- i18n FR/EN via next-intl (`app/[locale]/`)
- Supabase pour les données (produits, blog, contacts)
- Sitemap dynamique : `app/sitemap.ts`
- Robots.txt : `app/robots.ts`
- JSON-LD existant : `components/seo/JsonLd.tsx` (Organization, WebSite, WebPage, FAQ, Breadcrumb, PodcastSeries, LocalBusiness)
- `generateMetadata` sur toutes les pages publiques
- 3 catalogues produits : `cosmetique_fr`, `parfum_fr`, `aromes_fr`
- Blog avec catégories, articles publiés avec slug

## Périmètre

Si `$ARGUMENTS` est fourni (ex: `articles`, `catalogue`, `app`), limiter l'audit à ce domaine. Sinon, audit complet.

---

## PARTIE 1 — SEO TECHNIQUE

### 1.1 Métadonnées (generateMetadata)

Pour CHAQUE page publique dans `app/[locale]/(public)/` :
- `title` : présent, unique, 50-60 caractères, contient le mot-clé principal
- `description` : présente, unique, 150-160 caractères, incitative (call-to-action implicite)
- `openGraph` : title, description, images (1200x630), type, locale, url
- `twitter` : card (summary_large_image), title, description, images
- `alternates` : liens hreflang FR ↔ EN corrects
- `canonical` : URL canonique définie (évite le duplicate content i18n)
- `robots` : index/noindex approprié selon la page

Vérifier aussi :
- `app/layout.tsx` : metadata par défaut (fallback)
- Pages auth (`login`, `register`) : `robots: { index: false }` ?
- Pages admin/client : `robots: { index: false }` ?

### 1.2 Sitemap

Analyser `app/sitemap.ts` :
- Toutes les pages publiques sont-elles incluses ?
- Les pages dynamiques (produits, articles) sont-elles générées ?
- Les URLs ont-elles `lastModified` basé sur la vraie date de modification ?
- Les `priority` et `changeFrequency` sont-ils pertinents ?
- Les deux langues (FR/EN) sont-elles couvertes ?
- Taille du sitemap : risque de dépasser 50 000 URLs ? Faut-il un sitemap index ?
- Les pages protégées (admin, espace-client) sont-elles exclues ?

### 1.3 Robots.txt

Analyser `app/robots.ts` :
- Les zones protégées sont-elles bloquées (`/admin/`, `/api/`, `/login`, `/register`) ?
- L'espace client (`/espace-client/`) est-il bloqué ?
- Le sitemap est-il référencé ?
- Faut-il des règles spécifiques pour Googlebot, Bingbot ?
- Faut-il bloquer les crawlers IA (GPTBot, CCBot, anthropic-ai) ou les autoriser pour l'AEO ?

### 1.4 Structured Data (JSON-LD)

Analyser `components/seo/JsonLd.tsx` et son utilisation :
- **Organization** : infos correctes (nom, adresse, logo, contact) ?
- **LocalBusiness** : horaires, adresse, téléphone exacts ?
- **WebSite** : SearchAction configurée correctement ?
- **BreadcrumbJsonLd** : utilisé sur toutes les pages internes ?
- **Articles de blog** : manque-t-il un `Article` ou `BlogPosting` schema ?
- **Produits** : manque-t-il un `Product` schema sur les pages catalogue ?
- **FAQ** : utilisé sur les bonnes pages ?
- **PodcastSeries** : données correctes ?
- Valider la structure JSON-LD (pas d'erreurs de syntaxe)
- Vérifier les données réelles vs placeholder (téléphone, adresse)

### 1.5 Performance & Core Web Vitals

Vérifier dans le code :
- **Images** : utilisation de `next/image` avec `width`, `height`, `alt`, `loading="lazy"` ?
- **Fonts** : chargement optimisé (`next/font` ou `font-display: swap`) ?
- **Bundle size** : composants lourds avec `dynamic()` ou `lazy()` ?
- **Streaming** : `loading.tsx` présent pour les pages lentes ?
- **Cache** : `revalidate` configuré sur les pages dynamiques ?
- **Above-the-fold** : le contenu principal est-il rendu côté serveur (pas de skeleton pour le contenu SEO) ?

### 1.6 i18n SEO

- Balises `hreflang` (FR ↔ EN) sur chaque page
- `alternates.languages` dans generateMetadata
- Les slugs sont-ils traduits ? (`/actualites` vs `/news`, `/catalogue` vs `/catalog`)
- Contenu dupliqué : les pages FR et EN ont-elles du contenu distinct ?
- Le sitemap couvre-t-il les deux langues ?
- La langue par défaut a-t-elle un redirect ou un canonical ?

---

## PARTIE 2 — SEO ON-PAGE (CONTENU)

### 2.1 Pages statiques

Pour chaque page publique, vérifier :
- **H1 unique** par page (un seul, contient le mot-clé principal)
- **Hiérarchie des titres** : H1 → H2 → H3 (pas de saut)
- **Contenu suffisant** : minimum 300 mots pour le SEO
- **Maillage interne** : liens vers d'autres pages du site
- **Alt text** sur toutes les images
- **URLs propres** : pas de paramètres inutiles, kebab-case

### 2.2 Articles de blog (SEO éditorial)

Analyser la structure des articles dans `app/[locale]/(public)/actualites/[slug]/page.tsx` :
- Le `generateMetadata` utilise-t-il les données de l'article (titre, excerpt, image) ?
- Schema `Article` ou `BlogPosting` JSON-LD avec :
  - `headline`, `description`, `image`, `author`, `datePublished`, `dateModified`
  - `publisher` (Organization)
  - `mainEntityOfPage`
- Table des matières (`TableOfContents`) : génère-t-elle des ancres exploitables ?
- Temps de lecture affiché ?
- Breadcrumb : Accueil > Actualités > [Catégorie] > [Article]
- Boutons de partage social (Open Graph bien configuré)
- Articles suggérés / liés en bas de page (maillage interne)
- Catégories et tags : bien structurés pour le SEO ?

### 2.3 Pages catalogue / produits

- Schema `Product` sur les pages produit (`/catalogue/[code]`)
- Fil d'ariane : Accueil > Catalogue > [Univers] > [Produit]
- Contenu descriptif suffisant (pas juste un tableau de specs)
- Liens entre produits similaires
- Images produit avec alt text descriptif
- Meta description dynamique basée sur le produit

### 2.4 Page d'accueil

- H1 contenant le mot-clé principal du site
- Contenu structuré avec H2 pour chaque section
- Liens vers les pages clés (catalogue, univers, blog)
- CTA clairs
- Derniers articles de blog (contenu frais)

---

## PARTIE 3 — AEO (Answer Engine Optimization)

L'AEO optimise le site pour les moteurs de réponse IA (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot).

### 3.1 Structured Data pour l'IA

- **SpeakableSpecification** : déjà dans `WebPageJsonLd`, mais est-il utilisé partout ?
- **FAQPage** : les pages avec des questions fréquentes l'utilisent-elles ?
- **HowTo** : pertinent pour des guides d'utilisation d'ingrédients ?
- **DefinedTerm** : pour le glossaire d'ingrédients (si existant)
- Les réponses dans les FAQ sont-elles concises et directement exploitables par les IA ?

### 3.2 Contenu optimisé pour les IA

- Les paragraphes d'introduction répondent-ils directement à une question ? (format "snippet-friendly")
- Les H2/H3 sont-ils formulés comme des questions quand c'est pertinent ?
- Les listes à puces sont-elles utilisées pour les informations structurées ?
- Le contenu est-il factuel, sourcé, et autoritaire (E-E-A-T) ?
- Y a-t-il des pages "pilier" qui couvrent un sujet en profondeur ?

### 3.3 Crawlabilité par les IA

- `robots.txt` : GPTBot, CCBot, PerplexityBot sont-ils autorisés ?
- Les pages clés sont-elles accessibles sans JavaScript (SSR) ?
- Le contenu est-il dans le HTML (pas dans des modales, accordéons fermés, ou chargé en JS) ?
- Les métadonnées `author`, `datePublished`, `dateModified` sont-elles présentes ?

### 3.4 Autorité & E-E-A-T

- Pages auteur / équipe avec expertise démontrée ?
- Mentions légales, CGV, politique de confidentialité ?
- Certifications, partenariats affichés ?
- Témoignages clients structurés (schema `Review`) ?

---

## PARTIE 4 — RECOMMANDATIONS SEA (Search Engine Advertising)

Analyser le site sous l'angle publicitaire :

### 4.1 Landing Pages

- Les pages catalogue sont-elles optimisées comme landing pages (CTA clair, formulaire visible) ?
- Y a-t-il des pages dédiées pour des campagnes (landing pages ciblées) ?
- Le formulaire de demande d'échantillons est-il accessible rapidement ?

### 4.2 Tracking & Conversion

- Google Tag Manager / GA4 intégré ?
- Événements de conversion trackés (formulaire contact, demande échantillon, inscription) ?
- Pixels publicitaires (Google Ads, LinkedIn Ads pour B2B) ?

### 4.3 Mots-clés & Structure pour le SEA

- Les pages sont-elles organisées par intention de recherche ?
  - Informationnelle : blog, guides
  - Transactionnelle : catalogue, échantillons
  - Navigationnelle : marque, contact
- Quality Score potentiel : les landing pages correspondent-elles aux mots-clés cibles ?
- Extensions d'annonce : le structured data supporte-t-il les extensions (sitelinks, callouts) ?

---

## Process

1. Lire `app/globals.css`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/seo/JsonLd.tsx`
2. Scanner TOUTES les pages publiques pour les `generateMetadata`
3. Vérifier les JSON-LD sur chaque page
4. Analyser la structure H1/H2/H3 des pages principales
5. Vérifier les images (alt, next/image, taille)
6. Auditer le blog en profondeur (schema Article, maillage)
7. Vérifier la compatibilité AEO (crawlers IA, contenu snippet-friendly)
8. Produire des recommandations SEA

## Format de sortie

### Résumé exécutif
- Score SEO global : X/10
- Score AEO : X/10
- Points critiques à corriger en priorité

### SEO Technique
- Métadonnées : OK / à corriger (détails par page)
- Sitemap : OK / issues
- Robots.txt : OK / issues
- JSON-LD : OK / manquants
- Performance : OK / issues
- i18n : OK / issues

### SEO On-Page
- Par page : état des H1, contenu, maillage
- Blog : état des articles, schema, maillage

### AEO
- Compatibilité moteurs IA
- Contenu optimisé pour les réponses
- Actions recommandées

### SEA
- Recommandations landing pages
- Tracking à mettre en place
- Structure mots-clés suggérée

### Plan d'action priorisé
1. Quick wins (impact fort, effort faible)
2. Corrections importantes
3. Améliorations long terme
