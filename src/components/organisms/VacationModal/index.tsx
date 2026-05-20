"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Alert } from "@/components/atoms/Alert";
import { VacationFormFields } from "@/components/molecules/VacationFormFields";

interface VacationModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: { startDate: string; endDate: string }) => Promise<void>;
  readonly availableDays: number;
  readonly loading?: boolean;
}

interface FormState {
  startDate: string;
  endDate: string;
}

function getInitialFormState(): FormState {
  return { startDate: "", endDate: "" };
}

export function VacationModal({
  isOpen,
  onClose,
  onSubmit,
  availableDays,
  loading = false,
}: VacationModalProps) {
  const [formState, setFormState] = useState<FormState>(getInitialFormState);
  const [error, setError] = useState("");

  const { startDate, endDate } = formState;

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setFormState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormState(getInitialFormState());
      setError("");
    }
  }, [isOpen]);

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

    if (!endDate) {
      setError("La fecha de fin es requerida");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }

    try {
      await onSubmit({ startDate, endDate });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar la solicitud");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg">Solicitar Vacaciones</h3>
        <p className="text-sm text-base-content/60 mt-1">
          Días disponibles: <span className="font-semibold text-primary">{availableDays}</span>
        </p>

        {error && (
          <div className="mt-3">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <VacationFormFields
            startDate={startDate}
            onStartDateChange={(value) => setField("startDate", value)}
            endDate={endDate}
            onEndDateChange={(value) => setField("endDate", value)}
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
              Solicitar
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
