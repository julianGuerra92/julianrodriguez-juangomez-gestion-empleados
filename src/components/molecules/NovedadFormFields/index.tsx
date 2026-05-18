"use client";

import { NovedadType } from "@/generated/prisma/client";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { NovedadTypeSelector } from "../NovedadTypeSelector";
import { Calendar, Clock } from "lucide-react";

interface NovedadFormFieldsProps {
  type: NovedadType;
  onTypeChange: (type: NovedadType) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  hours: string;
  onHoursChange: (hours: string) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  disabled?: boolean;
}

export function NovedadFormFields({
  type,
  onTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  hours,
  onHoursChange,
  reason,
  onReasonChange,
  disabled = false,
}: NovedadFormFieldsProps) {
  const isHoraExtra = type === "HORA_EXTRA";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">Tipo de Novedad</Label>
        <NovedadTypeSelector
          value={type}
          onChange={onTypeChange}
          disabled={disabled}
        />
      </div>

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

      {!isHoraExtra && (
        <div>
          <Label htmlFor="endDate">Fecha de Fin *</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            disabled={disabled}
            icon={<Calendar size={18} />}
          />
        </div>
      )}

      {isHoraExtra && (
        <div>
          <Label htmlFor="hours">Horas *</Label>
          <Input
            id="hours"
            type="number"
            min="1"
            step="0.5"
            value={hours}
            onChange={(e) => onHoursChange(e.target.value)}
            disabled={disabled}
            placeholder="Ej: 2.5"
            icon={<Clock size={18} />}
          />
        </div>
      )}

      <div>
        <Label htmlFor="reason">Motivo *</Label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          disabled={disabled}
          placeholder="Describe el motivo..."
          className="textarea textarea-bordered w-full"
          rows={3}
        />
      </div>
    </div>
  );
}
