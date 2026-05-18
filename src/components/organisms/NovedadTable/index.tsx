"use client";

import { NovedadListItem } from "@/types/novedad";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, Edit2 } from "lucide-react";

interface NovedadTableProps {
  novedades: NovedadListItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (novedad: NovedadListItem) => void;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
  total: number;
}

export function NovedadTable({
  novedades,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  loading = false,
  total,
}: NovedadTableProps) {
  const getTypeLabel = (type: string) => {
    return type === "HORA_EXTRA" ? "Hora Extra" : "Incapacidad";
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === "HORA_EXTRA" ? "primary" : "secondary";
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta novedad?")) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {novedades.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-base-content/60">No hay novedades registradas</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Duración/Fechas</th>
                  <th>Motivo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {novedades.map((novedad) => {
                  const isHoraExtra = novedad.type === "HORA_EXTRA";
                  const durationText = isHoraExtra
                    ? `${novedad.hours} hrs`
                    : `${format(new Date(novedad.startDate), "dd/MM", {
                        locale: es,
                      })} - ${format(new Date(novedad.endDate!), "dd/MM", {
                        locale: es,
                      })}`;

                  return (
                    <tr key={novedad.id}>
                      <td className="text-sm">
                        {format(new Date(novedad.startDate), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </td>
                      <td>
                        <Badge
                          variant={getTypeBadgeVariant(novedad.type) as any}
                          outline
                        >
                          {getTypeLabel(novedad.type)}
                        </Badge>
                      </td>
                      <td className="text-sm">{durationText}</td>
                      <td className="text-sm truncate max-w-xs">
                        {novedad.reason}
                      </td>
                      <td className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onEdit(novedad)}
                          disabled={loading}
                          className="btn-xs"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="error"
                          onClick={() => handleDelete(novedad.id)}
                          disabled={loading}
                          className="btn-xs"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="text-sm text-base-content/60">
              Página {currentPage} de {totalPages} | Total: {total} novedades
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
