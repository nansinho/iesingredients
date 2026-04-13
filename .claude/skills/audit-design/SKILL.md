---
name: audit-design
description: Audit complet de la cohérence design sur l'app IES Ingredients. Vérifie les couleurs Tailwind, espacements, typographie, composants UI, responsive, et conformité au design system Apple-inspired défini dans globals.css.
disable-model-invocation: false
allowed-tools: Glob Read Grep Agent
---

# Audit Design — IES Ingredients

Tu es un expert UI/UX spécialisé en Tailwind CSS v4 et design systems. Effectue un audit complet de la cohérence design du projet.

**Contexte du projet :**
- Design system Apple-inspired (off-white / forest green / warm sand)
- Tailwind CSS v4 avec config CSS-first dans `app/globals.css`
- Fonts : DM Sans (corps) + Playfair Display (accent)
- Composants shadcn/ui personnalisés dans `components/ui/`
- 3 zones : publique `(public)`, client `(client)`, admin `(admin)`
- Variables de marque : `--brand-primary`, `--brand-accent`, `--brand-secondary`, etc.

## Périmètre d'analyse

Si un argument `$ARGUMENTS` est fourni, limiter l'audit à ce dossier. Sinon, auditer tout le projet.

## 1. Couleurs — Conformité au design system

- Lire `app/globals.css` pour extraire TOUTES les couleurs définies (brand-*, shadcn, chart, sidebar)
- Scanner `app/` et `components/` pour trouver :
  - Couleurs hardcodées (`bg-[#...]`, `text-[#...]`, `border-[#...]`) → VIOLATION
  - Couleurs arbitraires (`bg-[hsl(...)]`, `text-[rgb(...)]`) → VIOLATION
  - Couleurs Tailwind par défaut non mappées au design system (`bg-blue-500`, `text-red-600`) → ALERTE si pas justifié
  - Couleurs custom du projet (`bg-brand-primary`, `text-brand-accent`) → OK
  - Couleurs shadcn (`bg-primary`, `text-muted-foreground`) → OK
- Vérifier la cohérence entre les 3 zones (public/client/admin)

## 2. Typographie

- Vérifier l'utilisation cohérente de `font-sans` (DM Sans) et `font-playfair`
- Vérifier que les tailles utilisent le scale Tailwind ou les custom display (`text-display-xl`, etc.)
- Pas de `font-size` inline ou de tailles arbitraires (`text-[17px]`)
- Vérifier les `letter-spacing` : utilise `tracking-luxury`, `tracking-widest` du design system
- Cohérence des `leading-*` (line-height) dans les composants similaires

## 3. Espacements & Layout

- Vérifier la cohérence des paddings/margins dans les composants similaires
- Les sections de page utilisent des espacements cohérents (`py-16`, `py-20`, `py-24`)
- Les cards utilisent les mêmes paddings internes
- Les gaps dans les grids/flex sont cohérents
- Détecter les valeurs arbitraires (`p-[37px]`, `mt-[13px]`) → VIOLATION

## 4. Composants UI (shadcn)

- Vérifier que les composants `components/ui/` utilisent les variables CSS du theme
- Pas de styles hardcodés qui contournent le design system
- Les boutons ont des variantes cohérentes (tailles, couleurs)
- Les inputs/formulaires sont stylés de manière uniforme
- Les cards utilisent `bg-card`, `text-card-foreground` et pas des couleurs directes

## 5. Responsive Design

- Vérifier l'approche mobile-first (styles de base = mobile, puis `md:`, `lg:`, `xl:`)
- Les layouts principaux ont des breakpoints cohérents
- Les grids passent correctement de 1 à 2/3/4 colonnes
- Les tailles de texte s'adaptent (`text-2xl md:text-4xl lg:text-5xl`)
- Pas de contenu caché sans alternative mobile (`hidden md:block` sans version mobile)

## 6. Animations & Transitions

- Vérifier l'utilisation des animations définies dans le design system (`animate-reveal`, `animate-fade-in`, etc.)
- Pas d'animations custom inline qui pourraient être standardisées
- Les `transition-*` sont cohérents (durées, easing)
- Vérifier que les animations respectent `prefers-reduced-motion`

## 7. Dark Mode

- Vérifier que les composants supportent le dark mode via les variables CSS
- Pas de couleurs hardcodées qui casseraient en dark mode
- Les contrastes sont suffisants dans les deux modes

## Process

1. Lire `app/globals.css` en entier pour comprendre le design system
2. Lancer des recherches en parallèle sur les violations de couleurs, typographie, espacements
3. Comparer les patterns entre zones public/client/admin
4. Vérifier les composants shadcn/ui

## Format de sortie

Produire un rapport structuré :

### Resume
- Score global : X/10
- Nombre de violations critiques / alertes / suggestions

### Violations critiques (a corriger)
- Fichier, ligne, problème, correction suggérée

### Alertes (a vérifier)
- Incohérences potentielles

### Suggestions d'amélioration
- Opportunités d'harmonisation

### Points positifs
- Ce qui est bien fait
