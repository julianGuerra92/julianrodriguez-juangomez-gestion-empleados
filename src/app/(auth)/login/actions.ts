"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export type LoginState = {
  error?: string
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return { error: "Por favor completa todos los campos." }
  }

  // Pre-validación para determinar el rol antes de llamar a signIn
  // (signIn siempre redirige en Server Actions, por eso necesitamos el rol aquí)
  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return { error: "Credenciales incorrectas. Verifica tu correo y contraseña." }
    }

    const redirectTo = user.role === "ADMIN" ? "/dashboard" : "/novedades"

    // signIn lanza una redirección NEXT_REDIRECT — debe re-lanzarse
    await signIn("credentials", { email, password, redirectTo })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Error de autenticación. Intenta de nuevo." }
    }
    // Re-lanzar NEXT_REDIRECT y otros errores del framework
    throw error
  }

  return {}
}
