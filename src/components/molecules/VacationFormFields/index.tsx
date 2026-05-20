"use client";

import { useMemo } from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Calendar } from "lucide-react";

interface VacationFormFieldsProps {
  readonly startDate: string;
  readonly onStartDateChange: (value: string) => void;
  readonly endDate: string;
  readonly onEndDateChange: (value: string) => void;
  readonly disabled?: boolean;
}

function calcBusinessDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
  if (endDate < startDate) return 0;

  let count = 0;
  const cur = new Date(startDate);
  cur.setHours(0, 0, 0, 0);
  const endNorm = new Date(endDate);
  endNorm.setHours(0, 0, 0, 0);

  while (cur <= endNorm) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function VacationFormFields({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  disabled = false,
}: VacationFormFieldsProps) {
  const businessDays = useMemo(
    () => calcBusinessDays(startDate, endDate),
    [startDate, endDate],
  );

  const showPreview = startDate && endDate && new Date(endDate) >= new Date(startDate);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="startDate">Fecha de Inicio *</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          disabled={disabled}
          icon={<Calendar size={18} />}
        />
      </div>

      <div>
        <Label htmlFor="endDate">Fecha de Fin *</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(e) => onEndDateChange(e.target.value)}
          disabled={disabled}
          icon={<Calendar size={18} />}
        />
      </div>

      {showPreview && (
        <div className="rounded-lg bg-base-200 px-4 py-3 text-sm">
          <span className="text-base-content/60">Días hábiles solicitados: </span>
          <span className="font-semibold text-primary">{businessDays}</span>
        </div>
      )}
    </div>
  );
}
