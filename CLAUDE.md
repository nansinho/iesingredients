# CLAUDE.md — IES Ingredients

## Projet

Site web B2B pour IES Ingredients, distributeur de matières premières naturelles et synthétiques pour la parfumerie, cosmétique et arômes alimentaires, basé à Allauch (Provence).

- **Stack** : Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase, next-intl (FR/EN)
- **Déploiement** : Docker via Coolify sur srv1197102.hstgr.cloud (domaine wpgrok.fr)
- **Node** : v20-alpine en production (Dockerfile), v24 en local

## Règles critiques

### Import PDF / Blog

- **Communiqués de presse** : Le contenu doit être reproduit **fidèlement**, mot pour mot. Ne jamais réécrire, reformuler ou inventer de contenu. Le titre doit être le titre exact du document source.
- **Autres articles** (news, events, trends) : L'IA peut reformuler et optimiser le contenu pour le SEO.
- L'IA ne doit jamais inventer de titre quand elle importe un document.

### Général

- Toujours répondre en **français**.
- Le `package-lock.json` doit être régénéré proprement avant chaque push (compatibilité npm 10 / Node 20 en production).
- Ne pas committer de secrets (.env, clés API).

---

## Règles Design (appliquées automatiquement)

### Couleurs — Design System obligatoire

- **TOUJOURS** utiliser les couleurs du design system défini dans `app/globals.css`
- Couleurs de marque : `bg-cream`, `bg-cream-light`, `bg-dark`, `bg-olive`, `bg-peach`, `bg-lavender`, `bg-brown`
- Couleurs par univers : `bg-cosmetique`, `bg-parfum`, `bg-arome` (+ `-light` / `-dark`)
- Échelles : `forest-50` à `forest-950`, `gold-50` à `gold-950`
- Couleurs shadcn : `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-card`, `bg-destructive`
- **INTERDIT** : couleurs hardcodées (`bg-[#xxx]`, `text-[rgb(...)]`), couleurs Tailwind par défaut (`bg-blue-500`, `text-red-600`)

### Typographie

- Corps : `font-sans` (DM Sans) — par défaut
- Titres accent : `font-playfair` (Playfair Display) — uniquement pour les grands titres élégants
- Tailles : utiliser le scale Tailwind (`text-sm`, `text-base`, `text-lg`...) ou les custom display (`text-display-xl` à `text-display-sm`)
- **INTERDIT** : tailles arbitraires (`text-[17px]`)

### Espacements

- Utiliser le scale Tailwind standard (`p-4`, `gap-6`, `mt-8`, `py-16`...)
- Sections de page : `py-16`, `py-20` ou `py-24` pour la cohérence
- **INTERDIT** : valeurs arbitraires (`p-[37px]`, `mt-[13px]`)

### Composants UI

- Utiliser les composants `components/ui/` (shadcn) pour : Button, Input, Card, Dialog, Select, Badge, etc.
- Utiliser `cn()` pour la composition de classes conditionnelles
- Ne pas mélanger Tailwind avec des styles inline

### Responsive

- Approche mobile-first : styles de base = mobile, puis `md:`, `lg:`, `xl:`
- Grids : 1 col mobile → 2 col `md:` → 3-4 col `lg:`
- Textes adaptatifs : `text-2xl md:text-4xl lg:text-5xl`

### Zones du site

- **Public** (`(public)`) : fond cream-light, accents peach/olive, design élégant Apple-inspired
- **Admin** (`(admin)`) : fond blanc, sidebar aubergine/dark, composants shadcn standard
- **Client** (`(client)`) : fond blanc/crème, sidebar fine et claire, style light

---

## Règles Structure (appliquées automatiquement)

### Conventions de nommage

- **Composants** : PascalCase (`UserCard.tsx`, `AdminSidebar.tsx`)
- **Pages** : `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` (convention Next.js)
- **API routes** : `route.ts` dans dossiers kebab-case (`app/api/create-user/route.ts`)
- **Utilitaires** : camelCase dans `lib/` (`formatDate.ts`)
- **Hooks** : préfixe `use` (`useAuth.ts`)

### Imports

- **TOUJOURS** utiliser l'alias `@/` (pas d'imports relatifs `../../`)
- Ordre : React/Next.js → packages externes → `@/lib` → `@/components` → types

### Server vs Client Components

- Pages = Server Components par défaut
- `"use client"` uniquement quand nécessaire (interactivité, hooks React)
- Data fetching dans les Server Components avec Supabase server client

