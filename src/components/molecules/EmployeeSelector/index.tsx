"use client";

import { Select } from "@/components/atoms/Select";
import { Label } from "@/components/atoms/Label";

interface Employee {
  id: string;
  name: string;
  email: string;
}

interface EmployeeSelectorProps {
  employees: Employee[];
  value: string;
  onChange: (userId: string) => void;
  disabled?: boolean;
  label?: string;
  allowAllOption?: boolean;
}

export function EmployeeSelector({
  employees,
  value,
  onChange,
  disabled = false,
  label = "Empleado",
  allowAllOption = false,
}: EmployeeSelectorProps) {
  const options = [
    ...(allowAllOption ? [{ label: "Todos los empleados (Filtro general)", value: "" }] : []),
    ...employees.map((emp) => ({
      label: `${emp.name} (${emp.email})`,
      value: emp.id,
    }))
  ];

  return (
    <div>
      <Label htmlFor="employee-select">{label}</Label>
      <Select
        value={value}
        onChange={onChange}
        disabled={disabled}
        options={options}
      />
    </div>
  );
}
