"use client";

import { useState } from "react";
import { PendingVacationItem } from "@/types/vacation";
import { SolicitudesPendientesTable } from "@/components/organisms/SolicitudesPendientesTable";
import { Alert } from "@/components/atoms/Alert";
import { getPendingVacaciones, updateVacacionStatus } from "@/actions/vacaciones";

interface SolicitudesWrapperProps {
  readonly initialSolicitudes: PendingVacationItem[];
  readonly initialTotal: number;
  readonly initialPages: number;
}

export function SolicitudesWrapper({
  initialSolicitudes,
  initialTotal,
  initialPages,
}: SolicitudesWrapperProps) {
  const [solicitudes, setSolicitudes] = useState(initialSolicitudes);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [pages, setPages] = useState(initialPages);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await getPendingVacaciones(newPage);
      setSolicitudes(response.solicitudes);
      setCurrentPage(response.currentPage);
      setTotal(response.total);
      setPages(response.pages);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las solicitudes",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "APROBADA" | "RECHAZADA",
  ) => {
    setLoading(true);
    setError("");

    try {
      const response = await updateVacacionStatus({ id, status });
      if (!response.success) {
        throw new Error(response.error ?? "Error al procesar la solicitud");
      }
      const refreshed = await getPendingVacaciones(1);
      setSolicitudes(refreshed.solicitudes);
      setCurrentPage(refreshed.currentPage);
      setTotal(refreshed.total);
      setPages(refreshed.pages);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al procesar la solicitud",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <SolicitudesPendientesTable
        solicitudes={solicitudes}
        currentPage={currentPage}
        totalPages={pages}
        onPageChange={handlePageChange}
        onApprove={(id) => handleUpdateStatus(id, "APROBADA")}
        onReject={(id) => handleUpdateStatus(id, "RECHAZADA")}
        loading={loading}
        total={total}
      />
    </div>
  );
}
