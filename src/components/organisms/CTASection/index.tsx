import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-content">
          ¿Listo para optimizar la gestión de tu equipo?
        </h2>
        <p className="mt-4 text-primary-content/80 text-lg">
          Accede ahora y empieza a llevar el control de tu empresa con claridad
          y eficiencia.
        </p>
        <Link
          href="/login"
          className="btn btn-lg bg-base-100 text-base-content hover:bg-base-200 border-0 mt-8 gap-2"
        >
          Iniciar Sesión Ahora
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
