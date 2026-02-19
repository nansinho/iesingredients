# IES Ingredients

Site B2B de distribution d'ingrédients naturels pour la cosmétique, la parfumerie et l'agroalimentaire.

## Stack technique

- **Framework** : Next.js 16 (App Router, Turbopack)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4 + shadcn/ui
- **i18n** : next-intl v4 (FR/EN)
- **Base de données** : Supabase (PostgreSQL) self-hosted
- **Auth** : Supabase Auth + RBAC (admin/user)
- **State** : Zustand (panier d'échantillons)
- **Animations** : Framer Motion
- **Traduction** : LibreTranslate self-hosted
- **Déploiement** : Docker + Nginx + Let's Encrypt sur VPS

## Structure du projet

```
app/
├── [locale]/(public)/     # Pages publiques (FR/EN)
│   ├── page.tsx           # Accueil avec hero parallax
│   ├── catalogue/         # Catalogue + fiches produits (ISR)
│   ├── entreprise/        # Page entreprise
│   ├── equipe/            # Équipe
│   ├── actualites/        # Blog articles
│   ├── contact/           # Formulaire de contact
│   ├── podcast/           # Podcast
│   └── mon-compte/        # Espace utilisateur
├── [locale]/(auth)/       # Login / Register
├── [locale]/(admin)/      # Dashboard admin (protégé RBAC)
└── api/                   # Routes API (contact, samples, translate, revalidate, health)

components/
├── home/                  # Composants accueil (ParallaxHero, BentoExpertise, etc.)
├── catalog/               # CatalogClient
├── product/               # ProductDetail
├── admin/                 # Dashboard admin (CRUD produits, blog, équipe, etc.)
├── auth/                  # LoginForm, RegisterForm
├── cart/                  # SampleCartSheet (panier d'échantillons)
├── contact/               # ContactForm
├── layout/                # Header, Footer
├── seo/                   # JSON-LD (Organization, WebSite, FAQ, Breadcrumb, etc.)
└── ui/                    # shadcn/ui components

lib/
├── supabase/              # Clients Supabase (server, client, admin, middleware)
├── products.ts            # Recherche produits SSR
├── auth.ts                # Helpers auth serveur
├── rate-limit.ts          # Rate limiting en mémoire
└── validations.ts         # Schémas Zod
```

## Développement local

```bash
# Installer les dépendances
npm install

# Créer le fichier .env.local
cp .env.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Lancer le serveur de développement
npm run dev

# Type-check
npm run type-check

# Build production
npm run build
```

## Base de données

Le schéma SQL complet est dans `supabase/schema.sql`. L'exécuter dans le SQL Editor de Supabase pour créer les 13 tables avec RLS, triggers et indexes.

## Déploiement VPS

```bash
# Premier déploiement
cd docker
./scripts/deploy.sh first-run

# Mise à jour
./scripts/deploy.sh update

# SSL (première fois uniquement)
./scripts/init-ssl.sh ies-ingredients.com admin@ies-ingredients.com
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (serveur uniquement) |
| `NEXT_PUBLIC_SITE_URL` | `https://ies-ingredients.com` |
| `REVALIDATE_SECRET` | Secret pour l'API ISR on-demand |
| `LIBRETRANSLATE_URL` | URL LibreTranslate (défaut: `http://libretranslate:5000`) |