### Organisation des fichiers

```
app/[locale]/(public)/   → Pages publiques
app/[locale]/(client)/   → Extranet client
app/[locale]/(admin)/    → Back-office admin
app/api/                 → API routes
components/admin/        → Composants admin
components/client/       → Composants extranet
components/ui/           → shadcn/ui
components/home/         → Page d'accueil
components/layout/       → Header, Footer
components/seo/          → JSON-LD, SEO
lib/supabase/            → Client Supabase
```

---

## Règles Sécurité (appliquées automatiquement)

### Authentification

- Routes `/admin/*` : vérifier rôle admin obligatoirement
- Routes `/espace-client/*` : vérifier authentification
- API routes sensibles : toujours vérifier `auth.uid()` en premier

### Supabase & RLS

- Chaque nouvelle table **doit** avoir RLS activé + policies SELECT/INSERT/UPDATE/DELETE
- Toujours vérifier l'ownership (`auth.uid()`) dans les policies
- Le `service_role` key ne doit **JAMAIS** être utilisé côté client
- Utiliser le Supabase client approprié : `createClient()` server-side, `createBrowserClient()` client-side

### Validation des inputs

- Valider les body de requête dans les API routes (Zod recommandé)
- Valider les paramètres d'URL avant requête DB
- Vérifier type MIME et taille pour les uploads de fichiers

### Injections

- **TOUJOURS** utiliser l'API builder Supabase (`.from().select().eq()`)
- **JAMAIS** d'interpolation de string dans les requêtes SQL
- Sanitiser le HTML avant `dangerouslySetInnerHTML`

### Secrets

- Variables sensibles uniquement dans `.env.local` (jamais hardcodées)
- `NEXT_PUBLIC_*` ne doit contenir aucun secret
- Ne jamais logger de tokens ou clés API

---

## Règles SEO / AEO (appliquées automatiquement)

### Métadonnées obligatoires

- Chaque page publique **doit** avoir `generateMetadata` avec :
  - `title` : 50-60 caractères, mot-clé principal inclus
  - `description` : 150-160 caractères, incitative
  - `openGraph` : title, description, images (1200x630), locale
  - `alternates` : hreflang FR ↔ EN
- Pages admin/client/auth : `robots: { index: false }`

### Structured Data (JSON-LD)

- Page d'accueil : `OrganizationJsonLd` + `WebSiteJsonLd` + `LocalBusinessJsonLd`
- Pages internes : `BreadcrumbJsonLd` (Accueil > Section > Page)
- Articles de blog : schema `Article`/`BlogPosting` (headline, author, datePublished, image)
- Pages produit : schema `Product` (name, description, category)
- Pages FAQ : `FAQJsonLd`
- Composants dans `components/seo/JsonLd.tsx`

### Images

- **TOUJOURS** `next/image` avec `width`, `height`, `alt` descriptif
- `loading="lazy"` sauf above-the-fold (hero)
- Format WebP, cible 150 Ko max

### Contenu SEO

- Un seul `<h1>` par page, contenant le mot-clé principal
- Hiérarchie H1 → H2 → H3 sans saut
- Maillage interne : lier vers les pages pertinentes du site
- Alt text descriptif sur toutes les images (pas "image", pas vide)

### AEO (Answer Engine Optimization)

- Paragraphes d'intro qui répondent directement à une question (snippet-friendly)
- H2/H3 formulés comme des questions quand pertinent
- Contenu factuel, structuré en listes quand approprié
- `SpeakableSpecification` sur les pages clés
- Autoriser les crawlers IA (GPTBot, PerplexityBot) dans robots.txt

### Blog — Règles spécifiques

- Chaque article doit avoir : titre, excerpt, image, catégorie, date de publication
- Schema `BlogPosting` JSON-LD automatique
- Breadcrumb : Accueil > Actualités > [Article]
- Articles liés en bas de page (maillage)
- Table des matières avec ancres pour les articles longs

---

## Skills d'audit disponibles

Pour un audit complet et détaillé, utiliser les skills dédiées :
- `/audit-design` — Audit cohérence design (couleurs, typo, espacements, responsive)
- `/audit-structure` — Audit architecture (nommage, imports, code mort, patterns)
- `/audit-security` — Audit sécurité (auth, RLS, validation, injections, secrets)
- `/audit-seo` — Audit SEO + AEO + SEA (métadonnées, JSON-LD, contenu, crawlers IA)
