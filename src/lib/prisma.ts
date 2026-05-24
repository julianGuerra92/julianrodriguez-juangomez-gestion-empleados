// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "@/generated/prisma/client";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// function getConnectionString() {
//   if (!process.env.DATABASE_URL) return undefined;
  
//   try {
//     const url = new URL(process.env.DATABASE_URL);
//     url.searchParams.delete("pgbouncer");
//     return url.toString();
//   } catch (error) {
//     return process.env.DATABASE_URL;
//   }
// }

// function createPrismaClient() {
//   const connectionString = getConnectionString();
  
//   if (connectionString) {
//     const adapter = new PrismaPg({ connectionString });
//     return new PrismaClient({ adapter });
//   }

//   return new PrismaClient({} as any);
// }

// export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

