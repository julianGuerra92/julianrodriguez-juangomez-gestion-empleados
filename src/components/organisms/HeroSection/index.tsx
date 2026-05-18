import Link from "next/link";
import {
  Shield,
  Users,
  CalendarDays,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";

export function HeroSection() {
  return (
    <section className="hero bg-base-200 py-24 lg:py-32">
      <div className="hero-content text-center max-w-4xl px-4">
        <div className="flex flex-col items-center gap-6">
          <Badge variant="primary" outline className="gap-2 py-3 px-4 text-sm">
            <Shield className="w-4 h-4" />
            Plataforma segura de gestión de empleados
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Gestiona tu equipo con{" "}
            <span className="text-primary">total eficiencia</span>
          </h1>

          <p className="text-lg sm:text-xl text-base-content/70 max-w-2xl">
            Centraliza el control de novedades, vacaciones y métricas de tu
            empresa en un solo lugar. Diseñado para equipos de Recursos Humanos
            que necesitan agilidad y precisión.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link href="/login" className="btn btn-primary btn-lg gap-2">
              Comenzar Ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn btn-outline btn-lg">
              Iniciar Sesión
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-base-content/50 mt-4">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Gestión de empleados
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Control de vacaciones
            </span>
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Dashboard analítico
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
