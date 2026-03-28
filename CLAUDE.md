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
