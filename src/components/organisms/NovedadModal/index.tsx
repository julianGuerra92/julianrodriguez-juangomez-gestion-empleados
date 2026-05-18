"use client";

import { useState, useCallback, useEffect } from "react";
import { NovedadType } from "@/generated/prisma/client";
import { Button } from "@/components/atoms/Button";
import { Alert } from "@/components/atoms/Alert";
import { NovedadFormFields } from "@/components/molecules/NovedadFormFields";
import { EmployeeSelector } from "@/components/molecules/EmployeeSelector";
import { ROLES } from "@/constants/roles";
import { NovedadListItem } from "@/types/novedad";

interface Employee {
  id: string;
  name: string;
  email: string;
}

interface NovedadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: NovedadType;
    startDate: string;
    endDate: string;
    hours: string;
    reason: string;
    userId: string;
  }) => Promise<void>;
  employees: Employee[];
  currentUserId: string;
  userRole: string;
  editingNovedad?: NovedadListItem | null;
  loading?: boolean;
}

export function NovedadModal({
  isOpen,
  onClose,
  onSubmit,
  employees,
  currentUserId,
  userRole,
  editingNovedad,
  loading = false,
}: NovedadModalProps) {
  const [type, setType] = useState<NovedadType>("HORA_EXTRA");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hours, setHours] = useState("");
  const [reason, setReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(currentUserId);
  const [error, setError] = useState("");
  const isAdmin = userRole === ROLES.ADMIN;

  useEffect(() => {
    if (editingNovedad) {
      setType(editingNovedad.type);
      setStartDate(
        new Date(editingNovedad.startDate).toISOString().split("T")[0]
      );
      setEndDate(
        editingNovedad.endDate
          ? new Date(editingNovedad.endDate).toISOString().split("T")[0]
          : ""
      );
      setHours(editingNovedad.hours ? String(editingNovedad.hours) : "");
      setReason(editingNovedad.reason);
      setSelectedUserId(editingNovedad.user.id);
    }
  }, [editingNovedad, isOpen]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleReset = useCallback(() => {
    setType("HORA_EXTRA");
    setStartDate("");
    setEndDate("");
    setHours("");
    setReason("");
    setSelectedUserId(currentUserId);
    setError("");
  }, [currentUserId]);

  const handleClose = useCallback(() => {
    handleReset();
    onClose();
  }, [handleReset, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!startDate) {
      setError("La fecha de inicio es requerida");
      return;
    }

    if (!reason.trim()) {
      setError("El motivo es requerido");
      return;
    }

    if (type === "HORA_EXTRA") {
      if (!hours) {
        setError("Las horas son requeridas");
        return;
      }
    } else if (type === "INCAPACIDAD") {
      if (!endDate) {
        setError("La fecha de fin es requerida");
        return;
      }
    }

    try {
      await onSubmit({
        type,
        startDate,
        endDate,
        hours,
        reason,
        userId: selectedUserId,
      });
      handleReset();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al registrar la novedad");
    }
  };

  if (!isOpen) return null;

  const modalTitle = editingNovedad ? "Editar Novedad" : "Registrar Novedad";

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg">{modalTitle}</h3>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {isAdmin && employees.length > 0 && (
            <EmployeeSelector
              employees={employees}
              value={selectedUserId}
              onChange={setSelectedUserId}
              disabled={loading}
              label="Registrar para"
            />
          )}

          <NovedadFormFields
            type={type}
            onTypeChange={setType}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            hours={hours}
            onHoursChange={setHours}
            reason={reason}
            onReasonChange={setReason}
            disabled={loading}
          />

          <div className="modal-action">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              isLoading={loading}
            >
              {editingNovedad ? "Actualizar" : "Registrar"}
            </Button>
          </div>
        </form>

        <form
          method="dialog"
          className="modal-backdrop"
          onClick={handleClose}
        >
          <button>close</button>
        </form>
      </div>
    </div>
  );
}
