import { ROLES } from "@/constants/roles";
import type { NextAuthConfig } from "next-auth";

/**
 * Configuración base de NextAuth sin importaciones de Node.js (Prisma, bcryptjs).
 * Segura para usar en el Edge Runtime del middleware de Next.js.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    // Valida si la petición está autorizada y gestiona las redirecciones de ruta
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Ruta de login: permitir si no hay sesión, redirigir si ya está autenticado
      if (pathname === "/login") {
        if (!isLoggedIn) return true;
        const role = (auth?.user as { role?: string })?.role;
        const destination = role === ROLES.ADMIN ? "/dashboard" : "/novedades";
        return Response.redirect(new URL(destination, nextUrl));
      }

      // Landing page: pública para visitantes, redirigir si ya está autenticado
      if (pathname === "/") {
        if (!isLoggedIn) return true;
        const role = (auth?.user as { role?: string })?.role;
        const destination = role === ROLES.ADMIN ? "/dashboard" : "/novedades";
        return Response.redirect(new URL(destination, nextUrl));
      }

      // Rutas protegidas: redirigir a login si no hay sesión
      if (!isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
    // Persiste el rol e ID en el JWT
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    // Expone el rol e ID en el objeto de sesión
    session({ session, token }) {
      if (token.role) {
        (session.user as { role?: string }).role = token.role as string;
      }
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
