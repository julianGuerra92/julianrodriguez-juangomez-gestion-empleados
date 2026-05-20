import { VacationStats } from "@/types/vacation";
import { CalendarDays } from "lucide-react";

interface VacationStatsCardProps {
  readonly stats: VacationStats;
}

export function VacationStatsCard({ stats }: VacationStatsCardProps) {
  const { totalAccrued, usedDays, availableDays, yearsWorked } = stats;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-6">
        <h2 className="card-title text-lg mb-4">
          <CalendarDays size={20} className="text-primary" />
          Días de Vacaciones
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center bg-base-200 rounded-xl p-4 gap-1">
            <span className="text-3xl font-bold text-primary">
              {availableDays}
            </span>
            <span className="text-sm text-base-content/70 text-center">
              Días disponibles
            </span>
          </div>

          <div className="flex flex-col items-center justify-center bg-base-200 rounded-xl p-4 gap-1">
            <span className="text-3xl font-bold text-base-content">
              {totalAccrued}
            </span>
            <span className="text-sm text-base-content/70 text-center">
              Días acumulados
            </span>
          </div>

          <div className="flex flex-col items-center justify-center bg-base-200 rounded-xl p-4 gap-1">
            <span className="text-3xl font-bold text-base-content/60">
              {usedDays}
            </span>
            <span className="text-sm text-base-content/70 text-center">
              Días usados
            </span>
          </div>
        </div>

        <p className="text-xs text-base-content/50 mt-3">
          Basado en {yearsWorked} {yearsWorked === 1 ? "año" : "años"} laborado{yearsWorked === 1 ? "" : "s"} · 15 días por año
        </p>
      </div>
    </div>
  );
}
