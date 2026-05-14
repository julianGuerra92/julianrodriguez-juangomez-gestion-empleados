import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getConnectionString() {
  const url = new URL(process.env.DATABASE_URL!)
  // ?pgbouncer=true es un flag de Prisma Engine, no es válido para el driver pg
  url.searchParams.delete("pgbouncer")
  return url.toString()
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: getConnectionString() })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
