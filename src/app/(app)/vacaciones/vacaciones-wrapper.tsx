"use client";

import { useState } from "react";
import { VacationListItem, VacationStats } from "@/types/vacation";
import { VacationStatsCard } from "@/components/molecules/VacationStatsCard";
import { VacationTable } from "@/components/organisms/VacationTable";
import { VacationModal } from "@/components/organisms/VacationModal";
import { Alert } from "@/components/atoms/Alert";
import { Button } from "@/components/atoms/Button";
import { getVacaciones, createVacacion } from "@/actions/vacaciones";
import { Plus } from "lucide-react";

interface VacaionesWrapperProps {
  readonly initialVacaciones: VacationListItem[];
  readonly initialTotal: number;
  readonly initialPages: number;
  readonly stats: VacationStats;
}

export function VacaionesWrapper({
  initialVacaciones,
  initialTotal,
  initialPages,
  stats,
}: VacaionesWrapperProps) {
  const [vacaciones, setVacaciones] = useState(initialVacaciones);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [pages, setPages] = useState(initialPages);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStats, setCurrentStats] = useState(stats);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await getVacaciones(newPage);
      setVacaciones(response.vacaciones);
      setCurrentPage(response.currentPage);
      setTotal(response.total);
      setPages(response.pages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar las vacaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (data: { startDate: string; endDate: string }) => {
    setLoading(true);
    try {
      const response = await createVacacion(data);
      if (!response.success) {
        throw new Error(response.error ?? "Error al crear la solicitud");
      }
      const refreshed = await getVacaciones(1);
      setVacaciones(refreshed.vacaciones);
      setCurrentPage(refreshed.currentPage);
      setTotal(refreshed.total);
      setPages(refreshed.pages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis Vacaciones</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={loading || currentStats.availableDays === 0}
        >
          <Plus size={16} />
          Solicitar Vacaciones
        </Button>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <VacationStatsCard stats={currentStats} />

      <VacationTable
        vacaciones={vacaciones}
        currentPage={currentPage}
        totalPages={pages}
        onPageChange={handlePageChange}
        loading={loading}
        total={total}
      />

      <VacationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmit}
        availableDays={currentStats.availableDays}
        loading={loading}
      />
    </div>
  );
}
