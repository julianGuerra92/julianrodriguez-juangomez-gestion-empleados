"use client";

import { PendingVacationItem } from "@/types/vacation";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, XCircle } from "lucide-react";

interface SolicitudesPendientesTableProps {
  readonly solicitudes: PendingVacationItem[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly onApprove: (id: string) => Promise<void>;
  readonly onReject: (id: string) => Promise<void>;
  readonly loading?: boolean;
  readonly total: number;
}

export function SolicitudesPendientesTable({
  solicitudes,
  currentPage,
  totalPages,
  onPageChange,
  onApprove,
  onReject,
  loading = false,
  total,
}: SolicitudesPendientesTableProps) {
  return (
    <div className="space-y-4">
      {solicitudes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base-content/60 text-lg">
            No hay solicitudes de vacaciones pendientes
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Días solicitados</th>
                  <th>Saldo disponible</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id}>
                    <td className="font-medium">{solicitud.user.name}</td>
                    <td className="text-sm">
                      {format(new Date(solicitud.startDate), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </td>
                    <td className="text-sm">
                      {format(new Date(solicitud.endDate), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </td>
                    <td>
                      <Badge variant="neutral">{solicitud.requestedDays} días</Badge>
                    </td>
                    <td>
                      <Badge
                        variant={
                          solicitud.userAvailableDays >= solicitud.requestedDays
                            ? "success"
                            : "error"
                        }
                      >
                        {solicitud.userAvailableDays} días
                      </Badge>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => onApprove(solicitud.id)}
                          disabled={loading}
                          className="btn-xs gap-1"
                        >
                          <CheckCircle size={14} />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="error"
                          onClick={() => onReject(solicitud.id)}
                          disabled={loading}
                          className="btn-xs gap-1"
                        >
                          <XCircle size={14} />
                          Rechazar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="text-sm text-base-content/60">
              Página {currentPage} de {totalPages} | Total: {total} solicitud
              {total !== 1 ? "es" : ""} pendiente{total !== 1 ? "s" : ""}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
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
