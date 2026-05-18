"use client";

import { NovedadType } from "@/generated/prisma/client";
import { Select } from "@/components/atoms/Select";

interface NovedadTypeSelectorProps {
  value: NovedadType;
  onChange: (type: NovedadType) => void;
  disabled?: boolean;
}

const typeOptions = [
  { label: "Hora Extra", value: "HORA_EXTRA" },
  { label: "Incapacidad", value: "INCAPACIDAD" },
];

export function NovedadTypeSelector({
  value,
  onChange,
  disabled = false,
}: NovedadTypeSelectorProps) {
  return (
    <Select
      value={value}
      onChange={(selected) => onChange(selected as NovedadType)}
      disabled={disabled}
      options={typeOptions}
    />
  );
}
