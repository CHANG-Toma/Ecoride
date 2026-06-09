import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  return new PrismaClient({
    log: ["error", "warn"],
  });
}

function isStalePrismaClient(client: PrismaClient): boolean {
  return !("reparation" in client) || !("entreeStock" in client);
}

function getPrismaClient() {
  const cached = globalForPrisma.prisma;

  // Recree le client en dev si le schema a change (ex: nouveaux modeles atelier)
  if (cached && isStalePrismaClient(cached)) {
    void cached.$disconnect();
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = getPrismaClient();
