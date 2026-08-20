# Fabère Portfolio — backend dynamique

Ton portfolio statique existant + une administration complète (projets, compétences,
formations, messages, profil, réglages) branchée sur une vraie base de données.

## Comment c'est organisé

- `site/index.html` — ton site tel qu'il était, **inchangé**. Servi à la racine `/`
  par `app/route.js`.
- `public/` — `style.css`, `script.js`, images et icônes. `script.js` va maintenant
  chercher tes données dynamiques sur `/api/public-data` au chargement de la page ;
  si la base est vide, le contenu statique par défaut reste affiché.
- `app/api/` — toute l'API (routes publiques `public-data` et `contact`, routes
  protégées sous `api/admin/*`).
- `app/admin/` — l'interface d'administration (React/Next.js).
- `prisma/schema.prisma` — le schéma de la base de données.

## Installation en local

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Créer une base PostgreSQL gratuite**
   Le plus simple est [Neon](https://neon.tech) ou [Supabase](https://supabase.com) —
   crée un projet, récupère la chaîne de connexion (`postgresql://...`).

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   Remplis `DATABASE_URL` avec ta chaîne de connexion, génère un `SESSION_SECRET`
   (`openssl rand -base64 32`), et choisis `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

4. **Créer les tables**
   ```bash
   npm run db:migrate
   ```

5. **Créer ton compte admin**
   ```bash
   npm run db:seed
   ```

6. **Lancer le site en local**
   ```bash
   npm run dev
   ```
   - Site public : http://localhost:3000
   - Administration : http://localhost:3000/admin/login

## Déployer sur Vercel

1. Pousse ce projet sur GitHub (remplace le contenu de ton dépôt actuel par celui-ci —
   attention, la structure a changé : ce n'est plus un simple dossier de fichiers
   statiques mais un projet Next.js).
2. Sur [vercel.com](https://vercel.com), "Add New Project" → sélectionne le dépôt.
   Vercel détecte automatiquement Next.js, aucune configuration à changer.
3. Dans les réglages du projet Vercel → **Environment Variables**, ajoute
   `DATABASE_URL` et `SESSION_SECRET` (les mêmes valeurs que ton `.env`).
4. Déploie. Une fois en ligne, connecte-toi à `https://ton-site.vercel.app/admin/login`
   avec le compte créé à l'étape "seed" (lance `npm run db:seed` une fois en local
   avec le `DATABASE_URL` de production dans ton `.env`, le temps de créer le compte).

## Activer l'upload de fichiers (images, certificats, CV)

Les champs "image" et "fichier" de l'admin (photo de profil, image de projet,
galerie, certificat, CV) téléversent maintenant réellement vers
[Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — un espace de
stockage de fichiers gratuit jusqu'à 500 Mo, propre à ton compte Vercel.

**Cette étape est nécessaire même pour tester en local :**

1. Sur [vercel.com](https://vercel.com), crée d'abord ton projet (voir la section
   "Déployer sur Vercel" ci-dessous) — même sans avoir encore poussé de code, un
   projet vide suffit pour activer le stockage.
2. Dans le tableau de bord du projet → onglet **Storage** → **Create Database** →
   choisis **Blob**. Donne-lui un nom (ex. `portfolio-uploads`) et connecte-le au projet.
3. Une fois créé, Vercel affiche un token `BLOB_READ_WRITE_TOKEN`. Copie-le.
4. Ajoute-le dans ton `.env` local :
   ```
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxx"
   ```
5. Relance `npm run dev`. Les boutons "Choisir un fichier" dans l'admin
   fonctionnent maintenant, en local comme en production (même espace de stockage).

En production sur Vercel, si le Blob store est connecté au projet, la variable
`BLOB_READ_WRITE_TOKEN` est injectée automatiquement — pas besoin de la
redéfinir dans les Environment Variables du projet.

## Sécurité

- Le mot de passe admin est haché avec bcrypt — jamais stocké en clair.
- Les sessions sont des JWT signés en cookie `httpOnly`, `Secure`, expirant après 8h.
- Toutes les routes `/admin/*` et `/api/admin/*` sont protégées par `middleware.js` :
  impossible d'y accéder sans être connecté.
- Le formulaire de contact public a une protection anti-spam basique (honeypot).
- L'upload de fichiers est limité à 8 Mo et aux types image/PDF, et n'est
  accessible qu'aux routes admin protégées.

## Ce qui n'est pas encore fait

- Les pages admin sont fonctionnelles avec un style soigné, mais sans les
  animations avancées du site public (curseur personnalisé, cube 3D, etc.) —
  l'objectif reste que tout fonctionne d'abord correctement.
