import { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function Label({ children, className = "", ...props }: LabelProps) {
  return (
    <label
      className={["label pb-0", className].filter(Boolean).join(" ")}
      {...props}
    >
      <span className="label-text text-sm font-medium">{children}</span>
    </label>
  );
}
