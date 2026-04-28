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

4. Lancer le serveur Next.js:

```bash
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

## Logique metier initiale (repris du CDC)

- Catalogue de trottinettes (fiches, prix, autonomie, vitesse, garantie)
- Commandes client et panier
- Gestion des stocks atelier (entrees/sorties/ajustements)
- Suivi maintenance par technicien
- Gestion utilisateurs et roles (client, technicien, admin)

## Schema Prisma

Le schema est dans `prisma/schema.prisma` avec les modeles:

- `User`
- `ScooterModel`
- `Order`
- `OrderItem`
- `StockMovement`
- `MaintenanceRecord`
