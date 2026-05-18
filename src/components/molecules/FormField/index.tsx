import { InputHTMLAttributes, ReactNode } from "react";
import { Label } from "@/components/atoms/Label";
import { Input } from "@/components/atoms/Input";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export function FormField({
  label,
  icon,
  id,
  className,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="form-control gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} icon={icon} className={className} {...inputProps} />
    </div>
  );
}
