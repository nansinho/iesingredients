---
name: audit-structure
description: Audit complet de la structure et architecture du projet IES Ingredients. Vérifie les conventions de nommage, l'organisation des fichiers, les imports, le code mort, les doublons et la conformité aux patterns Next.js App Router.
disable-model-invocation: false
allowed-tools: Glob Read Grep Bash Agent
---

# Audit Structure — IES Ingredients

Tu es un architecte Next.js senior. Effectue un audit complet de la structure et de l'organisation du code.

**Contexte du projet :**
- Next.js 16 App Router avec TypeScript
- 3 route groups : `(public)`, `(client)`, `(admin)`
- Supabase (pas Prisma) — migrations SQL dans `supabase/migrations/`
- i18n via next-intl (FR/EN) — routes sous `app/[locale]/`
- Composants dans `components/` organisés par domaine
- API routes dans `app/api/`

## Périmètre d'analyse

Si un argument `$ARGUMENTS` est fourni, limiter l'audit à ce dossier. Sinon, auditer tout le projet.

## 1. Conventions de nommage

### Fichiers & dossiers
- **Pages** : `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` (Next.js convention)
- **Composants** : PascalCase (ex: `UserCard.tsx`, `AdminSidebar.tsx`)
- **Utilitaires/lib** : camelCase (ex: `formatDate.ts`, `supabaseClient.ts`)
- **API routes** : `route.ts` dans des dossiers kebab-case (ex: `app/api/create-user/route.ts`)
- **Types** : fichiers en camelCase dans `lib/types/` ou co-localisés
- **Hooks** : préfixe `use` + PascalCase (ex: `useAuth.ts`)

### Exports
- Les composants exportent en PascalCase
- Les fonctions utilitaires en camelCase
- Les types/interfaces en PascalCase avec préfixe descriptif

## 2. Organisation des dossiers

Vérifier la structure attendue :
```
app/
  [locale]/
    (public)/     → Pages publiques (accueil, catalogue, blog, contact)
    (client)/     → Extranet client (espace-client/*)
    (admin)/      → Back-office admin (admin/*)
  api/            → API routes
components/
  admin/          → Composants admin
  client/         → Composants extranet client
  ui/             → Composants shadcn/ui
  home/           → Composants page d'accueil
  layout/         → Header, Footer, Sidebar
  auth/           → Authentification
  [domaine]/      → Par domaine métier
lib/
  supabase/       → Client Supabase, helpers
  types/          → Types TypeScript
  utils/          → Fonctions utilitaires
supabase/
  migrations/     → Migrations SQL
```

Détecter :
- Fichiers mal placés (composant dans `lib/`, utilitaire dans `components/`)
- Dossiers vides ou avec un seul fichier inutilement imbriqué
- Incohérences d'organisation entre zones

## 3. Imports & Dépendances

- Vérifier l'utilisation systématique des alias `@/` (pas d'imports relatifs `../../`)
- Ordre des imports : React/Next → packages externes → `@/lib` → `@/components` → relatifs
- Détecter les imports circulaires
- Vérifier qu'aucun import ne pointe vers un fichier inexistant
- Pas d'imports inutilisés

## 4. Code mort & Fichiers orphelins

- Composants jamais importés nulle part
- Fonctions exportées mais jamais utilisées
- Pages/routes sans lien dans la navigation
- Fichiers de migration SQL obsolètes ou en conflit
- Variables d'environnement référencées mais potentiellement inutilisées

## 5. Patterns & Cohérence

### Server vs Client Components
- Vérifier l'utilisation correcte de `"use client"` (seulement quand nécessaire)
- Les pages devraient être Server Components par défaut
- Seuls les composants interactifs ont `"use client"`

### Data Fetching
- Pattern cohérent : Server Components avec Supabase server client
- Actions serveur dans des fichiers dédiés ou co-localisés
- Pas de fetch côté client quand un Server Component suffit

### Error Handling
- Présence de `error.tsx` et `loading.tsx` pour les routes principales
- Gestion cohérente des erreurs dans les API routes

### Réutilisabilité
- Composants dupliqués qui devraient être factorisés
- Logique métier répétée qui devrait être dans `lib/`

## 6. Configuration & Meta

- `package.json` : dépendances inutilisées ou manquantes
- Cohérence des scripts npm
- Fichiers de config à la racine : nécessaires ou superflus ?
- `.gitignore` : couvre bien les fichiers sensibles

## Process

1. Scanner l'arborescence complète du projet
2. Vérifier les conventions de nommage fichier par fichier
3. Analyser les imports avec grep
4. Chercher le code mort (composants non importés)
5. Vérifier les patterns Server/Client components
6. Auditer la configuration

## Format de sortie

### Résumé
- Score global : X/10
- Statistiques : nombre de fichiers, composants, API routes, migrations

### Violations critiques
- Fichiers mal nommés, imports cassés, code mort significatif

### Alertes
- Incohérences mineures, imports relatifs, organisation discutable

### Suggestions
- Refactoring recommandé, factorisation de code dupliqué

### Points positifs
- Bonnes pratiques déjà en place
