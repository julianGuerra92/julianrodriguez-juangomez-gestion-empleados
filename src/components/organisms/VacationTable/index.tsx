"use client";

import { VacationListItem } from "@/types/vacation";
import { VacationStatus } from "@/generated/prisma/client";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface VacationTableProps {
  readonly vacaciones: VacationListItem[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly loading?: boolean;
  readonly total: number;
}

const statusConfig: Record<
  VacationStatus,
  { label: string; variant: "warning" | "success" | "error" }
> = {
  PENDIENTE: { label: "Pendiente", variant: "warning" },
  APROBADA: { label: "Aprobada", variant: "success" },
  RECHAZADA: { label: "Rechazada", variant: "error" },
};

export function VacationTable({
  vacaciones,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  total,
}: VacationTableProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Historial de solicitudes</h2>

      {vacaciones.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-base-content/60">No hay solicitudes de vacaciones registradas</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Fecha de inicio</th>
                  <th>Fecha de fin</th>
                  <th>Días solicitados</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {vacaciones.map((vacation) => {
                  const { label, variant } = statusConfig[vacation.status];
                  return (
                    <tr key={vacation.id}>
                      <td className="text-sm">
                        {format(new Date(vacation.startDate), "dd/MM/yyyy", { locale: es })}
                      </td>
                      <td className="text-sm">
                        {format(new Date(vacation.endDate), "dd/MM/yyyy", { locale: es })}
                      </td>
                      <td className="text-sm">{vacation.requestedDays}</td>
                      <td>
                        <Badge variant={variant} outline>
                          {label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="text-sm text-base-content/60">
              Página {currentPage} de {totalPages} | Total: {total} solicitudes
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={loading || currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={loading || currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
