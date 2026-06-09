# EcoRide - Next.js + PostgreSQL

Initialisation du projet front-office/back-office en Next.js, avec une base PostgreSQL
conteneurisee et un schema Prisma inspire du cahier des charges.

## Stack

- Next.js (App Router + TypeScript)
- PostgreSQL via Docker Compose
- Prisma ORM

## Demarrage rapide

1. Copier l'environnement:

```bash
cp .env.example .env
```

2. Demarrer la base de donnees:

```bash
docker compose up -d
```

3. Generer Prisma et appliquer la migration initiale:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Ajouter `SESSION_SECRET` dans `.env` (minimum 32 caracteres).

5. Peupler la base avec les donnees de test:

```bash
npm run db:seed
```

6. Lancer le serveur Next.js:

```bash
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

## Partie 1 - Socle & Auth

### Fonctionnalites livrees

- Connexion / inscription / deconnexion
- Sessions JWT securisees (cookie httpOnly)
- Roles: `client`, `technicien`, `admin`
- Protection des routes `/compte`, `/atelier`, `/admin`
- Seed: categories, trottinettes, stocks, comptes de test

### Comptes de test (apres `npm run db:seed`)

Mot de passe pour tous les comptes: `EcoRide2026!`

| Email | Role | Redirection |
|-------|------|-------------|
| `client@ecoride.test` | client | `/compte` |
| `technicien@ecoride.test` | technicien | `/atelier` |
| `admin@ecoride.test` | admin | `/admin` |

### Structure ajoutee

```
src/
  app/
    actions/auth.ts       # Server actions login/register/logout
    connexion/            # Page connexion
    inscription/          # Page inscription
    compte/               # Espace client (protege)
    atelier/              # Espace technicien (protege)
    admin/                # Back-office (protege)
  components/auth/        # Formulaires auth
  lib/auth/               # Session, mots de passe, roles
  middleware.ts           # Protection des routes
  types/auth.ts           # Types partages
prisma/seed.ts            # Donnees de test
```

## Logique metier initiale (repris du CDC)

- Catalogue de trottinettes (fiches, prix, autonomie, vitesse, garantie)
- Commandes client et panier
- Gestion des stocks
- Facturation
- Gestion utilisateurs et roles

## Schema Prisma

Le schema est dans `prisma/schema.prisma` avec les modeles:

- `Utilisateur`
- `Commande`
- `Facture`
- `LigneCommande`
- `Categorie`
- `Trottinette`
- `Stock`

## Workflow equipe (obligatoire)

Pour garder un historique clair quand on travaille a plusieurs:

- Toujours creer **une branche par fonctionnalite** ou correctif.
- Ne pas developper directement sur `main`.
- Ouvrir une PR pour relecture avant merge.

### Convention de nommage des branches

- `feat/nom-fonctionnalite`
- `fix/nom-correctif`
- `chore/tache-technique`

Exemples:

- `feat/catalogue-filtres`
- `feat/panier-client`
- `fix/calcul-montant-commande`

### Convention des messages de commit

Utiliser des commits explicites avec les prefixes:

- `feat(...)` pour une nouvelle fonctionnalite
- `fix(...)` pour une correction de bug

Exemples:

- `feat(catalogue): ajout du filtre par autonomie`
- `feat(commande): creation de la table ligne_commandes`
- `fix(stock): correction du calcul de quantite disponible`
- `fix(auth): verifie le role admin sur la route back-office`
