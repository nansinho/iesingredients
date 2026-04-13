---
name: audit-security
description: Audit de sécurité complet de l'app IES Ingredients. Vérifie l'authentification Supabase, les politiques RLS, la validation des inputs, la protection des API routes, la gestion des secrets, les injections SQL/XSS, et les permissions RBAC.
disable-model-invocation: false
allowed-tools: Glob Read Grep Bash Agent
---

# Audit Sécurité — IES Ingredients

Tu es un expert en sécurité applicative spécialisé Next.js + Supabase. Effectue un audit de sécurité complet.

**Contexte du projet :**
- Next.js 16 App Router avec TypeScript
- Supabase (Auth + Database + Storage + RLS)
- 3 zones : publique, client authentifié, admin
- Middleware : `middleware.ts` (next-intl + session Supabase)
- API routes dans `app/api/`
- Pas de rate limiting configuré actuellement
- Déploiement Docker via Coolify

## Périmètre d'analyse

Si un argument `$ARGUMENTS` est fourni, limiter l'audit à ce dossier. Sinon, auditer tout le projet.

## 1. Authentification & Sessions

### Supabase Auth
- Vérifier la config du client Supabase (server vs client, cookies)
- Le middleware `updateSession` est-il appelé sur toutes les routes protégées ?
- Les cookies de session sont-ils configurés avec `httpOnly`, `secure`, `sameSite` ?
- Le refresh token est-il géré correctement ?

### Protection des routes
- Vérifier que `/admin/*` exige un rôle admin
- Vérifier que `/espace-client/*` exige une authentification
- Les pages protégées redirigent-elles vers `/login` si non authentifié ?
- Le middleware couvre-t-il toutes les routes qui doivent être protégées ?

### Gestion des mots de passe
- Politique de complexité (longueur min, caractères spéciaux)
- Reset password sécurisé (token, expiration)
- Pas de mots de passe en clair dans les logs ou réponses API

## 2. Row-Level Security (RLS) — Supabase

C'est le point le plus critique. Analyser TOUTES les migrations SQL dans `supabase/migrations/` :

- **Chaque table a-t-elle RLS activé ?** (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- **Politiques définies** pour chaque opération (SELECT, INSERT, UPDATE, DELETE)
- **Vérification d'ownership** : les policies vérifient-elles `auth.uid()` ?
- **Rôle admin** : comment est-il vérifié dans les policies ?
- **Tables sensibles** à vérifier en priorité :
  - `profiles` / `users`
  - `sample_requests` (demandes d'échantillons)
  - `blog_articles`
  - `media` (fichiers uploadés)
  - `support_tickets` / `support_messages` (si existants)
  - `notifications` (si existant)
  - `contacts` (formulaire de contact)
  - `audit_logs`
- **Accès anonyme** : quelles tables sont accessibles sans auth ?
- **Service role** : le `service_role` key n'est-il utilisé que côté serveur ?

## 3. Validation des Inputs

### API Routes
Pour CHAQUE fichier dans `app/api/*/route.ts` :
- Le body de la requête est-il validé (Zod, yup, ou validation manuelle) ?
- Les query params sont-ils validés ?
- Les paramètres d'URL (`[id]`, `[slug]`) sont-ils sanitisés ?
- Les réponses d'erreur ne leakent-elles pas d'info sensible ?

### Formulaires
- Les composants de formulaire valident-ils côté client ET serveur ?
- Les uploads de fichiers vérifient-ils le type MIME et la taille ?
- Protection anti-spam : honeypot, CAPTCHA, rate limiting ?

## 4. Injection & XSS

### SQL Injection
- Vérifier que TOUTES les requêtes Supabase utilisent l'API builder (`.from().select().eq()`)
- Chercher tout SQL brut (`sql`, `rpc`, template literals avec des variables)
- Vérifier les fonctions RPC Supabase pour les injections

### XSS (Cross-Site Scripting)
- Chercher `dangerouslySetInnerHTML` — est-ce sanitisé ?
- Les données utilisateur affichées sont-elles échappées ?
- Les Rich Text Editors (TipTap/Trix) sanitisent-ils le HTML ?
- Les URLs générées dynamiquement sont-elles validées ?

### CSRF
- Les mutations utilisent-elles des Server Actions (protection CSRF native Next.js) ?
- Les API routes POST/PUT/DELETE vérifient-elles l'origine ?

## 5. API Routes — Sécurité

Pour chaque route dans `app/api/` :
- **Auth check** : la route vérifie-t-elle l'authentification ?
- **Autorisation** : vérifie-t-elle le rôle/ownership ?
- **Méthode HTTP** : seules les méthodes nécessaires sont-elles exportées ?
- **Rate limiting** : les routes sensibles sont-elles protégées ?
- **CORS** : la config est-elle restrictive ?

Routes critiques à vérifier en priorité :
- `/api/admin/create-user` — création d'utilisateur (admin only ?)
- `/api/upload` — upload de fichiers (auth required ? taille max ?)
- `/api/contact` — formulaire contact (anti-spam ?)
- `/api/samples` — demandes d'échantillons
- `/api/translate` — traduction (abuse possible ?)
- `/api/extract-pdf` — extraction PDF (DoS possible ?)
- `/api/cron/check-sirene` — cron job (protégé par secret ?)

## 6. Secrets & Configuration

- `.env*` sont dans `.gitignore` ?
- Pas de secrets hardcodés dans le code (`sk_`, `key_`, `password`, `secret`)
- Les variables `NEXT_PUBLIC_*` ne contiennent pas de secrets
- Le `service_role` Supabase n'est JAMAIS exposé côté client
- Les clés API tierces (Claude, Resend, etc.) sont côté serveur uniquement

## 7. Storage & Fichiers

- Les buckets Supabase Storage ont des policies restrictives
- Les uploads vérifient type MIME, taille, et extension
- Pas de path traversal possible dans les noms de fichiers
- Les fichiers sensibles ne sont pas accessibles publiquement

## 8. Headers & Transport

- `Content-Security-Policy` est-il configuré ?
- `Strict-Transport-Security` (HSTS) activé ?
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options` ou `frame-ancestors` dans CSP
- Next.js `headers()` config dans `next.config.ts`

## Process

1. Lire le middleware et la config Supabase
2. Analyser TOUTES les migrations SQL pour les RLS policies
3. Auditer chaque API route
4. Chercher les secrets hardcodés et les vulnérabilités d'injection
5. Vérifier les headers de sécurité
6. Tester les permissions avec des scénarios (user A accède aux données de user B)

## Format de sortie

### Résumé exécutif
- Score de sécurité : X/10
- Nombre de vulnérabilités : Critiques / Hautes / Moyennes / Basses

### Vulnérabilités critiques (action immédiate)
Chaque item : description, fichier:ligne, impact, correction avec code

### Vulnérabilités hautes
Risques significatifs nécessitant une correction rapide

### Vulnérabilités moyennes
Points à améliorer

### Vulnérabilités basses / Recommandations
Bonnes pratiques à implémenter

### Points positifs
Ce qui est déjà bien sécurisé

### Plan d'action priorisé
Liste ordonnée des corrections à effectuer
