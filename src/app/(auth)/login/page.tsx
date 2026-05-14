import { auth } from "@/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import LoginForm from "./LoginForm"

export const metadata: Metadata = {
  title: "Iniciar sesión | Gestión de Empleados",
}

export default async function LoginPage() {
  // Si ya hay sesión activa, redirigir según rol
  const session = await auth()
  if (session?.user) {
    const role = session.user.role
    redirect(role === "ADMIN" ? "/dashboard" : "/novedades")
  }

  return <LoginForm />
}
