# Faso Market

Boutique en ligne en 5 minutes pour les commerçants burkinabè — vente sur WhatsApp, paiement Mobile Money.

Stack : **Vite + React + TypeScript + Tailwind CSS** (frontend, hébergé gratuitement sur GitHub Pages) +
**Supabase** (gratuit) pour les comptes marchands, les boutiques et les produits.

## Mise en route

### 1. Développement local

```bash
npm install
cp .env.example .env.local   # puis remplis avec tes clés Supabase (étape 2)
npm run dev
```

### 2. Créer le projet Supabase (gratuit)

1. Va sur [supabase.com](https://supabase.com) et crée un compte + un nouveau projet (gratuit).
2. Dans **SQL Editor**, colle et exécute le contenu de [`supabase/schema.sql`](./supabase/schema.sql) —
   ça crée les tables `boutiques` / `produits`, les règles de sécurité (RLS) et le bucket de stockage des photos.
3. Dans **Project Settings > API**, récupère :
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. Colle ces deux valeurs dans ton `.env.local` (dev) et dans les secrets GitHub (prod, voir ci-dessous).

Ces clés sont faites pour être publiques côté client : la sécurité réelle est assurée par les règles RLS
définies dans `schema.sql` (un marchand ne peut modifier que sa propre boutique/ses propres produits).

### 3. Déploiement automatique (GitHub Pages, gratuit)

1. Dans les **Settings > Secrets and variables > Actions** du repo, ajoute deux secrets :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Dans **Settings > Pages**, choisis la source **GitHub Actions**.
3. À chaque push sur `main`, le workflow [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)
   build le site et le publie automatiquement.

## Structure

```
src/
  pages/         # Landing, Inscription, Connexion, Dashboard, Boutique publique
  components/    # Header, Footer, ProduitsManager, ProtectedRoute
  lib/           # client Supabase, auth context, types
supabase/
  schema.sql     # tables + RLS + storage bucket photos produits
```
