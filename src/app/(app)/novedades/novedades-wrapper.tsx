"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { NovedadListItem } from "@/types/novedad";
import { NovedadType } from "@/generated/prisma/client";
import { ROLES } from "@/constants/roles";
import { Button } from "@/components/atoms/Button";
import { Alert } from "@/components/atoms/Alert";
import { NovedadModal } from "@/components/organisms/NovedadModal";
import { NovedadTable } from "@/components/organisms/NovedadTable";
import {
  getNovedades,
  createNovedad,
  updateNovedad,
  deleteNovedad,
} from "@/actions/novedades";
import { Plus } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
}

interface NovedadesWrapperProps {
  currentUserId: string;
  userRole: string;
  initialNovedades: NovedadListItem[];
  initialTotal: number;
  initialPages: number;
  initialCurrentPage: number;
  employees?: Employee[];
}

export function NovedadesWrapper({
  currentUserId,
  userRole,
  initialNovedades,
  initialTotal,
  initialPages,
  initialCurrentPage,
  employees = [],
}: NovedadesWrapperProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNovedad, setEditingNovedad] = useState<NovedadListItem | null>(
    null
  );
  const [novedades, setNovedades] = useState(initialNovedades);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [total, setTotal] = useState(initialTotal);
  const [pages, setPages] = useState(initialPages);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await getNovedades(newPage);
      setNovedades(response.novedades);
      setCurrentPage(response.currentPage);
      setTotal(response.total);
      setPages(response.pages);
    } catch (err: any) {
      setError(err.message || "Error al cargar las novedades");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditingNovedad(null);
    setIsModalOpen(true);
  };

  const handleEditNovedad = (novedad: NovedadListItem) => {
    setEditingNovedad(novedad);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingNovedad(null);
    setError("");
  };

  const handleSubmit = async (data: {
    type: NovedadType;
    startDate: string;
    endDate: string;
    hours: string;
    reason: string;
    userId: string;
  }) => {
    setLoading(true);
    setError("");

    try {
      let response;

      if (editingNovedad) {
        response = await updateNovedad({
          id: editingNovedad.id,
          type: data.type,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          hours: data.hours ? parseInt(data.hours) : null,
          reason: data.reason,
        });
      } else {
        response = await createNovedad({
          type: data.type,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          hours: data.hours ? parseFloat(data.hours) : null,
          reason: data.reason,
          userId: data.userId,
        });
      }

      if (!response.success) {
        throw new Error(response.error || "Error al guardar la novedad");
      }

      const refreshedResponse = await getNovedades(currentPage);
      setNovedades(refreshedResponse.novedades);
      setTotal(refreshedResponse.total);
      setPages(refreshedResponse.pages);
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNovedad = async (id: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await deleteNovedad(id);

      if (!response.success) {
        throw new Error(response.error || "Error al eliminar la novedad");
      }

      const refreshedResponse = await getNovedades(currentPage);
      setNovedades(refreshedResponse.novedades);
      setTotal(refreshedResponse.total);
      setPages(refreshedResponse.pages);
    } catch (err: any) {
      setError(err.message || "Error al eliminar la novedad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mis Novedades</h1>
            <p className="mt-2 text-base-content/60">
              Aquí puedes registrar y consultar tus novedades.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleOpenModal}
            disabled={loading}
            className="gap-2"
          >
            <Plus size={18} />
            Registrar Novedad
          </Button>
        </div>

        {error && (
          <Alert
            variant="error"
          >
            {error}
          </Alert>
        )}

        <NovedadTable
          novedades={novedades}
          currentPage={currentPage}
          totalPages={pages}
          onPageChange={handlePageChange}
          onEdit={handleEditNovedad}
          onDelete={handleDeleteNovedad}
          loading={loading}
          total={total}
        />
      </div>

      <NovedadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        employees={employees}
        currentUserId={currentUserId}
        userRole={userRole}
        editingNovedad={editingNovedad}
        loading={loading}
      />
    </main>
  );
}
