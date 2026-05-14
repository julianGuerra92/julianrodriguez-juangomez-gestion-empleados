import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"
import bcrypt from "bcryptjs"
import "dotenv/config"

const rawUrl = new URL(process.env.DATABASE_URL!)
rawUrl.searchParams.delete("pgbouncer")
const adapter = new PrismaPg({ connectionString: rawUrl.toString() })
const prisma = new PrismaClient({ adapter })

async function main() {
      console.log("🌱 Iniciando seed...")

      // Usuario ADMIN de prueba
      const adminPassword = await bcrypt.hash("Admin123!", 12)
      await prisma.user.upsert({
            where: { email: "admin@empresa.com" },
            update: {},
            create: {
                  email: "admin@empresa.com",
                  name: "Administrador",
                  passwordHash: adminPassword,
                  role: "ADMIN",
                  hireDate: new Date("2023-01-15"),
            },
      })

      // Usuario USER de prueba
      const userPassword = await bcrypt.hash("User123!", 12)
      await prisma.user.upsert({
            where: { email: "empleado@empresa.com" },
            update: {},
            create: {
                  email: "empleado@empresa.com",
                  name: "Empleado de Prueba",
                  passwordHash: userPassword,
                  role: "USER",
                  hireDate: new Date("2024-03-15"),
            },
      })

      console.log("✅ Seed completado")
      console.log("   admin@empresa.com  / Admin123!")
      console.log("   empleado@empresa.com / User123!")
}

main()
      .catch((e) => {
            console.error("❌ Error en seed:", e)
            process.exit(1)
      })
      .finally(() => prisma.$disconnect())
