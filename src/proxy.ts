import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Middleware de autenticación basado en JWT.
 * Usa authConfig (sin Prisma) para ser compatible con el Edge Runtime.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto:
     * - /api/auth/... (handlers de NextAuth)
     * - /_next/static (archivos estáticos)
     * - /_next/image (optimización de imágenes)
     * - /favicon.ico
     * - Archivos de extensión conocida (svg, png, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
