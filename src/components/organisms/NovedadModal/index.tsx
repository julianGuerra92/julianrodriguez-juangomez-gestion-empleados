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
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: {
    type: NovedadType;
    startDate: string;
    endDate: string;
    hours: string;
    reason: string;
    userId: string;
  }) => Promise<void>;
  readonly employees: Employee[];
  readonly currentUserId: string;
  readonly userRole: string;
  readonly editingNovedad?: NovedadListItem | null;
  readonly loading?: boolean;
}

interface FormState {
  type: NovedadType;
  startDate: string;
  endDate: string;
  hours: string;
  reason: string;
  selectedUserId: string;
}

// Deriva el estado inicial directamente desde las props.
// Cuando el padre cambie la `key`, React remonta el componente
// y esta función se ejecuta de nuevo — sin necesidad de useEffect.
function getInitialFormState(
  editingNovedad: NovedadListItem | null | undefined,
  currentUserId: string
): FormState {
  if (editingNovedad) {
    return {
      type: editingNovedad.type,
      startDate: new Date(editingNovedad.startDate)
        .toISOString()
        .split("T")[0],
      endDate: editingNovedad.endDate
        ? new Date(editingNovedad.endDate).toISOString().split("T")[0]
        : "",
      hours: editingNovedad.hours ? String(editingNovedad.hours) : "",
      reason: editingNovedad.reason,
      selectedUserId: editingNovedad.user.id,
    };
  }

  return {
    type: "HORA_EXTRA",
    startDate: "",
    endDate: "",
    hours: "",
    reason: "",
    selectedUserId: currentUserId,
  };
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
  // ✅ Estado inicial derivado directamente de las props, sin useEffect
  const [formState, setFormState] = useState<FormState>(() =>
    getInitialFormState(editingNovedad, currentUserId)
  );
  const [error, setError] = useState("");

  const isAdmin = userRole === ROLES.ADMIN;
  const { type, startDate, endDate, hours, reason, selectedUserId } = formState;

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setFormState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ✅ Este useEffect es correcto: solo limpia un timer (sistema externo),
  // no actualiza estado de React desde dentro del efecto.
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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

    if (type === "HORA_EXTRA" && !hours) {
      setError("Las horas son requeridas");
      return;
    }

    if (type === "INCAPACIDAD" && !endDate) {
      setError("La fecha de fin es requerida");
      return;
    }

    try {
      await onSubmit({ type, startDate, endDate, hours, reason, userId: selectedUserId });
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar la novedad";
      setError(errorMessage);
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
              onChange={(value) => setField("selectedUserId", value)}
              disabled={loading}
              label="Registrar para"
            />
          )}

          <NovedadFormFields
            type={type}
            onTypeChange={(value) => setField("type", value)}
            startDate={startDate}
            onStartDateChange={(value) => setField("startDate", value)}
            endDate={endDate}
            onEndDateChange={(value) => setField("endDate", value)}
            hours={hours}
            onHoursChange={(value) => setField("hours", value)}
            reason={reason}
            onReasonChange={(value) => setField("reason", value)}
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

        <form method="dialog" className="modal-backdrop">
          <button
            type="button"
            onClick={handleClose}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleClose();
            }}
          >
            close
          </button>
        </form>
      </div>
    </div>
  );
}