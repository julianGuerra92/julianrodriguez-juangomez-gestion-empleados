import { ClipboardList, CalendarDays, BarChart3 } from "lucide-react";
import { FeatureCard } from "@/components/molecules/FeatureCard";

export function FeatureGrid() {
  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Todo lo que necesitas en un solo sistema
          </h2>
          <p className="mt-4 text-base-content/60 text-lg max-w-xl mx-auto">
            Módulos diseñados para simplificar la gestión del talento humano en
            tu organización.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ClipboardList className="w-7 h-7" />}
            variant="primary"
            title="Novedades"
            description="Registra horas extras e incapacidades fácilmente. Mantén un historial completo de las novedades de tu equipo en tiempo real."
            href="/login"
          />
          <FeatureCard
            icon={<CalendarDays className="w-7 h-7" />}
            variant="secondary"
            title="Vacaciones"
            description="Solicita, aprueba y controla días de descanso. El sistema calcula automáticamente el saldo disponible de cada empleado."
            href="/login"
          />
          <FeatureCard
            icon={<BarChart3 className="w-7 h-7" />}
            variant="accent"
            title="Dashboard"
            description="Visualiza métricas clave de tu empresa. Analiza horas extras, incapacidades y tendencias por empleado o área organizacional."
            href="/login"
          />
        </div>
      </div>
    </section>
  );
}
